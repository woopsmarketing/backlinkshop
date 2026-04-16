'use client'

import { useState, useEffect } from 'react'

export function LPStickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const form = document.getElementById('hero-form')
    if (!form) return

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(form)
    return () => observer.disconnect()
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-gray-900">무료 SEO 진단</p>
          <p className="text-xs text-gray-500">이메일만 입력하면 10분 안에 리포트 발송</p>
        </div>
        <a
          href="#hero-form"
          className="flex-shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          무료 진단 시작하기
        </a>
      </div>
    </div>
  )
}
