/**
 * 가격 Source of Truth
 *
 * 근거
 * - `scripts/seed-products.js` 와 `scripts/update-product-prices.js` 의 상품 가격표가
 *   서로 완전히 일치한다. 두 파일이 리포지토리 내 유일하게 검증 가능한 가격 원본이다.
 * - 크레딧 환산율: 두 파일 및 `app/credits/components/TopupPackages.tsx` 에서
 *   "1크레딧 = 1원" 으로 명시되어 있다.
 * - `lib/constants.ts` 의 CREDIT_PRICES(300크레딧=10,000원)는 어디에서도 참조되지 않는
 *   레거시 상수이며 위 원본과 모순되므로 가격 표기에 사용하지 않는다.
 *
 * ⚠️ TODO(운영자 확인): 운영 DB(products 테이블)의 실제 가격이 위 스크립트와 다를 수 있다.
 * 배포 전 DB 값과 1회 대조할 것. 대조 결과가 다르면 이 파일만 수정하면 전 페이지에 반영된다.
 */

/** 1 크레딧 = 1 원 */
export const CREDIT_TO_KRW = 1

export function formatKrw(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

export function formatCredits(amount: number): string {
  return `${amount.toLocaleString('ko-KR')} 크레딧`
}

export type PriceItem = {
  name: string
  /** 크레딧 = 원 */
  price: number
  note?: string
}

export type PricingGroup = {
  /** 서비스 slug (config/services.ts 와 1:1) */
  service: 'pbn-backlink' | 'plan-backlink' | 'onpage-seo' | 'content-seo'
  label: string
  /** 이 서비스의 최저 시작가 */
  from: number
  items: PriceItem[]
  /** 이 가격에 포함되는 것 */
  includes: string[]
  /** 이런 경우에 적합 */
  bestFor: string
}

export const PRICING: PricingGroup[] = [
  {
    service: 'pbn-backlink',
    label: 'PBN 백링크',
    from: 300_000,
    items: [
      { name: 'PBN 백링크 50', price: 300_000, note: '작업 기간 7일' },
      { name: 'PBN 백링크 100', price: 570_000, note: '작업 기간 10일' },
      { name: '로직 업그레이드 PBN 50', price: 800_000, note: '고유 도메인 사용 · 10일' },
      { name: '로직 업그레이드 PBN 100', price: 1_500_000, note: '콘텐츠 업데이트 포함 · 14일' },
      { name: '로직 업그레이드 PBN 200', price: 2_500_000, note: '작업 기간 21일' },
      { name: '로직 업그레이드 PBN 500', price: 4_500_000, note: '초고경쟁 키워드 · 30일' },
    ],
    includes: [
      '자체 운영 PBN 도메인에서의 링크 구축',
      '앵커 텍스트 분산 설계',
      '작업 URL·앵커텍스트가 포함된 작업 내역 리포트',
    ],
    bestFor: '경쟁이 심한 키워드에서 더 강한 신호가 필요할 때',
  },
  {
    service: 'plan-backlink',
    label: '플랜 백링크',
    from: 200_000,
    items: [
      { name: '플랜 백링크 20', price: 200_000, note: '작업 기간 5일' },
      { name: '플랜 백링크 B', price: 600_000, note: '작업 기간 10일' },
      { name: '플랜 백링크 A', price: 1_150_000, note: '작업 기간 14일' },
      { name: '플랜 백링크 S', price: 2_100_000, note: '고경쟁 키워드 · 21일' },
    ],
    includes: ['여러 백링크 유형의 조합 설계', '메인·서브 키워드 비율 구성', '작업 내역 리포트'],
    bestFor: '무엇부터 해야 할지 모르겠고, 링크 프로필을 균형 있게 만들고 싶을 때',
  },
  {
    service: 'onpage-seo',
    label: '온페이지 SEO',
    from: 200_000,
    items: [{ name: '온페이지 SEO 점검', price: 200_000, note: '리포트 제공까지 3일' }],
    includes: [
      '메타 정보·헤딩 구조·색인 상태 점검',
      '검색의도 대비 페이지 구성 진단',
      '우선순위가 정리된 수정 권고 리포트',
    ],
    bestFor: '링크를 늘렸는데도 순위가 그대로일 때',
  },
  {
    service: 'content-seo',
    label: '콘텐츠 SEO',
    from: 300_000,
    items: [{ name: '콘텐츠 최적화 패키지', price: 300_000, note: '작업 기간 4일' }],
    includes: [
      '타깃 키워드의 검색의도 정의',
      '문서 구조(헤딩·커버리지) 재설계',
      '기존 콘텐츠 수정안',
    ],
    bestFor: '글은 있는데 검색 노출로 이어지지 않을 때',
  },
]

export function getPricingGroup(service: PricingGroup['service']): PricingGroup | undefined {
  return PRICING.find(group => group.service === service)
}

/**
 * 산문(블로그 본문·요약)에서 쓰는 시작가 표기.
 * 글 안에 금액을 직접 적어두면 이 파일을 고쳐도 본문이 남아 /pricing 과 어긋난다.
 * 그래서 콘텐츠에서도 숫자는 여기서만 가져온다.
 */
export function startingPrice(service: PricingGroup['service']): string {
  const group = getPricingGroup(service)
  return group ? formatKrw(group.from) : ''
}

export function startingCredits(service: PricingGroup['service']): string {
  const group = getPricingGroup(service)
  return group ? formatCredits(group.from) : ''
}

/**
 * 가격이 달라지는 이유. /pricing 과 각 서비스 페이지에서 공용으로 쓴다.
 */
export const PRICE_FACTORS = [
  {
    title: '키워드 경쟁도',
    body: '같은 업종이라도 이미 상위에 있는 사이트가 얼마나 강한지에 따라 필요한 작업량이 달라집니다.',
  },
  {
    title: '목표 페이지',
    body: '홈으로 올릴지 상세 페이지로 올릴지에 따라 링크를 받아야 할 대상과 구조가 달라집니다.',
  },
  {
    title: '도메인 상태',
    body: '기존 링크 프로필과 사이트 연차에 따라 새 링크가 필요한 양이 달라집니다.',
  },
  {
    title: '필요한 링크 유형',
    body: 'PBN이 필요한 경우와 유형 조합이 필요한 경우의 단가가 다릅니다.',
  },
  {
    title: '작업 범위',
    body: '링크만 진행할지, 온페이지·콘텐츠까지 함께 볼지에 따라 범위가 달라집니다.',
  },
] as const
