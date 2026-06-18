// 키워드별 개별 LP. /lp/backlink · /lp/rank · /lp/audit · /lp/agency
// 카피는 키워드별로, 디자인은 ?theme=dark 로 라이트/다크 A/B.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LandingBody, type LPTheme } from '../seo/LandingBody'
import { VARIANTS } from '../seo/LPHeroCopy'

// 동적 렌더: ?theme=dark 가 요청마다 반영되도록 + 엣지 네거티브(404) 캐시 우회.
export const dynamic = 'force-dynamic'

const META: Record<string, { title: string; description: string }> = {
  backlink: {
    title: '백링크 효과·구축 전 진단 | 백링크샵',
    description:
      '백링크는 분명 효과가 있습니다. 단, 아무 데나 쌓으면 돈만 나갑니다. 구축 전에 내 사이트가 어디가 막혔는지 10분 무료로 확인하세요.',
  },
  rank: {
    title: '구글 상위노출 무료 진단 | 백링크샵',
    description:
      '광고를 꺼도 검색만으로 매달 문의가 들어오게. 순위가 안 오르는 진짜 이유를 10분 무료 진단으로 확인하세요.',
  },
  audit: {
    title: 'SEO 무료진단·분석 | 백링크샵',
    description:
      '순위가 안 오르는 원인은 보통 3가지 중 하나입니다. 추측 말고 50개 항목 + 경쟁사 비교로 정확히 짚어드립니다.',
  },
  agency: {
    title: 'SEO 대행사 비교 전 무료 진단 | 백링크샵',
    description:
      '대행사 비용은 그대로인데 리드가 안 들어온다면, 어디서부터 막혔는지 데이터로 먼저 확인하세요.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ keyword: string }>
}): Promise<Metadata> {
  const { keyword } = await params
  const m = META[keyword] ?? META.rank
  return { title: m.title, description: m.description, robots: { index: false, follow: false } }
}

export default async function LPKeywordPage({
  params,
  searchParams,
}: {
  params: Promise<{ keyword: string }>
  searchParams: Promise<{ theme?: string }>
}) {
  const { keyword } = await params
  if (!VARIANTS[keyword]) notFound()
  const sp = await searchParams
  const theme: LPTheme = sp?.theme === 'dark' ? 'dark' : 'light'
  return <LandingBody variantKey={keyword} theme={theme} />
}
