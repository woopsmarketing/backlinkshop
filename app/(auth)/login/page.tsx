// v2.0 - Google OAuth 추가 + LP 플로우 개선 (2026-04-07)
/**
 * 로그인 페이지
 * Google OAuth (1클릭) + 이메일/비밀번호 로그인/회원가입
 * LP에서 온 경우 Google 로그인 강조, 로그인 후 SEO 상품 페이지로 리디렉트
 */

'use client'

import { useState, Suspense } from 'react'
import { signIn, signUp } from '@/server/actions/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromLP = searchParams.get('from') === 'lp'
  const siteUrl = searchParams.get('site') || ''

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  /**
   * Google OAuth 로그인
   */
  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')

    try {
      const supabase = createClient()

      // 콜백 URL에 from, site 파라미터 전달
      const redirectUrl = new URL('/auth/callback', window.location.origin)
      if (fromLP) {
        redirectUrl.searchParams.set('from', 'lp')
        if (siteUrl) {
          redirectUrl.searchParams.set('site', siteUrl)
        }
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl.toString(),
        },
      })

      if (error) {
        setError(error.message)
        setGoogleLoading(false)
      }
    } catch (err) {
      setError('Google 로그인 중 오류가 발생했습니다')
      setGoogleLoading(false)
    }
  }

  /**
   * 이메일 로그인/회원가입 폼 제출 처리
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const result = await signIn(email, password)
        if (!result || !result.success) {
          setError(result?.error || '로그인에 실패했습니다')
          return
        }
        // LP에서 온 경우 SEO 상품 페이지로 리디렉트 (서버에서 상품 ID 조회 필요하므로 대시보드 경유)
        if (fromLP && siteUrl) {
          router.push(`/dashboard?from=lp&site=${encodeURIComponent(siteUrl)}`)
        } else {
          router.push('/dashboard')
        }
      } else {
        const result = await signUp(email, password)
        if (result.success) {
          setMessage(result.message || '회원가입이 완료되었습니다')
        } else {
          setError(result.error || '회원가입에 실패했습니다')
        }
      }
    } catch (err) {
      setError('오류가 발생했습니다')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">백링크샵</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {fromLP
                ? '무료 SEO 진단을 받으려면 로그인하세요'
                : mode === 'login'
                  ? '로그인하여 시작하세요'
                  : '새 계정 만들기'}
            </p>
          </div>

          {/* LP에서 온 경우 안내 */}
          {fromLP && siteUrl && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                <span className="font-semibold">{decodeURIComponent(siteUrl)}</span>의 SEO 진단을
                준비 중입니다
              </p>
            </div>
          )}

          {/* 에러/성공 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
              {message}
            </div>
          )}

          {/* Google 로그인 버튼 (최우선) */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium text-gray-700 dark:text-white shadow-sm"
          >
            {googleLoading ? (
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
            {googleLoading ? '연결 중...' : 'Google로 시작하기'}
          </button>

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                또는
              </span>
            </div>
          </div>

          {/* 이메일 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">최소 6자 이상</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
            </button>
          </form>

          {/* 모드 전환 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
                setMessage('')
              }}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {mode === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
          </div>

          {/* 가입 보너스 안내 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              회원가입 시 <span className="font-bold">20만 크레딧</span> 무료 지급!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
