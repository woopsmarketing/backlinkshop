import type { Metadata } from "next";
import "./globals.css";
import { GoogleTag } from './components/GoogleTag';

export const metadata: Metadata = {
  title: "백링크샵 - 국내 최대 PBN으로 진짜 SEO 효과를 만듭니다",
  description: "일반 업체와 다릅니다. 근본 원인 분석부터 고품질 PBN 구축, 투명한 성과 증명까지. 국내 최대 규모 PBN 네트워크와 전문 SEO 컨설턴트가 검증된 백링크 전략으로 순위 상승을 보장합니다.",
  keywords: [
    "백링크",
    "SEO",
    "PBN",
    "검색엔진최적화",
    "백링크샵",
    "고품질 백링크",
    "티어 링크",
    "SEO 대행",
    "백링크 서비스",
    "구글 상위노출",
    "네이버 SEO",
    "백링크 전략",
    "SEO 컨설팅",
    "PBN백링크"
  ],
  openGraph: {
    title: "백링크샵 - 국내 최대 PBN으로 진짜 SEO 효과를 만듭니다",
    description: "더 이상 가짜 업체에 속지 마세요. 근본 원인 분석부터 투명한 성과 증명까지. 국내 최대 PBN 네트워크로 검증된 백링크 전략을 제공합니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "백링크샵",
  },
  twitter: {
    card: "summary_large_image",
    title: "백링크샵 - 국내 최대 PBN으로 진짜 SEO 효과를 만듭니다",
    description: "더 이상 가짜 업체에 속지 마세요. 근본 원인 분석부터 투명한 성과 증명까지.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // 실제 구글 서치 콘솔 코드로 교체 필요
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <GoogleTag />
        {children}
      </body>
    </html>
  );
}
