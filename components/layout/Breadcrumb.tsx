/**
 * Breadcrumb — 실제 HTML 링크 + BreadcrumbList 구조화 데이터.
 * 홈을 제외한 모든 하위 SEO 페이지에서 사용한다.
 */
import Link from 'next/link'
import { Container } from './Container'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'

export type Crumb = { href: string; label: string }

export function Breadcrumb({ trail, narrow }: { trail: Crumb[]; narrow?: boolean }) {
  const items: Crumb[] = [{ href: '/', label: '홈' }, ...trail]

  return (
    <>
      <BreadcrumbSchema items={items} />
      <nav className="bl-breadcrumb" aria-label="현재 위치">
        <Container narrow={narrow}>
          <ol>
            {items.map((item, index) => {
              const isLast = index === items.length - 1
              return (
                <li key={item.href}>
                  {index > 0 ? (
                    <span className="bl-breadcrumb__sep" aria-hidden="true">
                      /
                    </span>
                  ) : null}{' '}
                  {isLast ? (
                    <span aria-current="page">{item.label}</span>
                  ) : (
                    <Link href={item.href}>{item.label}</Link>
                  )}
                </li>
              )
            })}
          </ol>
        </Container>
      </nav>
    </>
  )
}
