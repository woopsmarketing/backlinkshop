/**
 * 내부링크 그래프 (Topic Cluster)
 *
 * 원칙
 * - 내부링크를 각 페이지 JSX에 하드코딩하지 않는다. 관계는 전부 이 파일에서 정의한다.
 * - "모든 페이지가 모든 페이지에 링크"하는 구조를 만들지 않는다. 클러스터 안에서만 연결한다.
 * - RelatedServices / RelatedArticles / RelatedContent 컴포넌트가 이 설정을 읽는다.
 */

import { BLOG_POSTS } from '@/content/blog'

/** 사이트 내 공개 페이지 라벨 레지스트리. 링크 앵커·카드 제목을 여기서만 관리한다. */
export const PAGE_REGISTRY: Record<string, { label: string; description: string }> = {
  '/': {
    label: '백링크 구매 · 백링크샵',
    description: '현재 사이트 상황을 먼저 보고 필요한 백링크 작업을 판단합니다.',
  },
  '/backlink': {
    label: '백링크란? 구조부터 이해하기',
    description: '백링크가 검색순위에 어떻게 작용하는지 정리한 가이드입니다.',
  },
  '/backlink-agency': {
    label: '백링크 업체 판단 기준',
    description: '가격보다 먼저 확인해야 할 8가지 기준을 정리했습니다.',
  },
  '/pricing': {
    label: '백링크 가격',
    description: '무엇에 돈을 내는지, 가격이 왜 달라지는지 공개합니다.',
  },
  '/services': {
    label: 'SEO 서비스 전체',
    description: '문제에 맞는 SEO 작업을 고르는 허브입니다.',
  },
  '/services/pbn-backlink': {
    label: 'PBN 백링크',
    description: 'PBN이 어떻게 구성되는지, 어떤 경우에 맞는지 설명합니다.',
  },
  '/services/plan-backlink': {
    label: '플랜 백링크',
    description: '하나의 상품 대신 조합부터 설계하는 방식입니다.',
  },
  '/services/onpage-seo': {
    label: '온페이지 SEO',
    description: '페이지가 순위를 받을 준비가 되어 있는지 점검합니다.',
  },
  '/services/content-seo': {
    label: '콘텐츠 SEO',
    description: '검색한 사람이 원하는 답부터 만드는 작업입니다.',
  },
  '/google-ranking': {
    label: '구글 상위노출',
    description: '순위가 오르지 않는 이유를 하나로 설명하지 않습니다.',
  },
  '/about': {
    label: '백링크샵 소개',
    description: '8년 넘게 검색 결과가 변하는 과정을 직접 겪으며 만든 판단 기준입니다.',
  },
  '/cases': {
    label: '성공사례',
    description: '어떤 조건에서 나온 결과인지 함께 공개합니다.',
  },
  '/faq': {
    label: '자주 묻는 질문',
    description: '상담 전에 많이 받는 질문을 정리했습니다.',
  },
  '/blog': {
    label: 'SEO 가이드',
    description: 'SEO를 이해하면 무엇을 해야 할지가 명확해집니다.',
  },
  '/refund': {
    label: '환불정책',
    description: '작업 단계별 환불 기준과 제한되는 경우를 문서로 정리했습니다.',
  },
}

export type Cluster = {
  /** 이 클러스터의 정보성 허브 */
  pillar: string
  /** 이 클러스터가 향하는 상업 페이지 */
  moneyPage: string
  /** 문맥이 맞는 보조 페이지 */
  relatedPages: string[]
  /** 관련 블로그 슬러그 */
  relatedArticles: string[]
}

export type ClusterKey =
  | 'home'
  | 'backlink'
  | 'agency'
  | 'pricing'
  | 'services'
  | 'pbnBacklink'
  | 'planBacklink'
  | 'onpageSeo'
  | 'contentSeo'
  | 'googleRanking'
  | 'cases'
  | 'faq'
  | 'about'

export const SEO_GRAPH: Record<ClusterKey, Cluster> = {
  home: {
    pillar: '/backlink',
    moneyPage: '/services/pbn-backlink',
    relatedPages: ['/pricing', '/backlink-agency', '/cases', '/about'],
    relatedArticles: [
      'backlink-price-guide',
      'what-is-pbn-backlink',
      'high-quality-backlink-criteria',
    ],
  },
  backlink: {
    pillar: '/backlink',
    moneyPage: '/',
    relatedPages: ['/backlink-agency', '/pricing', '/services/pbn-backlink', '/google-ranking'],
    relatedArticles: [
      'high-quality-backlink-criteria',
      'link-building-guide',
      'what-is-pbn-backlink',
    ],
  },
  agency: {
    pillar: '/backlink',
    moneyPage: '/',
    relatedPages: ['/pricing', '/cases', '/services/pbn-backlink'],
    relatedArticles: ['how-to-choose-backlink-agency', 'backlink-price-guide'],
  },
  pricing: {
    pillar: '/backlink',
    moneyPage: '/services/pbn-backlink',
    relatedPages: [
      '/services/plan-backlink',
      '/services/onpage-seo',
      '/services/content-seo',
      '/backlink-agency',
      '/cases',
    ],
    relatedArticles: ['backlink-price-guide', 'how-to-choose-backlink-agency'],
  },
  services: {
    pillar: '/backlink',
    moneyPage: '/pricing',
    relatedPages: ['/cases', '/backlink-agency'],
    relatedArticles: ['link-building-guide', 'high-quality-backlink-criteria'],
  },
  pbnBacklink: {
    pillar: '/backlink',
    moneyPage: '/pricing',
    relatedPages: ['/cases', '/services/plan-backlink'],
    relatedArticles: ['what-is-pbn-backlink', 'high-quality-backlink-criteria'],
  },
  planBacklink: {
    pillar: '/backlink',
    moneyPage: '/pricing',
    relatedPages: ['/services/pbn-backlink', '/services/onpage-seo'],
    relatedArticles: ['link-building-guide', 'high-quality-backlink-criteria'],
  },
  onpageSeo: {
    pillar: '/google-ranking',
    moneyPage: '/pricing',
    relatedPages: ['/services/content-seo', '/cases'],
    relatedArticles: ['link-building-guide', 'high-quality-backlink-criteria'],
  },
  contentSeo: {
    pillar: '/google-ranking',
    moneyPage: '/pricing',
    relatedPages: ['/services/onpage-seo', '/blog'],
    relatedArticles: ['link-building-guide', 'high-quality-backlink-criteria'],
  },
  googleRanking: {
    pillar: '/backlink',
    moneyPage: '/services/pbn-backlink',
    relatedPages: [
      '/services/onpage-seo',
      '/services/content-seo',
      '/services/pbn-backlink',
      '/cases',
      '/about',
    ],
    relatedArticles: ['high-quality-backlink-criteria', 'link-building-guide'],
  },
  cases: {
    pillar: '/backlink',
    moneyPage: '/services/pbn-backlink',
    relatedPages: ['/pricing', '/backlink-agency', '/about'],
    relatedArticles: ['how-to-choose-backlink-agency'],
  },
  faq: {
    pillar: '/backlink',
    moneyPage: '/pricing',
    relatedPages: ['/backlink-agency', '/services/pbn-backlink', '/refund'],
    relatedArticles: ['what-is-pbn-backlink', 'backlink-price-guide'],
  },
  /**
   * /about 은 키워드 페이지가 아니라 신뢰 페이지다.
   * 그래서 pillar 를 /google-ranking 으로 두고, 경험 서술이 실제 판단으로 이어지는 곳으로 보낸다.
   */
  about: {
    pillar: '/google-ranking',
    moneyPage: '/services/pbn-backlink',
    relatedPages: ['/cases', '/backlink', '/services/onpage-seo'],
    relatedArticles: ['high-quality-backlink-criteria', 'what-is-pbn-backlink'],
  },
}

export function getCluster(key: ClusterKey): Cluster {
  return SEO_GRAPH[key]
}

/** 페이지 경로 → 표시 라벨. 레지스트리에 없으면 경로를 그대로 돌려준다. */
export function pageLabel(href: string): string {
  return PAGE_REGISTRY[href]?.label ?? href
}

export function pageDescription(href: string): string {
  return PAGE_REGISTRY[href]?.description ?? ''
}

/** 클러스터의 관련 아티클을 실제 존재하는 글로만 해석한다. */
export function resolveArticles(slugs: string[]) {
  return slugs
    .map(slug => BLOG_POSTS.find(post => post.slug === slug))
    .filter((post): post is (typeof BLOG_POSTS)[number] => Boolean(post))
}

/**
 * 블로그 글 1편의 내부링크 세트.
 * 규칙: Pillar 1 + Money page 1 + 관련 글 2 (+문맥이 맞으면 보조 Landing 1).
 * 관련 없는 페이지를 강제로 넣지 않는다.
 */
export function articleLinkSet(slug: string) {
  const post = BLOG_POSTS.find(item => item.slug === slug)
  if (!post) return null
  const cluster = SEO_GRAPH[post.cluster]
  const related = BLOG_POSTS.filter(
    item => item.slug !== slug && item.cluster === post.cluster
  ).slice(0, 2)
  const fallbackRelated =
    related.length >= 2
      ? related
      : [
          ...related,
          ...BLOG_POSTS.filter(item => item.slug !== slug && !related.includes(item)),
        ].slice(0, 2)

  return {
    pillar: cluster.pillar,
    moneyPage: post.moneyPage ?? cluster.moneyPage,
    supportingPage: post.supportingPage,
    relatedArticles: fallbackRelated,
  }
}
