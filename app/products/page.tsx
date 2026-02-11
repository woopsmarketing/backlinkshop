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

  // 상품 카드용 아이콘/배지 매핑
  const getProductIcon = (name: string, categoryValue?: string) => {
    if (name.includes('PBN')) return '🏆'
    if (name.includes('플랜')) return '📦'
    if (name.includes('온페이지')) return '🧭'
    if (name.includes('콘텐츠')) return '✍️'
    if (categoryValue === 'seo') return '⚙️'
    if (categoryValue === 'content') return '📝'
    return '🔗'
  }

  const getCategoryLabel = (categoryValue?: string) => {
    if (categoryValue === 'backlink') return '백링크'
    if (categoryValue === 'seo') return 'SEO'
    if (categoryValue === 'content') return '콘텐츠'
    return '기타'
  }

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
            {products.map(product => {
              const icon = getProductIcon(product.name, product.category)
              const categoryLabel = getCategoryLabel(product.category)
              const metadata = product.metadata as { da_range?: string; turnaround?: string } | null

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{icon}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {categoryLabel}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {product.description}
                    </p>
                    {(metadata?.da_range || metadata?.turnaround) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {metadata?.da_range && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            DA {metadata.da_range}
                          </span>
                        )}
                        {metadata?.turnaround && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            {metadata.turnaround} 내 완료
                          </span>
                        )}
                      </div>
                    )}
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
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
