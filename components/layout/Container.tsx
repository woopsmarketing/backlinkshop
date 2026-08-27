import type { ReactNode } from 'react'

export function Container({
  children,
  narrow,
  className,
}: {
  children: ReactNode
  narrow?: boolean
  className?: string
}) {
  return (
    <div
      className={['bl-container', narrow ? 'bl-container--narrow' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

/**
 * Section — 섹션 간격 리듬을 한 곳에서 통제한다.
 * 모든 섹션을 같은 간격으로 두지 않기 위해 size 를 의도적으로 섞어 쓴다.
 */
export function Section({
  children,
  id,
  size = 'md',
  subtle,
  bordered,
  narrow,
  className,
  ariaLabelledBy,
}: {
  children: ReactNode
  id?: string
  size?: 'sm' | 'md' | 'lg'
  subtle?: boolean
  bordered?: boolean
  narrow?: boolean
  className?: string
  ariaLabelledBy?: string
}) {
  const sizeClass = size === 'md' ? '' : `bl-section--${size}`
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={[
        'bl-section',
        sizeClass,
        subtle ? 'bl-section--subtle' : '',
        bordered ? 'bl-section--bordered' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Container narrow={narrow}>{children}</Container>
    </section>
  )
}
