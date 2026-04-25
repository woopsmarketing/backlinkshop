'use client'

import { sha256Email } from '@/lib/hash'
import { trackTelegramClick, trackSetUser, LP_EMAIL_STORAGE_KEY } from '@/lib/gtag'

type Props = {
  domain: string
  placement: string
  variant?: 'primary' | 'secondary'
  label?: string
  subLabel?: string
  className?: string
}

export function AnalyzeTelegramCTA({
  domain,
  placement,
  variant = 'primary',
  label = '텔레그램으로 1:1 전문가 상담',
  subLabel,
  className = '',
}: Props) {
  const handleClick = async () => {
    if (typeof window === 'undefined') return

    // EC: LP에서 받았던 이메일이 sessionStorage에 있으면 해싱해서 user_data 셋업
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
        /* 해시 실패해도 이벤트는 발화 */
      }
    }
    trackTelegramClick({ domain, placement })
  }

  const base =
    variant === 'primary'
      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25'
      : 'bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50'

  return (
    <a
      href="https://t.me/goat82"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-semibold transition-all ${base} ${className}`}
    >
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
      </svg>
      <span className="flex flex-col items-start text-left leading-tight">
        <span>{label}</span>
        {subLabel && <span className="text-xs font-normal opacity-80">{subLabel}</span>}
      </span>
    </a>
  )
}
