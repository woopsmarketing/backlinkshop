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

// FAQ: 클릭 시 AI 호출 없이 "고정 답변"을 즉시 노출(빠르고·정확하고·문구 통제 가능).
// 답변 문구는 챗봇 지식(lib/chat-knowledge.ts)과 톤을 맞춘다 — 개수 단정 금지,
// 백링크는 월 예산 정기 구축, 기간은 편차 강조.
const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: '백링크가 꼭 필요한가요?',
    a: '네, 백링크는 구글 상위 노출의 가장 핵심 요소이자 SEO의 기본 체력이에요. 한 번 하고 끝나는 게 아니라 꾸준히 주기적으로 쌓을수록 순위가 안정적으로 올라가고 경쟁사에 밀리지 않습니다. 물론 안전한 화이트햇 방식으로만 진행해요.',
  },
  {
    q: '비용이 얼마나 드나요?',
    a: '서비스마다 달라요. 간단히는 — 플랜 백링크는 월 예산 맞춤(월 100만원 기준 5,000건 이상), PBN 백링크는 50개 30만원부터예요. 아래 "💰 가격·견적" 버튼에서 항목별로 자세히 볼 수 있고, 정확한 견적은 텔레그램에서 안내드려요.',
  },
  {
    q: '구글 1페이지까지 얼마나 걸려요?',
    a: '키워드와 사이트 상태에 따라 편차가 커요. 어떤 사이트는 1주~1달 만에 오르기도 하고, 경쟁이 센 키워드는 4~6개월 이상 걸리기도 합니다. 정해진 기간보다 꾸준한 링크 구축이 핵심이에요.',
  },
  {
    q: '진단은 정말 무료인가요?',
    a: '네, SEO 진단은 완전 무료예요. 카드 등록이나 자동 결제 같은 건 전혀 없고, 보고서만 받아보고 직접 적용하셔도 됩니다.',
  },
  {
    q: '구글에서 제재받을 위험은 없나요?',
    a: '안전한 화이트햇 방식으로만 진행해서, 구글 정책 위반 위험이 있는 블랙햇 기법은 사용하지 않아요. 그래서 순위가 안정적으로 유지됩니다.',
  },
]

// 가격·견적: 서비스 항목별 고정 답변. 클릭 시 해당 가격표/설명을 즉시 노출.
const PRICE_ITEMS: { q: string; a: string }[] = [
  {
    q: '플랜 백링크',
    a: '플랜 백링크는 유튜브·네이버블로그·레딧·각종 SNS 등 외부 플랫폼에 회원가입·게스트로 콘텐츠를 작성하고 백링크를 거는 방식이에요.\n\n고객님의 월 예산에 맞춰 꾸준히 구축합니다.\n• 기준: 월 100만원 → 백링크 5,000건 이상 구축\n• 예산에 맞춰 자유롭게 커스터마이징\n\n정확한 구성은 텔레그램에서 안내드려요.',
  },
  {
    q: 'PBN 백링크',
    a: 'PBN 백링크는 백링크샵이 직접 보유·운영하는 고품질 프리미엄 도메인 사이트에 백링크를 거는 방식이에요. (외부 플랫폼이 아닌 "우리 자산"에 구축 — 이게 플랜 백링크와의 차이)\n\n■ 고품질 PBN\n· 50개 30만 / 100개 57만 / 200개 95만 / 500개 220만 원\n\n■ 로직 업그레이드 PBN (최상위 퀄리티)\n· 50개 80만 / 100개 150만 / 200개 250만 / 500개 450만 원\n\n서비스 특성상 유지 기간이 추가될 수 있어요. 자세한 건 텔레그램에서!',
  },
  {
    q: '프리미엄 도메인',
    a: '백링크샵이 보유한 고품질 프리미엄 도메인을 활용하는 옵션이에요. 도메인 등급·이력에 따라 가격이 달라져서, 현재 보유 현황과 정확한 견적은 텔레그램에서 바로 안내드려요.',
  },
  {
    q: 'PBN 제작',
    a: '고객님 전용 PBN(자체 운영 사이트망)을 새로 제작하는 서비스예요. 도메인·호스팅·유니크 콘텐츠가 포함되며, 제작 규모에 따라 견적이 달라집니다. 구성과 비용은 텔레그램에서 안내드려요.',
  },
  {
    q: '사이트가 여러 개라면?',
    a: '운영 사이트가 여러 개라면 백링크를 병렬로 구축해 효율을 크게 높이는 방식을 제안드려요. 사이트 수·목표에 맞춰 패키지를 구성하니, 텔레그램에서 상담받아 보시는 걸 추천드려요.',
  },
]

export function AiChatWidget({ context }: { context?: ChatContext }) {
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

  // FAQ·가격 고정 답변: AI 호출 없이 질문+정답을 바로 대화에 추가
  const answerFaq = (item: { q: string; a: string }) => {
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
                {FAQ_ITEMS.map(item => (
                  <button
                    key={item.q}
                    onClick={() => answerFaq(item)}
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
                {FAQ_ITEMS.map(item => (
                  <button
                    key={item.q}
                    onClick={() => answerFaq(item)}
                    className="rounded-full border border-purple-200 bg-white px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50"
                  >
                    {item.q}
                  </button>
                ))}
              </div>
            )}
            {priceOpen && (
              <div className="px-3 pb-1 pt-2">
                <p className="mb-1.5 text-[11px] text-slate-400">어떤 서비스 가격이 궁금하세요?</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRICE_ITEMS.map(item => (
                    <button
                      key={item.q}
                      onClick={() => answerFaq(item)}
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
