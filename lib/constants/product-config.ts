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
