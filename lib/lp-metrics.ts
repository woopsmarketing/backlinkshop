/**
 * LP 결과 페이지에서 ParsedSeo 결과를 "요약 카드" 배열로 변환하는 유틸.
 *
 * React 렌더 로직과 분리해 단위 테스트로 경계 조건을 검증한다.
 */

export type MetricLevel = 'good' | 'warn' | 'bad' | 'neutral'

export type Metric = {
  label: string
  value: string
  hint?: string
  level: MetricLevel
}

export type ParsedFields = {
  title?: string | null
  titleLength?: number
  metaDescription?: string | null
  metaDescriptionLength?: number
  h1?: string[]
  imgTotal?: number
  imgWithoutAlt?: number
  wordCount?: number
  loadTimeMs?: number
  isHttps?: boolean
  hasViewport?: boolean
  hasStructuredData?: boolean
  structuredDataTypes?: string[]
  internalLinks?: number
  externalLinks?: number
  hasOgImage?: boolean
  canonical?: string | null
  lang?: string | null
}

export function buildMetrics(p: ParsedFields): Metric[] {
  const out: Metric[] = []

  if (p.title !== undefined) {
    const len = p.titleLength ?? p.title?.length ?? 0
    out.push({
      label: '페이지 제목',
      value: p.title ? `${len}자` : '없음',
      hint: len >= 10 && len <= 60 ? '적정 길이' : len === 0 ? '제목 누락' : '길이 조정 권장',
      level: p.title ? (len >= 10 && len <= 60 ? 'good' : 'warn') : 'bad',
    })
  }

  if (p.metaDescription !== undefined) {
    const len = p.metaDescriptionLength ?? p.metaDescription?.length ?? 0
    out.push({
      label: '메타 설명',
      value: p.metaDescription ? `${len}자` : '없음',
      hint: len >= 50 && len <= 160 ? '적정 길이' : len === 0 ? '설명 누락' : '길이 조정 권장',
      level: p.metaDescription ? (len >= 50 && len <= 160 ? 'good' : 'warn') : 'bad',
    })
  }

  if (p.h1) {
    const count = p.h1.length
    out.push({
      label: 'H1 태그',
      value: `${count}개`,
      hint: count === 1 ? '권장 1개' : count === 0 ? '누락' : '2개 이상 중복',
      level: count === 1 ? 'good' : count === 0 ? 'bad' : 'warn',
    })
  }

  if (p.imgTotal !== undefined) {
    const miss = p.imgWithoutAlt ?? 0
    out.push({
      label: '이미지 ALT',
      value: `${p.imgTotal - miss}/${p.imgTotal}`,
      hint: miss === 0 ? '모두 설정됨' : `${miss}개 누락`,
      level: miss === 0 ? 'good' : miss < 3 ? 'warn' : 'bad',
    })
  }

  if (p.isHttps !== undefined) {
    out.push({
      label: 'HTTPS',
      value: p.isHttps ? '적용됨' : '미적용',
      level: p.isHttps ? 'good' : 'bad',
    })
  }

  if (p.hasViewport !== undefined) {
    out.push({
      label: '모바일 최적화',
      value: p.hasViewport ? 'viewport 설정' : '미설정',
      level: p.hasViewport ? 'good' : 'bad',
    })
  }

  if (p.loadTimeMs !== undefined) {
    const ms = p.loadTimeMs
    out.push({
      label: '응답 속도',
      value: ms >= 1000 ? `${(ms / 1000).toFixed(1)}초` : `${ms}ms`,
      hint: ms < 800 ? '빠름' : ms < 2000 ? '보통' : '느림',
      level: ms < 800 ? 'good' : ms < 2000 ? 'warn' : 'bad',
    })
  }

  if (p.hasStructuredData !== undefined) {
    out.push({
      label: '구조화 데이터',
      value: p.hasStructuredData ? p.structuredDataTypes?.slice(0, 2).join(', ') || '있음' : '없음',
      level: p.hasStructuredData ? 'good' : 'warn',
    })
  }

  if (p.wordCount !== undefined) {
    out.push({
      label: '본문 분량',
      value: `${p.wordCount.toLocaleString()}자`,
      hint: p.wordCount >= 300 ? '충분' : '빈약',
      level: p.wordCount >= 300 ? 'good' : 'warn',
    })
  }

  return out
}

/**
 * lp_requests.seo_report_data 에 저장된 JSON 이 "결과 페이지에 표시 가능한 리포트"인지 확인.
 *
 * 재시도 메타만 남아있는 실패 payload 와 구분하려면 `analysisHtml` 키 존재 여부를 쓴다.
 */
export function isVisibleReport(status: string, raw: unknown): boolean {
  if (status !== 'processing' && status !== 'sending_report' && status !== 'completed') {
    return false
  }
  if (!raw || typeof raw !== 'object') return false
  return 'analysisHtml' in (raw as Record<string, unknown>)
}

/* ───────────────────────── KPI · 경쟁사 ───────────────────────── */

/**
 * CompetitorAnalysis.customerMetrics / competitors[i] 에서 쓰는 필드만 뽑은 타입.
 *
 * lib/competitor-analyzer.ts 의 CompetitorData 와 호환 (structural typing).
 * 결과 페이지 렌더는 이 subset 만 사용하므로 의존성 최소화를 위해 로컬 타입으로 둔다.
 */
export type CompetitorMetrics = {
  domain?: string
  mozDA?: number
  mozPA?: number
  mozLinks?: number
  mozSpam?: number
  ahrefsDR?: number
  ahrefsBacklinks?: number
  ahrefsRefDomains?: number
  ahrefsTraffic?: number
  ahrefsTrafficValue?: number
  ahrefsOrganicKeywords?: number
  majesticTF?: number
  majesticCF?: number
  majesticLinks?: number
  majesticRefEdu?: number
  majesticRefGov?: number
  backlinkTotal?: number
  backlinkDoFollow?: number
  referringDomains?: number
  referringDoFollow?: number
  domainAgeYears?: number
  waybackFirstSeen?: string | null
  waybackSnapshots?: number
  onPage?: Record<string, unknown> | null
}

export type MetricFormat = 'number' | 'score' | 'text'

/**
 * 경쟁사 비교표 셀 포맷터.
 *
 * - number: 정수 천 단위 구분자
 * - score: 소수점 없는 정수 그대로
 * - text: 문자열
 * - null / undefined / NaN → '-'
 * - suffix 지정 시 값 뒤에 붙임 (ex. '년')
 */
export function formatMetricValue(
  raw: unknown,
  format: MetricFormat = 'number',
  suffix?: string
): string {
  if (raw === null || raw === undefined) return '-'
  if (format === 'text') {
    if (typeof raw !== 'string') return '-'
    const t = raw.trim()
    return t ? t : '-'
  }
  const num = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(num)) return '-'
  const body = format === 'number' ? num.toLocaleString('en-US') : String(Math.round(num))
  return suffix ? `${body}${suffix}` : body
}

/**
 * 핵심 KPI 카드 1장 정의.
 *
 * React 컴포넌트와 분리해 테스트 가능한 순수 데이터로 유지.
 */
export type KpiCard = {
  key: string
  label: string
  value: string
  hint?: string
  raw: number | null
  level: MetricLevel
}

type KpiSpec = {
  key: string
  label: string
  hint: string
  pick: (c: CompetitorMetrics) => number | null | undefined
  /** [goodMin, warnMin] — raw 값 기준 good/warn 구간 경계 */
  levels: [number, number]
  format: MetricFormat
  suffix?: string
}

const KPI_SPECS: KpiSpec[] = [
  {
    key: 'ahrefsDR',
    label: 'Ahrefs DR',
    hint: '도메인 등급 (0~100)',
    pick: c => c.ahrefsDR,
    levels: [40, 20],
    format: 'score',
  },
  {
    key: 'mozDA',
    label: 'Moz DA',
    hint: '도메인 권위 (0~100)',
    pick: c => c.mozDA,
    levels: [40, 20],
    format: 'score',
  },
  {
    key: 'backlinks',
    label: '총 백링크',
    hint: '내 사이트를 향한 전체 링크',
    pick: c => c.ahrefsBacklinks ?? c.backlinkTotal,
    levels: [1000, 100],
    format: 'number',
  },
  {
    key: 'refDomains',
    label: '참조 도메인',
    hint: '링크를 건 고유 도메인 수',
    pick: c => c.ahrefsRefDomains ?? c.referringDomains,
    levels: [100, 30],
    format: 'number',
  },
  {
    key: 'traffic',
    label: '월간 유기 트래픽',
    hint: '월 검색 유입 추정치',
    pick: c => c.ahrefsTraffic,
    levels: [1000, 100],
    format: 'number',
  },
  {
    key: 'organicKeywords',
    label: '노출 키워드',
    hint: '상위 100위 이내 키워드',
    pick: c => c.ahrefsOrganicKeywords,
    levels: [500, 50],
    format: 'number',
  },
  {
    key: 'majesticTF',
    label: 'Majestic TF',
    hint: '링크 신뢰도 (0~100)',
    pick: c => c.majesticTF,
    levels: [30, 15],
    format: 'score',
  },
  {
    key: 'domainAge',
    label: '도메인 연령',
    hint: '도메인이 유지된 기간',
    pick: c => c.domainAgeYears,
    levels: [5, 2],
    format: 'score',
    suffix: '년',
  },
]

function scoreLevel(raw: number | null, [good, warn]: [number, number]): MetricLevel {
  if (raw === null) return 'neutral'
  if (raw >= good) return 'good'
  if (raw >= warn) return 'warn'
  return 'bad'
}

/**
 * 고객 도메인의 CompetitorMetrics 를 KPI 카드 배열로 변환한다.
 *
 * - 값이 없는 항목은 생략 (카드 자체를 렌더하지 않음)
 * - KPI_SPECS 순서를 유지 → UI 상단 카드 배치 순서와 일치
 */
export function buildKpiCards(metrics: CompetitorMetrics | null | undefined): KpiCard[] {
  if (!metrics) return []
  const out: KpiCard[] = []
  for (const spec of KPI_SPECS) {
    const picked = spec.pick(metrics)
    if (picked === undefined || picked === null) continue
    const num = typeof picked === 'number' ? picked : Number(picked)
    if (!Number.isFinite(num)) continue
    out.push({
      key: spec.key,
      label: spec.label,
      value: formatMetricValue(num, spec.format, spec.suffix),
      hint: spec.hint,
      raw: num,
      level: scoreLevel(num, spec.levels),
    })
  }
  return out
}

/* ───────────────────────── 경쟁사 격차 ───────────────────────── */

export type CompetitorGap = {
  key: string
  label: string
  myValue: number
  topValue: number
  gap: number
  /** 내 값이 TOP 대비 차지하는 비율 (%). top === 0 이면 null. */
  percentOfTop: number | null
  isBehind: boolean
  suffix?: string
}

const GAP_SPECS: Array<{
  key: string
  label: string
  pick: (c: CompetitorMetrics) => number | null | undefined
  suffix?: string
}> = [
  {
    key: 'backlinks',
    label: '백링크',
    pick: c => c.ahrefsBacklinks ?? c.backlinkTotal,
  },
  {
    key: 'refDomains',
    label: '참조 도메인',
    pick: c => c.ahrefsRefDomains ?? c.referringDomains,
  },
  {
    key: 'mozDA',
    label: 'Moz DA',
    pick: c => c.mozDA,
    suffix: '점',
  },
  {
    key: 'ahrefsDR',
    label: 'Ahrefs DR',
    pick: c => c.ahrefsDR,
    suffix: '점',
  },
  {
    key: 'traffic',
    label: '월간 트래픽',
    pick: c => c.ahrefsTraffic,
  },
]

/**
 * 내 사이트 vs 1위 경쟁사 핵심 지표 격차를 계산한다.
 *
 * - 둘 다 값이 있는 지표만 반환 (한쪽만 있으면 비교 불가)
 * - 내가 뒤처진(`isBehind: true`) 항목만 화면에 표시하는 것이 기본 전략
 */
export function calculateCompetitorGap(
  me: CompetitorMetrics | null | undefined,
  top: CompetitorMetrics | null | undefined
): CompetitorGap[] {
  if (!me || !top) return []
  const out: CompetitorGap[] = []
  for (const spec of GAP_SPECS) {
    const mineRaw = spec.pick(me)
    const topRaw = spec.pick(top)
    if (mineRaw === undefined || mineRaw === null) continue
    if (topRaw === undefined || topRaw === null) continue
    const mine = Number(mineRaw)
    const upper = Number(topRaw)
    if (!Number.isFinite(mine) || !Number.isFinite(upper)) continue
    const gap = upper - mine
    out.push({
      key: spec.key,
      label: spec.label,
      myValue: mine,
      topValue: upper,
      gap,
      percentOfTop: upper === 0 ? null : Math.min(100, Math.round((mine / upper) * 100)),
      isBehind: gap > 0,
      suffix: spec.suffix,
    })
  }
  return out
}

/**
 * 경쟁사 비교표에 쓰는 도메인 레이블을 "13자 이상은 생략(..)" 규칙으로 잘라준다.
 */
export function trimDomainLabel(domain: string | undefined, maxLen = 13): string {
  if (!domain) return '-'
  if (domain.length <= maxLen) return domain
  return domain.slice(0, maxLen - 2) + '..'
}
