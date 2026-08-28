import type { CaseStudy } from '@/config/cases'
import { RankJourney } from './RankJourney'

/**
 * 사례 카드 — 결과 하나만 크게 적지 않고 조건을 함께 노출한다.
 * 표시하는 값은 전부 운영자가 확인해 준 항목이다 (config/cases.ts 주석 참고).
 */
export function CaseStudyCard({ study, wide }: { study: CaseStudy; wide?: boolean }) {
  return (
    <article
      className={['bl-case-card', wide ? 'bl-case-card--wide' : ''].filter(Boolean).join(' ')}
    >
      <header className="bl-case-card__head">
        <div>
          <h3 className="bl-case-card__industry">{study.industry}</h3>
          <p className="bl-case-card__keyword">{study.keywordType}</p>
        </div>
        <span className="bl-case-card__year">{study.year}</span>
      </header>

      <dl className="bl-case-card__meta">
        <div>
          <dt>시작</dt>
          <dd>{study.start}</dd>
        </div>
        <div>
          <dt>최종</dt>
          <dd className="bl-case-card__result">{study.result}</dd>
        </div>
        <div>
          <dt>기간</dt>
          <dd>{study.period}</dd>
        </div>
      </dl>

      <RankJourney stages={study.stages} wide={wide} />

      {study.work.length ? (
        <p className="bl-case-card__work">
          <span>진행 작업</span> {study.work.join(' · ')}
        </p>
      ) : null}
    </article>
  )
}
