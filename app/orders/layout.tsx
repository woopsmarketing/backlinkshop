/**
 * 주문 — 검색엔진 색인 대상이 아니다.
 * robots.txt 로 차단하는 대신 noindex 를 준다(차단하면 Google이 noindex 를 읽지 못한다).
 */
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: '주문',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
