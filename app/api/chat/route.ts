/**
 * POST /api/chat — AI 상담 챗봇 응답.
 *
 * 완전 익명: 대화 내용을 저장하지 않는다. 레이트리밋용 IP 해시만 사용량 테이블에 기록.
 * 정확한 견적·계약은 텔레그램으로 승격하도록 시스템 프롬프트에서 유도.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createHash } from 'crypto'
import { createAdminSupabaseClient } from '@/server/supabase/admin'
import { buildChatSystemPrompt, type ChatContext } from '@/lib/chat-knowledge'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const MAX_HISTORY = 16
const MAX_CONTENT_LEN = 2000
const RATE_LIMIT_PER_HOUR = 40

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  }

  let body: { messages?: unknown; context?: ChatContext } | null = null
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const messages = sanitizeMessages(body?.messages)
  if (messages.length === 0) {
    return NextResponse.json({ error: 'no messages' }, { status: 400 })
  }

  // ── 레이트리밋 (IP 해시 기준, 시간당) ──
  const ip = getClientIp(request)
  const limited = await isRateLimited(ip)
  if (limited) {
    return NextResponse.json(
      {
        reply:
          '문의가 잠시 몰려서 응답이 제한되었어요. 잠깐 후에 다시 시도하거나, 텔레그램으로 바로 상담해 주세요 🙏',
        rateLimited: true,
      },
      { status: 429 }
    )
  }

  const systemPrompt = buildChatSystemPrompt(body?.context)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: AbortSignal.timeout(30000),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.5,
        max_tokens: 600,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    })

    if (!response.ok) {
      console.error('[api/chat] OpenAI 오류:', response.status)
      return NextResponse.json({ error: 'ai error' }, { status: 502 })
    }

    const data = await response.json()
    const reply: string =
      data.choices?.[0]?.message?.content?.trim() ||
      '죄송해요, 답변을 만들지 못했어요. 텔레그램으로 문의 주시면 바로 도와드릴게요.'

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[api/chat] 예외:', err)
    return NextResponse.json({ error: 'ai error' }, { status: 502 })
  }
}

function sanitizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m === 'object' &&
        ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant') &&
        typeof (m as ChatMessage).content === 'string' &&
        (m as ChatMessage).content.trim().length > 0
    )
    .slice(-MAX_HISTORY)
    .map(m => ({ role: m.role, content: m.content.trim().slice(0, MAX_CONTENT_LEN) }))
}

function getClientIp(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

async function isRateLimited(ip: string): Promise<boolean> {
  try {
    const ipHash = createHash('sha256').update(`backlinkshop:${ip}`).digest('hex')
    const supabase = createAdminSupabaseClient()
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const nowIso = new Date().toISOString()

    const { data } = await supabase
      .from('ai_chat_usage')
      .select('count, window_start')
      .eq('ip_hash', ipHash)
      .maybeSingle()

    let count = 1
    let windowStart = nowIso
    if (data && data.window_start > hourAgo) {
      if (data.count >= RATE_LIMIT_PER_HOUR) return true
      count = data.count + 1
      windowStart = data.window_start
    }

    await supabase
      .from('ai_chat_usage')
      .upsert(
        { ip_hash: ipHash, count, window_start: windowStart, updated_at: nowIso },
        { onConflict: 'ip_hash' }
      )
    return false
  } catch (err) {
    // 레이트리밋 실패 시에는 막지 않는다 (가용성 우선).
    console.warn('[api/chat] rate limit 확인 실패:', err)
    return false
  }
}
