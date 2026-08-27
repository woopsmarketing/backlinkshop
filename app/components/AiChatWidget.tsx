'use client'

/**
 * 재사용 가능한 AI 상담 챗봇 위젯 (우측하단 플로팅) — "엔진" 컴포넌트.
 *
 * 프로젝트별 내용(브랜드·인사말·FAQ·가격·에스컬레이션·프롬프트)은 전부
 * lib/chatbot/config.ts 에 있다. 이 파일은 그 설정을 소비할 뿐, 직접 수정하지 않는다.
 *
 * - 완전 익명: 대화는 브라우저 sessionStorage(탭 단위)에만, 서버 미전송·개인정보 안 받음.
 * - 24/7 AI 1차 응대 → 정확한 견적·상담은 사람 채널(텔레그램 등)로 승격.
 * - 분석 페이지 등에서는 방문자의 진단 맥락(context)을 함께 전달해 맞춤 답변.
 */

import { useEffect, useRef, useState } from 'react'
import { chatbotConfig, type ChatContext } from '@/lib/chatbot'
import { trackChatWidgetOpen, trackChatMessageSent } from '@/lib/gtag'

export type { ChatContext }

type Msg = { role: 'user' | 'assistant'; content: string }

export function AiChatWidget({ context }: { context?: ChatContext }) {
  const cfg = chatbotConfig
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tgLoading, setTgLoading] = useState(false)
  const [faqOpen, setFaqOpen] = useState(false)
  const [priceOpen, setPriceOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  // 새로고침 시 대화 복원 (sessionStorage, 서버 미전송)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(cfg.storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setMessages(parsed as Msg[])
      }
    } catch {
      /* storage 차단 — 무시 */
    }
  }, [cfg.storageKey])

  // 대화 변경 시 저장
  useEffect(() => {
    try {
      if (messages.length > 0) sessionStorage.setItem(cfg.storageKey, JSON.stringify(messages))
    } catch {
      /* ignore */
    }
  }, [messages, cfg.storageKey])

  const resetChat = () => {
    setMessages([])
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    try {
      sessionStorage.removeItem(cfg.storageKey)
    } catch {
      /* ignore */
    }
  }

  // FAQ·가격 고정 답변: AI 호출 없이 질문+정답을 바로 대화에 추가
  const answerCanned = (item: { q: string; a: string }) => {
    if (loading) return
    setFaqOpen(false)
    setPriceOpen(false)
    setMessages(prev => [
      ...prev,
      { role: 'user', content: item.q },
      { role: 'assistant', content: item.a },
    ])
  }

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    trackChatMessageSent({ domain: context?.domain ?? undefined })
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

  const escalate = async () => {
    if (tgLoading) return
    setTgLoading(true)
    try {
      cfg.onEscalate?.(context)
    } catch {
      /* 트래킹 실패 무시 */
    }
    try {
      let url = cfg.escalationFallbackUrl
      if (cfg.escalationSessionEndpoint) {
        let ref: string | null = null
        try {
          ref = sessionStorage.getItem('lp_ref')
        } catch {
          /* ignore */
        }
        const res = await fetch(cfg.escalationSessionEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain: context?.domain ?? null,
            source: cfg.escalationSource,
            ref,
          }),
        })
        const data = await res.json().catch(() => null)
        url = data?.deeplink || cfg.escalationFallbackUrl
      }
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      window.open(cfg.escalationFallbackUrl, '_blank', 'noopener,noreferrer')
    } finally {
      setTgLoading(false)
    }
  }

  return (
    <>
      {/* 런처 버튼 — 시선을 끄는 ping 헤일로 + 알림 점 */}
      {!open && (
        <div className="fixed bottom-4 right-4 z-50">
          {/* 뒤에서 퍼지는 보라색 헤일로 */}
          <span
            className="absolute inset-0 rounded-full bg-purple-500/50 animate-ping"
            aria-hidden="true"
          />
          <button
            onClick={() => {
              setOpen(true)
              trackChatWidgetOpen({ domain: context?.domain ?? undefined })
            }}
            aria-label="상담 AI 열기"
            className="relative flex items-center gap-2 rounded-full bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-purple-600/40 transition hover:bg-purple-700 hover:scale-105"
          >
            <span className="text-lg">💬</span>
            <span className="hidden sm:inline">{cfg.launcherLabel}</span>
            <span className="sm:hidden">{cfg.launcherLabelShort}</span>
            {/* 우상단 알림 점 (자체 ping) */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-500" />
            </span>
          </button>
        </div>
      )}

      {/* 채팅 패널 */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:w-96">
          {/* 헤더 */}
          <div className="flex items-center justify-between bg-purple-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <p className="text-sm font-bold leading-tight">{cfg.brandName}</p>
                <p className="text-[11px] text-purple-100">{cfg.brandSubtitle}</p>
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
            <Bubble role="assistant" content={cfg.greeting} />
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && <Bubble role="assistant" content="…" typing />}

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cfg.faqItems.map(item => (
                  <button
                    key={item.q}
                    onClick={() => answerCanned(item)}
                    className="rounded-full border border-purple-200 bg-white px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50"
                  >
                    {item.q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 빠른 메뉴: FAQ + 가격·견적 (대화 중에도 언제든 열기) */}
          <div className="border-t border-slate-100 bg-white">
            {faqOpen && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-1 pt-2">
                {cfg.faqItems.map(item => (
                  <button
                    key={item.q}
                    onClick={() => answerCanned(item)}
                    className="rounded-full border border-purple-200 bg-white px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50"
                  >
                    {item.q}
                  </button>
                ))}
              </div>
            )}
            {priceOpen && (
              <div className="px-3 pb-1 pt-2">
                {cfg.priceHint && (
                  <p className="mb-1.5 text-[11px] text-slate-400">{cfg.priceHint}</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {cfg.priceItems.map(item => (
                    <button
                      key={item.q}
                      onClick={() => answerCanned(item)}
                      className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      {item.q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex divide-x divide-slate-100">
              <button
                onClick={() => {
                  setFaqOpen(o => !o)
                  setPriceOpen(false)
                }}
                className="flex flex-1 items-center justify-center gap-1 py-1.5 text-[11px] font-medium text-slate-500 hover:text-purple-700"
              >
                ❓ 자주 묻는 질문 {faqOpen ? '▲' : '▼'}
              </button>
              <button
                onClick={() => {
                  setPriceOpen(o => !o)
                  setFaqOpen(false)
                }}
                className="flex flex-1 items-center justify-center gap-1 py-1.5 text-[11px] font-medium text-slate-500 hover:text-emerald-700"
              >
                💰 가격·견적 {priceOpen ? '▲' : '▼'}
              </button>
            </div>
          </div>

          {/* 에스컬레이션 (사람 상담 채널로 승격) */}
          <button
            onClick={escalate}
            className="flex items-center justify-center gap-1.5 border-t border-slate-100 bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            {tgLoading ? '연결 중…' : cfg.escalationLabel}
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
