import type { ReactNode } from 'react'
import { Container } from '@/components/layout/Container'

/**
 * Hero — 모든 랜딩의 첫 화면.
 * visual 을 넘기면 2단 split, 넘기지 않으면 단일 컬럼으로 렌더링한다.
 */
export function Hero({
  eyebrow,
  title,
  support,
  actions,
  note,
  visual,
}: {
  eyebrow?: string
  title: ReactNode
  support?: ReactNode
  actions?: ReactNode
  note?: ReactNode
  visual?: ReactNode
}) {
  return (
    <section className="bl-hero">
      <Container>
        <div
          className={['bl-hero__grid', visual ? 'bl-hero__grid--split' : 'bl-hero__grid--single']
            .filter(Boolean)
            .join(' ')}
        >
          <div>
            {eyebrow ? <span className="bl-eyebrow">{eyebrow}</span> : null}
            <h1 className="bl-h1 bl-hero__title">{title}</h1>
            {support ? <p className="bl-lead bl-hero__support">{support}</p> : null}
            {actions ? <div className="bl-btn-row">{actions}</div> : null}
            {note ? <p className="bl-hero__note">{note}</p> : null}
          </div>
          {visual ? <div>{visual}</div> : null}
        </div>
      </Container>
    </section>
  )
}
