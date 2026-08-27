import type { ReactNode } from 'react'

export function Badge({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'brand' | 'success'
}) {
  const toneClass = tone === 'default' ? '' : `bl-badge--${tone}`
  return <span className={['bl-badge', toneClass].filter(Boolean).join(' ')}>{children}</span>
}
