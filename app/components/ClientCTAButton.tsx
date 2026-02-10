'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface ClientCTAButtonProps {
  variant?: 'primary' | 'secondary' | 'white'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * 클라이언트 사이드 CTA 버튼
 * 로그인 상태에 따라 버튼 텍스트와 링크 변경
 */
export function ClientCTAButton({ 
  variant = 'primary', 
  size = 'lg',
  className = '' 
}: ClientCTAButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setIsLoggedIn(!!user)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Auth check failed:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // 로딩 중에는 기본 텍스트 표시 (깜빡임 최소화)
  const buttonText = isLoading 
    ? '무료 300 크레딧 받기 →' 
    : isLoggedIn 
    ? '마이페이지' 
    : '무료 300 크레딧 받기 →'

  const href = isLoggedIn ? '/dashboard' : '/login'

  // 사이즈별 스타일
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-xl'
  }

  // 변형별 스타일
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-xl',
    secondary: 'bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20',
    white: 'bg-white text-blue-600 hover:bg-gray-100 shadow-2xl'
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center font-bold rounded-xl transition-all hover:scale-105 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {buttonText}
    </Link>
  )
}

/**
 * 헤더용 소형 버튼
 */
export function HeaderCTAButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setIsLoggedIn(!!user)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Auth check failed:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const buttonText = isLoading 
    ? '로그인' 
    : isLoggedIn 
    ? '마이페이지' 
    : '로그인'

  const href = isLoggedIn ? '/dashboard' : '/login'

  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg transition-all"
    >
      {buttonText}
    </Link>
  )
}
