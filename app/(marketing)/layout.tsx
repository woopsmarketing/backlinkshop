/**
 * 공개 마케팅/콘텐츠 영역 레이아웃.
 *
 * 이 그룹 안의 페이지만 신규 헤더/푸터를 쓴다.
 * 회원 영역(/dashboard, /credits, /orders, /admin)과 광고 LP(/lp/*), 분석 결과(/analyze/*)는
 * 기존 레이아웃과 동작을 그대로 유지한다.
 */
import type { ReactNode } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="bl-sr-only">
        본문 바로가기
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
