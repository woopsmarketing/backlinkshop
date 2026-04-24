/**
 * 도메인/URL 정규화 유틸
 *
 * LP 폼 입력 → DB 저장 → 결과 페이지 라우팅의 공통 규칙을 한 곳에 모은다.
 * Supabase·Next.js 의존성 없이 순수 함수만 두어 단위 테스트로 검증 가능.
 */

const DOMAIN_REGEX = /^[a-zA-Z0-9가-힣][a-zA-Z0-9가-힣.-]*\.[a-zA-Z가-힣]{2,}$/

/**
 * 사용자가 입력한 URL 문자열을 `https://` 프리픽스 형태로 정규화한다.
 *
 * - 앞뒤 공백 제거
 * - 프로토콜(`http:`, `https:`, `//`) 제거 후 `https://`로 통일
 * - 선두 슬래시 제거
 * - 빈 문자열 입력 시 빈 문자열 반환 (호출측에서 400 처리)
 */
export function normalizeUrl(raw: string): string {
  if (typeof raw !== 'string') return ''
  let cleaned = raw.trim()
  if (!cleaned) return ''
  cleaned = cleaned.replace(/^(?:https?:?\/?\/?)/i, '')
  cleaned = cleaned.replace(/^\/+/, '')
  if (!cleaned) return ''
  return 'https://' + cleaned
}

/**
 * 정규화된 URL에서 도메인(+포트)만 추출한다. 경로·쿼리·해시 제외.
 *
 * 정규화되지 않은 입력도 안전하게 처리하도록 내부에서 normalizeUrl을 재사용.
 */
export function extractDomain(input: string): string {
  const normalized = normalizeUrl(input)
  if (!normalized) return ''
  const withoutProtocol = normalized.replace(/^https:\/\//i, '')
  const withoutPath = withoutProtocol.split(/[/?#]/)[0] ?? ''
  return withoutPath.toLowerCase()
}

/**
 * 도메인 형식(`xxx.xx` 이상)을 검증한다.
 *
 * - 허용: ASCII 영숫자 + 한글 + `-`·`.`
 * - TLD는 2자 이상 문자(한글 포함)
 * - 공백 불허
 */
export function isValidDomain(domain: string): boolean {
  if (typeof domain !== 'string') return false
  if (!domain || /\s/.test(domain)) return false
  return DOMAIN_REGEX.test(domain)
}

/**
 * LP 폼 입력 → 결과 페이지 slug 로 변환하는 통합 유틸.
 *
 * `/analyze/{slug}` 라우트 파라미터에 바로 쓸 수 있는 소문자 도메인 문자열.
 * 유효하지 않은 입력은 빈 문자열 반환.
 */
export function toDomainSlug(raw: string): string {
  const domain = extractDomain(raw)
  if (!isValidDomain(domain)) return ''
  return domain
}
