'use client'

import { useSearchParams } from 'next/navigation'

type Variant = {
  badge: string
  h1a: string
  h1b: string
  sub: string
}

export const VARIANTS: Record<string, Variant> = {
  backlink: {
    badge: '백링크 + SEO 통합 진단',
    h1a: '백링크의 노하우를 나만 안다면',
    h1b: '어떤 일이 벌어질까요?',
    sub: '효과 내는 백링크와 그렇지 않은 백링크의 차이는 "어디에, 어떤 상태에서 쌓느냐"입니다. 구축 전에 내 사이트가 어디가 막혀 있는지 10분 무료로 확인하세요. 회원가입·카드 등록은 없습니다.',
  },
  rank: {
    badge: '구글 상위노출 전문',
    h1a: '구글에 내 사이트가 1위에 있는 삶을 상상해보세요.',
    h1b: '현실로 만들어 드립니다.',
    sub: '내 사이트가 지금 어디서 막혀 순위가 안 오르는지, 10분 무료 진단으로 정확히 확인하세요. 이메일만 입력하면 됩니다. 회원가입·카드 등록 없음.',
  },
  audit: {
    badge: 'SEO 진단·분석 전문',
    h1a: '예쁜 사이트 만들어 놓고 방문자가 없다?',
    h1b: '속은 예쁘지 않기 때문입니다.',
    sub: '어디를 고쳐야 매출로 이어지는지 정확히 알려드립니다. 경쟁사 비교까지 포함해 10분이면 충분합니다. 회원가입·카드 등록은 없습니다.',
  },
  agency: {
    badge: '에이전시·B2B 전용',
    h1a: '실력 좋고 믿을 만한 상위노출 대행사를 찾고 계신가요?',
    h1b: '여러분이 찾는 대행사 30곳이 저희 고객입니다.',
    sub: '대행사를 바꾸기 전에, 어디서부터 막혔는지 데이터로 먼저 확인하세요. 진단 결과를 보면 다음 결정이 명확해집니다. 회원가입·카드 등록은 없습니다.',
  },
  black: {
    badge: '블랙키워드 상위노출 전문',
    h1a: '광고가 막히는 업종일수록,',
    h1b: '검색 상위노출이 유일한 통로입니다',
    sub: '광고 심사가 거절되는 업종은 검색 자연 노출이 매출을 좌우합니다. 어떤 키워드가 가능한지, 내 사이트가 지금 어디서 막혀 있는지 10분 무료 진단으로 확인하세요. 회원가입·카드 등록 없이, 문의 내용은 노출되지 않습니다.',
  },
}

const DEFAULT: Variant = VARIANTS.rank

/**
 * variantKey가 주어지면 그것을 우선 사용(개별 키워드 페이지),
 * 없으면 ?ref= 쿼리로 결정(/lp/seo 통합 페이지 하위호환).
 * 잘 안 읽히는 sub 단락은 렌더하지 않는다(데이터는 보존). 대신 hero가 값 리스트를 노출.
 */
export function LPHeroCopy({
  variantKey,
  theme = 'dark',
}: {
  variantKey?: string
  theme?: 'light' | 'dark'
}) {
  const params = useSearchParams()
  const ref = variantKey || params?.get('ref') || ''
  const variant = VARIANTS[ref] || DEFAULT
  const dark = theme === 'dark'

  return (
    <>
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border text-sm font-semibold mb-5 ${
          dark
            ? 'bg-orange-500/20 border-orange-400/30 text-orange-400'
            : 'bg-orange-100 border-orange-200 text-orange-700'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full animate-pulse ${dark ? 'bg-orange-400' : 'bg-orange-500'}`}
        />
        {variant.badge}
      </div>

      <h1
        className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 ${
          dark ? 'text-white' : 'text-gray-900'
        }`}
      >
        {variant.h1a}
        <br />
        <span
          className={`text-transparent bg-clip-text bg-gradient-to-r ${
            dark ? 'from-orange-400 to-red-400' : 'from-orange-500 to-red-500'
          }`}
        >
          {variant.h1b}
        </span>
      </h1>
    </>
  )
}
