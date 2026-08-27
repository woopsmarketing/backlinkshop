import Link from 'next/link'
import { pageDescription, pageLabel } from '@/config/seo-graph'

/**
 * 관련 페이지 목록 — 링크 대상과 라벨을 config/seo-graph.ts 에서 가져온다.
 * 페이지 JSX 에서 내부링크를 하드코딩하지 않기 위한 공용 컴포넌트다.
 */
export function RelatedContent({
  heading,
  hrefs,
  columns = 2,
}: {
  heading: string
  hrefs: string[]
  columns?: 2 | 3
}) {
  const items = hrefs.filter(href => pageLabel(href) !== href)
  if (!items.length) return null

  return (
    <section className="bl-related" aria-label={heading}>
      <h2 className="bl-related__heading">{heading}</h2>
      <div className={`bl-related__list bl-related__list--${columns}`}>
        {items.map(href => (
          <Link key={href} href={href} className="bl-related__item">
            <span className="bl-related__title">{pageLabel(href)}</span>
            <span className="bl-related__desc">{pageDescription(href)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
