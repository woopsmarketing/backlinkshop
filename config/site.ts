/**
 * 사이트 전역 Source of Truth
 *
 * 원칙
 * - Telegram URL, 연락처, 사업자 정보를 컴포넌트에 하드코딩하지 않는다.
 * - 확인되지 않은 사업 정보는 만들어내지 않고 TODO로 격리한다.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.backlinkshop.co.kr'

export const SITE_NAME = '백링크샵'
export const SITE_NAME_EN = 'BacklinkShop'

/**
 * 1:1 상담 텔레그램.
 * 출처: 기존 리포지토리 전역에서 사용 중인 상담 링크 (app/page.tsx, app/pricing, app/services,
 * app/faq, app/cases, app/dashboard, app/lp/seo/LPFloatingCTA).
 * 주의: /analyze 플로우의 봇 딥링크(t.me/backlinkshop_seo_bot)와 다른 채널이므로 혼용하지 않는다.
 * 2026-08-29: t.me 직링크에서 자사 리다이렉트 도메인(oopsad.com/tg)으로 교체했다.
 * 이 URL을 렌더링하는 모든 <a>에는 rel="nofollow noopener noreferrer" 를 적용한다.
 */
export const TELEGRAM_URL = 'https://oopsad.com/tg'

/** /analyze 결과 페이지에서 쓰는 봇 딥링크 (기존 동작 보존용, 마케팅 CTA에는 사용하지 않음) */
export const TELEGRAM_BOT_URL = 'https://t.me/backlinkshop_seo_bot'

/** 고객지원 이메일. 출처: 기존 Organization 스키마 및 홈 푸터. */
export const SUPPORT_EMAIL = 'support@backlink-shop.com'

/** 무료 도메인 분석 (자사 운영 외부 도구) */
export const DOMAIN_CHECKER_URL = 'https://domainchecker.co.kr'

/**
 * 사업자 정보.
 *
 * ⚠️ TODO(운영자 입력 필요): 리포지토리 어디에도 사업자등록번호·통신판매업 신고번호·대표자명·
 * 주소가 존재하지 않는다(전수 검색 0건). 전자상거래법 표시의무 대상이므로 실제 값을 채워야 한다.
 * 값이 채워지면 Footer 사업자정보 블록과 Organization 구조화 데이터에 자동 반영된다.
 * 확인 전까지는 임의 값을 만들지 않고 비워 둔다 (빈 값이면 화면에 렌더링되지 않음).
 */
export const BUSINESS_INFO = {
  /** 상호 (법인/개인사업자 등록명) */
  companyName: '',
  /** 대표자명 */
  representative: '',
  /** 사업자등록번호 */
  registrationNumber: '',
  /** 통신판매업 신고번호 */
  mailOrderNumber: '',
  /** 사업장 주소 */
  address: '',
  /** 고객센터 전화 */
  phone: '',
  /** 개인정보보호책임자 */
  privacyOfficer: '',
} as const

export function hasBusinessInfo(): boolean {
  return Object.values(BUSINESS_INFO).some(value => value.trim().length > 0)
}

/**
 * 정책 문서 최종 개정일.
 * ⚠️ TODO(운영자 확인 필요): 실제 정책 시행일로 교체할 것.
 * 현재 값은 정책 문서를 신규 작성한 날짜다.
 */
export const POLICY_UPDATED_AT = '2026-08-27'

/** 절대 URL 생성 (canonical, OG, 구조화 데이터 공용) */
export function absoluteUrl(path: string): string {
  if (!path || path === '/') return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
