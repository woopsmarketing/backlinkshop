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
import { fetchAndAnalyze } from '@/lib/seo-analyzer'
import { analyzeCompetitors, type CompetitorAnalysis } from '@/lib/competitor-analyzer'
import { markdownToHtml } from '@/lib/markdown-to-html'

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

    // pending_analysis 상태 주문 조회 (최대 2건씩 처리)
    // 10분 이상 analyzing으로 멈춘 주문도 복구 대상 (크래시 복구)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()

    const { data: pendingOrders, error: queryError } = await adminClient
      .from('orders')
      .select('id, user_id, site_url, keywords, created_at, products!inner(name), status')
      .or(`status.eq.pending_analysis,and(status.eq.analyzing,created_at.lt.${tenMinutesAgo})`)
      .limit(2)

    if (queryError) {
      console.error('[SEO Analysis Cron] 대기 주문 조회 실패:', queryError)
      return NextResponse.json({ error: 'Query failed' }, { status: 500 })
    }

    if (!pendingOrders || pendingOrders.length === 0) {
      return NextResponse.json({ message: 'No pending analysis', processed: 0 })
    }

    // 🔒 락 획득: 픽업한 주문을 원자적으로 analyzing 상태로 변경
    // .eq('status', order.status) 조건으로 이미 다른 크론이 바꿨으면 매칭 실패 → 0건 반환
    const lockedOrders: typeof pendingOrders = []
    for (const order of pendingOrders) {
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

    if (lockedOrders.length === 0) {
      return NextResponse.json({
        message: 'All orders being processed by other crons',
        processed: 0,
      })
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

        // 1. 온페이지 SEO 분석
        const { parsed, analysis, score } = await fetchAndAnalyze(
          order.site_url,
          order.keywords || undefined
        )
        const analysisHtml = markdownToHtml(analysis)

        // 2. 경쟁사 분석 (키워드 있는 경우만, 실패해도 무시)
        let competitorData: CompetitorAnalysis | null = null
        if (order.keywords) {
          try {
            console.log(`[SEO Analysis] 경쟁사 분석 시작: ${order.keywords}`)
            competitorData = await analyzeCompetitors(order.keywords, order.site_url, 3)
            console.log(`[SEO Analysis] 경쟁사 분석 완료: ${competitorData.competitors.length}개`)
          } catch (compError: any) {
            console.error(`[SEO Analysis] 경쟁사 분석 실패 (무시):`, compError.message)
          }
        }

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

        // 실패 시 에러 기록 후 pending_analysis로 되돌림 (다음 크론에서 재시도)
        await adminClient
          .from('orders')
          .update({
            status: 'pending_analysis',
            api_error: `SEO 분석 실패: ${err.message}`,
          })
          .eq('id', order.id)

        failed++
      }
    }

    return NextResponse.json({
      message: `Processed ${processed} analyses`,
      processed,
      failed,
      total: pendingOrders.length,
    })
  } catch (error: any) {
    console.error('[SEO Analysis Cron] 오류:', error)
    return NextResponse.json({ error: 'Internal error', details: error.message }, { status: 500 })
  }
}
