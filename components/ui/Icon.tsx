/**
 * 아이콘 시스템
 *
 * 왜 직접 그리는가
 * - 시스템 Emoji 는 OS 마다 렌더링이 달라 브랜드 화면이 기기별로 다르게 보인다.
 * - 아이콘 라이브러리를 추가하면 이 정도 개수 때문에 번들과 의존성이 늘어난다.
 * 그래서 24x24 stroke 그리드로 통일한 인라인 SVG 한 벌만 유지한다.
 *
 * 사용 규칙
 * - 장식용이므로 기본 aria-hidden. 의미를 전달해야 하면 title 을 넘긴다.
 * - 색은 currentColor 를 따른다. 크기는 CSS(.bl-icon)에서 통제한다.
 */
import type { SVGProps } from 'react'

const P = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 21 21" />
    </>
  ),
  activity: <polyline points="3 12 7 12 10 4.5 14 19.5 17 12 21 12" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8l-2.2 5.8L8 16l2.2-5.8z" />
    </>
  ),
  file: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <polyline points="14 3 14 8 19 8" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  sitemap: (
    <>
      <rect x="9" y="3" width="6" height="4.5" rx="1" />
      <rect x="2.5" y="16.5" width="6" height="4.5" rx="1" />
      <rect x="15.5" y="16.5" width="6" height="4.5" rx="1" />
      <path d="M12 7.5v4M5.5 16.5v-2.5h13v2.5" />
    </>
  ),
  link: (
    <>
      <path d="M10.5 13.5a4.5 4.5 0 0 0 6.36 0l2.5-2.5a4.5 4.5 0 0 0-6.36-6.36l-1.4 1.4" />
      <path d="M13.5 10.5a4.5 4.5 0 0 0-6.36 0l-2.5 2.5a4.5 4.5 0 0 0 6.36 6.36l1.4-1.4" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="4.5" r="2.2" />
      <circle cx="4.8" cy="19" r="2.2" />
      <circle cx="19.2" cy="19" r="2.2" />
      <path d="M12 6.7v4.6M12 11.3 6.2 17.3M12 11.3l5.8 6" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 21 8l-9 5-9-5z" />
      <polyline points="3.4 12.4 12 17.2 20.6 12.4" />
      <polyline points="3.4 16.4 12 21.2 20.6 16.4" />
    </>
  ),
  gauge: (
    <>
      <path d="M3.5 18a8.5 8.5 0 1 1 17 0" />
      <path d="M12 18 16.2 11.4" />
      <circle cx="12" cy="18" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.6 3.9 5.6 3.9 9S14.6 18.4 12 21c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5.5" r="2.4" />
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="18.5" r="2.4" />
      <path d="M8.2 10.8 15.8 6.7M8.2 13.2l7.6 4.1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 6.8 12 12.3 15.6 14.2" />
    </>
  ),
  wrench: (
    <>
      <path d="M15.6 3.6a5.5 5.5 0 0 0-7.1 6.8L3 15.9 8.1 21l5.5-5.5a5.5 5.5 0 0 0 6.8-7.1l-3.2 3.2-2.9-.7-.7-2.9z" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="6.5" rx="1.5" />
      <rect x="3" y="13.5" width="18" height="6.5" rx="1.5" />
      <path d="M7 7.2h.01M7 16.8h.01" />
    </>
  ),
  trending: (
    <>
      <polyline points="3 17.5 9.2 11 13 14.6 21 6.5" />
      <polyline points="15.2 6.5 21 6.5 21 12.2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 20 6v5.6c0 4.8-3.3 8.2-8 9.4-4.7-1.2-8-4.6-8-9.4V6z" />
      <polyline points="9 12 11.2 14.2 15.4 10" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.7-5.6 6-5.6s6 2.3 6 5.6" />
      <path d="M16.2 5.2a3.2 3.2 0 0 1 0 6.1M17.5 14.9c2 .7 3.4 2.6 3.4 5.1" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h16" />
      <path d="M8.5 16.5v-4M12.5 16.5v-8M16.5 16.5v-5.5" />
    </>
  ),
  check: <polyline points="4.5 12.5 9.5 17.5 19.5 6.5" />,
  alert: (
    <>
      <path d="M12 4 21 19.5H3z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8.5 3v4M15.5 3v4" />
    </>
  ),
  map: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  pen: (
    <>
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8.5 17.5 4 19l1.5-4.5z" />
      <path d="M14.5 5.5 17.5 8.5" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.5 13.9 9l5.6 2-5.6 2-1.9 5.5L10.1 13 4.5 11l5.6-2z" />
    </>
  ),
} as const

export type IconName = keyof typeof P

export function isIconName(name: string): name is IconName {
  return name in P
}

export function Icon({
  name,
  title,
  className,
  ...rest
}: { name: string; title?: string } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  const path = isIconName(name) ? P[name] : P.spark

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={['bl-icon', className ?? ''].filter(Boolean).join(' ')}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {path}
    </svg>
  )
}

/** 아이콘을 담는 작은 브랜드 서피스. 카드 좌상단에 쓴다. */
export function IconSurface({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <span
      className={['bl-icon-surface', `bl-icon-surface--${size}`, className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <Icon name={name} />
    </span>
  )
}
