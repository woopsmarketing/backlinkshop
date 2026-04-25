/**
 * GA4 이벤트 발화 헬퍼.
 *
 * 설계 원칙
 * - GoogleTag.tsx는 gtag 로딩만 담당 (window.gtag 노출).
 * - 이 모듈에서 타입 안전한 헬퍼로 이벤트를 쏜다.
 * - value 필드는 박지 않는다 (Google Ads 전환 액션 화면에서 default value 설정).
 *   이유: 현재 입찰 전략(Max Clicks → tCPA)은 value를 학습 신호로 사용하지 않음.
 * - Google Ads 전환은 GA4의 '주요 이벤트'를 import해서 생성 (코드에서 AW-/label 직접 호출 X → 이중 카운트 방지).
 *
 * Enhanced Conversions
 * - 이벤트 발화 직전 trackSetUser(emailHash)로 user_data를 셋업.
 * - emailHash가 비어있으면 set 호출을 스킵 (Google Ads가 비어있는 user_data를 매칭 시도하지 않도록).
 */

/**
 * LP 폼 제출 시 이메일을 sessionStorage에 보관하는 키.
 * /analyze/[domain]의 텔레그램 CTA에서 EC 해싱용으로 꺼내 쓴다.
 */
export const LP_EMAIL_STORAGE_KEY = 'bls_lp_email'

type GtagFn = (...args: unknown[]) => void

type WindowWithGtag = Window & {
  gtag?: GtagFn
  dataLayer?: unknown[]
}

function getGtag(): GtagFn | null {
  if (typeof window === 'undefined') return null
  const w = window as WindowWithGtag
  return typeof w.gtag === 'function' ? w.gtag : null
}

/**
 * Enhanced Conversions: 다음 이벤트 발화 직전 호출.
 * emailHash는 SHA-256 16진수(64자). 빈 값이면 호출 스킵.
 */
export function trackSetUser(emailHash: string): void {
  const gtag = getGtag()
  if (!gtag) return
  if (!emailHash || emailHash.length !== 64) return
  gtag('set', 'user_data', { sha256_email_address: emailHash })
}

/** LP 폼 제출 (보조 전환). ref·domain은 광고그룹별 분석용. */
export function trackLpSubmit(params: { ref?: string; domain?: string }): void {
  const gtag = getGtag()
  if (!gtag) return
  gtag('event', 'lp_form_submit', {
    ref: params.ref || '(none)',
    domain: params.domain || '',
  })
}

/** 텔레그램 1:1 상담 클릭 (주 전환). placement는 발화 위치 분석용. */
export function trackTelegramClick(params: { domain?: string; placement: string }): void {
  const gtag = getGtag()
  if (!gtag) return
  gtag('event', 'telegram_click', {
    domain: params.domain || '',
    placement: params.placement,
  })
}

/** /analyze/[domain] 진입 1회 발화. 관찰 전용 — '전환으로 표시' OFF. */
export function trackAnalyzePageView(params: { domain: string }): void {
  const gtag = getGtag()
  if (!gtag) return
  gtag('event', 'analyze_page_view', { domain: params.domain })
}
