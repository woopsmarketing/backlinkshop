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
    h1a: '백링크만 사면 순위가 오를 거라 들으셨다면,',
    h1b: '백링크가 답이 아닐 수도 있습니다',
    sub: '같은 비용으로 효과를 내는 사이트와 안 나는 사이트의 차이는 백링크 개수가 아닙니다. 어디가 진짜 막혀 있는지 10분 무료로 확인하세요. 회원가입·카드 등록은 없습니다.',
  },
  rank: {
    badge: '구글 상위노출 전문',
    h1a: '광고비 안 쓰고도 매달 문의가 들어오는 구조,',
    h1b: '만들 수 있습니다',
    sub: '내 사이트가 지금 어디가 막혀 있는지 10분 무료 진단으로 확인하세요. 회원가입·카드 등록 없이 이메일만 입력하시면 됩니다.',
  },
  audit: {
    badge: 'SEO 진단·분석 전문',
    h1a: '어디를 고쳐야 매출로 이어지는지,',
    h1b: '50개 항목으로 정확히 짚어드립니다',
    sub: '검색 순위가 안 오르는 원인은 보통 3가지 중 하나입니다. 추측하지 말고 진단부터 받아보세요. 10분이면 충분합니다. 회원가입·카드 등록은 없습니다.',
  },
  agency: {
    badge: '에이전시·B2B 전용',
    h1a: '대행사 비용은 그대로인데 리드가 안 들어온다면,',
    h1b: '시작 지점이 잘못된 겁니다',
    sub: '대행사를 바꾸기 전에, 어디서부터 막혔는지 먼저 확인하세요. 진단 결과를 보면 다음 결정이 명확해집니다. 회원가입·카드 등록은 없습니다.',
  },
}

const DEFAULT: Variant = VARIANTS.rank

export function LPHeroCopy() {
  const params = useSearchParams()
  const ref = params?.get('ref') || ''
  const variant = VARIANTS[ref] || DEFAULT

  return (
    <>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-400/30 text-orange-400 text-sm font-semibold mb-6">
        <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
        {variant.badge}
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
        {variant.h1a}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
          {variant.h1b}
        </span>
      </h1>

      <p className="text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
        {variant.sub}
      </p>
    </>
  )
}
