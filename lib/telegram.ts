/**
 * 텔레그램 Bot API 호출 유틸.
 *
 * Vercel 서버리스에서 webhook으로 호출되거나, 세션 발급 시 사용된다.
 * 토큰/관리자 chat_id 는 환경변수에서 읽는다.
 */

const TELEGRAM_API_BASE = 'https://api.telegram.org'

export type TelegramKeyboardButton = {
  text: string
  callback_data?: string
  url?: string
}

export type TelegramInlineKeyboard = TelegramKeyboardButton[][]

export type SendMessageOptions = {
  chatId: number | string
  text: string
  parseMode?: 'HTML' | 'MarkdownV2' | 'Markdown'
  replyMarkup?: { inline_keyboard: TelegramInlineKeyboard }
  disableWebPagePreview?: boolean
}

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN 환경변수가 누락되었습니다')
  return token
}

export function getAdminChatId(): string {
  const id = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!id) throw new Error('TELEGRAM_ADMIN_CHAT_ID 환경변수가 누락되었습니다')
  return id
}

export function getBotUsername(): string {
  return process.env.TELEGRAM_BOT_USERNAME || 'backlinkshop_seo_bot'
}

/**
 * sendMessage — 텔레그램 메시지 전송.
 * 실패해도 throw 하지 않고 false 반환 (호출자가 사용자 응답을 막지 않도록).
 */
export async function sendMessage(opts: SendMessageOptions): Promise<boolean> {
  try {
    const token = getBotToken()
    const body: Record<string, unknown> = {
      chat_id: opts.chatId,
      text: opts.text,
      parse_mode: opts.parseMode ?? 'HTML',
      disable_web_page_preview: opts.disableWebPagePreview ?? false,
    }
    if (opts.replyMarkup) body.reply_markup = opts.replyMarkup

    const res = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error('[telegram.sendMessage] 실패:', res.status, errText)
      return false
    }
    return true
  } catch (err) {
    console.error('[telegram.sendMessage] 예외:', err)
    return false
  }
}

/**
 * answerCallbackQuery — 인라인 버튼 클릭 시 사용자에게 "처리 중" 토스트.
 * 실패해도 무시.
 */
export async function answerCallbackQuery(callbackQueryId: string, text?: string): Promise<void> {
  try {
    const token = getBotToken()
    await fetch(`${TELEGRAM_API_BASE}/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || '',
      }),
    })
  } catch (err) {
    console.error('[telegram.answerCallbackQuery] 예외:', err)
  }
}

/**
 * setWebhook — 봇 webhook URL 등록. 배포 후 1회만 호출.
 */
export async function setWebhook(webhookUrl: string, secretToken?: string): Promise<boolean> {
  try {
    const token = getBotToken()
    const body: Record<string, unknown> = { url: webhookUrl }
    if (secretToken) body.secret_token = secretToken

    const res = await fetch(`${TELEGRAM_API_BASE}/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    return res.ok
  } catch (err) {
    console.error('[telegram.setWebhook] 예외:', err)
    return false
  }
}

/**
 * HTML 안전 escape. Telegram HTML parse_mode 에서 사용.
 */
export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
