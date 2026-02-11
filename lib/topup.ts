// v1.1 - 보너스 구간 재설정 (2026-02-11)
/**
 * 크레딧 충전 보너스 계산 유틸
 * - 사용 예시: const { bonus, total } = calculateTopupBonus(500000)
 */

// 보너스 구간 설정 (원하는 대로 조정 가능)
export const TOPUP_BONUS_TIERS = [
  { minCredits: 2_000_000, bonusRate: 0.5, label: '200만 이상 +50%' },
  { minCredits: 1_000_000, bonusRate: 0.3, label: '100만 이상 +30%' },
  { minCredits: 500_000, bonusRate: 0.2, label: '50만 이상 +20%' },
  { minCredits: 100_000, bonusRate: 0.1, label: '10만 이상 +10%' },
] as const

/**
 * 보너스 계산
 * - 구간별 보너스 적용
 */
export function calculateTopupBonus(amount: number) {
  if (amount <= 0 || Number.isNaN(amount)) {
    return { bonus: 0, rate: 0, total: 0 }
  }

  // 구간별 보너스 적용 (가장 큰 구간부터 확인)
  for (const tier of TOPUP_BONUS_TIERS) {
    if (amount >= tier.minCredits) {
      const bonus = Math.floor(amount * tier.bonusRate)
      return { bonus, rate: tier.bonusRate, total: amount + bonus }
    }
  }

  return { bonus: 0, rate: 0, total: amount }
}
