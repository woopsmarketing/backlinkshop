/**
 * sitemap.xml
 *
 * 규칙
 * - 200 + indexable + self canonical URL 만 넣는다. 리다이렉트되는 URL 을 넣지 않는다.
 * - lastmod 는 빌드 시각이 아니라 실제 콘텐츠 수정일을 쓴다 (config/routes.ts, 각 글의 updatedAt).
 */
import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/config/site'
import { PUBLIC_ROUTES } from '@/config/routes'
import { BLOG_POSTS } from '@/content/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = PUBLIC_ROUTES.map(route => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const posts: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...pages, ...posts]
}
