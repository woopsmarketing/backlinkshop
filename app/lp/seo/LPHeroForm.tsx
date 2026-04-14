'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LPHeroForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // LP 폼 제출 마이크로 전환 발화
    if (typeof window !== 'undefined' && (window as any).trackLpSubmit) {
      ;(window as any).trackLpSubmit()
    }

    // 로딩 애니메이션을 1.5초 보여준 후 이동 (분석 준비 느낌)
    setTimeout(() => {
      const encodedUrl = encodeURIComponent(url.trim())
      router.push(url.trim() ? `/login?from=lp&site=${encodedUrl}` : '/login?from=lp')
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
        {/* 로딩 상태 */}
        {loading ? (
          <div className="py-8 text-center">
            {/* 스피너 */}
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin" />
              <div
                className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
              />
            </div>
            <p className="text-white font-semibold text-lg mb-1">진단 준비 중...</p>
            <p className="text-gray-400 text-sm">
              {url.trim() ? url.trim() : '사이트'}의 SEO 상태를 확인하고 있습니다
            </p>
            {/* 진행 바 */}
            <div className="mt-5 max-w-xs mx-auto">
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full animate-progress" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400 ml-2">SEO 진단 도구</span>
            </div>

            <label
              htmlFor="site-url"
              className="block text-left text-sm text-gray-300 mb-2 font-semibold"
            >
              진단할 사이트 URL을 입력하세요
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
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              무료 SEO 진단 시작하기
            </button>

            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                10초 가입
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                카드 없음
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                즉시 결과
              </span>
            </div>
          </>
        )}
      </div>
    </form>
  )
}
