/**
 * Stat — 값 하나를 보여주는 표면.
 *
 * 규칙: source 없이 성과 수치를 넣지 않는다. 산출 근거를 댈 수 없는 숫자는 이 컴포넌트로 표시하지 않는다.
 */
export function Stat({
  value,
  label,
  source,
}: {
  value: string
  label: string
  /** 이 값의 산출 기준 (기간·표본·측정 도구). 근거를 적을 수 없으면 값을 게시하지 않는다. */
  source?: string
}) {
  return (
    <div className="bl-stat">
      <p className="bl-stat__value">{value}</p>
      <p className="bl-stat__label">{label}</p>
      {source ? <p className="bl-stat__source">{source}</p> : null}
    </div>
  )
}
