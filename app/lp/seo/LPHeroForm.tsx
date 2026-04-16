'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function LPHeroForm() {
  const [url, setUrl] = useState('')
  const [keyword, setKeyword] = useState('')
  const [step, setStep] = useState<'form' | 'login'>('form')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || !keyword.trim()) return

    // LP 폼 제출 전환 발화
    if (typeof window !== 'undefined' && (window as any).trackLpSubmit) {
      ;(window as any).trackLpSubmit()
    }

    setStep('login')
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const redirectUrl = new URL('/auth/callback', window.location.origin)
      redirectUrl.searchParams.set('from', 'lp')
      redirectUrl.searchParams.set('site', url.trim())
      redirectUrl.searchParams.set('keyword', keyword.trim())

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUrl.toString() },
      })
    } catch {
      setLoading(false)
    }
  }

  const handleTelegramClick = () => {
    if (typeof window !== 'undefined' && (window as any).trackTelegramClick) {
      ;(window as any).trackTelegramClick()
    }
  }

  if (step === 'login') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
          {/* 입력 확인 */}
          <div className="mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
            <p className="text-sm text-gray-300 mb-1">진단 대상</p>
            <p className="text-white font-semibold truncate">{url}</p>
            <p className="text-sm text-gray-300 mt-2 mb-1">핵심 키워드</p>
            <p className="text-cyan-400 font-semibold">{keyword}</p>
          </div>

          <p className="text-center text-gray-300 text-sm mb-4">
            리포트를 이메일로 받으려면 로그인이 필요합니다
          </p>

          {/* Google 로그인 버튼 */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-gray-100 rounded-xl font-bold text-gray-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {loading ? '연결 중...' : 'Google로 무료 진단 시작'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">
            가입 즉시 20만 크레딧 지급 · 카드 등록 불필요
          </p>

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-transparent text-gray-500">또는</span>
            </div>
          </div>

          {/* 텔레그램 1:1 문의 */}
          <a
            href="https://t.me/goat82"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTelegramClick}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-[#2AABEE]/20 hover:bg-[#2AABEE]/30 border border-[#2AABEE]/40 rounded-xl font-semibold text-white transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
            1:1 전문가 상담 신청
          </a>

          {/* 뒤로가기 */}
          <button
            onClick={() => setStep('form')}
            className="w-full mt-4 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← URL / 키워드 수정하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400 ml-2">SEO 진단 도구</span>
          </div>

          {/* URL 입력 */}
          <label
            htmlFor="site-url"
            className="block text-left text-sm text-gray-300 mb-2 font-semibold"
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
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-lg"
            />
          </div>

          {/* 키워드 입력 */}
          <label
            htmlFor="keyword"
            className="block text-left text-sm text-gray-300 mb-2 font-semibold"
          >
            핵심 키워드 1개
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
        </div>
      </form>
    </div>
  )
}
