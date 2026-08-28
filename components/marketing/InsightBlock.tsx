import type { ReactNode } from 'react'

/**
 * 인사이트 블록 — 섹션의 결론을 작은 안내문이 아니라 하나의 주장으로 세운다.
 * 기존 .bl-closing (본문에 묻히는 문단) 을 대체하는 자리다.
 */
export function InsightBlock({
  eyebrow,
  title,
  children,
  actions,
  tone = 'default',
}: {
  eyebrow?: string
  title: ReactNode
  children: ReactNode
  actions?: ReactNode
  tone?: 'default' | 'accent'
}) {
  return (
    <aside
      className={['bl-insight', tone === 'accent' ? 'bl-insight--accent' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className="bl-insight__main">
        {eyebrow ? <span className="bl-insight__eyebrow">{eyebrow}</span> : null}
        <p className="bl-insight__title">{title}</p>
        <div className="bl-insight__body">{children}</div>
      </div>
      {actions ? <div className="bl-insight__actions">{actions}</div> : null}
    </aside>
  )
}
