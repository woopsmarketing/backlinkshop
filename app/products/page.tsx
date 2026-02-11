// v2.0 - 카테고리형 상품 페이지 (2026-02-11)
/**
 * 상품 목록 페이지
 * 카테고리 카드 제공 → 카테고리별 상품 리스트로 이동
 */

import Link from 'next/link'
import { getCurrentUser, isAdmin } from '@/server/auth/session'
import TopNav from '@/app/components/TopNav'
import { PRODUCT_CATEGORIES } from '@/lib/product-categories'

type Props = {
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage(props: Props) {
  // Next.js 15: searchParams는 Promise (현재 페이지에서는 사용하지 않음)
  await props.searchParams
  const user = await getCurrentUser()
  const admin = await isAdmin()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user?.email} isAdmin={admin} title="상품 카테고리" />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 안내 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            카테고리별로 먼저 고르세요
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            큰 카테고리에서 선택하면, 세부 상품이 자동으로 나열됩니다.
          </p>
        </div>

        {/* 카테고리 카드 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_CATEGORIES.map(category => (
            <div
              key={category.slug}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {category.title}
                  </span>
                </div>
                {category.comingSoon && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    준비중
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {category.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {category.description}
              </p>

              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-6">
                {category.highlights.map(item => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>

              <Link
                href={`/products/category/${category.slug}`}
                className="mt-auto block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                상품 보기
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
