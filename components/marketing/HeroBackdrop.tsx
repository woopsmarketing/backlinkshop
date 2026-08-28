/**
 * Hero 배경 비주얼
 *
 * 의도
 * - 홈 Hero 가 1단 중앙 정렬로 바뀌면서 우측이 비었다. 가짜 대시보드 패널 대신
 *   "검색 노출이 장기간 올라가는 흐름"을 추상적인 곡선으로만 표현한다.
 * - 주식 차트처럼 보이면 안 되므로 눈금·수치·축 라벨을 넣지 않는다.
 * - 실제 데이터가 아니므로 어떤 숫자도 표시하지 않는다.
 * - 곡선은 Hero 하단 영역에만 머문다. 제목·본문 위를 가로지르면 배경이 아니라 방해물이 된다.
 *
 * 구현
 * - CSS + SVG 만 사용한다 (애니메이션 라이브러리 추가 금지).
 * - 선 그리기 애니메이션은 stroke-dasharray 로 처리하고 prefers-reduced-motion 에서 끈다.
 * - 모바일에서는 CSS 가 그리드와 데이터 포인트를 줄인다.
 */

/** 곡선 위 데이터 포인트 좌표 (곡선 경로와 같은 좌표계) */
const POINTS = [
  [232, 372],
  [452, 330],
  [668, 278],
  [884, 216],
  [1092, 166],
] as const

export function HeroBackdrop() {
  return (
    <div className="bl-hero__backdrop" aria-hidden="true">
      <svg
        className="bl-hero__svg"
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMax slice"
        focusable="false"
      >
        <defs>
          <pattern id="bl-hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0H0v60" fill="none" stroke="var(--brand)" strokeWidth="1" opacity="0.07" />
          </pattern>

          <linearGradient id="bl-hero-stroke" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.25" />
            <stop offset="55%" stopColor="var(--brand)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="bl-hero-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="bl-hero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect className="bl-hero__grid" width="1200" height="420" fill="url(#bl-hero-grid)" />

        <ellipse cx="960" cy="130" rx="380" ry="230" fill="url(#bl-hero-glow)" />

        <path
          className="bl-hero__area"
          d="M20 396 C 150 390 210 372 340 356 S 470 336 560 306 S 700 292 790 250 S 930 222 1010 186 S 1130 162 1180 150 L 1180 420 L 20 420 Z"
          fill="url(#bl-hero-fill)"
        />

        <path
          className="bl-hero__line"
          d="M20 396 C 150 390 210 372 340 356 S 470 336 560 306 S 700 292 790 250 S 930 222 1010 186 S 1130 162 1180 150"
          fill="none"
          stroke="url(#bl-hero-stroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <g className="bl-hero__dots">
          {POINTS.map(([cx, cy], index) => (
            <g key={`${cx}-${cy}`} style={{ ['--i' as string]: index }}>
              <circle className="bl-hero__halo" cx={cx} cy={cy} r="9" fill="var(--brand)" />
              <circle className="bl-hero__dot" cx={cx} cy={cy} r="3.5" fill="var(--brand)" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
