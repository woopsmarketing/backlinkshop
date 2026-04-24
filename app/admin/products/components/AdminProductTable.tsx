// v1.0 - 관리자 상품 테이블 추가 (2026-02-05)
/**
 * 관리자 상품 목록 테이블
 * 활성/비활성 토글 제공
 */

'use client'

import { useState } from 'react'
import { formatCredits, formatDate } from '@/lib/utils'
import { toggleProductStatusAction } from '@/server/actions/admin-products'
import type { AdminProductRow } from '@/server/queries/admin-products'

type Props = {
  products: AdminProductRow[]
}

export default function AdminProductTable({ products }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  /**
   * 상태 토글 처리
   */
  const handleToggle = async (id: string, status: string) => {
    const nextStatus = status === 'active' ? 'inactive' : 'active'
    setLoadingId(id)
    setMessage(null)

    try {
      const result = await toggleProductStatusAction(id, nextStatus)
      if (result.success) {
        setMessage({ type: 'success', text: result.message || '상태 변경 완료' })
      } else {
        setMessage({ type: 'error', text: result.error || '상태 변경 실패' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '상태 변경 중 오류가 발생했습니다' })
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

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          등록된 상품이 없습니다
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  상품명
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  카테고리
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  가격
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  상태
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  등록일
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  처리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCredits(Number(product.price))} 크레딧
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {product.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(product.created_at)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggle(product.id, product.status)}
                      disabled={loadingId === product.id}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400"
                    >
                      {product.status === 'active' ? '비활성' : '활성'}
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
