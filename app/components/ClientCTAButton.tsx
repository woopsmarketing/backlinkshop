'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        setIsLoggedIn(!!user)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  return { isLoggedIn, isLoading }
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-8 py-4 text-base',
  lg: 'px-10 py-5 text-xl',
} as const

const variantClasses = {
  primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-xl',
  secondary: 'bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20',
  white: 'bg-white text-blue-600 hover:bg-gray-100 shadow-2xl',
} as const

interface ClientCTAButtonProps {
  variant?: keyof typeof variantClasses
  size?: keyof typeof sizeClasses
  className?: string
}

export function ClientCTAButton({
  variant = 'primary',
  size = 'lg',
  className = '',
}: ClientCTAButtonProps) {
  const { isLoggedIn, isLoading } = useAuth()

  const buttonText = isLoading
    ? '무료 20만 크레딧 받기'
    : isLoggedIn
      ? '마이페이지'
      : '무료 20만 크레딧 받기'

  return (
    <Link
      href={isLoggedIn ? '/dashboard' : '/login'}
      className={cn(
        'inline-flex items-center justify-center font-bold rounded-xl transition-all hover:scale-105',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {buttonText}
    </Link>
  )
}

export function HeaderCTAButton() {
  const { isLoggedIn, isLoading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/'
    } finally {
      setIsLoggingOut(false)
    }
  }

  const linkClass =
    'px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg transition-all'

  if (isLoading || !isLoggedIn) {
    return (
      <Link href="/login" className={linkClass}>
        로그인
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className={linkClass}>
        마이페이지
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all disabled:opacity-60"
      >
        {isLoggingOut ? '로그아웃 중' : '로그아웃'}
      </button>
    </div>
  )
}
