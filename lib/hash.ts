/**
 * Enhanced Conversions(향상된 전환)용 해시 유틸.
 *
 * Google Ads EC 표준은 SHA-256(소문자·trim 정규화 이메일)만 받는다.
 * 평문은 절대 외부로 나가지 않고, 해시 16진수만 gtag('set','user_data',...)에 전달.
 *
 * Web Crypto API(globalThis.crypto.subtle) 기반이라 브라우저와 Node 20+ 모두 동작.
 */

export function normalizeEmail(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input.trim().toLowerCase()
}

export async function sha256(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const arr = new Uint8Array(digest)
  let hex = ''
  for (let i = 0; i < arr.length; i++) {
    hex += arr[i].toString(16).padStart(2, '0')
  }
  return hex
}

export async function sha256Email(email: unknown): Promise<string> {
  const normalized = normalizeEmail(email)
  if (!normalized) return ''
  return sha256(normalized)
}
