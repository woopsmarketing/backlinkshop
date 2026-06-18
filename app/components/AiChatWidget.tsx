'use client'

/**
 * AI 상담 챗봇 위젯 (우측하단 플로팅).
 *
 * - 완전 익명: 대화는 브라우저 sessionStorage(탭 단위)에만, 서버 미전송·개인정보 안 받음.
 * - 24/7 AI 1차 응대 → 정확한 견적·상담은 텔레그램으로 승격.
 * - 분석 페이지에서는 그 방문자의 진단 맥락(context)을 함께 전달해 맞춤 답변.
 */

import { useEffect, useRef, useState } from 'react'

export type ChatContext = {
  domain?: string | null
  keyword?: string | null
  score?: number | null
  gaps?: string[]
  issues?: string[]
}

type Msg = { role: 'user' | 'assistant'; content: string }

const TELEGRAM_FALLBACK = 'https://t.me/backlinkshop_seo_bot'
// 대화는 서버에 저장하지 않는다(완전 익명). 새로고침에도 유지되도록 브라우저
// sessionStorage(탭 단위)에만 보관 — 탭을 닫으면 자동 삭제된다.
const STORAGE_KEY = 'bls_chat_msgs'
const GREETING =
  '안녕하세요! 백링크샵 SEO 상담 AI예요 😊\n구글 상위 노출·백링크·견적 등 무엇이든 편하게 물어보세요. 24시간 바로 답해드려요.'

const SUGGESTIONS = ['백링크가 꼭 필요한가요?', '비용이 얼마나 드나요?', '얼마나 걸려요?']

export function AiChatWidget({ context }: { context?: ChatContext }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tgLoading, setTgLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  // 새로고침 시 대화 복원 (sessionStorage, 서버 미전송)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setMessages(parsed as Msg[])
      }
    } catch {
      /* storage 차단 — 무시 */
    }
  }, [])

  // 대화 변경 시 저장
  useEffect(() => {
    try {
      if (messages.length > 0) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      /* ignore */
    }
  }, [messages])

  const resetChat = () => {
    setMessages([])
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const next: Msg[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, context }),
      })
      const data = await res.json().catch(() => null)
      const reply =
        data?.reply || '죄송해요, 잠시 문제가 있었어요. 텔레그램으로 문의 주시면 바로 도와드릴게요.'
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: '연결이 불안정해요. 텔레그램으로 문의 주시면 바로 도와드릴게요 🙏',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const openTelegram = async () => {
    if (tgLoading) return
    setTgLoading(true)
    try {
      let ref: string | null = null
      try {
        ref = sessionStorage.getItem('lp_ref')
      } catch {
        /* ignore */
      }
      const res = await fetch('/api/telegram/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: context?.domain ?? null, source: 'ai_widget', ref }),
      })
      const data = await res.json().catch(() => null)
      window.open(data?.deeplink || TELEGRAM_FALLBACK, '_blank', 'noopener,noreferrer')
    } catch {
      window.open(TELEGRAM_FALLBACK, '_blank', 'noopener,noreferrer')
    } finally {
      setTgLoading(false)
    }
  }

  return (
    <>
      {/* 런처 버튼 */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="SEO 상담 AI 열기"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-purple-600/30 transition hover:bg-purple-700"
        >
          <span className="text-lg">💬</span>
          <span className="hidden sm:inline">SEO 무엇이든 물어보세요</span>
          <span className="sm:hidden">AI 상담</span>
        </button>
      )}

      {/* 채팅 패널 */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:w-96">
          {/* 헤더 */}
          <div className="flex items-center justify-between bg-purple-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <p className="text-sm font-bold leading-tight">백링크샵 상담 AI</p>
                <p className="text-[11px] text-purple-100">24시간 즉시 응답</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={resetChat}
                  aria-label="새 대화 시작"
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-purple-100 hover:bg-purple-500"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  새 대화
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="rounded-full p-1 text-purple-100 hover:bg-purple-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-4">
            <Bubble role="assistant" content={GREETING} />
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && <Bubble role="assistant" content="…" typing />}

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-purple-200 bg-white px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 텔레그램 승격 */}
          <button
            onClick={openTelegram}
            className="flex items-center justify-center gap-1.5 border-t border-slate-100 bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            {tgLoading ? '연결 중…' : '💬 정확한 견적·상담은 텔레그램에서 운영자와 →'}
          </button>

          {/* 입력 */}
          <form
            onSubmit={e => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-end gap-2 border-t border-slate-200 bg-white p-2"
          >
            <textarea
              ref={taRef}
              value={input}
              rows={1}
              onChange={e => {
                setInput(e.target.value)
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder="메시지를 입력하세요… (Shift+Enter 줄바꿈)"
              className="max-h-[120px] min-h-[40px] min-w-0 flex-1 resize-none overflow-y-auto rounded-2xl border border-slate-200 px-3 py-2 text-sm leading-relaxed outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex-shrink-0 rounded-full bg-purple-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              전송
            </button>
          </form>
        </div>
      )}
    </>
  )
}

function Bubble({
  role,
  content,
  typing,
}: {
  role: 'user' | 'assistant'
  content: string
  typing?: boolean
}) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-sm bg-purple-600 text-white'
            : 'rounded-bl-sm bg-white text-slate-800 shadow-sm'
        }`}
      >
        {typing ? <span className="inline-block animate-pulse">●●●</span> : content}
      </div>
    </div>
  )
}
