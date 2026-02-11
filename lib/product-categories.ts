// v1.0 - 상품 카테고리 정의 유틸 (2026-02-11)
/**
 * 상품 카테고리 정의 유틸
 * - 사용 예시: const category = getCategoryBySlug('pbn')
 */

export type ProductCategorySlug = 'plan' | 'pbn' | 'content' | 'seo' | 'domain' | 'hosting'

export type ProductSummary = {
  id: string
  name: string
  description?: string | null
  price: number
  category?: string | null
  metadata?: Record<string, unknown> | null
}

type CategoryRule = {
  includeKeywords?: string[]
  includeCategories?: string[]
}

export type ProductCategory = {
  slug: ProductCategorySlug
  title: string
  description: string
  icon: string
  highlights: string[]
  comingSoon?: boolean
  rule: CategoryRule
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: 'plan',
    title: '플랜 백링크',
    description: '다양한 유형 백링크 조합으로 자연스러운 링크 프로필 구축',
    icon: '📦',
    highlights: ['다양한 조합', '자연스러운 프로필', '초기 성장용'],
    rule: { includeKeywords: ['플랜'] },
  },
  {
    slug: 'pbn',
    title: 'PBN 백링크',
    description: '직접 운영 PBN 네트워크로 강력한 순위 상승',
    icon: '🏆',
    highlights: ['고품질 도메인', '강력한 링크 파워', '빠른 효과'],
    rule: { includeKeywords: ['PBN'] },
  },
  {
    slug: 'content',
    title: '콘텐츠 최적화',
    description: '키워드 기반 콘텐츠 수정 및 최적화',
    icon: '✍️',
    highlights: ['키워드 정합성', '전환율 개선', '품질 강화'],
    rule: { includeCategories: ['content'], includeKeywords: ['콘텐츠'] },
  },
  {
    slug: 'seo',
    title: '온페이지 SEO 점검',
    description: '기술 SEO/구조/메타 최적화 점검',
    icon: '🧭',
    highlights: ['기술 SEO', '구조 최적화', '리포트 제공'],
    rule: { includeCategories: ['seo'], includeKeywords: ['SEO', '온페이지'] },
  },
  {
    slug: 'domain',
    title: '도메인',
    description: '프로젝트에 맞는 고품질 도메인 추천',
    icon: '🌐',
    highlights: ['신뢰도 확보', '브랜딩 강화', '맞춤 추천'],
    comingSoon: true,
    rule: { includeKeywords: ['도메인'] },
  },
  {
    slug: 'hosting',
    title: '호스팅',
    description: '안정적인 SEO 최적화 호스팅',
    icon: '🖥️',
    highlights: ['속도 최적화', '보안 강화', '운영 편의'],
    comingSoon: true,
    rule: { includeKeywords: ['호스팅'] },
  },
]

export function getCategoryBySlug(slug: string) {
  return PRODUCT_CATEGORIES.find(category => category.slug === slug)
}

export function filterProductsByCategory(slug: string, products: ProductSummary[]) {
  const category = getCategoryBySlug(slug)
  if (!category) return []

  const { rule } = category
  const keywords = rule.includeKeywords || []
  const categories = rule.includeCategories || []

  return products.filter(product => {
    const name = product.name || ''
    const categoryValue = product.category || ''

    if (categories.includes(categoryValue)) {
      return true
    }

    if (keywords.some(keyword => name.includes(keyword))) {
      return true
    }

    return false
  })
}
