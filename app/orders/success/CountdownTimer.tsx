'use client'

import { useState, useEffect } from 'react'

export default function CountdownTimer({ minutes }: { minutes: number }) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  const progress = ((minutes * 60 - secondsLeft) / (minutes * 60)) * 100

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">예상 소요 시간</span>
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        분석이 완료되면 이메일로 보고서를 발송합니다
      </p>
    </div>
  )
}
