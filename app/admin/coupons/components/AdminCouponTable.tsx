// v1.0 - 관리자 쿠폰 테이블 추가 (2026-02-05)
/**
 * 관리자 쿠폰 목록 테이블
 * 만료 처리 기능 포함
 */

'use client'

import { useState } from 'react'
import { formatCredits, formatDate } from '@/lib/utils'
import { expireCouponAction } from '@/server/actions/admin-coupons'
import type { AdminCouponRow } from '@/server/queries/admin-coupons'

type Props = {
  coupons: AdminCouponRow[]
}

export default function AdminCouponTable({ coupons }: Props) {
  const [loadingCode, setLoadingCode] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  /**
   * 쿠폰 만료 처리
   */
  const handleExpire = async (code: string) => {
    setLoadingCode(code)
    setMessage(null)

    try {
      const result = await expireCouponAction(code)
      if (result.success) {
        setMessage({ type: 'success', text: result.message || '만료 완료' })
      } else {
        setMessage({ type: 'error', text: result.error || '만료 실패' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '만료 처리 중 오류가 발생했습니다' })
    } finally {
      setLoadingCode(null)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* 메시지 */}
      {message && (
        <div
          className={`m-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {coupons.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          등록된 쿠폰이 없습니다
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  코드
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  금액
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  사용/최대
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  만료일
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  생성일
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  처리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {coupon.code}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCredits(Number(coupon.amount))} 크레딧
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                    {coupon.used_count} / {coupon.max_uses}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                    {coupon.expires_at ? formatDate(coupon.expires_at) : '무기한'}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(coupon.created_at)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleExpire(coupon.code)}
                      disabled={loadingCode === coupon.code}
                      className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md disabled:bg-gray-400"
                    >
                      만료
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

