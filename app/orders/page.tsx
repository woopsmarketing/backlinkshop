// v1.2 - 보고서 다운로드 추가 (2026-02-05)
/**
 * 주문 내역 페이지
 * 유저의 주문 리스트 표시
 */

import { getCurrentUser, isAdmin } from '@/server/auth/session'
import { getMyOrders } from '@/server/queries/orders'
import { formatCredits, formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'
import TopNav from '@/app/components/TopNav'
import ReportDownloadButton from '@/app/components/ReportDownloadButton'

const statusLabel: Record<string, string> = {
  pending: '대기중',
  processing: '처리중',
  completed: '완료',
  failed: '실패',
}

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const admin = await isAdmin()
  const orders = await getMyOrders(user.id, 50)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user.email} isAdmin={admin} title="주문 내역" />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              아직 주문 내역이 없습니다
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
                      수량
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                      총액
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                      상태
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                      보고서
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                      날짜
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {order.products?.name || '알 수 없는 상품'}
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
                      <td className="py-3 px-4 text-center">
                        {order.report_path ? (
                          <ReportDownloadButton orderId={order.id} />
                        ) : (
                          <span className="text-xs text-gray-400">없음</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

