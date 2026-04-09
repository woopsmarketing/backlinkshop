/**
 * 경쟁사 분석 모듈
 * 키워드로 구글 1~3위 경쟁사를 찾고 도메인/백링크 데이터를 수집
 */

export interface CompetitorData {
  rank: number
  url: string
  domain: string
  title: string
  // 도메인 메트릭 (RapidAPI)
  mozDA?: number
  ahrefsDR?: number
  ahrefsBacklinks?: number
  ahrefsRefDomains?: number
  ahrefsTraffic?: number
  majesticTF?: number
  majesticCF?: number
  // 백링크 프로필 (VebAPI)
  backlinkTotal?: number
  backlinkDoFollow?: number
  referringDomains?: number
  referringDoFollow?: number
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
    console.error('SERP API 오류:', res.status)
    return []
  }

  const data = await res.json()

  // 응답 구조: results.results[0].content.results.results.organic[]
  const organic = data?.results?.results?.[0]?.content?.results?.results?.organic || []

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
async function fetchBacklinkProfile(domain: string): Promise<{
  backlinkTotal: number
  backlinkDoFollow: number
  referringDomains: number
  referringDoFollow: number
} | null> {
  const apiKey = process.env.VEBAPI_KEY
  if (!apiKey) return null

  try {
    const res = await fetch(
      `https://vebapi.com/api/seo/backlinkdata?website=${encodeURIComponent(domain)}`,
      {
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!res.ok) return null

    const data = await res.json()
    const counts = data?.counts

    return {
      backlinkTotal: counts?.backlinks?.total || 0,
      backlinkDoFollow: counts?.backlinks?.doFollow || 0,
      referringDomains: counts?.domains?.total || 0,
      referringDoFollow: counts?.domains?.doFollow || 0,
    }
  } catch (err) {
    console.error('백링크 API 오류:', domain, err)
    return null
  }
}

/**
 * RapidAPI Domain Metrics: 도메인 권위도 조회
 */
async function fetchDomainMetrics(domain: string): Promise<{
  mozDA: number
  ahrefsDR: number
  ahrefsBacklinks: number
  ahrefsRefDomains: number
  ahrefsTraffic: number
  majesticTF: number
  majesticCF: number
} | null> {
  const apiKey = process.env.RAPIDAPI_KEY
  if (!apiKey) return null

  try {
    const res = await fetch(
      `https://domain-metrics-check.p.rapidapi.com/domain-metrics/${encodeURIComponent(domain)}`,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'domain-metrics-check.p.rapidapi.com',
        },
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!res.ok) return null

    const data = await res.json()

    return {
      mozDA: data?.mozDA || 0,
      ahrefsDR: data?.ahrefsDR || 0,
      ahrefsBacklinks: data?.ahrefsBacklinks || 0,
      ahrefsRefDomains: data?.ahrefsRefDomains || 0,
      ahrefsTraffic: Math.round(data?.ahrefsTraffic || 0),
      majesticTF: data?.majesticTF || 0,
      majesticCF: data?.majesticCF || 0,
    }
  } catch (err) {
    console.error('도메인 메트릭 API 오류:', domain, err)
    return null
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
  const [domainMetrics, backlinkProfile] = await Promise.all([
    fetchDomainMetrics(domain),
    fetchBacklinkProfile(domain),
  ])

  return {
    rank,
    url,
    domain,
    title,
    ...(domainMetrics || {}),
    ...(backlinkProfile || {}),
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

  // 1. SERP에서 상위 결과 가져오기
  const serpResults = await fetchSerpResults(keyword, 5)

  // 고객 도메인 제외하고 상위 N개 선택
  const competitorResults = serpResults
    .filter(r => !extractDomain(r.url).includes(customerDomain))
    .slice(0, topN)

  // 2. 고객 사이트 + 경쟁사 동시 분석
  const [customerMetrics, ...competitorMetrics] = await Promise.all([
    analyzeOneDomain(customerDomain, 0, customerSiteUrl, '내 사이트'),
    ...competitorResults.map((r, i) =>
      analyzeOneDomain(extractDomain(r.url), i + 1, r.url, r.title)
    ),
  ])

  return {
    keyword,
    customerDomain,
    customerMetrics,
    competitors: competitorMetrics,
  }
}
