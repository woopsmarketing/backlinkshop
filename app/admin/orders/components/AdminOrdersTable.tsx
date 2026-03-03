// v1.3 - PBN 백링크 주문 정보 표시 추가 (2026-03-03)
/**
 * 관리자 주문 테이블
 * 주문 상태 변경 버튼 제공
 * PBN 백링크 주문: 사이트 URL, 키워드 표시
 */

'use client'

import { useState } from 'react'
import { formatCredits, formatDate } from '@/lib/utils'
import { updateOrderStatusAction } from '@/server/actions/admin-orders'
import ReportUploadButton from './ReportUploadButton'
import type { AdminOrderRow } from '@/server/queries/admin-orders'

type Props = {
  orders: AdminOrderRow[]
}

const statusLabel: Record<string, string> = {
  pending: '대기중',
  processing: '처리중',
  completed: '완료',
  failed: '실패',
}

type ModalType = 'note' | 'details'

export default function AdminOrdersTable({ orders }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [modal, setModal] = useState<{
    type: ModalType
    open: boolean
    data: AdminOrderRow | null
  } | null>(null)

  /**
   * 상세 정보 모달 열기
   */
  const openDetailsModal = (order: AdminOrderRow) => {
    setModal({ type: 'details', open: true, data: order })
  }

  /**
   * 모달 닫기
   */
  const closeModal = () => {
    setModal(null)
  }

  /**
   * 상태 변경 처리
   */
  const handleUpdate = async (id: string, status: string) => {
    setLoadingId(id)
    setMessage(null)

    try {
      const result = await updateOrderStatusAction(id, status)
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

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">주문이 없습니다</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  주문 ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  상품명
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  수량
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  총액
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  상태
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  상세정보
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  보고서
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  주문일
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  처리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {Array.isArray(order.products)
                      ? order.products[0]?.name || '알 수 없는 상품'
                      : order.products?.name || '알 수 없는 상품'}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                    {order.quantity}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCredits(Number(order.total_price))} 크레딧
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {statusLabel[order.status] || order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    <button
                      onClick={() => openDetailsModal(order)}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      상세보기
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <ReportUploadButton
                      orderId={order.id}
                      hasReport={!!order.report_path}
                      fileName={order.report_filename || undefined}
                    />
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleUpdate(order.id, 'processing')}
                          disabled={loadingId === order.id}
                          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400"
                        >
                          처리중
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          onClick={() => handleUpdate(order.id, 'completed')}
                          disabled={loadingId === order.id}
                          className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md disabled:bg-gray-400"
                        >
                          완료
                        </button>
                      )}
                      {order.status !== 'failed' && order.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdate(order.id, 'failed')}
                          disabled={loadingId === order.id}
                          className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md disabled:bg-gray-400"
                        >
                          실패
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 상세 정보 모달 */}
      {modal?.open && modal.data && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">주문 상세 정보</h3>
              <button
                onClick={closeModal}
                className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                닫기
              </button>
            </div>

            <div className="space-y-4">
              {/* 기본 정보 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">기본 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">주문 ID:</span>
                    <span className="text-gray-900 dark:text-white font-mono">{modal.data.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">상품명:</span>
                    <span className="text-gray-900 dark:text-white">
                      {Array.isArray(modal.data.products)
                        ? modal.data.products[0]?.name || '알 수 없는 상품'
                        : modal.data.products?.name || '알 수 없는 상품'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">수량:</span>
                    <span className="text-gray-900 dark:text-white">{modal.data.quantity}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">총액:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {formatCredits(Number(modal.data.total_price))} 크레딧
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">주문일:</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(modal.data.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* PBN 백링크 정보 */}
              {(modal.data.site_url || modal.data.keywords) && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                    🏆 PBN 백링크 정보
                  </h4>
                  <div className="space-y-2 text-sm">
                    {modal.data.site_url && (
                      <div>
                        <span className="text-blue-700 dark:text-blue-400 font-medium">
                          사이트 URL:
                        </span>
                        <div className="mt-1 text-gray-900 dark:text-white break-all bg-white dark:bg-gray-800 p-2 rounded">
                          {modal.data.site_url}
                        </div>
                      </div>
                    )}
                    {modal.data.keywords && (
                      <div>
                        <span className="text-blue-700 dark:text-blue-400 font-medium">
                          키워드:
                        </span>
                        <div className="mt-1 text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-2 rounded">
                          {modal.data.keywords}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 요청사항 */}
              {modal.data.note && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-3">
                    📝 요청사항
                  </h4>
                  <div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {modal.data.note}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
