/**
 * 전역 레이아웃
 */
import type { Metadata } from 'next'
import './globals.css'
import { GoogleTag } from './components/GoogleTag'

export const metadata: Metadata = {
  title: '백링크샵 - 고품질 백링크로 구글 상위노출 | 구글SEO · PBN백링크 · 검색엔진최적화 전문',
  description:
    '구글SEO 전문 백링크샵. 직접 구축한 PBN 백링크와 10가지 이상 고품질 SEO 백링크로 2~4주 내 구글 상위노출을 실현합니다. 무료 도메인 분석으로 경쟁사 대비 SEO 전략을 수립하세요. 검색엔진최적화(SEO) 전문 업체.',
  keywords: [
    '구글SEO',
    '구글 SEO',
    '구글상위노출',
    '구글 상위노출',
    '백링크',
    '고품질백링크',
    'PBN백링크',
    'SEO백링크',
    '검색엔진최적화',
    '백링크 서비스',
    '백링크 구매',
    '고품질 백링크 구매',
    'PBN 백링크 서비스',
    'SEO 대행',
    'SEO 컨설팅',
    '도메인 분석',
    '백링크샵',
    '티어 링크',
    '네이버 SEO',
  ],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  alternates: {
    canonical: 'https://www.backlinkshop.co.kr',
  },
  openGraph: {
    title: '백링크샵 - 구글SEO · 구글 상위노출 전문 | 고품질 백링크 · 무료 도메인 분석',
    description:
      '구글SEO 전문 백링크샵. PBN 백링크와 10가지 이상 SEO 백링크로 구글 상위노출. 무료 도메인 분석으로 경쟁사 비교. 1,247개 프로젝트 검증, 패널티 0건.',
    type: 'website',
    locale: 'ko_KR',
    siteName: '백링크샵',
    url: 'https://www.backlinkshop.co.kr',
    images: [
      {
        url: 'https://www.backlinkshop.co.kr/logo.png',
        alt: '백링크샵 - 고품질 백링크 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '백링크샵 - 구글SEO · 구글 상위노출 전문 | 고품질 백링크',
    description:
      '구글SEO 전문 백링크샵. PBN 백링크와 고품질 SEO 백링크로 구글 상위노출. 무료 도메인 분석 제공. 무료 20만 크레딧.',
    images: ['https://www.backlinkshop.co.kr/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'j32wzFaswXxA6-7Fh5R-J8V2o7xQ4b-eb0-u37ywSYg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <GoogleTag />
        {children}
      </body>
    </html>
  )
}
