/**
 * 경쟁사 분석 모듈
 * 키워드로 구글 1~3위 경쟁사를 찾고 도메인/백링크/Wayback 데이터 수집
 */

export interface CompetitorData {
  rank: number
  url: string
  domain: string
  title: string

  // RapidAPI - Moz
  mozDA?: number
  mozPA?: number
  mozRank?: number
  mozLinks?: number
  mozSpam?: number

  // RapidAPI - Ahrefs
  ahrefsDR?: number
  ahrefsRank?: number
  ahrefsBacklinks?: number
  ahrefsRefDomains?: number
  ahrefsTraffic?: number
  ahrefsTrafficValue?: number
  ahrefsOrganicKeywords?: number

  // RapidAPI - Majestic
  majesticTF?: number
  majesticCF?: number
  majesticLinks?: number
  majesticRefDomains?: number
  majesticRefEdu?: number
  majesticRefGov?: number

  // VebAPI 백링크
  backlinkTotal?: number
  backlinkDoFollow?: number
  referringDomains?: number
  referringDoFollow?: number

  // Wayback
  waybackFirstSeen?: string | null
  waybackSnapshots?: number
  domainAgeYears?: number

  // 디버그
  _errors?: string[]
}

export interface CompetitorAnalysis {
  keyword: string
  customerDomain: string
  customerMetrics: CompetitorData | null
  competitors: CompetitorData[]
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
  }
}

/**
 * VebAPI SERP: 키워드로 구글 검색 → 상위 URL 반환
 */
async function fetchSerpResults(
  keyword: string,
  count: number = 5
): Promise<{ url: string; title: string }[]> {
  const apiKey = process.env.VEBAPI_KEY
  if (!apiKey) throw new Error('VEBAPI_KEY 환경변수가 설정되지 않았습니다')

  const params = new URLSearchParams({
    q: keyword,
    locale: 'ko-kr',
    device_type: 'desktop_chrome',
    page_count: '1',
  })

  const res = await fetch(`https://vebapi.com/api/serp/google?${params}`, {
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    console.error('[SERP] API 오류:', res.status, await res.text().catch(() => ''))
    return []
  }

  const data = await res.json()
  const organic = data?.results?.results?.[0]?.content?.results?.results?.organic || []

  console.log(`[SERP] 키워드 "${keyword}" → ${organic.length}개 결과 수집`)

  return organic
    .slice(0, count)
    .map((item: any) => ({
      url: item.url || '',
      title: item.title || '',
    }))
    .filter((item: any) => item.url)
}

/**
 * VebAPI Backlink: 도메인의 백링크 프로필 조회
 */
async function fetchBacklinkProfile(domain: string): Promise<Partial<CompetitorData>> {
  const apiKey = process.env.VEBAPI_KEY
  if (!apiKey) return { _errors: ['VEBAPI_KEY 없음'] }

  try {
    const res = await fetch(
      `https://vebapi.com/api/seo/backlinkdata?website=${encodeURIComponent(domain)}`,
      {
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(15000),
      }
    )

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[Backlink] ${domain} 오류 ${res.status}:`, text.slice(0, 200))
      return { _errors: [`백링크 API ${res.status}`] }
    }

    const data = await res.json()
    const counts = data?.counts

    console.log(`[Backlink] ${domain}:`, JSON.stringify(counts?.backlinks))

    return {
      backlinkTotal: counts?.backlinks?.total || 0,
      backlinkDoFollow: counts?.backlinks?.doFollow || 0,
      referringDomains: counts?.domains?.total || 0,
      referringDoFollow: counts?.domains?.doFollow || 0,
    }
  } catch (err: any) {
    console.error(`[Backlink] ${domain} 예외:`, err.message)
    return { _errors: [`백링크 예외: ${err.message}`] }
  }
}

/**
 * RapidAPI Domain Metrics: 도메인 전체 권위도 지표
 */
async function fetchDomainMetrics(domain: string): Promise<Partial<CompetitorData>> {
  const apiKey = process.env.RAPIDAPI_KEY
  if (!apiKey) return { _errors: ['RAPIDAPI_KEY 없음'] }

  try {
    const res = await fetch(
      `https://domain-metrics-check.p.rapidapi.com/domain-metrics/${encodeURIComponent(domain)}`,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'domain-metrics-check.p.rapidapi.com',
        },
        signal: AbortSignal.timeout(15000),
      }
    )

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[Metrics] ${domain} 오류 ${res.status}:`, text.slice(0, 200))
      return { _errors: [`도메인 메트릭 API ${res.status}`] }
    }

    const data = await res.json()

    console.log(`[Metrics] ${domain}:`, {
      mozDA: data?.mozDA,
      ahrefsDR: data?.ahrefsDR,
      ahrefsTraffic: data?.ahrefsTraffic,
      majesticTF: data?.majesticTF,
    })

    return {
      mozDA: data?.mozDA ?? undefined,
      mozPA: data?.mozPA ?? undefined,
      mozRank: data?.mozRank ?? undefined,
      mozLinks: data?.mozLinks ?? undefined,
      mozSpam: data?.mozSpam ?? undefined,
      ahrefsDR: data?.ahrefsDR ?? undefined,
      ahrefsRank: data?.ahrefsRank ?? undefined,
      ahrefsBacklinks: data?.ahrefsBacklinks ?? undefined,
      ahrefsRefDomains: data?.ahrefsRefDomains ?? undefined,
      ahrefsTraffic: data?.ahrefsTraffic ? Math.round(data.ahrefsTraffic) : undefined,
      ahrefsTrafficValue: data?.ahrefsTrafficValue
        ? Math.round(data.ahrefsTrafficValue)
        : undefined,
      ahrefsOrganicKeywords: data?.ahrefsOrganicKeywords ?? undefined,
      majesticTF: data?.majesticTF ?? undefined,
      majesticCF: data?.majesticCF ?? undefined,
      majesticLinks: data?.majesticLinks ?? undefined,
      majesticRefDomains: data?.majesticRefDomains ?? undefined,
      majesticRefEdu: data?.majesticRefEdu ?? undefined,
      majesticRefGov: data?.majesticRefGov ?? undefined,
    }
  } catch (err: any) {
    console.error(`[Metrics] ${domain} 예외:`, err.message)
    return { _errors: [`메트릭 예외: ${err.message}`] }
  }
}

/**
 * Wayback Machine: 도메인 최초 아카이브 시점 + 스냅샷 수 → 도메인 연령 계산
 */
async function fetchWaybackInfo(domain: string): Promise<Partial<CompetitorData>> {
  try {
    // 1. 최초 스냅샷 조회 (가장 오래된 것)
    const res = await fetch(
      `https://archive.org/wayback/available?url=${encodeURIComponent(domain)}&timestamp=19960101`,
      { signal: AbortSignal.timeout(10000) }
    )

    if (!res.ok) return { _errors: [`wayback ${res.status}`] }

    const data = await res.json()
    const snapshot = data?.archived_snapshots?.closest

    if (!snapshot) return { waybackFirstSeen: null, waybackSnapshots: 0 }

    // YYYYMMDDHHMMSS → YYYY-MM-DD
    const ts = snapshot.timestamp || ''
    const firstSeen =
      ts.length >= 8 ? `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}` : null

    // 도메인 연령 계산
    let ageYears: number | undefined
    if (firstSeen) {
      const firstDate = new Date(firstSeen)
      const now = new Date()
      ageYears = Math.floor((now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    }

    console.log(`[Wayback] ${domain}: ${firstSeen} (${ageYears}년)`)

    return {
      waybackFirstSeen: firstSeen,
      domainAgeYears: ageYears,
    }
  } catch (err: any) {
    console.error(`[Wayback] ${domain} 예외:`, err.message)
    return { _errors: [`wayback 예외: ${err.message}`] }
  }
}

/**
 * 단일 도메인의 전체 분석 데이터 수집
 */
async function analyzeOneDomain(
  domain: string,
  rank: number,
  url: string,
  title: string
): Promise<CompetitorData> {
  const [domainMetrics, backlinkProfile, waybackInfo] = await Promise.all([
    fetchDomainMetrics(domain),
    fetchBacklinkProfile(domain),
    fetchWaybackInfo(domain),
  ])

  const errors = [
    ...(domainMetrics._errors || []),
    ...(backlinkProfile._errors || []),
    ...(waybackInfo._errors || []),
  ]

  return {
    rank,
    url,
    domain,
    title,
    ...domainMetrics,
    ...backlinkProfile,
    ...waybackInfo,
    _errors: errors.length > 0 ? errors : undefined,
  }
}

/**
 * 메인 함수: 키워드 + 고객 사이트 URL → 경쟁사 비교 분석
 */
export async function analyzeCompetitors(
  keyword: string,
  customerSiteUrl: string,
  topN: number = 3
): Promise<CompetitorAnalysis> {
  const customerDomain = extractDomain(customerSiteUrl)

  console.log(`[Competitor] 분석 시작: keyword="${keyword}", customer=${customerDomain}`)

  // 1. SERP 조회
  const serpResults = await fetchSerpResults(keyword, 10)

  // 고객 도메인과 정확히 일치하는 것만 제외
  const competitorResults = serpResults
    .filter(r => {
      const d = extractDomain(r.url)
      return d && d !== customerDomain
    })
    .slice(0, topN)

  console.log(
    `[Competitor] 경쟁사 ${competitorResults.length}개 선정:`,
    competitorResults.map(r => extractDomain(r.url))
  )

  // 2. 고객 + 경쟁사 동시 분석
  const [customerMetrics, ...competitorMetrics] = await Promise.all([
    analyzeOneDomain(customerDomain, 0, customerSiteUrl, '내 사이트'),
    ...competitorResults.map((r, i) =>
      analyzeOneDomain(extractDomain(r.url), i + 1, r.url, r.title)
    ),
  ])

  console.log(`[Competitor] 분석 완료`)

  return {
    keyword,
    customerDomain,
    customerMetrics,
    competitors: competitorMetrics,
  }
}
