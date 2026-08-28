import { EXPERIENCE_ERAS, PLATFORM_REFS, type ExperienceEra } from '@/config/experience'

/**
 * 검색 환경 변화 타임라인.
 *
 * - 데스크톱: 3열 그리드 + 연결선. 모바일: 좌측 레일 세로 타임라인 (CSS 에서 전환).
 * - 플랫폼 항목에는 운영자 요청대로 외부 링크에 rel="nofollow noopener noreferrer" 를 붙인다.
 *   PLATFORM_REFS 의 href 가 비어 있으면 링크가 아니라 텍스트로 렌더링한다
 *   (확인되지 않은 도메인으로 링크하지 않기 위해).
 */
function PlatformRefs() {
  return (
    <span className="bl-timeline__refs">
      {PLATFORM_REFS.map((ref, index) => (
        <span key={ref.name}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {ref.href ? (
            <a href={ref.href} target="_blank" rel="nofollow noopener noreferrer">
              {ref.name}
            </a>
          ) : (
            <span>{ref.name}</span>
          )}
        </span>
      ))}
    </span>
  )
}

export function ExperienceTimeline({ eras = EXPERIENCE_ERAS }: { eras?: ExperienceEra[] }) {
  return (
    <ol className="bl-timeline">
      {eras.map((era, index) => (
        <li key={era.key} className="bl-timeline__item">
          <span className="bl-timeline__dot" aria-hidden="true" />
          <span className="bl-timeline__label">
            <span className="bl-timeline__index">{String(index + 1).padStart(2, '0')}</span>
            {era.label}
          </span>
          <h3 className="bl-timeline__title">{era.title}</h3>
          <p className="bl-timeline__body">
            {era.body}
            {era.key === 'platform' ? (
              <>
                {' '}
                직접 다뤄본 플랫폼: <PlatformRefs />
              </>
            ) : null}
          </p>
        </li>
      ))}
    </ol>
  )
}
