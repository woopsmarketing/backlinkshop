/**
 * POST /api/telegram/webhook
 *
 * 텔레그램 봇 webhook 엔드포인트.
 * - /start <session_id>: 세션 기반 자동 응답 (분석 결과 발송 + discovery + 운영자 알림)
 * - /start: 세션 없는 외부 채널 진입
 * - callback_query: 인라인 버튼 (메뉴/discovery) 처리
 * - 일반 메시지: 운영자 chat_id 로 포워딩 알림
 *
 * 보안: setWebhook 시 등록한 secret_token 을 헤더로 검증.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createAdminSupabaseClient } from '@/server/supabase/admin'
import { sendMessage, answerCallbackQuery, getAdminChatId } from '@/lib/telegram'
import {
  buildUserWelcomeWithReport,
  buildUserWelcomeNoReport,
  buildDiscoveryQuestion,
  buildDiscoveryResponse,
  buildMenuPrice,
  buildMenuCases,
  buildMenuServices,
  buildMenuFaq,
  buildMenuContact,
  buildMenuQuote,
  buildPersistentMenuKeyboard,
  buildKeywordDetailMessage,
  buildAiAndPrecisionMessage,
  buildClosingPitch,
  buildAdminAlertForNewSession,
  buildAdminAlertForUserMessage,
  buildAdminAlertForDiscovery,
  type LpRequestRow,
  type SessionRow,
  type TelegramFromPayload,
  type TelegramUserRow,
} from '@/lib/telegram-messages'
import { getAnalyzeV2, getSingleKeyword, getAiVisibility } from '@/lib/vebapi'
import { generateKeywordIdeas } from '@/lib/keyword-ideas'
import { extractDomain } from '@/lib/domain'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type TgUpdate = {
  update_id: number
  message?: TgMessage
  callback_query?: TgCallbackQuery
}

type TgMessage = {
  message_id: number
  from?: TelegramFromPayload
  chat: { id: number; type: string }
  date: number
  text?: string
}

type TgCallbackQuery = {
  id: string
  from: TelegramFromPayload
  message?: TgMessage
  data?: string
}

export async function POST(request: NextRequest) {
  // secret_token 검증 (옵션 — 설정된 경우만)
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (expectedSecret) {
    const received = request.headers.get('x-telegram-bot-api-secret-token')
    if (received !== expectedSecret) {
      console.warn('[telegram/webhook] secret_token mismatch')
      return NextResponse.json({ ok: false }, { status: 401 })
    }
  }

  let update: TgUpdate
  try {
    update = (await request.json()) as TgUpdate
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  // 텔레그램에는 항상 200 빠르게 응답해야 함. 처리는 best-effort.
  try {
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query)
    } else if (update.message) {
      await handleMessage(update.message)
    }
  } catch (err) {
    console.error('[telegram/webhook] 처리 예외:', err)
  }

  return NextResponse.json({ ok: true })
}

// ─────────────────────────────────────────────────────────────
// message handlers
// ─────────────────────────────────────────────────────────────

async function handleMessage(msg: TgMessage) {
  if (!msg.from || msg.from.is_bot) return
  const chatId = msg.chat.id
  const text = msg.text?.trim() || ''

  const supabase = createAdminSupabaseClient()
  const user = await upsertTelegramUser(supabase, msg.from)

  // /start [session_id]
  if (text.startsWith('/start')) {
    const arg = text.slice('/start'.length).trim()
    await handleStart(supabase, chatId, msg.from, user, arg)
    return
  }

  // /help
  if (text === '/help') {
    await sendMessage({
      chatId,
      text:
        '<b>도움말</b>\n\n' +
        '저는 백링크샵 SEO 상담 봇이에요.\n' +
        '자유롭게 질문 주시면 운영자가 5~15분 안에 직접 답변드립니다.\n\n' +
        '아래 메뉴를 활용하실 수도 있어요.',
      replyMarkup: {
        inline_keyboard: [
          [{ text: '💬 1:1 상담 요청', callback_data: 'menu:contact' }],
          [
            { text: '💰 가격', callback_data: 'menu:price' },
            { text: '📋 서비스', callback_data: 'menu:services' },
            { text: '❓ FAQ', callback_data: 'menu:faq' },
          ],
        ],
      },
    })
    return
  }

  // 일반 메시지 — 운영자에게 포워딩 알림
  if (text.length > 0) {
    const alert = buildAdminAlertForUserMessage(user, msg.from, text)
    await safeSendToAdmin(alert)

    // 사용자에게 접수 확인 + 영구 메뉴
    await sendMessage({
      chatId,
      text: '<b>메시지가 운영자에게 전달됐어요.</b>\n평균 5~15분 안에 직접 답변드립니다 ☺️',
      replyMarkup: { inline_keyboard: buildPersistentMenuKeyboard() },
    })
  }
}

async function handleCallbackQuery(cb: TgCallbackQuery) {
  if (!cb.data) {
    await answerCallbackQuery(cb.id)
    return
  }
  const chatId = cb.message?.chat.id
  if (!chatId) {
    await answerCallbackQuery(cb.id)
    return
  }

  const supabase = createAdminSupabaseClient()
  const user = await upsertTelegramUser(supabase, cb.from)

  // discovery:keyword | discovery:backlink | discovery:cost | discovery:direct
  if (cb.data.startsWith('discover:')) {
    const intent = cb.data.split(':')[1]
    const { text, intentLabel } = buildDiscoveryResponse(intent)

    await answerCallbackQuery(cb.id, '전달했어요')
    // discovery 응답 후엔 영구 메뉴 동행
    await sendMessage({
      chatId,
      text,
      replyMarkup: { inline_keyboard: buildPersistentMenuKeyboard() },
    })

    const alert = buildAdminAlertForDiscovery(user, cb.from, intentLabel)
    await safeSendToAdmin(alert)
    return
  }

  // menu:price | menu:cases | menu:services | menu:faq | menu:contact | menu:quote
  if (cb.data.startsWith('menu:')) {
    const key = cb.data.split(':')[1]
    await answerCallbackQuery(cb.id)

    // 모든 메뉴 응답에 영구 메뉴 키보드 자동 부착
    const menuMarkup = { inline_keyboard: buildPersistentMenuKeyboard() }

    switch (key) {
      case 'price':
        await sendMessage({ chatId, text: buildMenuPrice(), replyMarkup: menuMarkup })
        break
      case 'cases':
        await sendMessage({ chatId, text: buildMenuCases(), replyMarkup: menuMarkup })
        break
      case 'services':
        await sendMessage({ chatId, text: buildMenuServices(), replyMarkup: menuMarkup })
        break
      case 'faq':
        await sendMessage({ chatId, text: buildMenuFaq(), replyMarkup: menuMarkup })
        break
      case 'contact': {
        // 1:1 상담 응답엔 메뉴 안 붙임 (대화 시작 단계 — 시각적 노이즈 최소화)
        await sendMessage({ chatId, text: buildMenuContact() })
        const alert = buildAdminAlertForDiscovery(user, cb.from, '1:1 상담 요청 클릭')
        await safeSendToAdmin(alert)
        break
      }
      case 'quote': {
        const lastDomain = user.analyzed_domains[user.analyzed_domains.length - 1]
        await sendMessage({
          chatId,
          text: buildMenuQuote(lastDomain),
          replyMarkup: menuMarkup,
        })
        const alert = buildAdminAlertForDiscovery(user, cb.from, '견적 문의 클릭')
        await safeSendToAdmin(alert)
        break
      }
      default:
        break
    }
    return
  }

  await answerCallbackQuery(cb.id)
}

// ─────────────────────────────────────────────────────────────
// /start session handler
// ─────────────────────────────────────────────────────────────

async function handleStart(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  chatId: number,
  from: TelegramFromPayload,
  user: TelegramUserRow,
  arg: string
) {
  let session: SessionRow | null = null
  let lp: LpRequestRow | null = null

  if (arg) {
    // arg = session_id
    const { data: sessionRow } = await supabase
      .from('telegram_sessions')
      .select('id, source, ref, lp_request_id, created_at, expires_at')
      .eq('id', arg)
      .maybeSingle()

    if (sessionRow) {
      // 세션 만료 체크
      const expiresAt = new Date(sessionRow.expires_at as string)
      if (expiresAt > new Date()) {
        session = {
          id: sessionRow.id as string,
          source: sessionRow.source as string | null,
          ref: sessionRow.ref as string | null,
          created_at: sessionRow.created_at as string,
        }

        // 세션에 chat_id, started_at 기록
        await supabase
          .from('telegram_sessions')
          .update({ chat_id: chatId, started_at: new Date().toISOString() })
          .eq('id', sessionRow.id as string)

        // 연결된 lp_requests 조회
        if (sessionRow.lp_request_id) {
          const { data: lpRow } = await supabase
            .from('lp_requests')
            .select('id, url, keyword, email, ip_address, created_at, seo_report_data')
            .eq('id', sessionRow.lp_request_id as string)
            .maybeSingle()
          if (lpRow) {
            lp = lpRow as LpRequestRow
            // telegram_users.analyzed_domains 에 추가
            const domain = extractDomain(lpRow.url as string)
            await appendAnalyzedDomain(supabase, chatId, domain)
          }
        }

        // source_channels 누적
        if (session.ref) {
          await appendSourceChannel(supabase, chatId, session.ref)
        }
      }
    }
  }

  // 응답 분기
  if (lp && session) {
    const domain = extractDomain(lp.url)

    const { text, keyboard } = buildUserWelcomeWithReport(lp, session)
    await sendMessage({
      chatId,
      text,
      replyMarkup: { inline_keyboard: keyboard },
      disableWebPagePreview: true,
    })

    // 정밀 데이터 (페이지에서 잠겼던 것) 자동 발송
    try {
      const parsedReport = (lp.seo_report_data?.parsedData ?? null) as Record<
        string,
        unknown
      > | null
      const reportTitle =
        (parsedReport?.title as string | undefined) ||
        (parsedReport?.metaDescription as string | undefined) ||
        null

      const [singleKw, ideas, ai, av2] = await Promise.all([
        lp.keyword ? safeAwait(() => getSingleKeyword(lp.keyword, 'kr')) : Promise.resolve(null),
        lp.keyword
          ? safeAwait(() =>
              generateKeywordIdeas({ seedKeyword: lp.keyword, domain, siteTitle: reportTitle })
            ).then(r => r ?? [])
          : Promise.resolve([] as Awaited<ReturnType<typeof generateKeywordIdeas>>),
        safeAwait(() => getAiVisibility(domain)),
        safeAwait(() => getAnalyzeV2(domain)),
      ])

      // 키워드 정밀 분석 메시지
      const kwText = buildKeywordDetailMessage(lp.keyword, singleKw, ideas)
      if (kwText) {
        await sendMessage({ chatId, text: kwText, disableWebPagePreview: true })
      }

      // AI + 정밀 진단 메시지
      const aiPrecisionText = buildAiAndPrecisionMessage(ai, av2)
      if (aiPrecisionText) {
        await sendMessage({ chatId, text: aiPrecisionText, disableWebPagePreview: true })
      }

      // 매출 강조 마무리
      await sendMessage({
        chatId,
        text: buildClosingPitch(domain),
        disableWebPagePreview: true,
      })
    } catch (err) {
      console.error('[telegram/webhook] enrichment 발송 실패:', err)
    }

    // discovery question — 마지막에 행동 유도
    const discovery = buildDiscoveryQuestion()
    await sendMessage({
      chatId,
      text: discovery.text,
      replyMarkup: { inline_keyboard: discovery.keyboard },
    })

    // 운영자 알림
    const updatedUser = await refreshUser(supabase, chatId)
    const alert = buildAdminAlertForNewSession(lp, session, updatedUser ?? user, from)
    await safeSendToAdmin(alert)
  } else {
    // 분석 결과 없음 / 세션 만료 / 외부 채널
    const { text, keyboard } = buildUserWelcomeNoReport()
    await sendMessage({
      chatId,
      text,
      replyMarkup: { inline_keyboard: keyboard },
      disableWebPagePreview: true,
    })

    // 운영자 알림 (외부 채널 진입)
    const dummySession: SessionRow = {
      id: '',
      source: 'external',
      ref: session?.ref ?? null,
      created_at: new Date().toISOString(),
    }
    const alert = buildAdminAlertForNewSession(null, dummySession, user, from)
    await safeSendToAdmin(alert)
  }
}

// ─────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────

async function upsertTelegramUser(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  from: TelegramFromPayload
): Promise<TelegramUserRow> {
  const { data: existing } = await supabase
    .from('telegram_users')
    .select(
      'chat_id, username, first_name, last_name, language_code, first_seen_at, total_sessions, analyzed_domains, source_channels'
    )
    .eq('chat_id', from.id)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('telegram_users')
      .update({
        username: from.username ?? existing.username,
        first_name: from.first_name ?? existing.first_name,
        last_name: from.last_name ?? existing.last_name,
        language_code: from.language_code ?? existing.language_code,
        last_seen_at: new Date().toISOString(),
        total_sessions: (existing.total_sessions as number) + 1,
      })
      .eq('chat_id', from.id)

    return {
      chat_id: existing.chat_id as number,
      username: (from.username ?? existing.username) as string | null,
      first_name: (from.first_name ?? existing.first_name) as string | null,
      last_name: (from.last_name ?? existing.last_name) as string | null,
      language_code: (from.language_code ?? existing.language_code) as string | null,
      first_seen_at: existing.first_seen_at as string,
      total_sessions: ((existing.total_sessions as number) ?? 0) + 1,
      analyzed_domains: (existing.analyzed_domains as string[]) ?? [],
    }
  }

  // 신규
  const insertRow = {
    chat_id: from.id,
    username: from.username ?? null,
    first_name: from.first_name ?? null,
    last_name: from.last_name ?? null,
    language_code: from.language_code ?? null,
    total_sessions: 1,
    analyzed_domains: [] as string[],
    source_channels: [] as string[],
  }
  await supabase.from('telegram_users').insert(insertRow)

  return {
    chat_id: from.id,
    username: from.username ?? null,
    first_name: from.first_name ?? null,
    last_name: from.last_name ?? null,
    language_code: from.language_code ?? null,
    first_seen_at: new Date().toISOString(),
    total_sessions: 1,
    analyzed_domains: [],
  }
}

async function refreshUser(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  chatId: number
): Promise<TelegramUserRow | null> {
  const { data } = await supabase
    .from('telegram_users')
    .select(
      'chat_id, username, first_name, last_name, language_code, first_seen_at, total_sessions, analyzed_domains'
    )
    .eq('chat_id', chatId)
    .maybeSingle()
  return data as TelegramUserRow | null
}

async function appendAnalyzedDomain(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  chatId: number,
  domain: string
) {
  const { data } = await supabase
    .from('telegram_users')
    .select('analyzed_domains')
    .eq('chat_id', chatId)
    .maybeSingle()
  if (!data) return
  const arr = (data.analyzed_domains as string[]) ?? []
  if (arr.includes(domain)) return
  arr.push(domain)
  await supabase.from('telegram_users').update({ analyzed_domains: arr }).eq('chat_id', chatId)
}

async function appendSourceChannel(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  chatId: number,
  ref: string
) {
  const { data } = await supabase
    .from('telegram_users')
    .select('source_channels')
    .eq('chat_id', chatId)
    .maybeSingle()
  if (!data) return
  const arr = (data.source_channels as string[]) ?? []
  if (arr.includes(ref)) return
  arr.push(ref)
  await supabase.from('telegram_users').update({ source_channels: arr }).eq('chat_id', chatId)
}

async function safeSendToAdmin(text: string) {
  try {
    const adminId = getAdminChatId()
    await sendMessage({ chatId: adminId, text, disableWebPagePreview: true })
  } catch (err) {
    console.error('[telegram/webhook] admin 알림 실패:', err)
  }
}

async function safeAwait<T>(fn: () => Promise<T | null>): Promise<T | null> {
  try {
    return await fn()
  } catch (err) {
    console.error('[telegram/webhook] safeAwait 실패:', err)
    return null
  }
}
