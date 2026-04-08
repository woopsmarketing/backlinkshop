'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Props {
  createdAt: string // ISO date string (user created_at)
  bonusDays: number // 보너스 유효 기간 (일)
}

export default function FirstChargeBonusTimer({ createdAt, bonusDays }: Props) {
  const [timeLeft, setTimeLeft] = useState('')
  const [expired, setExpired] = useState(false)
  const [urgency, setUrgency] = useState<'normal' | 'warning' | 'critical'>('normal')

  useEffect(() => {
    const deadline = new Date(createdAt)
    deadline.setDate(deadline.getDate() + bonusDays)

    const update = () => {
      const now = new Date()
      const diff = deadline.getTime() - now.getTime()

      if (diff <= 0) {
        setExpired(true)
        setTimeLeft('만료됨')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secs = Math.floor((diff % (1000 * 60)) / 1000)

      if (days <= 1) setUrgency('critical')
      else if (days <= 3) setUrgency('warning')
      else setUrgency('normal')

      if (days > 0) {
        setTimeLeft(
          `${days}일 ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        )
      } else {
        setTimeLeft(
          `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        )
      }
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [createdAt, bonusDays])

  if (expired) return null

  const bgClass =
    urgency === 'critical'
      ? 'from-red-500 to-orange-500'
      : urgency === 'warning'
        ? 'from-orange-400 to-yellow-400'
        : 'from-yellow-400 to-orange-400'

  return (
    <div className={`bg-gradient-to-r ${bgClass} rounded-2xl p-6 text-white shadow-xl`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{urgency === 'critical' ? '🔥' : '🎁'}</div>
          <div>
            <h3 className="text-lg font-bold">
              첫 충전 100% 보너스
              {urgency === 'critical' && (
                <span className="ml-2 text-sm animate-pulse">곧 만료!</span>
              )}
            </h3>
            <p className="text-white/80 text-sm">5만원 충전하면 10만 크레딧 지급 (1회 한정)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 카운트다운 */}
          <div className="text-center">
            <p className="text-xs text-white/70 mb-1">남은 시간</p>
            <p className="text-2xl font-bold tabular-nums tracking-wide">{timeLeft}</p>
          </div>

          <Link
            href="/credits"
            className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap shadow-lg hover:scale-105 transition-all ${
              urgency === 'critical' ? 'bg-white text-red-600' : 'bg-white text-orange-600'
            }`}
          >
            지금 충전하기
          </Link>
        </div>
      </div>
    </div>
  )
}
