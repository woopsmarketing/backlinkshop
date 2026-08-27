/**
 * Button — 링크 버튼 표면.
 * 내부 이동은 <Link>, 외부(http) 링크는 새 탭 <a> 로 자동 분기한다.
 */
import Link from 'next/link'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

export function buttonClass({
  variant = 'primary',
  size = 'md',
  block,
  className,
}: {
  variant?: Variant
  size?: Size
  block?: boolean
  className?: string
} = {}): string {
  return [
    'bl-btn',
    `bl-btn--${variant}`,
    size === 'lg' ? 'bl-btn--lg' : '',
    block ? 'bl-btn--block' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  href,
  children,
  variant,
  size,
  block,
  className,
}: {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  block?: boolean
  className?: string
}) {
  const cls = buttonClass({ variant, size, block, className })

  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}
