// v1.0 - 카테고리별 상품 목록 페이지 (2026-02-11)
/**
 * 카테고리별 상품 목록 페이지
 * - 사용 예시: /products/category/pbn
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getActiveProducts } from '@/server/queries/products'
import { formatCredits } from '@/lib/utils'
import { getCurrentUser, isAdmin } from '@/server/auth/session'
import TopNav from '@/app/components/TopNav'
import {
  filterProductsByCategory,
  getCategoryBySlug,
  type ProductSummary,
} from '@/lib/product-categories'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductCategoryPage(props: Props) {
  // Next.js 15: params는 Promise
  const params = await props.params
  const category = getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const user = await getCurrentUser()
  const admin = await isAdmin()

  const products = (await getActiveProducts()) as ProductSummary[]
  const filtered = filterProductsByCategory(category.slug, products)

  // 카드용 보조 정보
  const getProductIcon = (name: string, categoryValue?: string) => {
    if (name.includes('PBN')) return '🏆'
    if (name.includes('플랜')) return '📦'
    if (name.includes('온페이지')) return '🧭'
    if (name.includes('콘텐츠')) return '✍️'
    if (categoryValue === 'seo') return '⚙️'
    if (categoryValue === 'content') return '📝'
    return category.icon
  }

  const getHighlight = (name: string) => {
    if (name.includes('로직 업그레이드')) return '고유 도메인 + 콘텐츠 업데이트'
    if (name.includes('PBN')) return '직접 운영 PBN 네트워크'
    if (name.includes('플랜')) return '다양한 유형 백링크 조합'
    if (name.includes('온페이지')) return '기술 SEO 점검 리포트'
    if (name.includes('콘텐츠')) return '키워드 기반 최적화'
    return category.description
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user?.email} isAdmin={admin} title={category.title} />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/products"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            ← 카테고리 목록
          </Link>
        </div>

        {/* 카테고리 소개 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{category.title}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
          <ul className="mt-4 grid md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
            {category.highlights.map(item => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* 상품 리스트 */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            아직 준비중인 카테고리입니다. 곧 업데이트됩니다.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(product => {
              const icon = getProductIcon(product.name, product.category || undefined)
              const metadata = product.metadata as { da_range?: string; turnaround?: string } | null

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col"
                >
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{icon}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {category.title}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {getHighlight(product.name)}
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
