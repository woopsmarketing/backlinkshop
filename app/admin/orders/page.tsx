// v1.0 - 관리자 주문 관리 페이지 추가 (2026-02-05)
/**
 * 관리자 주문 관리 페이지
 * 주문 목록 조회 및 상태 변경
 */

import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/server/auth/session'
import { getAdminOrders } from '@/server/queries/admin-orders'
import { getAdminStats } from '@/server/queries/admin-stats'
import TopNav from '@/app/components/TopNav'
import AdminNav from '@/app/admin/components/AdminNav'
import AdminOrdersTable from './components/AdminOrdersTable'

type Props = {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminOrdersPage(props: Props) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const admin = await isAdmin()
  if (!admin) {
    redirect('/dashboard')
  }

  // Next.js 15: searchParams는 Promise
  const searchParams = await props.searchParams
  const status = searchParams?.status

  // 데이터 병렬 조회
  const [orders, stats] = await Promise.all([getAdminOrders(status), getAdminStats()])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user.email} isAdmin={admin} title="주문 관리" />

      <main className="container mx-auto px-4 py-8">
        {/* 관리자 탭 (미처리 알림 배지 포함) */}
        <AdminNav current="orders" stats={stats} />

        {/* 상태 필터 */}
        <div className="flex gap-2 mb-6">
          <a
            href="/admin/orders"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !status
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            전체
          </a>
          <a
            href="/admin/orders?status=pending"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              status === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            대기중
          </a>
          <a
            href="/admin/orders?status=processing"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              status === 'processing'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            처리중
          </a>
          <a
            href="/admin/orders?status=completed"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              status === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            완료
          </a>
          <a
            href="/admin/orders?status=failed"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              status === 'failed'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            실패
          </a>
        </div>

        <AdminOrdersTable orders={orders} />
      </main>
    </div>
  )
}
