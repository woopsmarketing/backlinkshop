/**
 * 서비스 메타데이터 Source of Truth
 *
 * 각 서비스의 slug / URL / 표시명 / 요약 / 적합 상황을 한 곳에서 관리한다.
 * Header 드롭다운, Footer, /services 허브, Situation Selector, ServiceSchema가 모두 이 값을 쓴다.
 */

export type ServiceSlug = 'pbn-backlink' | 'plan-backlink' | 'onpage-seo' | 'content-seo'

export type Service = {
  slug: ServiceSlug
  href: string
  /** 네비게이션·카드에 쓰는 짧은 이름 */
  name: string
  /** 페이지 H1에 쓰는 정식 명칭 */
  title: string
  /** 한 줄 요약 (카드 본문) */
  summary: string
  /** 이 서비스가 답하는 상황 (Situation Selector) */
  situation: string
  /** 카드에 노출할 핵심 포인트 3개 */
  points: string[]
  /** 홈 서비스 섹션에서 시각적으로 크게 다룰지 */
  primary?: boolean
}

export const SERVICES: Service[] = [
  {
    slug: 'pbn-backlink',
    href: '/services/pbn-backlink',
    name: 'PBN 백링크',
    title: 'PBN 백링크',
    summary:
      '자체 운영 네트워크에서 링크를 구축합니다. 강도가 높은 만큼 어떤 사이트에나 권하지는 않습니다.',
    situation: '경쟁 키워드를 공략하고 싶어요',
    points: ['자체 운영 도메인에서 구축', '앵커 분산 설계', '작업 URL 리포트 제공'],
    primary: true,
  },
  {
    slug: 'plan-backlink',
    href: '/services/plan-backlink',
    name: '플랜 백링크',
    title: '플랜 백링크',
    summary:
      '하나의 상품 대신 여러 링크 유형의 조합을 설계합니다. 어디서 시작할지 모를 때 기준을 잡는 방식입니다.',
    situation: '무엇부터 해야 할지 모르겠어요',
    points: ['유형 조합 설계', '키워드 비율 구성', '단계적 확장 가능'],
  },
  {
    slug: 'onpage-seo',
    href: '/services/onpage-seo',
    name: '온페이지 SEO',
    title: '온페이지 SEO',
    summary:
      '링크를 받기 전에 페이지가 순위를 받을 준비가 되어 있는지 점검합니다. 링크를 늘려도 안 오를 때 먼저 보는 영역입니다.',
    situation: '링크를 했는데 순위가 안 올라요',
    points: ['검색의도·구조 점검', '색인 상태 확인', '우선순위 수정 리포트'],
  },
  {
    slug: 'content-seo',
    href: '/services/content-seo',
    name: '콘텐츠 SEO',
    title: '콘텐츠 SEO',
    summary:
      '키워드를 반복하는 작업이 아니라, 검색한 사람이 원하는 답을 담도록 문서 구조를 다시 만듭니다.',
    situation: '콘텐츠 자체가 약한 것 같아요',
    points: ['검색의도 정의', '문서 구조 재설계', '기존 글 수정안'],
  },
]

export function getService(slug: ServiceSlug): Service | undefined {
  return SERVICES.find(service => service.slug === slug)
}

/**
 * Situation Selector — "지금 가장 가까운 상황을 선택하세요"
 * 서비스 4종 + 백링크 업체 판단 기준으로 가는 경로를 함께 제공한다.
 */
export const SITUATIONS: { label: string; href: string; hint: string }[] = [
  {
    label: '사이트 권위를 높이고 싶어요',
    href: '/backlink',
    hint: '백링크가 무엇을 바꾸는지부터 정리했습니다',
  },
  {
    label: '경쟁 키워드를 공략하고 싶어요',
    href: '/services/pbn-backlink',
    hint: 'PBN이 필요한 상황인지 판단 기준을 봅니다',
  },
  {
    label: '무엇부터 해야 할지 모르겠어요',
    href: '/services/plan-backlink',
    hint: '조합을 먼저 설계하는 방식입니다',
  },
  {
    label: '링크를 했는데 순위가 안 올라요',
    href: '/services/onpage-seo',
    hint: '페이지가 순위를 받을 준비가 됐는지 봅니다',
  },
  {
    label: '콘텐츠 자체가 약한 것 같아요',
    href: '/services/content-seo',
    hint: '검색의도에 맞는 구조로 다시 만듭니다',
  },
]

/**
 * 공통 진행 프로세스.
 * 홈 · /services · 각 서비스 페이지가 같은 원본을 사용한다.
 */
export const PROCESS_STEPS = [
  {
    step: '01',
    title: '사이트와 목표 확인',
    body: '도메인, 목표 키워드, 지금까지 해온 작업을 먼저 듣습니다.',
  },
  {
    step: '02',
    title: '현재 SEO 상태 판단',
    body: '검색 노출 상태, 기존 링크 프로필, 온페이지 구성을 함께 봅니다.',
  },
  {
    step: '03',
    title: '필요한 작업 구성',
    body: '무엇이 부족한지에 따라 링크·온페이지·콘텐츠 중 필요한 것만 구성합니다.',
  },
  {
    step: '04',
    title: '실행',
    body: '합의된 범위대로 작업을 진행합니다.',
  },
  {
    step: '05',
    title: '결과 및 작업 내역 공유',
    body: '무엇을 했는지 확인할 수 있도록 작업 내역과 이후 방향을 공유합니다.',
  },
] as const

/**
 * 순위를 움직이는 4가지 요소. 홈 Diagnosis 섹션과 /google-ranking 이 공유한다.
 */
export const RANKING_FACTORS = [
  {
    key: 'content',
    label: 'Content',
    title: '콘텐츠',
    body: '검색한 사람이 찾던 답이 페이지 안에 있는지. 여기가 비어 있으면 링크를 더해도 잘 움직이지 않습니다.',
  },
  {
    key: 'onpage',
    label: 'On-page',
    title: '온페이지',
    body: '제목·헤딩·내부링크·색인 상태처럼 페이지가 평가받을 준비가 되어 있는지.',
  },
  {
    key: 'authority',
    label: 'Authority',
    title: '권위',
    body: '외부에서 이 사이트를 얼마나, 어떤 맥락으로 참조하는지. 백링크가 다루는 영역입니다.',
  },
  {
    key: 'competition',
    label: 'Competition',
    title: '경쟁 강도',
    body: '같은 키워드에서 이미 상위에 있는 사이트가 얼마나 강한지. 필요한 작업량을 결정합니다.',
  },
] as const
