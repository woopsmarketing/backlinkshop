/**
 * robots.txt
 *
 * 설계 원칙
 * - noindex 로 처리하는 경로(/login, /lp/*, /analyze/*, /shop, /dashboard ...)는 Disallow 하지 않는다.
 *   크롤을 막으면 Google 이 noindex 메타를 읽지 못해 오히려 색인에 남을 수 있다.
 * - 색인시킬 콘텐츠가 없고 noindex 를 읽힐 필요도 없는 경로만 Disallow 한다.
 */
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/config/site'
import { DISALLOW_PATHS } from '@/config/routes'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...DISALLOW_PATHS],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
