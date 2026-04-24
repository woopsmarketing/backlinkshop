import { NextResponse, type NextRequest } from 'next/server'
import { createAdminSupabaseClient } from '@/server/supabase/admin'
import { extractDomain, isValidDomain } from '@/lib/domain'
import { isVisibleReport } from '@/lib/lp-metrics'

export const dynamic = 'force-dynamic'

type LpStatus =
  | 'pending_analysis'
  | 'analyzing'
  | 'processing'
  | 'sending_report'
  | 'completed'
  | 'failed'

/**
 * LP 분석 상태 폴링 엔드포인트.
 *
 * 결과 페이지가 1~2초 간격으로 호출해 진행 상태를 갱신한다.
 * - 쿼리 파라미터: `domain` (필수)
 * - 응답: 가장 최근 요청의 상태·결과 데이터
 * - 민감 정보(email/ip)는 응답에서 제외
 */
export async function GET(request: NextRequest) {
  try {
    const rawDomain = request.nextUrl.searchParams.get('domain')?.trim() ?? ''
    if (!rawDomain) {
      return NextResponse.json({ error: 'domain 파라미터가 필요합니다' }, { status: 400 })
    }

    const domain = extractDomain(rawDomain)
    if (!isValidDomain(domain)) {
      return NextResponse.json({ error: '도메인 형식이 올바르지 않습니다' }, { status: 400 })
    }

    const adminClient = createAdminSupabaseClient()

    // 도메인 기반 가장 최근 요청 1개 (ilike 로 프로토콜/경로 포함 URL 매칭)
    const pattern = `https://${domain}%`
    const { data, error } = await adminClient
      .from('lp_requests')
      .select('id, url, keyword, status, seo_report_data, created_at, analyzed_at, completed_at')
      .ilike('url', pattern)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('[LP Status] 조회 실패:', error)
      return NextResponse.json({ error: '상태 조회 실패' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json(
        {
          status: 'none' as const,
          hasReport: false,
          domain,
        },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const status = data.status as LpStatus
    const hasReport = isVisibleReport(status, data.seo_report_data)

    return NextResponse.json(
      {
        status,
        hasReport,
        domain,
        url: data.url,
        keyword: data.keyword,
        requestedAt: data.created_at,
        analyzedAt: data.analyzed_at,
        completedAt: data.completed_at,
        report: hasReport ? data.seo_report_data : null,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('[LP Status] 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
