import Link from 'next/link'
import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  feature?: boolean
  className?: string
}

export function Card({ children, feature, className }: CardProps) {
  return (
    <div
      className={['bl-card', feature ? 'bl-card--feature' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

/** 카드 전체가 하나의 내부링크인 경우 */
export function LinkCard({ href, children, feature, className }: CardProps & { href: string }) {
  return (
    <Link
      href={href}
      className={['bl-card', 'bl-card--link', feature ? 'bl-card--feature' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Link>
  )
}

export function CardTitle({
  children,
  as: As = 'h3',
}: {
  children: ReactNode
  as?: 'h2' | 'h3' | 'h4'
}) {
  return <As className="bl-card__title">{children}</As>
}

export function CardBody({ children }: { children: ReactNode }) {
  return <p className="bl-card__body">{children}</p>
}

export function CardMeta({ children }: { children: ReactNode }) {
  return <p className="bl-card__meta">{children}</p>
}

/** 점 목록 — 카드 내부 포인트 나열용 */
export function BulletList({ items, plain }: { items: readonly string[]; plain?: boolean }) {
  return (
    <ul className={['bl-list', plain ? 'bl-list--plain' : ''].filter(Boolean).join(' ')}>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
