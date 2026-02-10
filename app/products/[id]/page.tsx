// v1.1 - 상단 메뉴 추가 (2026-02-05)
/**
 * 상품 상세 페이지
 * 상세 정보 표시 및 구매 폼 제공
 */

import { notFound } from 'next/navigation'
import { getProductById } from '@/server/queries/products'
import { formatCredits } from '@/lib/utils'
import ProductPurchaseForm from '../components/ProductPurchaseForm'
import Link from 'next/link'
import { getCurrentUser, isAdmin } from '@/server/auth/session'
import TopNav from '@/app/components/TopNav'

type Props = {
  params: { id: string }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductById(params.id)
  const user = await getCurrentUser()
  const admin = await isAdmin()

  if (!product || product.status !== 'active') {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user?.email} isAdmin={admin} title={product.name} />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/products"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            ← 상품 목록
          </Link>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 왼쪽: 상품 정보 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              상품 설명
            </h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap mb-6">
              {product.description}
            </p>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                가격
              </p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatCredits(Number(product.price))} 크레딧
              </p>
            </div>
          </div>

          {/* 오른쪽: 구매 폼 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              구매하기
            </h2>
            <ProductPurchaseForm
              productId={product.id}
              productName={product.name}
              price={Number(product.price)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

