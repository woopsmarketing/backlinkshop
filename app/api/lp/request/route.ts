import { NextResponse, type NextRequest } from 'next/server'
import { createAdminSupabaseClient } from '@/server/supabase/admin'

export const dynamic = 'force-dynamic'

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

    // IP 추출
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const adminClient = createAdminSupabaseClient()

    // IP 기반 하루 3회 제한
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count } = await adminClient
      .from('lp_requests')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', todayStart.toISOString())

    if (count !== null && count >= 3) {
      return NextResponse.json(
        { error: '하루 최대 3회까지 신청 가능합니다. 내일 다시 시도해주세요.' },
        { status: 429 }
      )
    }

    // 이메일 기준 하루 1회 제한 (URL 무관)
    const { count: emailDayCount } = await adminClient
      .from('lp_requests')
      .select('*', { count: 'exact', head: true })
      .eq('email', email.trim().toLowerCase())
      .gte('created_at', todayStart.toISOString())

    if (emailDayCount !== null && emailDayCount >= 1) {
      return NextResponse.json(
        {
          error:
            '같은 이메일로 하루 1회만 무료 진단이 가능합니다. 추가 진단이 필요하시면 1:1 상담을 이용해주세요.',
        },
        { status: 429 }
      )
    }

    // 같은 이메일 + URL 중복 요청 방지 (24시간 내)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: dupCount } = await adminClient
      .from('lp_requests')
      .select('*', { count: 'exact', head: true })
      .eq('email', email.trim().toLowerCase())
      .eq('url', url.trim())
      .gte('created_at', oneDayAgo)

    if (dupCount !== null && dupCount > 0) {
      return NextResponse.json(
        { error: '같은 URL에 대한 진단이 이미 진행 중입니다. 이메일을 확인해주세요.' },
        { status: 409 }
      )
    }

    // DB 저장
    const { error: insertError } = await adminClient.from('lp_requests').insert({
      url: url.trim(),
      keyword: keyword.trim(),
      email: email.trim().toLowerCase(),
      ip_address: ip,
      status: 'pending_analysis',
    })

    if (insertError) {
      console.error('[LP Request] 저장 실패:', insertError)
      return NextResponse.json({ error: '요청 처리 중 오류가 발생했습니다' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: '진단 요청이 접수되었습니다' })
  } catch (error) {
    console.error('[LP Request] 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
