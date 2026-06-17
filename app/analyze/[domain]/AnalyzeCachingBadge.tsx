'use client'

/**
 * 분석 결과 페이지 상단 — 캐싱 안내 배지.
 *
 * 같은 URL 재진단 시 사용자가 "왜 똑같은 결과지?" 라고 헷갈리는 걸 방지한다.
 * 진단 시점이 표시되고, "최신 진단 원하시면 텔레그램으로 문의" 작은 CTA 제공.
 */

import { useState } from 'react'

type Props = {
  domain: string
  analyzedAt: string | null
}

const FALLBACK_DEEPLINK = 'https://t.me/backlinkshop_seo_bot'

export function AnalyzeCachingBadge({ domain, analyzedAt }: Props) {
  const [loading, setLoading] = useState(false)

  const diffDays = analyzedAt
    ? Math.floor((Date.now() - new Date(analyzedAt).getTime()) / (1000 * 60 * 60 * 24))
    : null

  const isCached = diffDays !== null && diffDays >= 1

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (typeof window === 'undefined' || loading) return
    setLoading(true)
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
        body: JSON.stringify({ domain, source: 'caching_badge', ref }),
      })
      const data = await res.json().catch(() => null)
      window.open(data?.deeplink || FALLBACK_DEEPLINK, '_blank', 'noopener,noreferrer')
    } catch {
      window.open(FALLBACK_DEEPLINK, '_blank', 'noopener,noreferrer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm">
      <div className="flex items-center gap-2">
        <svg
          className="h-4 w-4 flex-shrink-0 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-slate-700">
          {isCached ? (
            <>
              <strong>{diffDays}일 전 진단 결과</strong>를 보여드립니다. 같은 URL은{' '}
              <strong className="text-orange-600">14일간 동일 결과</strong>로 안내드려요.
            </>
          ) : (
            <>
              <strong>최신 진단 결과</strong>입니다. 같은 URL은 14일간 같은 결과로 캐시됩니다.
            </>
          )}
        </span>
      </div>
      {isCached && (
        <a
          href={FALLBACK_DEEPLINK}
          onClick={handleClick}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 ${
            loading ? 'opacity-70' : ''
          }`}
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
          {loading ? '연결 중...' : '최신 진단 받기'}
        </a>
      )}
    </div>
  )
}
