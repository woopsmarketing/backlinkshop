'use client'

import { useState } from 'react'

export function LPHeroForm() {
  const [url, setUrl] = useState('')
  const [keyword, setKeyword] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'form' | 'loading' | 'success' | 'error'>('form')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || !keyword.trim() || !email.trim()) return

    // LP 폼 제출 전환 발화
    if (typeof window !== 'undefined' && (window as any).trackLpSubmit) {
      ;(window as any).trackLpSubmit()
    }

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

      // purchase 전환 발화 (무료 주문 완료)
      if (typeof window !== 'undefined' && (window as any).trackFreeOrder) {
        ;(window as any).trackFreeOrder()
      }

      setStep('success')
    } catch {
      setErrorMsg('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
      setStep('error')
    }
  }

  const handleTelegramClick = () => {
    if (typeof window !== 'undefined' && (window as any).trackTelegramClick) {
      ;(window as any).trackTelegramClick()
    }
  }

  // 성공 화면
  if (step === 'success') {
    return (
      <div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">진단 요청이 접수되었습니다!</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            분석이 바로 시작되며, 약 <strong className="text-orange-400">10분 후</strong>에
            <br />
            <strong className="text-white">{email}</strong> 으로 결과를 보내드립니다.
          </p>
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-400/20 text-sm text-gray-300">
            <p>
              <strong className="text-white">진단 사이트:</strong> {url}
            </p>
            <p className="mt-1">
              <strong className="text-white">핵심 키워드:</strong> {keyword}
            </p>
          </div>

          {/* 텔레그램 상담 */}
          <p className="text-gray-400 text-xs mt-6 mb-3">
            구글 상위노출에 필요한 모든 서비스를 제공합니다
          </p>
          <a
            href="https://t.me/goat82"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTelegramClick}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-[#2AABEE]/20 hover:bg-[#2AABEE]/30 border border-[#2AABEE]/40 rounded-xl font-semibold text-white transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
            1:1 전문가 상담 신청
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
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
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {errorMsg}
            </div>
          )}

          {/* URL 입력 */}
          <label
            htmlFor="site-url"
            className="block text-left text-sm text-gray-700 mb-2 font-semibold"
          >
            진단할 사이트 URL
          </label>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
              placeholder="example.com"
              required
              disabled={step === 'loading'}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-lg disabled:opacity-50"
            />
          </div>

          {/* 키워드 입력 */}
          <label
            htmlFor="keyword"
            className="block text-left text-sm text-gray-700 mb-2 font-semibold"
          >
            핵심 키워드 1개
          </label>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
              placeholder="예: 인테리어 소품"
              required
              disabled={step === 'loading'}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-lg disabled:opacity-50"
            />
          </div>

          {/* 이메일 입력 */}
          <label
            htmlFor="email"
            className="block text-left text-sm text-gray-700 mb-2 font-semibold"
          >
            리포트 받을 이메일
          </label>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
              disabled={step === 'loading'}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-lg disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={step === 'loading'}
            className="w-full px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:shadow-orange-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
          >
            {step === 'loading' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                분석 요청 중...
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

          <p className="text-center text-xs text-gray-500 mt-3">
            신청 후 바로 분석이 진행되며, 약 10분 후에 이메일로 결과를 보내드립니다
          </p>

          {/* 구분선 */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-400">또는</span>
            </div>
          </div>

          {/* 텔레그램 1:1 문의 */}
          <p className="text-center text-xs text-gray-500 mb-3">
            구글 상위노출에 필요한 모든 서비스를 제공합니다
          </p>
          <a
            href="https://t.me/goat82"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTelegramClick}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
            1:1 전문가 상담 신청
          </a>
        </div>
      </form>
    </div>
  )
}
