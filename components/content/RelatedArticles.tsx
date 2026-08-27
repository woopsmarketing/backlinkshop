import Link from 'next/link'
import type { BlogPost } from '@/content/blog'

/**
 * 관련 글 — 실제로 존재하는 글만 받는다 (config/seo-graph.ts 의 resolveArticles 사용).
 */
export function RelatedArticles({
  heading = '이어서 읽기',
  posts,
}: {
  heading?: string
  posts: BlogPost[]
}) {
  if (!posts.length) return null

  return (
    <section className="bl-related" aria-label={heading}>
      <h2 className="bl-related__heading">{heading}</h2>
      <div className={`bl-related__list bl-related__list--${posts.length >= 3 ? 3 : 2}`}>
        {posts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="bl-related__item">
            <span className="bl-related__label">{post.category}</span>
            <span className="bl-related__title">{post.title}</span>
            <span className="bl-related__desc">{post.summary}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
