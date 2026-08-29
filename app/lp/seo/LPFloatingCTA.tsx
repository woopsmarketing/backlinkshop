'use client'

import { useEffect, useState } from 'react'

/**
 * 중앙 하단 "맞춤 가이드받기(텔레그램)" 소형 플로팅 버튼.
 * - Hero 폼이 화면에서 사라지면 등장 (초기에 폼/콘텐츠를 가리지 않음).
 * - 우측 하단 AI 챗봇 위젯과 겹치지 않도록 중앙 정렬 + 우측 여백 확보.
 * - LP의 텔레그램 버튼은 telegram_click을 발화하지 않는다(전환 측정은 /analyze 단일 진입점).
 */
export function LPFloatingCTA() {
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
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-3">
      <a
        href="https://oopsad.com/tg"
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400/40 backdrop-blur transition-all hover:scale-[1.03] hover:bg-emerald-600"
      >
        <svg
          className="h-4 w-4 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
        </svg>
        맞춤 가이드받기
      </a>
    </div>
  )
}
