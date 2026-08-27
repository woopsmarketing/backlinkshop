/**
 * 블로그 콘텐츠 레지스트리
 *
 * 새 글을 추가할 때는 `content/blog/<slug>.ts` 를 만들고 여기에 import 후 배열에 추가한다.
 * 사이트맵·목록·관련글 컴포넌트가 전부 이 배열을 읽는다.
 */

import type { BlogPost } from './types'
import { post as backlinkPriceGuide } from './backlink-price-guide'
import { post as howToChooseBacklinkAgency } from './how-to-choose-backlink-agency'
import { post as whatIsPbnBacklink } from './what-is-pbn-backlink'
import { post as highQualityBacklinkCriteria } from './high-quality-backlink-criteria'
import { post as linkBuildingGuide } from './link-building-guide'

export type { BlogPost, BlogSection, BlogCategory } from './types'

/** 최신 수정일 내림차순으로 정렬해 노출한다. */
export const BLOG_POSTS: BlogPost[] = [
  backlinkPriceGuide,
  howToChooseBacklinkAgency,
  whatIsPbnBacklink,
  highQualityBacklinkCriteria,
  linkBuildingGuide,
].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug)
}

export function getFeaturedPost(): BlogPost {
  return BLOG_POSTS.find(post => post.featured) ?? BLOG_POSTS[0]
}

/** 사이트맵 lastmod 용 — 블로그 전체의 가장 최근 수정일 */
export function latestBlogUpdate(): string {
  return BLOG_POSTS.reduce(
    (latest, post) => (post.updatedAt > latest ? post.updatedAt : latest),
    '1970-01-01'
  )
}
