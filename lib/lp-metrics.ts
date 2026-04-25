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
  url?: string
  statusCode?: number
  title?: string | null
  titleLength?: number
  metaDescription?: string | null
  metaDescriptionLength?: number
  metaKeywords?: string | null
  canonical?: string | null
  h1?: string[]
  h2?: string[]
  h3Count?: number
  imgTotal?: number
  imgWithoutAlt?: number
  internalLinks?: number
  externalLinks?: number
  nofollowLinks?: number
  wordCount?: number
  htmlSize?: number
  loadTimeMs?: number
  isHttps?: boolean
  hasViewport?: boolean
  hasCharset?: boolean
  hasOgTitle?: boolean
  hasOgDescription?: boolean
  hasOgImage?: boolean
  hasTwitterCard?: boolean
  hasRobotsMeta?: string | null
  hasHreflang?: boolean
  hasStructuredData?: boolean
  structuredDataTypes?: string[]
  textToHtmlRatio?: number
  urlDepth?: number
  urlLength?: number
  inlineCssSize?: number
  inlineJsSize?: number
  hasGzip?: boolean
  hasCacheControl?: string | null
  hasHsts?: boolean
  redirectCount?: number
  redirectIsWww?: boolean
  duplicateH1?: boolean
  duplicateDescription?: boolean
  ogImageUrl?: string | null
  hasFavicon?: boolean
  lang?: string | null
  xRobotsTag?: string | null
  contentType?: string | null
  hasIframes?: number
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

/* ───────────────────────── 플랫폼 도메인 감지 ───────────────────────── */

/**
 * 거대 플랫폼·블로그·SaaS 호스트 리스트.
 *
 * 이 도메인의 본체이거나 하위 도메인일 경우 일반 개인 사이트와 직접 비교가
 * 불공평하므로 (DA 80+, 백링크 수천만 개 단위) 평균 계산에서 제외한다.
 *
 * key 는 도메인 매칭에 쓰이고, value 는 사용자 친화 라벨.
 */
const PLATFORM_HOSTS: Record<string, string> = {
  // 블로그 / 문서 플랫폼
  'tistory.com': '티스토리 블로그',
  'blogspot.com': 'Blogger',
  'wordpress.com': '워드프레스닷컴',
  'medium.com': 'Medium',
  'velog.io': 'velog',
  'brunch.co.kr': '브런치',
  'postype.com': '포스타입',
  'note.com': 'note',
  // 위키 / 지식
  'wikipedia.org': '위키피디아',
  'namu.wiki': '나무위키',
  'fandom.com': 'Fandom 위키',
  'wikia.com': 'Wikia',
  // 호스팅 / SaaS
  'github.io': 'GitHub Pages',
  'gitbook.io': 'GitBook',
  'gitbook.com': 'GitBook',
  'notion.so': 'Notion',
  'notion.site': 'Notion',
  'vercel.app': 'Vercel',
  'netlify.app': 'Netlify',
  'pages.dev': 'Cloudflare Pages',
  // 도메인·SEO 산업 본체
  'godaddy.com': '고대디',
  'semrush.com': 'Semrush',
  'ahrefs.com': 'Ahrefs',
  'moz.com': 'Moz',
  'namecheap.com': 'Namecheap',
  'similarweb.com': 'SimilarWeb',
  // 대형 SNS / 영상
  'youtube.com': 'YouTube',
  'facebook.com': 'Facebook',
  'twitter.com': 'Twitter',
  'x.com': 'X(Twitter)',
  'instagram.com': 'Instagram',
  'linkedin.com': 'LinkedIn',
  'reddit.com': 'Reddit',
  'pinterest.com': 'Pinterest',
  // 국내 대형 포털
  'naver.com': '네이버',
  'daum.net': '다음',
  'google.com': '구글',
  'kakao.com': '카카오',
  // 국내 빌더 / 쇼핑몰 플랫폼
  'cafe24.com': '카페24',
  'imweb.me': '아임웹',
  'makeshop.co.kr': '메이크샵',
  'godo.co.kr': '고도몰',
  'modoo.at': 'modoo!',
  'creatorlink.net': '크리에이터링크',
}

export type PlatformDetection = {
  isPlatform: boolean
  /** 매칭된 본체 호스트 (예: tistory.com). 미매칭 시 undefined */
  platformHost?: string
  /** 사용자에게 보여줄 한국어 라벨 (예: "티스토리 블로그") */
  label?: string
}

/**
 * 도메인이 거대 플랫폼 본체이거나 그 하위 도메인인지 판별한다.
 *
 * - 'X.tistory.com' 또는 'tistory.com' 모두 platform=true
 * - 'X.blog.naver.com' 도 naver.com 매칭으로 platform=true
 * - 입력 도메인은 소문자·www 제거 후 비교
 */
export function detectPlatform(domain: string | null | undefined): PlatformDetection {
  if (!domain || typeof domain !== 'string') return { isPlatform: false }
  const normalized = domain
    .trim()
    .toLowerCase()
    .replace(/^www\./, '')
  if (!normalized) return { isPlatform: false }
  for (const host of Object.keys(PLATFORM_HOSTS)) {
    if (normalized === host || normalized.endsWith('.' + host)) {
      return { isPlatform: true, platformHost: host, label: PLATFORM_HOSTS[host] }
    }
  }
  return { isPlatform: false }
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
  /**
   * 상위 경쟁사 평균 대비 내 값의 비율 (%).
   * - 100 = 평균과 동일, 200 = 평균의 2배, 50 = 평균의 절반
   * - 평균 데이터가 없거나 평균이 0 이면 null
   */
  vsAverage: number | null
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
 * - `average` 제공 시 각 카드에 `vsAverage` (평균 대비 %) 계산
 */
export function buildKpiCards(
  metrics: CompetitorMetrics | null | undefined,
  average?: CompetitorMetrics | null
): KpiCard[] {
  if (!metrics) return []
  const out: KpiCard[] = []
  for (const spec of KPI_SPECS) {
    const picked = spec.pick(metrics)
    if (picked === undefined || picked === null) continue
    const num = typeof picked === 'number' ? picked : Number(picked)
    if (!Number.isFinite(num)) continue

    let vsAverage: number | null = null
    if (average) {
      const avgPicked = spec.pick(average)
      if (avgPicked !== undefined && avgPicked !== null) {
        const avgNum = Number(avgPicked)
        if (Number.isFinite(avgNum) && avgNum > 0) {
          vsAverage = Math.round((num / avgNum) * 100)
        }
      }
    }

    out.push({
      key: spec.key,
      label: spec.label,
      value: formatMetricValue(num, spec.format, spec.suffix),
      hint: spec.hint,
      raw: num,
      level: scoreLevel(num, spec.levels),
      vsAverage,
    })
  }
  return out
}

/**
 * 경쟁사 배열의 수치 필드를 평균화해 단일 CompetitorMetrics 로 반환한다.
 *
 * - 필드별로 유효한(숫자·유한) 값만 평균 집계
 * - 빈 배열 / 전부 결측이면 null 반환
 * - 소수점은 반올림 (정수 기반 지표가 많아 가독성 우선)
 */
const AVG_NUMERIC_FIELDS: (keyof CompetitorMetrics)[] = [
  'mozDA',
  'mozPA',
  'mozLinks',
  'mozSpam',
  'ahrefsDR',
  'ahrefsBacklinks',
  'ahrefsRefDomains',
  'ahrefsTraffic',
  'ahrefsTrafficValue',
  'ahrefsOrganicKeywords',
  'majesticTF',
  'majesticCF',
  'majesticLinks',
  'majesticRefEdu',
  'majesticRefGov',
  'backlinkTotal',
  'backlinkDoFollow',
  'referringDomains',
  'referringDoFollow',
  'domainAgeYears',
  'waybackSnapshots',
]

export function calculateCompetitorAverage(
  competitors: CompetitorMetrics[] | null | undefined
): CompetitorMetrics | null {
  if (!competitors || competitors.length === 0) return null
  // 거대 플랫폼은 평균 왜곡을 일으키므로 제외 (DA 80+, 백링크 수천만 단위)
  const eligible = competitors.filter(c => !detectPlatform(c.domain).isPlatform)
  if (eligible.length === 0) return null
  const avg: Record<string, number> = {}
  let hasAny = false
  for (const field of AVG_NUMERIC_FIELDS) {
    const vals: number[] = []
    for (const c of eligible) {
      const v = c[field]
      if (typeof v === 'number' && Number.isFinite(v)) vals.push(v)
    }
    if (vals.length === 0) continue
    const sum = vals.reduce((a, b) => a + b, 0)
    avg[field] = Math.round(sum / vals.length)
    hasAny = true
  }
  if (!hasAny) return null
  return avg as CompetitorMetrics
}

/**
 * 경쟁사 배열에서 플랫폼 도메인과 일반 도메인을 분리한다.
 *
 * 결과 페이지에서 평균 계산은 일반 도메인만, 비교표는 양쪽 모두 표시하되
 * 플랫폼은 회색 + 안내 배지를 붙이기 위해 사용.
 */
export function partitionCompetitors(competitors: CompetitorMetrics[] | null | undefined): {
  regular: CompetitorMetrics[]
  platforms: CompetitorMetrics[]
} {
  if (!competitors || competitors.length === 0) return { regular: [], platforms: [] }
  const regular: CompetitorMetrics[] = []
  const platforms: CompetitorMetrics[] = []
  for (const c of competitors) {
    if (detectPlatform(c.domain).isPlatform) platforms.push(c)
    else regular.push(c)
  }
  return { regular, platforms }
}

/* ───────────────────────── 경쟁사 격차 ───────────────────────── */

export type CompetitorGap = {
  key: string
  label: string
  myValue: number
  /** 비교 기준 값 (상위 N 경쟁사 평균) */
  avgValue: number
  /** avgValue - myValue. 양수면 내가 뒤처짐. */
  gap: number
  /** 내 값이 평균 대비 차지하는 비율 (%). 평균 === 0 이면 null. 상한 없음. */
  percentOfAvg: number | null
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
 * 내 사이트 vs 상위 경쟁사 평균 핵심 지표 격차를 계산한다.
 *
 * - 경쟁사 배열의 평균을 기준으로 비교 (1위 단일 비교보다 안정적)
 * - 둘 다 값이 있는 지표만 반환 (한쪽만 있으면 비교 불가)
 * - 내가 뒤처진(`isBehind: true`) 항목만 화면에 표시하는 것이 기본 전략
 */
export function calculateCompetitorGap(
  me: CompetitorMetrics | null | undefined,
  competitors: CompetitorMetrics[] | null | undefined
): CompetitorGap[] {
  if (!me || !competitors || competitors.length === 0) return []
  const avg = calculateCompetitorAverage(competitors)
  if (!avg) return []
  const out: CompetitorGap[] = []
  for (const spec of GAP_SPECS) {
    const mineRaw = spec.pick(me)
    const avgRaw = spec.pick(avg)
    if (mineRaw === undefined || mineRaw === null) continue
    if (avgRaw === undefined || avgRaw === null) continue
    const mine = Number(mineRaw)
    const upper = Number(avgRaw)
    if (!Number.isFinite(mine) || !Number.isFinite(upper)) continue
    const gap = upper - mine
    out.push({
      key: spec.key,
      label: spec.label,
      myValue: mine,
      avgValue: upper,
      gap,
      percentOfAvg: upper === 0 ? null : Math.round((mine / upper) * 100),
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

/* ───────────────────────── 온페이지 상세 진단 ───────────────────────── */

export type OnPageItem = {
  label: string
  value: string
  hint?: string
  level: MetricLevel
}

export type OnPageGroup = {
  title: string
  description?: string
  items: OnPageItem[]
}

function fmtBytes(bytes: number | undefined | null): string {
  if (bytes === undefined || bytes === null || !Number.isFinite(bytes)) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function lvl(cond: 'good' | 'warn' | 'bad' | 'neutral'): MetricLevel {
  return cond
}

/**
 * ParsedFields(SEO 분석기 출력) 를 결과 페이지에서 표시할 6개 카테고리·35+ 항목으로 변환.
 *
 * 각 항목은 ✓/✗/⚠ 표시와 권장 기준 힌트를 포함한다. 데이터가 없는 항목은 생략.
 */
export function buildOnPageDetail(p: ParsedFields | null | undefined): OnPageGroup[] {
  if (!p) return []
  const groups: OnPageGroup[] = []

  // 1. 기본 정보
  const basic: OnPageItem[] = []
  if (p.statusCode !== undefined) {
    const ok = p.statusCode >= 200 && p.statusCode < 300
    basic.push({
      label: '상태 코드',
      value: String(p.statusCode),
      hint: ok ? '정상 응답' : '비정상 응답',
      level: ok ? lvl('good') : lvl('bad'),
    })
  }
  if (p.isHttps !== undefined) {
    basic.push({
      label: 'HTTPS',
      value: p.isHttps ? '적용됨' : '미적용',
      hint: p.isHttps ? '보안 연결' : '구글이 비보안 사이트를 낮게 평가',
      level: p.isHttps ? lvl('good') : lvl('bad'),
    })
  }
  if (p.loadTimeMs !== undefined) {
    const ms = p.loadTimeMs
    basic.push({
      label: '로딩 시간',
      value: ms >= 1000 ? `${(ms / 1000).toFixed(1)}초` : `${ms}ms`,
      hint: ms < 800 ? '빠름' : ms < 2000 ? '보통' : '느림 (개선 필요)',
      level: ms < 800 ? lvl('good') : ms < 2000 ? lvl('warn') : lvl('bad'),
    })
  }
  if (p.htmlSize !== undefined) {
    const kb = p.htmlSize / 1024
    basic.push({
      label: 'HTML 크기',
      value: fmtBytes(p.htmlSize),
      hint: kb < 500 ? '경량' : kb < 1024 ? '보통' : '용량 큼',
      level: kb < 500 ? lvl('good') : kb < 1024 ? lvl('warn') : lvl('bad'),
    })
  }
  if (p.wordCount !== undefined) {
    basic.push({
      label: '본문 단어 수',
      value: p.wordCount.toLocaleString('en-US') + '개',
      hint: p.wordCount >= 300 ? '충분' : p.wordCount >= 100 ? '얇음' : '본문 부족',
      level: p.wordCount >= 300 ? lvl('good') : p.wordCount >= 100 ? lvl('warn') : lvl('bad'),
    })
  }
  if (p.textToHtmlRatio !== undefined) {
    const r = p.textToHtmlRatio
    basic.push({
      label: '텍스트/HTML 비율',
      value: `${r.toFixed(1)}%`,
      hint: r >= 10 ? '콘텐츠 비중 양호' : 'SPA·프레임워크 사이트일 수 있음',
      level: r >= 10 ? lvl('good') : r >= 3 ? lvl('warn') : lvl('neutral'),
    })
  }
  if (p.urlDepth !== undefined && p.urlLength !== undefined) {
    basic.push({
      label: 'URL 깊이·길이',
      value: `${p.urlDepth}단계 (${p.urlLength}자)`,
      hint:
        p.urlDepth <= 3 && p.urlLength <= 75
          ? '간결'
          : p.urlDepth > 5 || p.urlLength > 100
            ? '너무 깊거나 김'
            : '보통',
      level:
        p.urlDepth <= 3 && p.urlLength <= 75
          ? lvl('good')
          : p.urlDepth > 5 || p.urlLength > 100
            ? lvl('bad')
            : lvl('warn'),
    })
  }
  if (p.redirectCount !== undefined) {
    const n = p.redirectCount
    basic.push({
      label: '리다이렉트',
      value: n === 0 ? '없음' : `${n}회${p.redirectIsWww ? ' (www 정규화)' : ''}`,
      hint: n === 0 ? '직접 응답' : n <= 1 ? 'www 정규화 정도는 OK' : '체인 길어 권장 안 됨',
      level: n === 0 ? lvl('good') : n <= 1 ? lvl('good') : lvl('warn'),
    })
  }
  if (basic.length > 0) {
    groups.push({
      title: '기본 정보',
      description: '검색엔진이 가장 먼저 확인하는 응답·로딩·구조 신호',
      items: basic,
    })
  }

  // 2. 메타 태그
  const meta: OnPageItem[] = []
  if (p.title !== undefined) {
    const len = p.titleLength ?? p.title?.length ?? 0
    const ok = !!p.title && len >= 10 && len <= 60
    meta.push({
      label: 'Title',
      value: p.title
        ? `${p.title.slice(0, 60)}${p.title.length > 60 ? '…' : ''} (${len}자)`
        : '없음',
      hint: ok ? '적정 길이 (10~60자)' : len === 0 ? '제목 누락' : '길이 조정 권장',
      level: ok ? lvl('good') : !p.title ? lvl('bad') : lvl('warn'),
    })
  }
  if (p.metaDescription !== undefined) {
    const len = p.metaDescriptionLength ?? p.metaDescription?.length ?? 0
    const ok = !!p.metaDescription && len >= 50 && len <= 160
    meta.push({
      label: 'Description',
      value: p.metaDescription
        ? `${p.metaDescription.slice(0, 80)}${p.metaDescription.length > 80 ? '…' : ''} (${len}자)`
        : '없음',
      hint: ok ? '적정 길이 (50~160자)' : len === 0 ? '설명 누락' : '길이 조정 권장',
      level: ok ? lvl('good') : !p.metaDescription ? lvl('bad') : lvl('warn'),
    })
  }
  if (p.metaKeywords !== undefined) {
    const arr = p.metaKeywords ? p.metaKeywords.split(',').filter(Boolean) : []
    meta.push({
      label: 'Keywords',
      value: arr.length > 0 ? `${arr.length}개` : '없음',
      hint: arr.length > 0 ? '구글은 미사용, 네이버 일부 참고' : '필수 아님',
      level: lvl('neutral'),
    })
  }
  if (p.canonical !== undefined) {
    meta.push({
      label: 'Canonical',
      value: p.canonical ? '설정됨' : '없음',
      hint: p.canonical ? '중복 URL 정리됨' : '중복 콘텐츠 위험',
      level: p.canonical ? lvl('good') : lvl('warn'),
    })
  }
  if (p.hasRobotsMeta !== undefined) {
    const v = p.hasRobotsMeta ?? 'index, follow'
    const blocked = /noindex|nofollow/i.test(String(v))
    meta.push({
      label: 'Robots',
      value: v ? String(v) : 'index, follow (기본값)',
      hint: blocked ? '색인·추적 차단 설정됨' : '검색 노출 허용',
      level: blocked ? lvl('bad') : lvl('good'),
    })
  }
  if (p.lang !== undefined) {
    meta.push({
      label: 'Lang',
      value: p.lang || '없음',
      hint: p.lang ? '언어 명시됨' : 'lang 속성 권장',
      level: p.lang ? lvl('good') : lvl('warn'),
    })
  }
  if (meta.length > 0) {
    groups.push({
      title: '메타 태그',
      description: '검색 결과에 노출되는 핵심 텍스트',
      items: meta,
    })
  }

  // 3. 제목 구조
  const heading: OnPageItem[] = []
  if (p.h1) {
    const c = p.h1.length
    heading.push({
      label: 'H1',
      value:
        c === 0
          ? '없음'
          : `${c}개${p.h1[0] ? ` — "${p.h1[0].slice(0, 30)}${p.h1[0].length > 30 ? '…' : ''}"` : ''}`,
      hint: c === 1 ? '권장 (1개)' : c === 0 ? 'H1 누락' : '중복 H1',
      level: c === 1 ? lvl('good') : c === 0 ? lvl('bad') : lvl('warn'),
    })
  }
  if (p.h2) {
    const c = p.h2.length
    heading.push({
      label: 'H2',
      value: `${c}개`,
      hint: c >= 3 ? '구조 양호' : c > 0 ? '얇은 구조' : 'H2 누락',
      level: c >= 3 ? lvl('good') : c > 0 ? lvl('warn') : lvl('bad'),
    })
  }
  if (p.h3Count !== undefined) {
    heading.push({
      label: 'H3',
      value: `${p.h3Count}개`,
      hint: p.h3Count >= 3 ? '세부 구조 갖춤' : '필요 시 추가',
      level: p.h3Count >= 3 ? lvl('good') : lvl('neutral'),
    })
  }
  if (heading.length > 0) {
    groups.push({
      title: '제목 구조',
      description: '본문의 의미 계층 (검색엔진의 콘텐츠 이해 기준)',
      items: heading,
    })
  }

  // 4. 이미지 & 링크
  const links: OnPageItem[] = []
  if (p.imgTotal !== undefined) {
    links.push({
      label: '이미지',
      value: `${p.imgTotal}개`,
      level: lvl('neutral'),
    })
  }
  if (p.imgWithoutAlt !== undefined) {
    const miss = p.imgWithoutAlt
    links.push({
      label: 'Alt 미설정',
      value: `${miss}개`,
      hint: miss === 0 ? '모든 이미지에 alt' : miss < 3 ? '일부 누락' : '다수 누락',
      level: miss === 0 ? lvl('good') : miss < 3 ? lvl('warn') : lvl('bad'),
    })
  }
  if (p.internalLinks !== undefined) {
    links.push({
      label: '내부 링크',
      value: `${p.internalLinks}개`,
      hint: p.internalLinks >= 5 ? '내부 연결 양호' : '내부 링크 부족',
      level: p.internalLinks >= 5 ? lvl('good') : lvl('warn'),
    })
  }
  if (p.externalLinks !== undefined) {
    links.push({
      label: '외부 링크',
      value: `${p.externalLinks}개`,
      level: lvl('neutral'),
    })
  }
  if (p.nofollowLinks !== undefined) {
    links.push({
      label: 'Nofollow 링크',
      value: `${p.nofollowLinks}개`,
      level: lvl('neutral'),
    })
  }
  if (links.length > 0) {
    groups.push({
      title: '이미지 & 링크',
      description: '내부 SEO 와 사용자 탐색 동선의 기반',
      items: links,
    })
  }

  // 5. 기술 SEO
  const tech: OnPageItem[] = []
  if (p.hasViewport !== undefined) {
    tech.push({
      label: 'Viewport',
      value: p.hasViewport ? '설정됨' : '없음',
      hint: p.hasViewport ? '모바일 대응' : '모바일 SEO 핵심 요소 누락',
      level: p.hasViewport ? lvl('good') : lvl('bad'),
    })
  }
  if (p.hasCharset !== undefined) {
    tech.push({
      label: 'Charset',
      value: p.hasCharset ? '설정됨' : '없음',
      hint: p.hasCharset ? 'UTF-8 등 명시' : 'charset 권장',
      level: p.hasCharset ? lvl('good') : lvl('warn'),
    })
  }
  if (p.hasFavicon !== undefined) {
    tech.push({
      label: 'Favicon',
      value: p.hasFavicon ? '있음' : '없음',
      hint: p.hasFavicon ? 'SERP 가독성' : '추가 권장',
      level: p.hasFavicon ? lvl('good') : lvl('warn'),
    })
  }
  if (p.hasGzip !== undefined) {
    tech.push({
      label: 'Gzip / Brotli',
      value: p.hasGzip ? '적용됨' : '미적용',
      hint: p.hasGzip ? '압축 전송' : '서버 압축 권장',
      level: p.hasGzip ? lvl('good') : lvl('warn'),
    })
  }
  if (p.hasHsts !== undefined) {
    tech.push({
      label: 'HSTS',
      value: p.hasHsts ? '적용됨' : '미적용',
      hint: p.hasHsts ? 'HTTPS 강제' : '권장 (선택)',
      level: p.hasHsts ? lvl('good') : lvl('neutral'),
    })
  }
  if (p.hasCacheControl !== undefined) {
    tech.push({
      label: 'Cache-Control',
      value: p.hasCacheControl || '없음',
      hint: p.hasCacheControl ? '캐시 정책 명시' : '캐시 헤더 권장',
      level: p.hasCacheControl ? lvl('good') : lvl('neutral'),
    })
  }
  if (p.inlineCssSize !== undefined) {
    const kb = p.inlineCssSize / 1024
    tech.push({
      label: '인라인 CSS',
      value: fmtBytes(p.inlineCssSize),
      hint: kb < 10 ? '경량' : kb < 50 ? '보통' : '외부 분리 권장',
      level: kb < 10 ? lvl('good') : kb < 50 ? lvl('warn') : lvl('bad'),
    })
  }
  if (p.inlineJsSize !== undefined) {
    const kb = p.inlineJsSize / 1024
    tech.push({
      label: '인라인 JS',
      value: fmtBytes(p.inlineJsSize),
      hint: kb < 50 ? '경량' : kb < 150 ? '보통 (프레임워크 사이트는 정상)' : '외부 분리 권장',
      level: kb < 50 ? lvl('good') : kb < 150 ? lvl('warn') : lvl('bad'),
    })
  }
  if (p.hasHreflang !== undefined) {
    tech.push({
      label: 'Hreflang',
      value: p.hasHreflang ? '있음' : '없음',
      hint: p.hasHreflang ? '다국어 명시' : '단일 언어면 불필요',
      level: p.hasHreflang ? lvl('good') : lvl('neutral'),
    })
  }
  if (p.hasIframes !== undefined) {
    tech.push({
      label: 'iFrame',
      value: `${p.hasIframes}개`,
      hint: p.hasIframes === 0 ? '없음' : '과다 사용 시 SEO 영향',
      level: p.hasIframes === 0 ? lvl('good') : p.hasIframes < 3 ? lvl('neutral') : lvl('warn'),
    })
  }
  if (tech.length > 0) {
    groups.push({
      title: '기술 SEO',
      description: '모바일·성능·보안 등 인프라 신호',
      items: tech,
    })
  }

  // 6. 소셜 & 구조화 데이터
  const social: OnPageItem[] = []
  if (
    p.hasOgTitle !== undefined ||
    p.hasOgDescription !== undefined ||
    p.hasOgImage !== undefined
  ) {
    const parts: string[] = []
    if (p.hasOgTitle) parts.push('title')
    if (p.hasOgDescription) parts.push('desc')
    if (p.hasOgImage) parts.push('image')
    const total = [p.hasOgTitle, p.hasOgDescription, p.hasOgImage].filter(
      v => v !== undefined
    ).length
    const present = parts.length
    social.push({
      label: 'Open Graph',
      value: parts.length > 0 ? parts.join(', ') : '없음',
      hint:
        present === total && total > 0
          ? '소셜 공유 카드 완비'
          : present > 0
            ? '일부 누락'
            : 'OG 태그 누락',
      level: present === total && total > 0 ? lvl('good') : present > 0 ? lvl('warn') : lvl('bad'),
    })
  }
  if (p.hasTwitterCard !== undefined) {
    social.push({
      label: 'Twitter Card',
      value: p.hasTwitterCard ? '있음' : '없음',
      hint: p.hasTwitterCard ? 'X(Twitter) 공유 카드' : '추가 권장',
      level: p.hasTwitterCard ? lvl('good') : lvl('neutral'),
    })
  }
  if (p.hasStructuredData !== undefined) {
    const types = p.structuredDataTypes ?? []
    social.push({
      label: 'JSON-LD',
      value: p.hasStructuredData ? (types.length > 0 ? types.join(', ') : '있음') : '없음',
      hint: p.hasStructuredData ? '리치 결과 노출 가능' : '구조화 데이터 권장',
      level: p.hasStructuredData ? lvl('good') : lvl('warn'),
    })
  }
  if (p.ogImageUrl !== undefined && p.ogImageUrl) {
    social.push({
      label: 'OG Image URL',
      value: p.ogImageUrl.length > 50 ? p.ogImageUrl.slice(0, 50) + '…' : p.ogImageUrl,
      level: lvl('good'),
    })
  }
  if (social.length > 0) {
    groups.push({
      title: '소셜 & 구조화 데이터',
      description: '검색 결과·SNS 공유 카드의 외형을 결정',
      items: social,
    })
  }

  return groups
}

/**
 * 항목 그룹들의 카운트 요약 — 카드 헤더에 "총 N개 / ✓N / ⚠N / ✗N" 표시용
 */
export function summarizeOnPage(groups: OnPageGroup[]): {
  total: number
  good: number
  warn: number
  bad: number
} {
  let total = 0
  let good = 0
  let warn = 0
  let bad = 0
  for (const g of groups) {
    for (const i of g.items) {
      total += 1
      if (i.level === 'good') good += 1
      else if (i.level === 'warn') warn += 1
      else if (i.level === 'bad') bad += 1
    }
  }
  return { total, good, warn, bad }
}
