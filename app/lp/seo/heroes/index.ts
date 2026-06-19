// 키워드(광고그룹)별 hero 레지스트리.
// 각 키워드는 고유 hero 컴포넌트 + 테마를 가진다. 본문 섹션은 theme만 받아 공유된다.
// 라이트: backlink·audit·agency / 다크: rank·black
// hero 분기를 점진적으로 추가하는 동안은 전부 LPHero(다크 base)를 가리킨다.
import type { ComponentType } from 'react'
import type { LPTheme } from '../LandingBody'
import { LPHero } from '../LPHero'
import { LPHeroAi } from '../LPHeroAi'

export type HeroConfig = {
  theme: LPTheme
  Hero: ComponentType<{ variantKey?: string; theme?: LPTheme }>
}

export const HEROES: Record<string, HeroConfig> = {
  backlink: { theme: 'light', Hero: LPHero },
  audit: { theme: 'light', Hero: LPHero },
  agency: { theme: 'light', Hero: LPHero },
  rank: { theme: 'dark', Hero: LPHero },
  black: { theme: 'dark', Hero: LPHero },
  ai: { theme: 'dark', Hero: LPHeroAi },
}

const DEFAULT_KEY = 'rank'

export function resolveHero(keyword?: string): HeroConfig {
  return (keyword && HEROES[keyword]) || HEROES[DEFAULT_KEY]
}
