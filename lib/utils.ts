/**
 * 프로젝트 전역 유틸 함수
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS 클래스 병합 (shadcn/ui 표준)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜 포맷팅 (한국 시간 기준)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * 크레딧 숫자 포맷팅 (천단위 콤마)
 */
export function formatCredits(credits: number): string {
  return new Intl.NumberFormat('ko-KR').format(credits)
}

/**
 * 가격 포맷팅 (원화)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price)
}

/**
 * 에러 메시지 추출
 * 다양한 에러 타입에서 메시지 추출
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return '알 수 없는 오류가 발생했습니다'
}
