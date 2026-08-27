/**
 * Hero 비주얼 — SEO 판단 항목을 보여주는 샘플 UI.
 *
 * 중요: 실제 고객 데이터가 아니다. 상단 바에 "예시 화면"임을 명시해
 * 가짜 고객 데이터처럼 읽히지 않게 한다.
 */
const ROWS: { label: string; value: string }[] = [
  { label: '도메인', value: 'example.co.kr' },
  { label: '현재 검색 노출 상태', value: '일부 페이지만 색인' },
  { label: '목표 키워드 경쟁도', value: '상위 노출 사이트 다수' },
  { label: '기존 백링크 프로필', value: '동일 앵커에 집중' },
  { label: '콘텐츠 / 온페이지', value: '검색의도 대비 답이 부족' },
  { label: '필요한 링크 유형', value: '상담 후 결정' },
]

export function SeoStrategyPanel() {
  return (
    <figure className="bl-panel">
      <div className="bl-panel__bar">
        <span>SEO 판단 항목</span>
        <span>예시 화면 · 실제 고객 데이터 아님</span>
      </div>
      <div className="bl-panel__rows">
        {ROWS.map(row => (
          <div key={row.label} className="bl-panel__row">
            <span className="bl-panel__label">{row.label}</span>
            <span className="bl-panel__value">{row.value}</span>
          </div>
        ))}
      </div>
      <figcaption className="bl-panel__foot">
        상담에서는 이 항목들을 실제 사이트 기준으로 하나씩 확인합니다.
      </figcaption>
    </figure>
  )
}
