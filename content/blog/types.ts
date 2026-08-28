import type { ClusterKey } from '@/config/seo-graph'

export type BlogCategory = 'BACKLINK' | 'SEO' | 'GOOGLE RANKING' | 'PBN'

export type BlogSection = {
  /** 목차 앵커 id (영문 kebab-case) */
  id: string
  /** 본문 H2 */
  heading: string
  /**
   * 섹션 본문 HTML.
   * - 저자가 직접 작성한 신뢰 가능한 문자열만 들어간다 (사용자 입력 없음).
   * - 허용 태그: p, ul, ol, li, strong, em, h3, table, thead, tbody, tr, th, td, blockquote, a
   * - 넓은 표는 <div class="blog-breakout"> 로 감싼다.
   */
  html: string
}

export type BlogPost = {
  slug: string
  /** 페이지 H1 */
  title: string
  /** <title> — H1과 다르게, 검색 의도를 한 문장으로 */
  metaTitle: string
  /** meta description */
  description: string
  /** 본문 상단 요약 (Summary) */
  summary: string
  category: BlogCategory
  /** ISO 날짜 (YYYY-MM-DD) */
  publishedAt: string
  updatedAt: string
  /** 이 글이 속한 내부링크 클러스터 */
  cluster: ClusterKey
  /** 이 글에서 연결할 상업 페이지 (미지정 시 클러스터 기본값) */
  moneyPage?: string
  /** 문맥이 맞을 때만 연결하는 보조 랜딩 */
  supportingPage?: string
  /**
   * 대표 이미지 (SVG 다이어그램).
   * - thumbnail: /blog 목록 카드 · 관련 글 카드
   * - heroImage: 글 본문 상단
   * 같은 파일을 둘 다에 써도 되지만, 나중에 비율이 다른 이미지를 쓸 수 있게 필드를 나눠 둔다.
   * 값이 없으면 이미지 없이 렌더링된다 (레이아웃이 깨지지 않는다).
   */
  thumbnail?: string
  heroImage?: string
  /** 이미지가 무엇을 설명하는지. 장식용이 아니므로 반드시 내용을 적는다. */
  imageAlt?: string

  /** Key Takeaways */
  keyTakeaways: string[]
  sections: BlogSection[]
  /** /blog 상단 Featured 로 노출 */
  featured?: boolean
}
