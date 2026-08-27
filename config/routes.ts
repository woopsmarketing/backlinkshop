/**
 * 색인 대상 공개 URL 목록 (사이트맵 / QA 점검의 단일 원본)
 *
 * 규칙
 * - 여기에 있는 URL 은 전부 200 + indexable + self canonical 이어야 한다.
 * - 로그인·관리자·광고 LP·분석 결과는 여기에 넣지 않는다.
 * - lastModified 는 빌드 시각이 아니라 실제 콘텐츠 수정일을 쓴다. 콘텐츠를 고치면 이 날짜도 함께 올린다.
 */

export type PublicRoute = {
  path: string
  /** 실제 콘텐츠 최종 수정일 (YYYY-MM-DD) */
  lastModified: string
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: number
}

/** 리뉴얼 배포일. 신규 페이지의 최초 lastModified. */
export const LAUNCH_DATE = '2026-08-27'

export const PUBLIC_ROUTES: PublicRoute[] = [
  // Tier A — 가장 많은 내부링크를 받는 페이지
  { path: '/', lastModified: LAUNCH_DATE, changeFrequency: 'weekly', priority: 1 },
  { path: '/backlink', lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.9 },
  {
    path: '/backlink-agency',
    lastModified: LAUNCH_DATE,
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  { path: '/pricing', lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.9 },
  {
    path: '/services/pbn-backlink',
    lastModified: LAUNCH_DATE,
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  { path: '/google-ranking', lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.9 },

  // Tier B
  { path: '/services', lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.8 },
  { path: '/cases', lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq', lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/blog', lastModified: LAUNCH_DATE, changeFrequency: 'weekly', priority: 0.8 },

  // Tier C
  {
    path: '/services/plan-backlink',
    lastModified: LAUNCH_DATE,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    path: '/services/onpage-seo',
    lastModified: LAUNCH_DATE,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    path: '/services/content-seo',
    lastModified: LAUNCH_DATE,
    changeFrequency: 'monthly',
    priority: 0.7,
  },

  // 정책
  { path: '/terms', lastModified: LAUNCH_DATE, changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacy', lastModified: LAUNCH_DATE, changeFrequency: 'yearly', priority: 0.3 },
  { path: '/refund', lastModified: LAUNCH_DATE, changeFrequency: 'yearly', priority: 0.3 },
]

/**
 * 검색엔진에서 제외하는 경로.
 * 이 목록은 noindex 로 처리한다 (robots.txt 로 막으면 Google 이 noindex 를 읽지 못한다).
 */
export const NOINDEX_PATHS = [
  '/login',
  '/shop',
  '/dashboard',
  '/credits',
  '/orders',
  '/admin',
  '/email-preview',
  '/analyze',
  '/lp',
] as const

/**
 * 크롤 자체를 막는 경로 (색인시킬 콘텐츠가 없고 noindex 를 읽힐 필요도 없는 곳).
 */
export const DISALLOW_PATHS = ['/api/', '/auth/', '/admin/'] as const
