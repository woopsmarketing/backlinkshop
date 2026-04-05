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

    // 5분 이상 경과한 + seo_report_data가 있는 + 아직 processing인 주문 조회
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

    const { data: pendingOrders, error: queryError } = await adminClient
      .from('orders')
      .select('id, user_id, site_url, keywords, seo_report_data, created_at')
      .eq('status', 'processing')
      .not('seo_report_data', 'is', null)
      .lt('created_at', fiveMinutesAgo)
      .limit(5) // 한번에 최대 5건 처리 (타임아웃 방지)

    if (queryError) {
      console.error('SEO 리포트 대기 주문 조회 실패:', queryError)
      return NextResponse.json({ error: 'Query failed' }, { status: 500 })
    }

    if (!pendingOrders || pendingOrders.length === 0) {
      return NextResponse.json({ message: 'No pending reports', processed: 0 })
    }

    let processed = 0
    let failed = 0

    for (const order of pendingOrders) {
      try {
        const reportData = order.seo_report_data as {
          score: number | null
          analysisHtml: string
          parsedData: ParsedSeo
        }

        // 사용자 이메일 조회
        const {
          data: { user: authUser },
        } = await adminClient.auth.admin.getUserById(order.user_id)
        const userEmail = authUser?.email

        if (!userEmail) {
          console.error('사용자 이메일 없음:', order.id)
          failed++
          continue
        }

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
        failed++
      }
    }

    return NextResponse.json({
      message: `Processed ${processed} reports`,
      processed,
      failed,
      total: pendingOrders.length,
    })
  } catch (error) {
    console.error('SEO 크론 오류:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
