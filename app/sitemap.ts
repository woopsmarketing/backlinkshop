// v1.0 - 사이트맵 생성 (2026-02-11)
/**
 * 사이트맵 생성
 * - 사용 예시: https://도메인/sitemap.xml
 */
import type { MetadataRoute } from 'next'

// 사이트맵 엔트리 생성 함수
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://backlinkshop.co.kr'
  const now = new Date()

  // 공개 페이지 목록 (로그인/대시보드 제외)
  const routes = [
    '',
    '/products',
    '/products/category/plan',
    '/products/category/pbn',
    '/products/category/content',
    '/products/category/seo',
  ]

  return routes.map(path => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))
}
