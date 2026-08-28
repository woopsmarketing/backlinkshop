import type { CaseStage } from '@/config/cases'

/**
 * 순위 여정 — 시작 상태에서 최종 결과까지의 단계를 보여준다.
 *
 * ⚠️ 왜 그래프가 아닌가
 * 정확한 순위 추이 데이터가 없다. Y축 순위 차트를 그리면 없는 데이터를 만들어내는 것이 된다.
 * 그래서 좌표가 아니라 "구간(stage)" 만 표시한다. 마지막 단계만 강조한다.
 */
export function RankJourney({
  stages,
  wide,
}: {
  stages: CaseStage[]
  /** /cases 처럼 넓은 자리에서 가로로 펼칠 때 */
  wide?: boolean
}) {
  return (
    <ol className={['bl-journey', wide ? 'bl-journey--wide' : ''].filter(Boolean).join(' ')}>
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1
        return (
          <li
            key={`${stage.label}-${index}`}
            className={['bl-journey__step', isLast ? 'bl-journey__step--final' : '']
              .filter(Boolean)
              .join(' ')}
          >
            <span className="bl-journey__dot" aria-hidden="true" />
            <span className="bl-journey__label">{stage.label}</span>
            {stage.note ? <span className="bl-journey__note">{stage.note}</span> : null}
          </li>
        )
      })}
    </ol>
  )
}
