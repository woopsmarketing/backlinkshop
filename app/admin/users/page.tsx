// v1.0 - 관리자 회원 관리 페이지 (2026-02-13)
/**
 * 관리자 회원 관리 페이지
 * 전체 회원 목록, 가입일, 크레딧 잔액, 역할 확인 가능
 */

import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/server/auth/session'
import { getAdminUsers } from '@/server/queries/admin-users'
import TopNav from '@/app/components/TopNav'
import AdminNav from '@/app/admin/components/AdminNav'
import AdminUsersTable from './components/AdminUsersTable'

export default async function AdminUsersPage() {
  // 1. 인증 확인
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // 2. 관리자 권한 확인
  const admin = await isAdmin()
  if (!admin) {
    redirect('/dashboard')
  }

  // 3. 회원 목록 조회
  const users = await getAdminUsers()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user.email} isAdmin={admin} title="회원 관리" />

      <main className="container mx-auto px-4 py-8">
        {/* 관리자 탭 */}
        <AdminNav current="users" />

        {/* 회원 테이블 */}
        <AdminUsersTable users={users} />
      </main>
    </div>
  )
}
