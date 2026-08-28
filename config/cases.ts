/**
 * 성공사례 Source of Truth
 *
 * ⚠️ 데이터 원칙 (임의로 완화하지 말 것)
 * - 여기 있는 값은 전부 운영자가 사실로 확인해 준 항목이다.
 * - 운영자가 주지 않은 값은 만들지 않는다: 중간 시점의 정확한 순위, 특정 날짜,
 *   CTR, 트래픽, 매출, ROI, 전환수, 평균 상승률.
 * - 중간 단계는 정확한 순위 대신 "구간(range)"으로만 표기한다.
 *   운영자가 사실로 확인한 공통 흐름: 초기 → 4~8페이지권 → 1~2페이지권 → 최종.
 * - Review / AggregateRating 구조화 데이터로 변환하지 않는다 (별점·평점 스팸).
 */

/** 순위 여정의 한 단계. 정확한 순위 숫자를 넣지 않는다. */
export type CaseStage = {
  /** 화면 라벨 */
  label: string
  /** 이 단계가 무엇인지 한 줄 설명 (선택) */
  note?: string
}

export type CaseStudy = {
  id: string
  /** 업종 */
  industry: string
  /** 목표 키워드의 성격 (정확한 키워드는 고객 자산이므로 공개하지 않는다) */
  keywordType: string
  /** 진행 연도 */
  year: string
  /** 시작 시점의 상태 */
  start: string
  /** 최종 도달 지점 */
  result: string
  /** 소요 기간 */
  period: string
  /** 순위 여정 (초기 → 중간 구간 → 최종). 4단계로 통일한다. */
  stages: CaseStage[]
  /**
   * 진행한 작업.
   * ⚠️ 운영자가 사실로 확인해 준 항목만 넣는다. 비어 있으면 카드에 표시되지 않는다.
   * TODO(운영자 입력): 사례별 실제 작업 구성을 확인해 채우면 카드에 자동 노출된다.
   */
  work: string[]
  /** 홈 대표 사례로 노출 */
  featured?: boolean
}

/**
 * 운영자 제공 프로젝트 기록.
 * 순서는 화면 노출 순서와 무관하다 (/cases 는 연도 내림차순으로 정렬한다).
 */
export const PUBLISHED_CASES: CaseStudy[] = [
  {
    id: 'gangnam-clinic',
    industry: '강남 피부과',
    keywordType: '지역 + 진료 키워드',
    year: '2024',
    start: '신규 사이트',
    result: '1위',
    period: '약 8개월',
    stages: [
      { label: '신규 사이트 구축', note: '검색 결과에 노출 이력이 없는 상태에서 시작' },
      { label: '4~8페이지권', note: '색인과 초기 평가가 잡히기 시작한 구간' },
      { label: '1~2페이지권', note: '경쟁 페이지와 같은 무대에 올라온 구간' },
      { label: '최종 1위', note: '목표 키워드 기준' },
    ],
    work: ['신규 사이트 구축'],
    featured: true,
  },
  {
    id: 'busan-massage',
    industry: '부산 마사지',
    keywordType: '지역 + 업종 키워드',
    year: '2026',
    start: '10페이지 밖',
    result: '1페이지',
    period: '약 6개월',
    stages: [
      { label: '10페이지 밖', note: '사실상 검색으로 유입이 없는 상태' },
      { label: '4~8페이지권' },
      { label: '1~2페이지권' },
      { label: '최종 1페이지' },
    ],
    work: [],
    featured: true,
  },
  {
    id: 'sports-live',
    industry: '스포츠중계',
    keywordType: '핵심 키워드',
    year: '2026',
    start: '10페이지 밖',
    result: '1페이지',
    period: '약 6개월',
    stages: [
      { label: '10페이지 밖' },
      { label: '4~8페이지권' },
      { label: '1~2페이지권' },
      { label: '최종 1페이지' },
    ],
    work: [],
  },
  {
    id: 'backlink-own',
    industry: '백링크',
    keywordType: '핵심 키워드',
    year: '2021',
    start: '신규 사이트',
    result: '1페이지',
    period: '약 3개월',
    stages: [
      { label: '신규 사이트', note: '도메인 이력이 없는 상태에서 시작' },
      { label: '4~8페이지권' },
      { label: '1~2페이지권' },
      { label: '최종 1페이지' },
    ],
    work: [],
    featured: true,
  },
  {
    id: 'night-job',
    industry: '밤알바',
    keywordType: '핵심 키워드',
    year: '2025',
    start: '10페이지 밖',
    result: '1~2위',
    period: '약 5개월',
    stages: [
      { label: '10페이지 밖' },
      { label: '4~8페이지권' },
      { label: '1~2페이지권' },
      { label: '최종 1~2위' },
    ],
    work: [],
  },
]

/** 사례 표기의 출처. 화면 하단 각주로 쓴다. */
export const CASE_SOURCE_NOTE = '운영자 제공 프로젝트 기록 기준'

/** 홈에 노출할 대표 사례 */
export function getFeaturedCases(): CaseStudy[] {
  return PUBLISHED_CASES.filter(item => item.featured)
}

/** /cases 전체 목록 — 최근 연도부터 */
export function getAllCases(): CaseStudy[] {
  return [...PUBLISHED_CASES].sort((a, b) => Number(b.year) - Number(a.year))
}

/**
 * 사례를 공개할 때 지키는 기준.
 * 결과만 크게 적는 사례 페이지와의 차이를 만드는 부분이므로 사례가 늘어도 그대로 유지한다.
 */
export const CASE_DISCLOSURE_RULES = [
  {
    title: '중간 순위를 지어내지 않습니다',
    body: '몇 월에 몇 위였는지까지 적으면 그럴듯해 보이지만, 그 숫자를 다시 확인할 방법이 없으면 기록이 아니라 연출입니다. 확인 가능한 것은 시작 상태와 최종 결과, 그리고 그 사이를 지나온 구간뿐이라 그렇게만 적습니다.',
  },
  {
    title: '결과와 조건을 함께 공개합니다',
    body: '업종, 목표 키워드의 성격, 시작 시점의 사이트 상태, 걸린 기간을 함께 적습니다. 같은 "1페이지"라도 신규 사이트에서 3개월과 기존 사이트에서 8개월은 전혀 다른 이야기입니다.',
  },
  {
    title: '트래픽·매출 수치는 쓰지 않습니다',
    body: '방문자 수, 전환수, 매출 증가율은 고객사 내부 데이터라 저희가 검증해 공개할 수 있는 값이 아닙니다. 검증할 수 없는 숫자는 아예 쓰지 않습니다.',
  },
  {
    title: '평균값으로 뭉뚱그리지 않습니다',
    body: '"평균 몇 % 상승" 같은 표현은 표본과 산출식을 밝힐 수 없으면 사용하지 않습니다. 사례는 건별로만 적습니다.',
  },
] as const
