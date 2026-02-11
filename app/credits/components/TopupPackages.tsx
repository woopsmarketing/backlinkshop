// v2.0 - 직접 입력 충전 + 보너스 로직 적용 (2026-02-11)
/**
 * 크레딧 충전 컴포넌트
 * - 사용 예시: <TopupPackages />
 */

'use client'

import { useMemo, useState } from 'react'
import { createTopupRequestAction } from '@/server/actions/credits'
import { calculateTopupBonus, TOPUP_BONUS_TIERS } from '@/lib/topup'
import { formatCredits, formatPrice } from '@/lib/utils'

export default function TopupPackages() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [amount, setAmount] = useState(100000)

  // 보너스 계산 (1크레딧=1원 기준)
  const bonusInfo = useMemo(() => calculateTopupBonus(amount), [amount])

  const handleRequest = async () => {
    setLoading(true)
    setMessage(null)

    try {
      if (!amount || amount < 1000) {
        setMessage({ type: 'error', text: '최소 1,000 크레딧부터 충전 가능합니다' })
        return
      }

      // 요청 메모에 보너스 정보 포함
      const note = `충전 ${formatCredits(amount)} 크레딧, 보너스 ${formatCredits(
        bonusInfo.bonus
      )} 크레딧 (${Math.round(bonusInfo.rate * 100)}%)`

      const result = await createTopupRequestAction('custom', amount, note)

      if (result.success) {
        setMessage({
          type: 'success',
          text: result.message || '충전 요청이 완료되었습니다',
        })
      } else {
        setMessage({
          type: 'error',
          text: result.error || '충전 요청에 실패했습니다',
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '오류가 발생했습니다' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* 메시지 */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 직접 입력 충전 */}
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            충전할 크레딧 입력 (1크레딧 = 1원)
          </label>
          <input
            type="number"
            min={1000}
            step={1000}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="예: 100000"
          />

          {/* 추천 버튼 */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[100000, 500000, 1000000].map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className="px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {formatCredits(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* 계산 결과 */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">결제 금액</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatPrice(amount)}
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
            <p className="text-xs text-blue-600 dark:text-blue-300">보너스</p>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-200">
              +{formatCredits(bonusInfo.bonus)}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
            <p className="text-xs text-green-600 dark:text-green-300">총 지급</p>
            <p className="text-sm font-semibold text-green-700 dark:text-green-200">
              {formatCredits(bonusInfo.total)}
            </p>
          </div>
        </div>

        {/* 보너스 안내 */}
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-3 text-xs text-gray-600 dark:text-gray-300">
          <p className="mb-2 font-semibold">보너스 구간</p>
          <ul className="space-y-1">
            <li>• 10만 크레딧 정확히 충전 시 100% 보너스</li>
            {TOPUP_BONUS_TIERS.map(tier => (
              <li key={tier.minCredits}>
                • {formatCredits(tier.minCredits)} 크레딧 이상: {Math.round(tier.bonusRate * 100)}%
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleRequest}
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? '처리 중...' : '충전 요청'}
        </button>
      </div>

      {/* 안내 */}
      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">
          💡 충전 요청 후 관리자 승인이 필요합니다. 입금 확인 후 크레딧이 지급됩니다.
        </p>
      </div>
    </div>
  )
}
