/**
 * POST /api/telegram/session
 *
 * 분석 결과 페이지(또는 LP)에서 텔레그램 CTA 버튼 클릭 시 호출.
 * - telegram_sessions 레코드 발급 (lp_request_id, source, ref 매핑)
 * - 봇 deeplink URL 반환 (https://t.me/<bot>?start=<session_id>)
 *
 * 클라이언트는 응답으로 받은 deeplink로 window.location.href 이동시킨다.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createAdminSupabaseClient } from '@/server/supabase/admin'
import { getBotUsername } from '@/lib/telegram'
import { extractDomain } from '@/lib/domain'

export const dynamic = 'force-dynamic'

type Body = {
  domain?: string
  source?: string
  ref?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Body
    const source = (body.source || 'unknown').slice(0, 64)
    const ref = body.ref ? body.ref.slice(0, 32) : null
    const domain = body.domain ? extractDomain(body.domain) : null

    const supabase = createAdminSupabaseClient()

    // 도메인이 주어지면 가장 최근 lp_requests 조회
    let lpRequestId: string | null = null
    if (domain) {
      const { data: latest } = await supabase
        .from('lp_requests')
        .select('id, url')
        .ilike('url', `%${domain}%`)
        .order('created_at', { ascending: false })
        .limit(5)

      const match = (latest ?? []).find(r => extractDomain(r.url) === domain)
      lpRequestId = match?.id ?? null
    }

    const { data: session, error } = await supabase
      .from('telegram_sessions')
      .insert({
        lp_request_id: lpRequestId,
        source,
        ref,
      })
      .select('id')
      .single()

    if (error || !session) {
      console.error('[telegram/session] insert 실패:', error)
      return NextResponse.json({ error: '세션 발급 실패' }, { status: 500 })
    }

    const botUsername = getBotUsername()
    const deeplink = `https://t.me/${botUsername}?start=${session.id}`

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      deeplink,
    })
  } catch (err) {
    console.error('[telegram/session] 예외:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
