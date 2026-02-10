// v1.0 - 관리자 쿠폰 관리 페이지 추가 (2026-02-05)
/**
 * 관리자 쿠폰 관리 페이지
 * 쿠폰 생성 + 목록 조회 + 만료 처리
 */

import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/server/auth/session'
import { getAdminCoupons } from '@/server/queries/admin-coupons'
import TopNav from '@/app/components/TopNav'
import AdminNav from '@/app/admin/components/AdminNav'
import AdminCouponForm from './components/AdminCouponForm'
import AdminCouponTable from './components/AdminCouponTable'

export default async function AdminCouponsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const admin = await isAdmin()
  if (!admin) {
    redirect('/dashboard')
  }

  const coupons = await getAdminCoupons()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user.email} isAdmin={admin} title="쿠폰 관리" />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* 관리자 탭 */}
        <AdminNav current="coupons" />

        {/* 쿠폰 생성 폼 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            쿠폰 생성
          </h2>
          <AdminCouponForm />
        </div>

        {/* 쿠폰 목록 */}
        <AdminCouponTable coupons={coupons} />
      </main>
    </div>
  )
}

