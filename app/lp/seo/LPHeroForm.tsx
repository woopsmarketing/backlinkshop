'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toDomainSlug } from '@/lib/domain'
import { sha256Email, normalizeEmail } from '@/lib/hash'
import { trackLpSubmit, trackSetUser, LP_EMAIL_STORAGE_KEY } from '@/lib/gtag'

type Step = 'form' | 'loading' | 'redirecting' | 'error'

// defaultRef: ?ref가 없을 때 쓸 기본 ref(키워드명). 광고 URL에 ref를 깜빡해도 전환 귀속됨.
export function LPHeroForm({ defaultRef }: { defaultRef?: string } = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [url, setUrl] = useState('')
  const [keyword, setKeyword] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<Step>('form')
  const [errorMsg, setErrorMsg] = useState('')
  const [showTip, setShowTip] = useState(false)
  const [phUrl, setPhUrl] = useState('')

  // URL 입력칸 placeholder 타이핑 순환 — 시선 유도 + 입력 가이드
  useEffect(() => {
    const EX = [
      'example.com',
      '내쇼핑몰.com',
      'blog.naver.com',
      'smartstore.naver.com',
      'mybrand.co.kr',
    ]
    let word = 0
    let char = 0
    let deleting = false
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const cur = EX[word]
      if (!deleting) {
        char++
        setPhUrl(cur.slice(0, char))
        if (char >= cur.length) {
          deleting = true
          timer = setTimeout(tick, 1500)
          return
        }
        timer = setTimeout(tick, 100)
      } else {
        char--
        setPhUrl(cur.slice(0, Math.max(char, 0)))
        if (char <= 0) {
          deleting = false
          word = (word + 1) % EX.length
          timer = setTimeout(tick, 400)
          return
        }
        timer = setTimeout(tick, 50)
      }
    }
    timer = setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || !keyword.trim() || !email.trim()) return

    const cleanedEmail = normalizeEmail(email)
    const submittedDomain = toDomainSlug(url.trim())
    const ref = (searchParams?.get('ref') || defaultRef || '').trim().toLowerCase() || '(none)'

    // analyze 페이지의 텔레그램 CTA EC용으로 이메일을 세션에 보존 (탭 종료 시 자동 소멸)
    if (typeof window !== 'undefined' && cleanedEmail) {
      try {
        sessionStorage.setItem(LP_EMAIL_STORAGE_KEY, cleanedEmail)
      } catch {
        /* private mode 등 storage 차단 — 무시 */
      }
    }

    // 텔레그램 세션 발급 시 광고그룹 추적용 ref 보존
    if (typeof window !== 'undefined' && ref && ref !== '(none)') {
      try {
        sessionStorage.setItem('lp_ref', ref)
      } catch {
        /* ignore */
      }
    }

    // EC: 이메일 해시 → user_data 셋업 후 lp_form_submit 발화
    try {
      const emailHash = await sha256Email(cleanedEmail)
      trackSetUser(emailHash)
    } catch {
      /* 해시 실패해도 이벤트는 발화 */
    }
    trackLpSubmit({ ref, domain: submittedDomain })

    setStep('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/lp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), keyword: keyword.trim(), email: email.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || '요청 처리 중 오류가 발생했습니다')
        setStep('error')
        return
      }

      // 응답에 redirectUrl이 있으면 그대로, 없으면 도메인에서 직접 slug 생성
      const fallbackSlug = submittedDomain
      const redirectUrl: string =
        data.redirectUrl || (fallbackSlug ? `/analyze/${encodeURIComponent(fallbackSlug)}` : '')

      if (!redirectUrl) {
        setErrorMsg('결과 페이지 주소를 만들지 못했습니다. 페이지를 새로고침해주세요.')
        setStep('error')
        return
      }

      setStep('redirecting')
      router.push(redirectUrl)
    } catch {
      setErrorMsg('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
      setStep('error')
    }
  }

  // LP의 텔레그램 버튼은 telegram_click을 발화하지 않는다.
  // 광고 전환 측정은 /analyze/[domain]의 텔레그램 CTA에서 단일 진입점으로 통일.

  const busy = step === 'loading' || step === 'redirecting'

  // 입력칸 공통 클래스 — 적정 크기(py-3 text-base)로 압축, 한 화면에 더 들어오게
  const inputCls =
    'w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-base transition focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:shadow-lg focus:shadow-orange-500/10 disabled:opacity-50'

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xl shadow-orange-500/20 ring-1 ring-orange-200/70">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-gray-500 ml-2">SEO 진단 도구</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            30초면 끝
          </span>
        </div>

        {/* 에러 메시지 */}
        {step === 'error' && errorMsg && (
          <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        {/* URL 입력 */}
        <label
          htmlFor="site-url"
          className="block text-left text-sm text-gray-700 mb-1.5 font-semibold"
        >
          진단할 사이트 URL
        </label>
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <input
            id="site-url"
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={phUrl || 'example.com'}
            required
            disabled={busy}
            className={inputCls}
          />
        </div>

        {/* 키워드 입력 */}
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="keyword" className="text-left text-sm text-gray-700 font-semibold">
            상위노출 노리는 메인 키워드 1개
          </label>
          <button
            type="button"
            onClick={() => setShowTip(t => !t)}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700"
          >
            {showTip ? '예시 접기 ▲' : '작성 팁·예시 ▼'}
          </button>
        </div>

        {/* 항상 보이는 한 줄 힌트 (광범위 키워드 방지 최소 가이드) */}
        <p className="text-xs text-gray-400 mb-2 leading-relaxed">
          구체적일수록 정확해요 — <span className="text-gray-500">예: 강남 인테리어 시공</span>
        </p>

        {/* 접히는 상세 예시 */}
        {showTip && (
          <div className="mb-3 rounded-xl bg-orange-50 border border-orange-200 p-3 text-xs leading-relaxed space-y-1.5 text-gray-700">
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                O
              </span>
              <span>
                <b className="text-gray-900">좋은 예:</b> 강남 인테리어 시공, 무직자 소액대출, 30대
                남성 다이어트, 부산 카드결제 단말기
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                X
              </span>
              <span>
                <b className="text-gray-900">피해주세요:</b> 대출, 스포츠, 축구, 카드, 정치
                <span className="text-gray-500"> (너무 광범위해서 분석 정확도가 떨어집니다)</span>
              </span>
            </div>
          </div>
        )}

        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="예: 강남 인테리어 시공"
            required
            disabled={busy}
            className={inputCls}
          />
        </div>

        {/* 이메일 입력 */}
        <label
          htmlFor="email"
          className="block text-left text-sm text-gray-700 mb-1.5 font-semibold"
        >
          리포트 받을 이메일
        </label>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={busy}
            className={inputCls}
          />
        </div>

        <div className="relative">
          {/* 펄스 글로우 — 시선을 버튼으로 (opacity+scale 함께 변해 또렷) */}
          <div
            className={`absolute -inset-1 rounded-xl bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 blur-md ${
              busy ? 'hidden' : 'animate-glow'
            }`}
            aria-hidden="true"
          />
          <button
            type="submit"
            disabled={busy}
            className="relative w-full px-8 py-3.5 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:shadow-orange-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
          >
            {busy ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {step === 'redirecting' ? '결과 페이지로 이동 중...' : '분석 요청 중...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                무료 SEO 진단 시작하기
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-2.5 leading-relaxed">
          광고·자동 결제·영업 전화 없습니다. 도움이 필요하다고 알려주신 분에게만 연락드립니다.
        </p>

        {/* 구분선 */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-400">또는</span>
          </div>
        </div>

        {/* 텔레그램 1:1 문의 */}
        <a
          href="https://oopsad.com/tg"
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-emerald-500/25 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
          1:1 전문가 상담 신청
        </a>
      </div>
    </form>
  )
}
