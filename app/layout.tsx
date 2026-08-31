/**
 * 전역 레이아웃
 *
 * 주의
 * - alternates.canonical 을 여기에 두지 않는다. 루트에 절대 canonical 을 두면 모든 하위 페이지가
 *   홈페이지를 canonical 로 상속해 색인 대상에서 빠진다. canonical 은 각 페이지에서 self-reference 로 지정한다.
 * - verification.google 은 Search Console 소유 확인용이므로 제거하면 GSC 연결이 끊긴다. 반드시 유지.
 * - favicon 은 app/icon.svg 를 자동 사용한다 (285KB logo.png 를 favicon 으로 쓰지 않는다).
 *   logo.png 는 OG 이미지로만 쓴다.
 */
import type { Metadata } from 'next'
import '@/styles/master.css'
import { GoogleTag } from './components/GoogleTag'
import { BoostChat } from './components/BoostChat'
import { SITE_NAME, SITE_URL } from '@/config/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '백링크 구매 · 고품질 백링크 | 백링크샵',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    '백링크 구매 전에 사이트 상황부터 확인합니다. 고품질 백링크와 PBN 백링크가 지금 필요한지 먼저 판단해 드립니다.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: SITE_NAME,
    images: [{ url: '/logo.png', alt: `${SITE_NAME} 로고` }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/logo.png'],
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
        <BoostChat />
      </body>
    </html>
  )
}
