'use client'

import { useState, useEffect } from 'react'

const KEYWORDS = [
  '스포츠중계',
  '베팅사이트',
  '여성알바',
  '강남출장',
  '인테리어 소품',
  '강남 피부과',
  '프로젝트 관리 툴',
  '영어 학원',
  '다이어트 보조제',
  '부동산 투자',
  '반려동물 용품',
  '웨딩 촬영',
  '이사 업체',
  '변호사 상담',
  '치과 임플란트',
  '헬스장 PT',
  '카페 창업',
  '중고차 매매',
  '네일 아트',
  '필라테스',
]

const TIMES = ['방금 전', '1분 전', '2분 전', '3분 전']

export function LPActivityToast() {
  const [current, setCurrent] = useState<{ keyword: string; time: string } | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const showNext = () => {
      const keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)]
      const time = TIMES[Math.floor(Math.random() * TIMES.length)]
      setCurrent({ keyword, time })
      setShow(true)

      // Hide after 4 seconds
      setTimeout(() => setShow(false), 4000)

      // Schedule next one in 15-25 seconds
      timeout = setTimeout(showNext, 15000 + Math.random() * 10000)
    }

    // First one after 3 seconds
    timeout = setTimeout(showNext, 3000)

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
            &ldquo;<strong>{current.keyword}</strong>&rdquo; 키워드로 진단 신청됨
          </p>
          <p className="text-xs text-gray-400">{current.time}</p>
        </div>
      </div>
    </div>
  )
}
