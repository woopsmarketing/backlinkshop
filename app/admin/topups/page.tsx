// v1.1 - 관리자 공통 탭 추가 (2026-02-05)
/**
 * 관리자 충전 승인 페이지
 * 충전 요청 목록 조회 및 승인/거절 처리
 */

import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/server/auth/session'
import { getTopupRequests } from '@/server/queries/admin-topups'
import TopNav from '@/app/components/TopNav'
import TopupTable from './components/TopupTable'
import AdminNav from '@/app/admin/components/AdminNav'

type Props = {
  searchParams?: { status?: string }
}

export default async function AdminTopupsPage({ searchParams }: Props) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const admin = await isAdmin()
  if (!admin) {
    redirect('/dashboard')
  }

  const status = searchParams?.status
  const requests = await getTopupRequests(status)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user.email} isAdmin={admin} title="충전 승인" />

      <main className="container mx-auto px-4 py-8">
        {/* 관리자 탭 */}
        <AdminNav current="topups" />

        {/* 상태 필터 */}
        <div className="flex gap-2 mb-6">
          <a
            href="/admin/topups"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !status
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            전체
          </a>
          <a
            href="/admin/topups?status=requested"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              status === 'requested'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            요청됨
          </a>
          <a
            href="/admin/topups?status=approved"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              status === 'approved'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            승인됨
          </a>
          <a
            href="/admin/topups?status=rejected"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              status === 'rejected'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            거절됨
          </a>
        </div>

        <TopupTable requests={requests} />
      </main>
    </div>
  )
}

