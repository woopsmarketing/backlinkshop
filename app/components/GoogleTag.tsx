// v3.0 - GA4 전용 구조 (GA4 → Google Ads 자동 import, 2026-04-15)
// 설계 원칙:
// - gtag 이벤트는 GA4 에만 쏜다 (AW-xxx/label 직접 발화 없음 → 이중 카운트 방지)
// - Google Ads 전환은 GA4 의 "주요 이벤트" 를 import 해서 생성 (UI 설정)
// - ?welcome=1 플래그는 신규 OAuth 가입 직후 trackSignup 을 1회만 발화
'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export function GoogleTag() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

  // welcome=1 플래그가 붙은 첫 진입에서 sign_up 이벤트 1회 발화
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('welcome') !== '1') return
    const key = 'bls_signup_fired'
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    const tryFire = (attempt = 0) => {
      const fn = (window as any).trackSignup
      if (typeof fn === 'function') {
        fn()
      } else if (attempt < 20) {
        setTimeout(() => tryFire(attempt + 1), 200)
      }
    }
    tryFire()
  }, [])

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

          // LP URL 폼 제출 (GA4 이벤트: lp_form_submit)
          // - GA4 에서 주요 이벤트로 표시 후 Google Ads 로 import 하면 "lp_submit" 전환으로 동작
          window.trackLpSubmit = function() {
            gtag('event', 'lp_form_submit', {
              'value': 1000,
              'currency': 'KRW'
            });
          };

          // 회원가입 완료 (GA4 이벤트: sign_up)
          // - 신규 OAuth 가입자만 ?welcome=1 플래그로 1회 발화
          // - GA4 에서 이미 주요 이벤트로 import 되어 "백링크샵 (web) sign_up" 전환으로 동작 중
          window.trackSignup = function() {
            gtag('event', 'sign_up', {
              'method': 'google',
              'value': 10000,
              'currency': 'KRW'
            });
          };

          // 무료 상품 주문 완료 (GA4 이벤트: free_order_complete)
          // - 보조 관찰용, 주 전환으로 승격하지 않음
          window.trackFreeOrder = function() {
            gtag('event', 'free_order_complete', {
              'value': 0,
              'currency': 'KRW'
            });
          };

          // 텔레그램 1:1 상담 클릭 (GA4 이벤트: telegram_click)
          window.trackTelegramClick = function() {
            gtag('event', 'telegram_click', {
              'value': 500,
              'currency': 'KRW'
            });
          };

          // 유료 결제 완료 (GA4 이벤트: purchase)
          // - GA4 에서 이미 주요 이벤트로 등록되어 Google Ads 로 자동 import 중
          window.trackPurchase = function(amount) {
            gtag('event', 'purchase', {
              'value': amount,
              'currency': 'KRW'
            });
          };
        `}
      </Script>
    </>
  )
}
