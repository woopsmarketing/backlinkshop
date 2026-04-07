// v1.1 - Google Tag Manager + Ads Conversion (2026-04-07)
/**
 * Google Analytics 및 Google Ads 전환 추적
 * - GA4 + Google Ads 전환 태그 동시 지원
 * - 환경 변수로 ID 관리
 */
'use client'

import Script from 'next/script'

export function GoogleTag() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID
  const ADS_CONVERSION_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

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
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
          ${ADS_CONVERSION_ID ? `gtag('config', '${ADS_CONVERSION_ID}');` : ''}

          // 회원가입 전환 추적 (GA4 + Google Ads)
          window.trackSignup = function() {
            gtag('event', 'sign_up', {
              'method': 'email'
            });
            ${
              ADS_CONVERSION_ID
                ? `gtag('event', 'conversion', {
              'send_to': '${ADS_CONVERSION_ID}/signup',
              'value': 1.0,
              'currency': 'KRW'
            });`
                : ''
            }
          };

          // 구매 전환 추적 (GA4 + Google Ads)
          window.trackPurchase = function(amount) {
            gtag('event', 'purchase', {
              'value': amount,
              'currency': 'KRW'
            });
            ${
              ADS_CONVERSION_ID
                ? `gtag('event', 'conversion', {
              'send_to': '${ADS_CONVERSION_ID}/purchase',
              'value': amount,
              'currency': 'KRW'
            });`
                : ''
            }
          };
        `}
      </Script>
    </>
  )
}
