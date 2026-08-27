import type { ReactNode } from 'react'

/**
 * 섹션 제목 블록. 모든 섹션이 같은 리듬을 갖도록 한 곳에서 관리한다.
 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  center,
  id,
  as: As = 'h2',
}: {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  center?: boolean
  id?: string
  as?: 'h2' | 'h3'
}) {
  return (
    <div
      className={['bl-section-head', center ? 'bl-section-head--center' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow ? <span className="bl-eyebrow">{eyebrow}</span> : null}
      <As id={id} className={As === 'h2' ? 'bl-h2' : 'bl-h3'}>
        {title}
      </As>
      {lead ? <p className="bl-lead bl-measure">{lead}</p> : null}
    </div>
  )
}
