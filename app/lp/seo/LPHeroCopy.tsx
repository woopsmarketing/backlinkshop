'use client'

import { useSearchParams } from 'next/navigation'

type Variant = {
  badge: string
  h1a: string
  h1b: string
  sub: string
}

const VARIANTS: Record<string, Variant> = {
  backlink: {
    badge: '백링크 + SEO 통합 서비스',
    h1a: '백링크 없이는 구글 1페이지,',
    h1b: '절대 올라갈 수 없습니다',
    sub: '경쟁사는 이미 백링크를 쌓고 있습니다. 내 사이트에 뭐가 부족한지, 10분이면 무료로 알 수 있습니다.',
  },
  rank: {
    badge: '구글 상위노출 전문',
    h1a: '지금 이 순간에도',
    h1b: '경쟁사에게 고객을 빼앗기고 있습니다',
    sub: 'SEO 작업, 아직도 안 하고 계신가요? 경쟁사는 현재도 진행 중입니다. 10분 무료 진단으로 격차를 확인하세요.',
  },
  audit: {
    badge: 'SEO 진단·분석 전문',
    h1a: '내 사이트에 치명적 SEO 문제가',
    h1b: '숨어있을 수 있습니다',
    sub: '검색 순위가 안 오르는 진짜 이유, 50개 항목 정밀 분석으로 10분 안에 찾아드립니다.',
  },
  agency: {
    badge: '에이전시·B2B 전용',
    h1a: 'SEO 대행사에 돈만 쓰고',
    h1b: '효과 없었다면, 이유가 있습니다',
    sub: '대행사를 바꿔도 결과가 안 나오는 건, 진단 없이 시작했기 때문입니다. 무료로 문제부터 파악하세요.',
  },
}

const DEFAULT: Variant = VARIANTS.rank

export function LPHeroCopy() {
  const params = useSearchParams()
  const ref = params?.get('ref') || ''
  const variant = VARIANTS[ref] || DEFAULT

  return (
    <>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 text-cyan-400 text-sm font-semibold mb-6">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        {variant.badge}
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
        {variant.h1a}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
          {variant.h1b}
        </span>
      </h1>

      <p className="text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
        {variant.sub}
      </p>
    </>
  )
}
