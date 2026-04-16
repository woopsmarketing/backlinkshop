'use client'

import { useState, useEffect } from 'react'

const ACTIVITIES = [
  { city: '서울', time: '방금 전' },
  { city: '부산', time: '1분 전' },
  { city: '인천', time: '2분 전' },
  { city: '대구', time: '3분 전' },
  { city: '광주', time: '방금 전' },
  { city: '대전', time: '1분 전' },
  { city: '수원', time: '2분 전' },
  { city: '성남', time: '방금 전' },
  { city: '용인', time: '3분 전' },
  { city: '고양', time: '1분 전' },
]

export function LPActivityToast() {
  const [current, setCurrent] = useState<(typeof ACTIVITIES)[0] | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const showNext = () => {
      const item = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)]
      setCurrent(item)
      setShow(true)

      // Hide after 4 seconds
      setTimeout(() => setShow(false), 4000)

      // Schedule next one in 15-25 seconds
      timeout = setTimeout(showNext, 15000 + Math.random() * 10000)
    }

    // First one after 8 seconds
    timeout = setTimeout(showNext, 8000)

    return () => clearTimeout(timeout)
  }, [])

  if (!current) return null

  return (
    <div
      className={`fixed bottom-20 left-4 z-40 transition-all duration-500 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3 max-w-xs">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-900 font-medium">
            {current.city}에서 진단 신청이 접수되었습니다
          </p>
          <p className="text-xs text-gray-400">{current.time}</p>
        </div>
      </div>
    </div>
  )
}
