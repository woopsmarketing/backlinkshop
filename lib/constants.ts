/**
 * 프로젝트 전역 상수
 * 크레딧 가격, 패키지 정보, 상태 값 등
 */

// 크레딧 가격 (원화 기준, 실제 결제 시 사용)
export const CREDIT_PRICES = {
  STARTER: { amount: 300, price: 10000 }, // 300 크레딧 = 10,000원
  PRO: { amount: 1000, price: 30000 }, // 1000 크레딧 = 30,000원
  ENTERPRISE: { amount: 5000, price: 140000 }, // 5000 크레딧 = 140,000원
} as const

// 충전 패키지 ID
export const TOPUP_PACKAGES = {
  STARTER_300: 'starter_300',
  PRO_1000: 'pro_1000',
  ENTERPRISE_5000: 'enterprise_5000',
} as const

// 주문 상태
export const ORDER_STATUS = {
  PENDING: 'pending', // 대기중
  PROCESSING: 'processing', // 처리중
  COMPLETED: 'completed', // 완료
  FAILED: 'failed', // 실패
} as const

// 충전 요청 상태
export const TOPUP_STATUS = {
  REQUESTED: 'requested', // 요청됨
  APPROVED: 'approved', // 승인됨
  REJECTED: 'rejected', // 거부됨
} as const

// 상품 상태
export const PRODUCT_STATUS = {
  ACTIVE: 'active', // 활성
  INACTIVE: 'inactive', // 비활성
} as const

// 상품 카테고리
export const PRODUCT_CATEGORY = {
  BACKLINK: 'backlink', // 백링크
  SEO: 'seo', // SEO
  CONTENT: 'content', // 콘텐츠
} as const

// 크레딧 원장 사유
export const CREDIT_REASON = {
  SIGNUP_BONUS: 'signup_bonus', // 가입 보너스
  COUPON: 'coupon', // 쿠폰 사용
  MANUAL_TOPUP: 'manual_topup', // 수동 충전
  PRODUCT_PURCHASE: 'product_purchase', // 상품 구매
  REFUND: 'refund', // 환불
} as const

// 기본 가입 보너스 (선택 사항)
export const SIGNUP_BONUS_AMOUNT = 300_000 // 30만 크레딧
