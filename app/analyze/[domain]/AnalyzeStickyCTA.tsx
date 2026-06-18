'use client'

import { useState } from 'react'
import { sha256Email } from '@/lib/hash'
import { trackTelegramClick, trackSetUser, LP_EMAIL_STORAGE_KEY } from '@/lib/gtag'

const FALLBACK_DEEPLINK = 'https://t.me/backlinkshop_seo_bot'

export function AnalyzeStickyCTA({ domain }: { domain: string }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (typeof window === 'undefined' || loading) return
    setLoading(true)

    try {
      let storedEmail = ''
      try {
        storedEmail = sessionStorage.getItem(LP_EMAIL_STORAGE_KEY) || ''
      } catch {
        /* storage 차단 — 무시 */
      }
      if (storedEmail) {
        try {
          const emailHash = await sha256Email(storedEmail)
          trackSetUser(emailHash)
        } catch {
          /* 해시 실패 무시 */
        }
      }
      trackTelegramClick({ domain, placement: 'sticky' })
    } catch {
      /* 트래킹 실패 무시 */
    }

    let ref: string | null = null
    try {
      ref = sessionStorage.getItem('lp_ref')
    } catch {
      /* ignore */
    }

    try {
      const res = await fetch('/api/telegram/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, source: 'sticky', ref }),
      })
      const data = await res.json().catch(() => null)
      const deeplink = data?.deeplink || FALLBACK_DEEPLINK
      window.open(deeplink, '_blank', 'noopener,noreferrer')
    } catch {
      window.open(FALLBACK_DEEPLINK, '_blank', 'noopener,noreferrer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-100 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur sm:left-1/2 sm:right-auto sm:bottom-6 sm:w-[360px] sm:-translate-x-1/2 sm:rounded-2xl sm:border sm:border-emerald-200 sm:p-4">
      <a
        href={FALLBACK_DEEPLINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-busy={loading}
        className={`flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-base font-bold text-white shadow-lg active:scale-[0.98] ${
          loading ? 'opacity-70 cursor-wait' : ''
        }`}
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
        </svg>
        {loading ? '연결 중...' : '맞춤 가이드 받기 (텔레그램)'}
      </a>
      <p className="mt-1 text-center text-[11px] text-slate-500 sm:mt-2">
        평균 응답 5~15분 · 회원가입 불필요
      </p>
    </div>
  )
}
