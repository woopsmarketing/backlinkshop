import type { ReactNode } from 'react'
import { Container } from '@/components/layout/Container'
import { HeroBackdrop } from './HeroBackdrop'

/**
 * Hero — 모든 랜딩의 첫 화면.
 *
 * 레이아웃 세 가지
 * - center: 홈 전용. 1단 중앙 정렬 + 배경 비주얼.
 * - split:  visual 을 넘긴 경우. 하위 랜딩에서 의미 있는 다이어그램이 있을 때만 쓴다.
 * - single: 기본. 좌측 정렬 1단.
 *
 * eyebrow 는 한글을 기본으로 쓴다 (SEO·PBN 같은 업계 용어는 그대로 둔다).
 */
export function Hero({
  eyebrow,
  title,
  support,
  actions,
  note,
  visual,
  center,
}: {
  eyebrow?: string
  title: ReactNode
  support?: ReactNode
  actions?: ReactNode
  note?: ReactNode
  visual?: ReactNode
  /** 홈 전용 중앙 정렬 + 배경 비주얼 */
  center?: boolean
}) {
  const layout = center
    ? 'bl-hero__grid--center'
    : visual
      ? 'bl-hero__grid--split'
      : 'bl-hero__grid--single'

  return (
    <section className={['bl-hero', center ? 'bl-hero--center' : ''].filter(Boolean).join(' ')}>
      {center ? <HeroBackdrop /> : null}
      <Container>
        <div className={['bl-hero__grid', layout].join(' ')}>
          <div className="bl-hero__body">
            {eyebrow ? <span className="bl-eyebrow">{eyebrow}</span> : null}
            <h1 className="bl-h1 bl-hero__title">{title}</h1>
            {support ? <p className="bl-lead bl-hero__support">{support}</p> : null}
            {actions ? <div className="bl-btn-row">{actions}</div> : null}
            {note ? <p className="bl-hero__note">{note}</p> : null}
          </div>
          {!center && visual ? <div className="bl-hero__visual">{visual}</div> : null}
        </div>
      </Container>
    </section>
  )
}
