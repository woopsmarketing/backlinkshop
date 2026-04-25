/**
 * SEO 분석 백그라운드 크론 API
 *
 * pending_analysis 상태 주문을 찾아서:
 * 1. 온페이지 SEO 분석 (fetchAndAnalyze)
 * 2. 경쟁사 분석 (analyzeCompetitors)
 * 3. 결과 저장 + status=processing 으로 변경
 *
 * 호출: cron-job.org에서 1분마다 GET 요청
 * 보안: CRON_SECRET 헤더로 인증
 */

import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/server/supabase/admin'
import { fetchAndParse, runAiAnalysis, type CompetitorContext } from '@/lib/seo-analyzer'
import { analyzeCompetitors, type CompetitorAnalysis } from '@/lib/competitor-analyzer'
import { markdownToHtml } from '@/lib/markdown-to-html'
// sendEmail, renderLpAnalysisFailedEmail은 Resend 의존성 때문에 동적 import

export const maxDuration = 60
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

    // pending_analysis 상태 주문 조회 (한 번에 1건만 처리 - 60초 내 완료 보장)
    // 10분 이상 analyzing으로 멈춘 주문도 복구 대상 (크래시 복구)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()

    const { data: pendingOrders, error: queryError } = await adminClient
      .from('orders')
      .select(
        'id, user_id, site_url, keywords, created_at, products!inner(name), status, api_error'
      )
      .or(`status.eq.pending_analysis,and(status.eq.analyzing,created_at.lt.${tenMinutesAgo})`)
      .limit(1)

    if (queryError) {
      console.error('[SEO Analysis Cron] 대기 주문 조회 실패:', queryError)
      return NextResponse.json({ error: 'Query failed' }, { status: 500 })
    }

    // 🔒 락 획득: 픽업한 주문을 원자적으로 analyzing 상태로 변경
    // .eq('status', order.status) 조건으로 이미 다른 크론이 바꿨으면 매칭 실패 → 0건 반환
    const lockedOrders: NonNullable<typeof pendingOrders> = []
    for (const order of pendingOrders || []) {
      const { data: locked, error: lockError } = await adminClient
        .from('orders')
        .update({ status: 'analyzing' })
        .eq('id', order.id)
        .eq('status', order.status)
        .select('id')

      if (lockError || !locked || locked.length === 0) {
        console.log(`[SEO Analysis] 락 획득 실패 (다른 크론이 처리 중): ${order.id}`)
        continue
      }
      lockedOrders.push(order)
    }

    let processed = 0
    let failed = 0

    for (const order of lockedOrders) {
      try {
        const productName = (order.products as any)?.name || ''
        const isOnPageProduct = productName.includes('온페이지')

        if (!isOnPageProduct || !order.site_url) {
          // 온페이지 상품이 아니면 바로 processing으로 전환
          await adminClient.from('orders').update({ status: 'processing' }).eq('id', order.id)
          processed++
          continue
        }

        console.log(`[SEO Analysis] 시작: ${order.id} - ${order.site_url}`)
        const startTime = Date.now()

        // 1단계: 고객 URL 먼저 체크 (실패하면 경쟁사 분석 안 함)
        const parsed = await fetchAndParse(order.site_url)

        // 2단계: 고객 URL 성공 시에만 경쟁사 분석 진행
        let competitorData: CompetitorAnalysis | null = null
        if (order.keywords) {
          try {
            competitorData = await analyzeCompetitors(order.keywords, order.site_url, 5)
            console.log(
              `[SEO Analysis] 경쟁사 분석 완료: ${competitorData?.competitors.length || 0}개`
            )
          } catch (compErr: any) {
            console.error(`[SEO Analysis] 경쟁사 분석 실패 (무시):`, compErr.message)
          }
        }

        // 2. AI 분석 (경쟁사 컨텍스트 주입)
        let competitorContext: CompetitorContext | null = null
        if (competitorData && competitorData.competitors.length > 0) {
          const cm = competitorData.customerMetrics
          competitorContext = {
            keyword: competitorData.keyword,
            customer: cm
              ? {
                  domain: cm.domain,
                  mozDA: cm.mozDA,
                  ahrefsDR: cm.ahrefsDR,
                  ahrefsBacklinks: cm.ahrefsBacklinks,
                  ahrefsRefDomains: cm.ahrefsRefDomains,
                  ahrefsTraffic: cm.ahrefsTraffic,
                }
              : undefined,
            competitors: competitorData.competitors.slice(0, 5).map((c, i) => ({
              rank: i + 1,
              domain: c.domain,
              mozDA: c.mozDA,
              ahrefsDR: c.ahrefsDR,
              ahrefsBacklinks: c.ahrefsBacklinks,
              ahrefsRefDomains: c.ahrefsRefDomains,
              ahrefsTraffic: c.ahrefsTraffic,
              titleLength: c.onPage?.titleLength,
              metaDescriptionLength: c.onPage?.metaDescriptionLength,
              h1Count: c.onPage?.h1Count,
              wordCount: c.onPage?.wordCount,
              hasStructuredData: c.onPage?.hasStructuredData,
            })),
          }
        }

        const { analysis, score } = await runAiAnalysis(
          parsed,
          order.keywords || undefined,
          competitorContext
        )
        const analysisHtml = markdownToHtml(analysis)
        console.log(`[SEO Analysis] SEO 분석 완료 (${Date.now() - startTime}ms, 점수 ${score})`)

        // 3. 결과 저장 + status 변경
        await adminClient
          .from('orders')
          .update({
            status: 'processing',
            seo_report_data: {
              score,
              analysisHtml,
              parsedData: parsed,
              competitorData,
            },
          })
          .eq('id', order.id)

        console.log(`[SEO Analysis] 완료: ${order.id} (점수 ${score})`)
        processed++
      } catch (err: any) {
        console.error(`[SEO Analysis] 실패: ${order.id}`, err.message)

        // 이전에 이미 실패한 적 있으면 (api_error에 기록 있으면) 2회째 → failed
        const hadPreviousError = !!(order as any).api_error
        if (hadPreviousError) {
          await adminClient
            .from('orders')
            .update({
              status: 'failed',
              api_error: `SEO 분석 2회 실패: ${err.message}`,
            })
            .eq('id', order.id)
          console.error(`[SEO Analysis] 주문 2회 실패로 failed 처리: ${order.id}`)
        } else {
          await adminClient
            .from('orders')
            .update({
              status: 'pending_analysis',
              api_error: `SEO 분석 실패: ${err.message}`,
            })
            .eq('id', order.id)
        }

        failed++
      }
    }

    // ── LP 비로그인 요청 처리 ──
    const { data: lpPending } = await adminClient
      .from('lp_requests')
      .select('id, url, keyword, email, status, seo_report_data')
      .or(`status.eq.pending_analysis,and(status.eq.analyzing,created_at.lt.${tenMinutesAgo})`)
      .limit(1)

    let lpProcessed = 0

    if (lpPending && lpPending.length > 0) {
      for (const lpReq of lpPending) {
        // 락 획득
        const { data: locked } = await adminClient
          .from('lp_requests')
          .update({ status: 'analyzing' })
          .eq('id', lpReq.id)
          .eq('status', lpReq.status)
          .select('id')

        if (!locked || locked.length === 0) continue

        // 재시도 횟수 확인 (3회 초과 시 failed 처리)
        const prevData = lpReq.seo_report_data as any
        const retryCount = (prevData?._retryCount || 0) + 1

        if (retryCount > 2) {
          console.error(`[SEO Analysis] LP 재시도 초과 (${retryCount}회): ${lpReq.id}`)
          await adminClient.from('lp_requests').update({ status: 'failed' }).eq('id', lpReq.id)

          // 실패 안내 이메일 발송
          try {
            const { sendEmail } = await import('@/lib/email/send-email')
            const { renderLpAnalysisFailedEmail } = await import('@/lib/email/render')
            await sendEmail(
              lpReq.email,
              'SEO 진단 요청을 처리할 수 없었습니다 - 백링크샵',
              renderLpAnalysisFailedEmail({
                email: lpReq.email,
                url: lpReq.url,
                keyword: lpReq.keyword,
              })
            )
            console.log(`[SEO Analysis] LP 실패 안내 이메일 발송: ${lpReq.email}`)
          } catch (emailErr: any) {
            console.error(`[SEO Analysis] LP 실패 안내 이메일 발송 실패:`, emailErr.message)
          }

          continue
        }

        try {
          // URL 정규화: https:example.com → https://example.com
          let normalizedUrl = lpReq.url.trim()
          normalizedUrl = normalizedUrl.replace(/^(https?):([^/])/, '$1://$2')

          console.log(
            `[SEO Analysis] LP 요청 시작 (시도 ${retryCount}/2): ${lpReq.id} - ${normalizedUrl}`
          )
          const startTime = Date.now()

          // 1단계: 고객 URL 먼저 체크 (실패하면 경쟁사 분석 안 함)
          const parsed = await fetchAndParse(normalizedUrl)

          // 2단계: 고객 URL 성공 시에만 경쟁사 분석 진행
          let competitorData: CompetitorAnalysis | null = null
          try {
            competitorData = await analyzeCompetitors(lpReq.keyword, normalizedUrl, 5)
          } catch (compErr: any) {
            console.error(`[SEO Analysis] 경쟁사 분석 실패 (무시):`, compErr.message)
          }

          let competitorContext: CompetitorContext | null = null
          if (competitorData && competitorData.competitors.length > 0) {
            const cm = competitorData.customerMetrics
            competitorContext = {
              keyword: competitorData.keyword,
              customer: cm
                ? {
                    domain: cm.domain,
                    mozDA: cm.mozDA,
                    ahrefsDR: cm.ahrefsDR,
                    ahrefsBacklinks: cm.ahrefsBacklinks,
                    ahrefsRefDomains: cm.ahrefsRefDomains,
                    ahrefsTraffic: cm.ahrefsTraffic,
                  }
                : undefined,
              competitors: competitorData.competitors.slice(0, 5).map((c, i) => ({
                rank: i + 1,
                domain: c.domain,
                mozDA: c.mozDA,
                ahrefsDR: c.ahrefsDR,
                ahrefsBacklinks: c.ahrefsBacklinks,
                ahrefsRefDomains: c.ahrefsRefDomains,
                ahrefsTraffic: c.ahrefsTraffic,
                titleLength: c.onPage?.titleLength,
                metaDescriptionLength: c.onPage?.metaDescriptionLength,
                h1Count: c.onPage?.h1Count,
                wordCount: c.onPage?.wordCount,
                hasStructuredData: c.onPage?.hasStructuredData,
              })),
            }
          }

          const { analysis, score } = await runAiAnalysis(parsed, lpReq.keyword, competitorContext)
          const analysisHtml = markdownToHtml(analysis)
          console.log(`[SEO Analysis] LP 분석 완료 (${Date.now() - startTime}ms, 점수 ${score})`)

          await adminClient
            .from('lp_requests')
            .update({
              status: 'processing',
              analyzed_at: new Date().toISOString(),
              seo_report_data: {
                score,
                analysisHtml,
                parsedData: parsed,
                competitorData,
              },
            })
            .eq('id', lpReq.id)

          lpProcessed++
        } catch (err: any) {
          console.error(`[SEO Analysis] LP 실패 (시도 ${retryCount}/2): ${lpReq.id}`, err.message)

          if (retryCount >= 2) {
            // 2회 실패 → failed 상태로 변경 (결과 페이지에서 실패 안내 노출)
            await adminClient
              .from('lp_requests')
              .update({
                status: 'failed',
                seo_report_data: { _retryCount: retryCount, _lastError: err.message },
              })
              .eq('id', lpReq.id)
          } else {
            // 재시도 카운트 기록 후 pending_analysis로 되돌림
            await adminClient
              .from('lp_requests')
              .update({
                status: 'pending_analysis',
                seo_report_data: { _retryCount: retryCount, _lastError: err.message },
              })
              .eq('id', lpReq.id)
          }
        }
      }
    }

    return NextResponse.json({
      message: `Processed ${processed} orders + ${lpProcessed} LP requests`,
      processed,
      failed,
      lpProcessed,
      total: pendingOrders.length,
    })
  } catch (error: any) {
    console.error('[SEO Analysis Cron] 오류:', error)
    return NextResponse.json({ error: 'Internal error', details: error.message }, { status: 500 })
  }
}
