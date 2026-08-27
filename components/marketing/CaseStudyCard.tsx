import type { CaseStudy } from '@/config/cases'

/**
 * 사례 카드 — 결과만 보여주지 않고 조건을 함께 노출한다.
 * measurement(측정 기준)가 비어 있으면 before/after 수치를 표시하지 않는다.
 */
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const showDelta = Boolean(study.measurement.trim() && study.before.trim() && study.after.trim())

  return (
    <article className="bl-case">
      <div>
        <p className="bl-related__label">
          {study.industry} · {study.target}
        </p>
        {showDelta ? (
          <p className="bl-case__delta">
            <span>{study.before}</span>
            <span aria-hidden="true">&rarr;</span>
            <span>{study.after}</span>
          </p>
        ) : null}
      </div>

      <dl className="bl-case__dl">
        <div>
          <dt className="bl-case__dt">문제</dt>
          <dd className="bl-case__dd">{study.problem}</dd>
        </div>
        <div>
          <dt className="bl-case__dt">초기 상태</dt>
          <dd className="bl-case__dd">{study.diagnosis}</dd>
        </div>
        <div>
          <dt className="bl-case__dt">판단 근거</dt>
          <dd className="bl-case__dd">{study.reasoning}</dd>
        </div>
        <div>
          <dt className="bl-case__dt">실행</dt>
          <dd className="bl-case__dd">{study.work.join(' · ')}</dd>
        </div>
        <div>
          <dt className="bl-case__dt">기간</dt>
          <dd className="bl-case__dd">{study.period}</dd>
        </div>
        <div>
          <dt className="bl-case__dt">결과 해석</dt>
          <dd className="bl-case__dd">{study.interpretation}</dd>
        </div>
        {study.measurement.trim() ? (
          <div>
            <dt className="bl-case__dt">측정 기준</dt>
            <dd className="bl-case__dd">{study.measurement}</dd>
          </div>
        ) : null}
        <div>
          <dt className="bl-case__dt">한계</dt>
          <dd className="bl-case__dd">{study.caveat}</dd>
        </div>
      </dl>
    </article>
  )
}
