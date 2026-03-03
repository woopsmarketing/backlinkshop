// v1.3 - PBN 백링크 주문 정보 표시 추가 (2026-03-03)
/**
 * 주문 내역 페이지
 * 유저의 주문 리스트 표시
 * PBN 백링크 주문: 사이트 URL, 키워드 표시
 */

import { getCurrentUser, isAdmin } from '@/server/auth/session'
import { getMyOrders } from '@/server/queries/orders'
import { redirect } from 'next/navigation'
import TopNav from '@/app/components/TopNav'
import OrdersTable from './components/OrdersTable'

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
            <OrdersTable orders={orders} />
          )}
        </div>
      </main>
    </div>
  )
}
