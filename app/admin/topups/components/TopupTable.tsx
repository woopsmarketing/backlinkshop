// v1.1 - 보너스 크레딧 표시 (2026-02-11)
/**
 * 충전 요청 테이블
 * 승인/거절 버튼 포함
 */

'use client'

import { useState } from 'react'
import { approveTopupRequestAction, rejectTopupRequestAction } from '@/server/actions/admin-topups'
import { calculateTopupBonus } from '@/lib/topup'
import { formatCredits, formatDate } from '@/lib/utils'
import type { TopupRequestRow } from '@/server/queries/admin-topups'

type Props = {
  requests: TopupRequestRow[]
}

const statusLabel: Record<string, string> = {
  requested: '요청됨',
  approved: '승인됨',
  rejected: '거절됨',
}

export default function TopupTable({ requests }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  /**
   * 승인 처리
   */
  const handleApprove = async (id: string) => {
    setLoadingId(id)
    setMessage(null)

    try {
      const result = await approveTopupRequestAction(id)
      if (result.success) {
        setMessage({ type: 'success', text: result.message || '승인 완료' })
      } else {
        setMessage({ type: 'error', text: result.error || '승인 실패' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '승인 처리 중 오류가 발생했습니다' })
    } finally {
      setLoadingId(null)
    }
  }

  /**
   * 거절 처리
   */
  const handleReject = async (id: string) => {
    setLoadingId(id)
    setMessage(null)

    try {
      const result = await rejectTopupRequestAction(id)
      if (result.success) {
        setMessage({ type: 'success', text: result.message || '거절 완료' })
      } else {
        setMessage({ type: 'error', text: result.error || '거절 실패' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '거절 처리 중 오류가 발생했습니다' })
    } finally {
      setLoadingId(null)
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

      {requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          충전 요청이 없습니다
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  유저 ID
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  패키지
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  충전/보너스
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  상태
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  요청일
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  처리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {requests.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {item.user_id.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                    {item.package_id}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    {(() => {
                      const bonusInfo = calculateTopupBonus(Number(item.amount))
                      return (
                        <div className="flex flex-col items-end gap-1">
                          <span>{formatCredits(Number(item.amount))} 크레딧</span>
                          <span className="text-xs text-blue-600 dark:text-blue-300">
                            +{formatCredits(bonusInfo.bonus)} 보너스
                          </span>
                          <span className="text-xs text-green-600 dark:text-green-300">
                            총 {formatCredits(bonusInfo.total)} 크레딧
                          </span>
                        </div>
                      )
                    })()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {statusLabel[item.status] || item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.status === 'requested' ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          disabled={loadingId === item.id}
                          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          disabled={loadingId === item.id}
                          className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md disabled:bg-gray-400"
                        >
                          거절
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">처리 완료</span>
                    )}
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
