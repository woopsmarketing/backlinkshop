/**
 * GOAT PBN API 연동 타입 정의
 * app.goatpbn.com 외부 API 호출을 위한 타입
 */

/**
 * GOAT PBN 캠페인 생성 요청 파라미터
 */
export interface GoatPBNCampaignRequest {
  // 기본 정보
  campaignName: string // 캠페인 이름
  description?: string // 캠페인 설명
  siteId: string // 대표 사이트 ID
  siteIds?: string[] // 선택된 사이트 ID 배열 (선택)
  targetSite: string // 타겟 사이트 URL
  keywords: string[] // 키워드 배열
  quantity: number // 총 생성할 콘텐츠 수량
  duration?: number // 캠페인 기간 (일, 기본값: 30)

  // 콘텐츠 생성 옵션
  persona?: string // 페르소나 (기본: 'expert')
  sectionCount?: number // 섹션 개수 (기본: 5)
  includeImages?: boolean // 이미지 포함 여부 (기본: true)
  sectionImageCount?: number // 섹션당 이미지 개수 (기본: 2)
  includeToc?: boolean // 목차 포함 여부 (기본: true)
  includeBacklinks?: boolean // 백링크 포함 여부 (기본: true)
  includeInternalLinks?: boolean // 내부 링크 포함 여부 (기본: false)

  // 크레딧 및 언어
  creditsPerContent?: number // 콘텐츠당 크레딧
  contentLanguage?: string // 콘텐츠 언어 (기본: 'ko')

  // 시작 시간 설정
  startType?: 'immediate' | 'delayed' | 'scheduled' // 시작 타입 (기본: 'immediate')
  scheduledStart?: string // ISO 날짜 문자열
  delayMinutes?: number // 지연 시작 시 분 단위 (기본: 5)
}

/**
 * GOAT PBN 캠페인 생성 응답
 */
export interface GoatPBNCampaignResponse {
  success: boolean // 성공 여부
  campaign_id?: string // 생성된 캠페인 ID
  message?: string // 성공 메시지
  error?: string // 에러 메시지
}

/**
 * GOAT PBN API 호출을 위한 간소화된 파라미터
 * Backlink-shop 주문 데이터에서 추출
 */
export interface CreateGoatCampaignParams {
  orderId: string // 주문 ID (캠페인 이름에 사용)
  siteUrl: string // 타겟 사이트 URL
  keywords: string // 키워드 (쉼표로 구분된 문자열)
  quantity: number // 수량
}
