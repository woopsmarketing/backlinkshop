/**
 * 상품별 GOAT PBN 캠페인 설정
 * 상품명에 따라 캠페인 기간(일)을 매핑
 */

/**
 * 상품명 → 캠페인 기간(일) 매핑
 *
 * 사용 예시:
 * const duration = PRODUCT_DURATION_MAP['PBN 백링크 50'] // 7
 */
export const PRODUCT_DURATION_MAP: Record<string, number> = {
  'PBN 백링크 50': 7,
  'PBN 백링크 100': 14,
  'PBN 백링크 200': 30,
  // 추가 상품은 여기에 추가
}

/**
 * 상품명으로 캠페인 기간 조회
 * 매핑되지 않은 상품은 기본값(30일) 반환
 *
 * @param productName 상품명
 * @returns 캠페인 기간(일)
 */
export function getProductDuration(productName: string): number {
  return PRODUCT_DURATION_MAP[productName] || 30 // 기본값: 30일
}

/**
 * PBN 상품인지 확인
 *
 * @param productName 상품명
 * @returns PBN 상품 여부
 */
export function isPBNProduct(productName: string): boolean {
  return productName.includes('PBN') && !productName.includes('플랜')
}

/**
 * 상품명에서 PBN 수량 추출
 *
 * 예시:
 * - "PBN 백링크 50" → 50
 * - "PBN 백링크 100" → 100
 * - "PBN백링크50" → 50
 * - "PBN 백링크" → 50 (기본값)
 *
 * @param productName 상품명
 * @returns PBN 수량
 */
export function extractPBNQuantity(productName: string): number {
  // 상품명에서 숫자 추출 (예: "PBN 백링크 50" → "50")
  const match = productName.match(/PBN.*?(\d+)/)

  if (match && match[1]) {
    const quantity = parseInt(match[1], 10)
    // 유효한 숫자인지 확인
    if (Number.isFinite(quantity) && quantity > 0) {
      return quantity
    }
  }

  // 매칭 실패 시 기본값 반환
  console.warn(`⚠️ 상품명에서 수량 추출 실패: "${productName}", 기본값 50 사용`)
  return 50
}
