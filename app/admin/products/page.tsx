// v1.0 - 관리자 상품 관리 페이지 추가 (2026-02-05)
/**
 * 관리자 상품 관리 페이지
 * 상품 생성 + 활성/비활성 관리
 */

import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/server/auth/session'
import { getAdminProducts } from '@/server/queries/admin-products'
import TopNav from '@/app/components/TopNav'
import AdminNav from '@/app/admin/components/AdminNav'
import AdminProductForm from './components/AdminProductForm'
import AdminProductTable from './components/AdminProductTable'

export default async function AdminProductsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const admin = await isAdmin()
  if (!admin) {
    redirect('/dashboard')
  }

  const products = await getAdminProducts()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user.email} isAdmin={admin} title="상품 관리" />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* 관리자 탭 */}
        <AdminNav current="products" />

        {/* 상품 생성 폼 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            상품 생성
          </h2>
          <AdminProductForm />
        </div>

        {/* 상품 목록 */}
        <AdminProductTable products={products} />
      </main>
    </div>
  )
}

