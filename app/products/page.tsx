// v1.1 - 상단 메뉴 추가 (2026-02-05)
/**
 * 상품 목록 페이지
 * 활성 상품 리스트 및 카테고리 필터
 */

import Link from 'next/link'
import { getActiveProducts } from '@/server/queries/products'
import { formatCredits } from '@/lib/utils'
import { getCurrentUser, isAdmin } from '@/server/auth/session'
import TopNav from '@/app/components/TopNav'

type Props = {
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage(props: Props) {
  // Next.js 15: searchParams는 Promise
  const searchParams = await props.searchParams
  const category = searchParams?.category
  const products = await getActiveProducts(category)
  const user = await getCurrentUser()
  const admin = await isAdmin()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user?.email} isAdmin={admin} title="상품 목록" />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 카테고리 필터 */}
        <div className="flex gap-2 mb-6">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !category
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            전체
          </Link>
          <Link
            href="/products?category=backlink"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              category === 'backlink'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            백링크
          </Link>
          <Link
            href="/products?category=seo"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              category === 'seo'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            SEO
          </Link>
          <Link
            href="/products?category=content"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              category === 'content'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            콘텐츠
          </Link>
        </div>

        {/* 상품 리스트 */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            등록된 상품이 없습니다
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="mt-auto">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                    {formatCredits(Number(product.price))} 크레딧
                  </p>
                  <Link
                    href={`/products/${product.id}`}
                    className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    상품 보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
