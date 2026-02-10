// v1.0 - Google Tag Manager (2026-02-10)
/**
 * Google Analytics 및 Google Ads 전환 추적
 * - 환경 변수로 GA Tracking ID 관리
 * - 클라이언트 컴포넌트로 브라우저에서만 실행
 * - next/script로 최적화된 로딩
 */
'use client'

import Script from 'next/script'

export function GoogleTag() {
  // 환경 변수에서 GA Tracking ID 가져오기
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID
  
  // Tracking ID가 없으면 아무것도 렌더링하지 않음 (개발 환경)
  if (!GA_TRACKING_ID) {
    return null
  }
  
  return (
    <>
      {/* Google Tag Manager 스크립트 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      
      {/* Google Analytics 초기화 */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
          
          // Google Ads 전환 추적 (회원가입)
          window.trackSignup = function() {
            gtag('event', 'conversion', {
              'send_to': '${GA_TRACKING_ID}/signup',
              'value': 300,
              'currency': 'KRW'
            });
          };
          
          // Google Ads 전환 추적 (구매)
          window.trackPurchase = function(amount) {
            gtag('event', 'conversion', {
              'send_to': '${GA_TRACKING_ID}/purchase',
              'value': amount,
              'currency': 'KRW'
            });
          };
        `}
      </Script>
    </>
  )
}
