import { NextResponse, type NextRequest } from 'next/server'
import { createAdminSupabaseClient } from '@/server/supabase/admin'
import { extractDomain, isValidDomain, normalizeUrl } from '@/lib/domain'

export const dynamic = 'force-dynamic'

const CACHE_WINDOW_DAYS = 30
const COMPLETED_STATUSES = ['processing', 'sending_report', 'completed'] as const

function buildRedirectUrl(domain: string) {
  return `/analyze/${encodeURIComponent(domain)}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, keyword, email } = body

    // 입력 검증
    if (!url?.trim() || !keyword?.trim() || !email?.trim()) {
      return NextResponse.json({ error: '모든 필드를 입력해주세요' }, { status: 400 })
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: '올바른 이메일 주소를 입력해주세요' }, { status: 400 })
    }

    const cleanUrl = normalizeUrl(url)
    if (!cleanUrl || cleanUrl === 'https://') {
      return NextResponse.json({ error: '올바른 URL을 입력해주세요' }, { status: 400 })
    }

    if (/\s/.test(cleanUrl)) {
      return NextResponse.json(
        { error: 'URL에 공백이 포함되어 있습니다. 확인 후 다시 입력해주세요.' },
        { status: 400 }
      )
    }

    const domain = extractDomain(cleanUrl)
    if (!isValidDomain(domain)) {
      return NextResponse.json(
        { error: '도메인 형식이 올바르지 않습니다. 예: example.com' },
        { status: 400 }
      )
    }

    // IP 추출
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const adminClient = createAdminSupabaseClient()
    const normalizedEmail = email.trim().toLowerCase()
    const trimmedKeyword = keyword.trim()

    // 관리자 이메일은 rate limit 제한 없이 통과
    const ADMIN_EMAILS = ['vnfm0580@gmail.com', 'thugwoops@naver.com']
    const isAdmin = ADMIN_EMAILS.includes(normalizedEmail)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    // IP 기반 하루 3회 제한
    const { count } = await adminClient
      .from('lp_requests')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', todayStart.toISOString())

    if (!isAdmin && count !== null && count >= 3) {
      return NextResponse.json(
        { error: '하루 최대 3회까지 신청 가능합니다. 내일 다시 시도해주세요.' },
        { status: 429 }
      )
    }

    // 이메일 기준 하루 1회 제한
    const { count: emailDayCount } = await adminClient
      .from('lp_requests')
      .select('*', { count: 'exact', head: true })
      .eq('email', normalizedEmail)
      .gte('created_at', todayStart.toISOString())

    if (!isAdmin && emailDayCount !== null && emailDayCount >= 1) {
      return NextResponse.json(
        {
          error:
            '같은 이메일로 하루 1회만 무료 진단이 가능합니다. 추가 진단이 필요하시면 1:1 상담을 이용해주세요.',
        },
        { status: 429 }
      )
    }

    // 동일 이메일+URL 24시간 내 재요청 → 기존 결과 페이지로 리다이렉트 (이중 요청 방지)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: existing } = await adminClient
      .from('lp_requests')
      .select('id')
      .eq('email', normalizedEmail)
      .eq('url', cleanUrl)
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!isAdmin && existing) {
      return NextResponse.json({
        success: true,
        redirectUrl: buildRedirectUrl(domain),
        cached: true,
        reused: true,
      })
    }

    // 30일 내 동일 URL 완료 캐시 조회 (다른 사용자의 완료 결과도 재사용)
    const cacheCutoff = new Date(Date.now() - CACHE_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()
    const { data: cached } = await adminClient
      .from('lp_requests')
      .select('seo_report_data')
      .eq('url', cleanUrl)
      .in('status', COMPLETED_STATUSES as unknown as string[])
      .gte('created_at', cacheCutoff)
      .not('seo_report_data', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const now = new Date().toISOString()
    const insertPayload: Record<string, unknown> = {
      url: cleanUrl,
      keyword: trimmedKeyword,
      email: normalizedEmail,
      ip_address: ip,
    }

    if (cached?.seo_report_data) {
      // 캐시 재사용: processing 상태로 저장 → seo-reports cron 이 이메일 발송
      insertPayload.status = 'processing'
      insertPayload.seo_report_data = cached.seo_report_data
      insertPayload.analyzed_at = now
    } else {
      insertPayload.status = 'pending_analysis'
    }

    const { error: insertError } = await adminClient.from('lp_requests').insert(insertPayload)

    if (insertError) {
      console.error('[LP Request] 저장 실패:', insertError)
      return NextResponse.json({ error: '요청 처리 중 오류가 발생했습니다' }, { status: 500 })
    }

    // 결과는 /analyze/{도메인} 페이지에서 실시간으로 보여주므로 별도 이메일 발송하지 않음.
    // 관리자 알림이 필요하면 Supabase 대시보드에서 lp_requests 테이블을 직접 모니터링.

    return NextResponse.json({
      success: true,
      redirectUrl: buildRedirectUrl(domain),
      cached: Boolean(cached),
      message: cached ? '이전에 분석한 결과를 불러왔어요' : '진단 요청이 접수되었습니다',
    })
  } catch (error) {
    console.error('[LP Request] 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
