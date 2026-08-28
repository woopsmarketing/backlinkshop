import Link from 'next/link'
import type { BlogPost } from '@/content/blog'

/**
 * 아티클 카드 — 대표 이미지가 있으면 함께 보여준다.
 *
 * 왜 이미지를 넣는가
 * 카테고리·제목·요약만 나열하면 카드가 문서 링크처럼 보여서 목록 전체가 스캔되지 않는다.
 * 이미지는 장식이 아니라 그 글이 무엇을 설명하는 글인지 알려주는 다이어그램이다.
 * thumbnail 이 없으면 이미지 영역 없이 렌더링된다 (레이아웃이 깨지지 않는다).
 */
export function ArticleCard({
  post,
  size = 'md',
}: {
  post: BlogPost
  /** lg = /blog 상단 Featured */
  size?: 'md' | 'lg'
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={['bl-post-card', size === 'lg' ? 'bl-post-card--lg' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {post.thumbnail ? (
        <span className="bl-post-card__thumb">
          {/* SVG 다이어그램이라 래스터 최적화가 필요 없다. next/image 로 SVG 를 통과시키려면
              dangerouslyAllowSVG 를 켜야 하는데, 그건 외부 SVG 까지 허용하는 옵션이라 켜지 않는다. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnail}
            alt={post.imageAlt ?? ''}
            width={800}
            height={450}
            loading="lazy"
            decoding="async"
          />
        </span>
      ) : null}
      <span className="bl-post-card__content">
        <span className="bl-post-card__cat">{post.category}</span>
        <span className="bl-post-card__title">{post.title}</span>
        <span className="bl-post-card__summary">{post.summary}</span>
        <span className="bl-post-card__foot">
          <span className="bl-post-card__date">{post.updatedAt} 업데이트</span>
          <span className="bl-post-card__arrow" aria-hidden="true">
            &rarr;
          </span>
        </span>
      </span>
    </Link>
  )
}
