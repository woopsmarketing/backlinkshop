/**
 * SEO 리포트 지연 발송 크론 API
 *
 * 5분 이상 경과한 SEO 분석 완료 주문에 대해:
 * 1. 분석 결과 이메일 발송
 * 2. 주문 상태를 completed로 변경
 *
 * 호출: 외부 크론 서비스에서 2분마다 GET 요청
 * 보안: CRON_SECRET 헤더로 인증
 */

import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/server/supabase/admin'
import { sendEmail } from '@/lib/email/send-email'
import { renderSeoReportEmail } from '@/lib/email/render'
import type { ParsedSeo } from '@/lib/seo-analyzer'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // 보안 검증
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminClient = createAdminSupabaseClient()

    // processing 상태 + seo_report_data 있는 + 생성 후 2분 이상 경과한 주문 조회
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()

    // 디버깅: 먼저 processing 상태 주문이 몇 개인지 확인
    const { count: processingCount } = await adminClient
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'processing')
      .not('seo_report_data', 'is', null)

    console.log(`[SEO Reports] processing 주문: ${processingCount}건, 기준시각: ${twoMinutesAgo}`)

    // 원자적 클레임: processing → sending_report 로 먼저 잡는 놈이 임자
    // 중복 크론/재시도가 들어와도 같은 주문을 두 번 집을 수 없음
    const { data: claimTargets, error: selectError } = await adminClient
      .from('orders')
      .select('id')
      .eq('status', 'processing')
      .not('seo_report_data', 'is', null)
      .lt('created_at', twoMinutesAgo)
      .limit(5)

    if (selectError) {
      console.error('[SEO Reports] 후보 조회 실패:', selectError)
      return NextResponse.json({ error: 'Query failed' }, { status: 500 })
    }

    let pendingOrders: Array<{
      id: string
      user_id: string
      site_url: string | null
      keywords: string | null
      seo_report_data: unknown
      created_at: string
    }> = []

    if (claimTargets && claimTargets.length > 0) {
      const ids = claimTargets.map(o => o.id)
      const { data: claimed, error: claimError } = await adminClient
        .from('orders')
        .update({ status: 'sending_report' })
        .in('id', ids)
        .eq('status', 'processing') // 다른 인스턴스가 이미 잡았으면 제외
        .select('id, user_id, site_url, keywords, seo_report_data, created_at')

      if (claimError) {
        console.error('[SEO Reports] 클레임 실패:', claimError)
        return NextResponse.json({ error: 'Claim failed' }, { status: 500 })
      }
      pendingOrders = claimed || []
    }

    const queryError = null as null

    void queryError
    console.log(`[SEO Reports] 이메일 발송 대상: ${pendingOrders?.length || 0}건`)

    let processed = 0
    let failed = 0

    // orders가 없어도 LP 요청 처리를 위해 계속 진행

    for (const order of pendingOrders) {
      try {
        const reportData = order.seo_report_data as {
          score: number | null
          analysisHtml: string
          parsedData: ParsedSeo
          competitorData?: import('@/lib/competitor-analyzer').CompetitorAnalysis | null
        }

        // 사용자 이메일 조회
        const {
          data: { user: authUser },
        } = await adminClient.auth.admin.getUserById(order.user_id)
        const userEmail = authUser?.email

        if (!userEmail) {
          console.error('[SEO Reports] 사용자 이메일 없음:', order.id)
          failed++
          continue
        }

        console.log(`[SEO Reports] 이메일 발송 시작: ${order.id} → ${userEmail}`)

        // 분석 결과 이메일 발송
        await sendEmail(
          userEmail,
          '온페이지 SEO 점검 결과가 준비되었습니다 - 백링크샵',
          renderSeoReportEmail({
            customerEmail: userEmail,
            orderId: order.id,
            siteUrl: order.site_url || undefined,
            keywords: order.keywords || undefined,
            score: reportData.score,
            analysisHtml: reportData.analysisHtml,
            parsedData: reportData.parsedData,
            competitorData: reportData.competitorData || null,
          })
        )

        // 주문 상태 completed로 변경
        await adminClient
          .from('orders')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', order.id)

        console.log('✅ SEO 리포트 발송 완료:', { orderId: order.id, email: userEmail })
        processed++
      } catch (err) {
        console.error('❌ SEO 리포트 발송 실패:', { orderId: order.id, error: err })
        // 실패 시 processing 으로 되돌려 다음 크론에서 재시도
        await adminClient
          .from('orders')
          .update({ status: 'processing' })
          .eq('id', order.id)
          .eq('status', 'sending_report')
        failed++
      }
    }

    // ── LP 비로그인 요청 리포트 발송 ──
    const { data: lpTargets } = await adminClient
      .from('lp_requests')
      .select('id')
      .eq('status', 'processing')
      .not('seo_report_data', 'is', null)
      .lt('analyzed_at', twoMinutesAgo)
      .limit(5)

    let lpProcessed = 0
    let lpFailed = 0

    if (lpTargets && lpTargets.length > 0) {
      const lpIds = lpTargets.map(r => r.id)
      const { data: lpClaimed } = await adminClient
        .from('lp_requests')
        .update({ status: 'sending_report' })
        .in('id', lpIds)
        .eq('status', 'processing')
        .select('id, url, keyword, email, seo_report_data, created_at')

      if (lpClaimed) {
        for (const lpReq of lpClaimed) {
          try {
            const reportData = lpReq.seo_report_data as {
              score: number | null
              analysisHtml: string
              parsedData: ParsedSeo
              competitorData?: import('@/lib/competitor-analyzer').CompetitorAnalysis | null
            }

            console.log(`[SEO Reports] LP 이메일 발송: ${lpReq.id} → ${lpReq.email}`)

            await sendEmail(
              lpReq.email,
              '온페이지 SEO 점검 결과가 준비되었습니다 - 백링크샵',
              renderSeoReportEmail({
                customerEmail: lpReq.email,
                orderId: lpReq.id,
                siteUrl: lpReq.url,
                keywords: lpReq.keyword,
                score: reportData.score,
                analysisHtml: reportData.analysisHtml,
                parsedData: reportData.parsedData,
                competitorData: reportData.competitorData || null,
              })
            )

            await adminClient
              .from('lp_requests')
              .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
              })
              .eq('id', lpReq.id)

            console.log('✅ LP 리포트 발송 완료:', { id: lpReq.id, email: lpReq.email })
            lpProcessed++
          } catch (err) {
            console.error('❌ LP 리포트 발송 실패:', { id: lpReq.id, error: err })
            await adminClient
              .from('lp_requests')
              .update({ status: 'processing' })
              .eq('id', lpReq.id)
              .eq('status', 'sending_report')
            lpFailed++
          }
        }
      }
    }

    return NextResponse.json({
      message: `Processed ${processed} reports + ${lpProcessed} LP reports`,
      processed,
      failed,
      lpProcessed,
      lpFailed,
      total: pendingOrders.length,
    })
  } catch (error) {
    console.error('SEO 크론 오류:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
