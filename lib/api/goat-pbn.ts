/**
 * GOAT PBN API 클라이언트
 * app.goatpbn.com 외부 API 연동을 위한 함수
 *
 * 주요 기능:
 * - PBN 백링크 주문 시 자동으로 GOAT PBN 캠페인 생성
 * - API 키 인증 및 에러 핸들링
 * - 타임아웃 설정 (30초)
 */

import type {
  GoatPBNCampaignRequest,
  GoatPBNCampaignResponse,
  CreateGoatCampaignParams,
} from '@/types/goat-pbn'

/**
 * GOAT PBN API 기본 설정
 */
const GOAT_PBN_API_URL = process.env.GOAT_PBN_API_URL || 'https://app.goatpbn.com'
const GOAT_PBN_API_KEY = process.env.GOAT_PBN_API_KEY
const API_TIMEOUT = 30000 // 30초

/**
 * GOAT PBN 캠페인 생성
 *
 * @param params - 캠페인 생성 파라미터 (주문 정보)
 * @returns 캠페인 생성 결과 (campaign_id 포함)
 * @throws API 호출 실패 시 에러
 */
export async function createGoatPBNCampaign(
  params: CreateGoatCampaignParams
): Promise<GoatPBNCampaignResponse> {
  // 1. API 키 검증
  if (!GOAT_PBN_API_KEY) {
    console.error('❌ GOAT PBN API 키가 설정되지 않았습니다')
    throw new Error('GOAT PBN API 키가 설정되지 않았습니다')
  }

  // 2. 키워드 배열 변환 (쉼표로 구분된 문자열 → 배열)
  const keywordsArray = params.keywords
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0)

  if (keywordsArray.length === 0) {
    throw new Error('유효한 키워드가 없습니다')
  }

  // 3. 요청 본문 구성
  const requestBody: GoatPBNCampaignRequest = {
    // 기본 정보
    campaignName: `Backlink-shop 주문 #${params.orderId}`,
    description: `Backlink-shop에서 자동 생성된 PBN 백링크 캠페인`,
    siteId: process.env.GOAT_PBN_DEFAULT_SITE_ID || '', // 환경변수에서 기본 사이트 ID 가져오기
    targetSite: params.siteUrl,
    keywords: keywordsArray,
    quantity: params.quantity,
    duration: 30, // 기본 30일

    // 콘텐츠 생성 옵션 (기본값)
    persona: 'expert',
    sectionCount: 5,
    includeImages: true,
    sectionImageCount: 2,
    includeToc: true,
    includeBacklinks: true,
    includeInternalLinks: false,

    // 언어 및 시작 설정
    contentLanguage: 'ko',
    startType: 'immediate',
    delayMinutes: 5,
  }

  console.log('📤 GOAT PBN API 호출 시작:', {
    url: `${GOAT_PBN_API_URL}/api/external/create-campaign`,
    orderId: params.orderId,
    targetSite: params.siteUrl,
    keywordsCount: keywordsArray.length,
    quantity: params.quantity,
  })

  try {
    // 4. API 호출 (타임아웃 설정)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    const response = await fetch(`${GOAT_PBN_API_URL}/api/external/create-campaign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GOAT_PBN_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // 5. 응답 처리
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ GOAT PBN API 오류:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })

      throw new Error(`GOAT PBN API 오류 (${response.status}): ${response.statusText}`)
    }

    const result: GoatPBNCampaignResponse = await response.json()

    // 6. 성공 응답 검증
    if (!result.success || !result.campaign_id) {
      console.error('❌ GOAT PBN API 응답 오류:', result)
      throw new Error(result.error || '캠페인 생성에 실패했습니다')
    }

    console.log('✅ GOAT PBN 캠페인 생성 성공:', {
      orderId: params.orderId,
      campaignId: result.campaign_id,
    })

    return result
  } catch (error: any) {
    // 7. 에러 핸들링
    if (error.name === 'AbortError') {
      console.error('❌ GOAT PBN API 타임아웃 (30초 초과)')
      throw new Error('GOAT PBN API 타임아웃 (30초 초과)')
    }

    console.error('❌ GOAT PBN API 호출 실패:', error)
    throw error
  }
}

/**
 * GOAT PBN API 연결 테스트
 *
 * @returns API 연결 가능 여부
 */
export async function testGoatPBNConnection(): Promise<boolean> {
  try {
    if (!GOAT_PBN_API_KEY) {
      console.error('❌ GOAT PBN API 키가 설정되지 않았습니다')
      return false
    }

    const response = await fetch(`${GOAT_PBN_API_URL}/api/health`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${GOAT_PBN_API_KEY}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error('❌ GOAT PBN API 연결 테스트 실패:', error)
    return false
  }
}
