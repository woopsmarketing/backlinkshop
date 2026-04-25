// v3.1 - GA4 로더만 담당 (이벤트 발화는 lib/gtag.ts 헬퍼로 위임, 2026-04-26)
// 설계 원칙:
// - GoogleTag.tsx는 gtag.js 스크립트 로딩과 window.gtag 노출만 담당
// - 이벤트 발화·EC user_data 설정은 lib/gtag.ts 의 타입 안전한 헬퍼로 처리
// - GA4 → Google Ads 자동 import (코드에서 AW-/label 직접 호출 없음)
'use client'

import Script from 'next/script'

export function GoogleTag() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
    </>
  )
}
