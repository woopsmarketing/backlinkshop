// v3.0 - LP 통합 페이지 (?ref= 하위호환). 개별 키워드 페이지는 /lp/[keyword].
import type { Metadata } from 'next'
import { LandingBody } from './LandingBody'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '무료 SEO 진단 | 백링크샵 - 구글 상위노출 전문',
  description:
    '구글 검색 순위가 낮은 진짜 이유, 10분 안에 무료로 확인하세요. 이메일만 입력하면 경쟁사 비교 분석까지 포함된 정밀 리포트를 보내드립니다.',
  robots: { index: false, follow: false },
}

// variantKey 미지정 → LPHeroCopy가 ?ref= 쿼리로 카피를 결정(기존 동작 유지).
// 통합 페이지는 라이트 고정.
export default function LPSeoPage() {
  return <LandingBody themeOverride="light" />
}
