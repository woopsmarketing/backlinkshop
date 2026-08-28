import type { BlogPost } from '@/content/blog'
import { ArticleCard } from './ArticleCard'

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
      <div className={`bl-post-grid bl-post-grid--${posts.length >= 3 ? 3 : 2}`}>
        {posts.map(post => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
