/**
 * 충전 패키지 컴포넌트
 * Client Component
 */

'use client'

import { useState } from 'react'
import { createTopupRequestAction } from '@/server/actions/credits'
import { CREDIT_PRICES, TOPUP_PACKAGES } from '@/lib/constants'
import { formatCredits, formatPrice } from '@/lib/utils'

export default function TopupPackages() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const packages = [
    {
      id: TOPUP_PACKAGES.STARTER_300,
      name: '스타터',
      amount: CREDIT_PRICES.STARTER.amount,
      price: CREDIT_PRICES.STARTER.price,
      popular: false,
    },
    {
      id: TOPUP_PACKAGES.PRO_1000,
      name: '프로',
      amount: CREDIT_PRICES.PRO.amount,
      price: CREDIT_PRICES.PRO.price,
      popular: true,
    },
    {
      id: TOPUP_PACKAGES.ENTERPRISE_5000,
      name: '엔터프라이즈',
      amount: CREDIT_PRICES.ENTERPRISE.amount,
      price: CREDIT_PRICES.ENTERPRISE.price,
      popular: false,
    },
  ]

  const handleRequest = async (packageId: string, amount: number) => {
    setLoading(true)
    setMessage(null)

    try {
      const result = await createTopupRequestAction(packageId, amount)

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

      {/* 패키지 카드 */}
      <div className="space-y-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`border rounded-lg p-4 ${
              pkg.popular
                ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {pkg.name}
                  </h3>
                  {pkg.popular && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      인기
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {formatCredits(pkg.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">가격</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatPrice(pkg.price)}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleRequest(pkg.id, pkg.amount)}
              disabled={loading}
              className="w-full mt-3 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? '처리 중...' : '충전 요청'}
            </button>
          </div>
        ))}
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
