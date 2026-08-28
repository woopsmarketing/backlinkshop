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
  /** 카드 아이콘 (components/ui/Icon.tsx 의 IconName) */
  icon: string
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
    icon: 'network',
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
    icon: 'layers',
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
    icon: 'gauge',
    summary:
      '링크를 받기 전에 페이지가 순위를 받을 준비가 되어 있는지 점검합니다. 속도와 Core Web Vitals부터 사이트 구조·내부링크·색인 상태·메타데이터까지 함께 봅니다.',
    situation: '링크를 했는데 순위가 안 올라요',
    points: ['속도·Core Web Vitals 점검', '구조·내부링크·크롤 경로 정리', '색인·메타데이터 수정안'],
  },
  {
    slug: 'content-seo',
    href: '/services/content-seo',
    name: '콘텐츠 SEO',
    title: '콘텐츠 SEO',
    icon: 'file',
    summary:
      '키워드를 반복하는 작업이 아니라, 검색한 사람이 원하는 답을 담도록 문서 구조를 다시 만듭니다.',
    situation: '콘텐츠 자체가 약한 것 같아요',
    points: ['검색의도 정의', '문서 구조 재설계', '기존 글 수정안'],
  },
]

/**
 * 온페이지 SEO 점검 범위.
 * 카드 요약과 서비스 상세 설명이 갈라지지 않도록 목록은 여기 한 곳에만 둔다.
 *
 * ⚠️ footprint 는 검색엔진 탐지 회피나 은폐를 뜻하지 않는다.
 * 여러 사이트를 운영할 때 생기는 기술적 중복과 사이트 품질 위험 요소를 점검한다는 의미다.
 */
export const ONPAGE_SCOPE = [
  {
    title: '사이트 속도 · Core Web Vitals',
    body: '실제 사용자가 체감하는 로딩과 반응 속도를 측정합니다.',
  },
  {
    title: '페이지 구조 · 헤딩',
    body: '문서가 무엇에 대한 페이지인지 구조만 봐도 드러나는지 확인합니다.',
  },
  { title: '사이트 구조 · IA', body: '중요한 페이지가 몇 번의 이동으로 도달되는지 봅니다.' },
  {
    title: '내부링크 설계 · 크롤 경로',
    body: '밖에서 받은 신호가 목표 페이지까지 흐르는 경로가 있는지 확인합니다.',
  },
  {
    title: '색인 상태 (Indexability)',
    body: '색인되지 않은 페이지에는 순위 자체가 존재하지 않습니다.',
  },
  {
    title: 'Canonical · 리다이렉트',
    body: '같은 콘텐츠가 여러 주소로 평가가 갈리지 않게 정리합니다.',
  },
  { title: 'Sitemap · robots', body: '크롤러에게 무엇을 보여주고 무엇을 막고 있는지 점검합니다.' },
  {
    title: '메타데이터 · 구조화 데이터',
    body: '검색 결과에 표시되는 정보가 실제 페이지와 일치하는지 봅니다.',
  },
  { title: '콘텐츠 구조', body: '검색 의도에 맞는 순서로 답이 배치되어 있는지 확인합니다.' },
  {
    title: '기술적 중복 · 품질 위험',
    body: '여러 사이트를 운영할 때 생기는 중복과 품질 위험 요소를 점검합니다.',
  },
  { title: '모바일 사용성', body: '실제 사용 환경에서 읽고 조작할 수 있는 상태인지 확인합니다.' },
] as const

export function getService(slug: ServiceSlug): Service | undefined {
  return SERVICES.find(service => service.slug === slug)
}

/**
 * 상담으로만 진행하는 서비스.
 *
 * ⚠️ 전용 랜딩 페이지를 만들지 않는다.
 * 검색 수요가 확인되지 않은 키워드로 얇은 페이지를 늘리면 사이트 전체 품질이 내려간다.
 * 카드 + 상담 CTA 형태로만 노출하고, 문맥이 맞는 기존 페이지로 연결한다.
 */
export type ConsultService = {
  key: string
  name: string
  icon: string
  summary: string
  /** 문맥상 이어지는 기존 페이지 (없으면 상담만) */
  relatedHref?: string
  relatedLabel?: string
}

export const CONSULT_SERVICES: ConsultService[] = [
  {
    key: 'pbn-custom',
    name: 'PBN 커스텀 구축',
    icon: 'wrench',
    summary:
      '공용 네트워크가 아니라 해당 사이트만을 위한 네트워크를 설계하고 구축합니다. 주제·도메인 이력·구조를 목표 키워드에 맞춰 처음부터 구성합니다.',
    relatedHref: '/services/pbn-backlink',
    relatedLabel: 'PBN 백링크가 어떻게 구성되는지 보기',
  },
  {
    key: 'domain-research',
    name: '만료·경매 도메인 리서치',
    icon: 'clock',
    summary:
      '만료되거나 경매에 나온 도메인의 과거 이력을 확인합니다. 이어받을 수 있는 이력과 오히려 부담이 되는 이력을 구분해 후보를 정리합니다.',
  },
  {
    key: 'seo-hosting',
    name: 'SEO 호스팅',
    icon: 'server',
    summary:
      '여러 사이트를 운영할 때 호스팅 구성이 남기는 기술적 중복 위험을 줄이는 방향으로 환경을 구성합니다.',
  },
]

/**
 * 홈 "현재 상황" 섹션 질문.
 * 공포 마케팅 대신 실제로 자주 듣는 상황만 적는다.
 */
export const HOME_QUESTIONS = [
  {
    icon: 'search',
    question: '백링크 작업을 했는데도 검색 노출이 그대로인가요?',
    body: '링크를 늘렸는데 순위가 움직이지 않는다면 원인이 다른 곳에 있을 수 있습니다.',
  },
  {
    icon: 'activity',
    question: '알고리즘 업데이트마다 순위가 크게 흔들리나요?',
    body: '외부 신호에만 기대고 있는 사이트일수록 변동 폭이 커집니다.',
  },
  {
    icon: 'target',
    question: '경쟁이 심한 키워드에서 더 이상 올라가지 않나요?',
    body: '상위 페이지와의 차이가 링크가 아닌 다른 조건에서 벌어지고 있을 수 있습니다.',
  },
  {
    icon: 'compass',
    question: '어떤 SEO 작업부터 해야 할지 기준이 없으신가요?',
    body: '순서를 정하지 못한 채 작업을 늘리면 무엇이 효과였는지도 알 수 없습니다.',
  },
] as const

/**
 * 순위를 움직이는 4가지 조건. 홈 "문제 진단" 섹션과 /google-ranking 이 공유한다.
 */
export const RANKING_FACTORS = [
  {
    key: 'content',
    icon: 'file',
    title: '콘텐츠',
    body: '검색한 사람이 찾던 답을 페이지가 충분히 제공하는가. 여기가 비어 있으면 링크를 더해도 잘 움직이지 않습니다.',
  },
  {
    key: 'structure',
    icon: 'sitemap',
    title: '사이트 구조',
    body: '검색엔진과 사용자가 중요 페이지에 쉽게 도달할 수 있는가. 내부 경로가 막혀 있으면 받은 신호가 목표 페이지까지 흐르지 않습니다.',
  },
  {
    key: 'authority',
    icon: 'link',
    title: '외부 권위',
    body: '사이트 주제와 관련성 있는 외부 신호가 필요한 수준인지. 백링크가 다루는 영역입니다.',
  },
  {
    key: 'competition',
    icon: 'target',
    title: '경쟁 환경',
    body: '현재 상위 페이지와 어떤 차이가 존재하는지. 필요한 작업의 양과 순서를 여기서 결정합니다.',
  },
] as const

/**
 * 홈 "전략 선택" 섹션.
 * 상황 → 추천 전략 → 이유 → 해당 페이지. 짧은 버튼 목록 대신 판단 근거까지 함께 준다.
 */
export type StrategyCard = {
  icon: string
  /** 사용자 상황 */
  situation: string
  /** 추천 전략 */
  strategy: string
  /** 왜 그 전략인지 */
  reason: string
  href: string
  linkLabel: string
}

export const HOME_STRATEGIES: StrategyCard[] = [
  {
    icon: 'link',
    situation: '사이트 권위를 높이고 싶다면',
    strategy: '백링크 전략',
    reason: '관련성과 품질을 기준으로 지금 필요한 외부 신호를 구성합니다.',
    href: '/backlink',
    linkLabel: '백링크 전략 보기',
  },
  {
    icon: 'network',
    situation: '경쟁 키워드를 공략하고 싶다면',
    strategy: 'PBN 전략',
    reason: '경쟁 환경과 현재 도메인 상태를 먼저 판단한 뒤 접근합니다.',
    href: '/services/pbn-backlink',
    linkLabel: 'PBN 자세히 보기',
  },
  {
    icon: 'layers',
    situation: '무엇부터 해야 할지 모르겠다면',
    strategy: '맞춤형 플랜',
    reason: '하나의 상품이 아니라 지금 필요한 작업의 우선순위를 구성합니다.',
    href: '/services/plan-backlink',
    linkLabel: '플랜 구성 보기',
  },
  {
    icon: 'gauge',
    situation: '백링크를 했는데도 안 오른다면',
    strategy: '온페이지 SEO',
    reason: '페이지 구조와 내부링크, 기술적인 병목부터 확인합니다.',
    href: '/services/onpage-seo',
    linkLabel: '점검 항목 보기',
  },
  {
    icon: 'file',
    situation: '콘텐츠가 약하다면',
    strategy: '콘텐츠 SEO',
    reason: '검색 의도와 콘텐츠 구조부터 다시 설계합니다.',
    href: '/services/content-seo',
    linkLabel: '콘텐츠 SEO 보기',
  },
  {
    icon: 'trending',
    situation: '어디가 막혀 있는지부터 알고 싶다면',
    strategy: '구글 상위노출 진단',
    reason: '증상에 따라 먼저 볼 곳이 다릅니다. 원인을 좁히는 순서를 정리했습니다.',
    href: '/google-ranking',
    linkLabel: '진단 순서 보기',
  },
]

/**
 * Situation Selector — 하위 페이지에서 계속 사용한다 (홈은 StrategyCard 로 대체).
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
