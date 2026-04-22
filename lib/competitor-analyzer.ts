/**
 * 경쟁사 분석 모듈
 * 키워드로 구글 1~5위 경쟁사를 찾고 도메인/백링크/Wayback/온페이지 데이터 수집
 */

import { parseHtml, type ParsedSeo } from './seo-analyzer'
import { createAdminSupabaseClient } from '@/server/supabase/admin'

const METRICS_CACHE_TTL_DAYS = 30 // 도메인 메트릭 캐시 유효기간 30일
const SERP_CACHE_TTL_DAYS = 14 // 검색 결과 캐시 유효기간 14일

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

  // 온페이지 (내부 최적화 상태)
  onPage?: {
    title: string | null
    titleLength: number
    metaDescription: string | null
    metaDescriptionLength: number
    h1Count: number
    h2Count: number
    wordCount: number
    imgTotal: number
    imgWithoutAlt: number
    internalLinks: number
    externalLinks: number
    loadTimeMs: number
    hasHttps: boolean
    hasStructuredData: boolean
    hasOgTags: boolean
  } | null

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
 * Serper.dev: 키워드로 구글 검색 → 상위 URL 반환
 */
async function fetchSerpResults(
  keyword: string,
  count: number = 10
): Promise<{ url: string; title: string }[]> {
  const apiKey = process.env.SERPER_API_KEY
  if (!apiKey) throw new Error('SERPER_API_KEY 환경변수가 설정되지 않았습니다')

  // 캐시 확인 (24시간)
  try {
    const adminClient = createAdminSupabaseClient()
    const cacheExpiry = new Date(
      Date.now() - SERP_CACHE_TTL_DAYS * 24 * 60 * 60 * 1000
    ).toISOString()

    const { data: cached } = await adminClient
      .from('serp_cache')
      .select('results, fetched_at')
      .eq('keyword', keyword.toLowerCase().trim())
      .gte('fetched_at', cacheExpiry)
      .single()

    if (cached?.results) {
      console.log(`[SERP] "${keyword}": 캐시 사용 (${cached.fetched_at})`)
      return cached.results as { url: string; title: string }[]
    }
  } catch {
    // 캐시 테이블 없거나 조회 실패 → API 호출로 진행
  }

  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: keyword,
        gl: 'kr',
        hl: 'ko',
        num: count,
      }),
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error(`[SERP] Serper 실패 ${res.status}:`, body.slice(0, 200))
      return []
    }

    const data = await res.json()
    const organic = data?.organic || []

    const results = organic
      .slice(0, count)
      .map((item: any) => ({
        url: item.link || '',
        title: item.title || '',
      }))
      .filter((item: any) => item.url)

    console.log(`[SERP] "${keyword}": API 호출 완료 → ${results.length}개 결과`)

    // 캐시 저장 (upsert)
    try {
      const adminClient = createAdminSupabaseClient()
      await adminClient.from('serp_cache').upsert(
        {
          keyword: keyword.toLowerCase().trim(),
          results,
          fetched_at: new Date().toISOString(),
        },
        { onConflict: 'keyword' }
      )
      console.log(`[SERP] "${keyword}": 캐시 저장 완료`)
    } catch (cacheErr: any) {
      console.error(`[SERP] "${keyword}": 캐시 저장 실패 (무시):`, cacheErr.message)
    }

    return results
  } catch (err: any) {
    console.error(`[SERP] Serper 예외:`, err.message)
    return []
  }
}

/**
 * VebAPI Backlink: 도메인의 백링크 프로필 조회
 */
async function fetchBacklinkProfile(domain: string): Promise<Partial<CompetitorData>> {
  const apiKey = process.env.VEBAPI_KEY
  if (!apiKey) return { _errors: ['VEBAPI_KEY 없음'] }

  // 캐시 확인
  try {
    const adminClient = createAdminSupabaseClient()
    const cacheExpiry = new Date(
      Date.now() - METRICS_CACHE_TTL_DAYS * 24 * 60 * 60 * 1000
    ).toISOString()

    const { data: cached } = await adminClient
      .from('backlink_cache')
      .select('metrics, fetched_at')
      .eq('domain', domain.toLowerCase())
      .gte('fetched_at', cacheExpiry)
      .single()

    if (cached?.metrics) {
      console.log(`[Backlink] ${domain}: 캐시 사용 (${cached.fetched_at})`)
      return cached.metrics as Partial<CompetitorData>
    }
  } catch {
    // 캐시 테이블 없거나 조회 실패 → API 호출로 진행
  }

  try {
    const res = await fetch(
      `https://vebapi.com/api/seo/backlinkdata?website=${encodeURIComponent(domain)}`,
      {
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20000),
      }
    )

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[Backlink] ${domain} 오류 ${res.status}:`, text.slice(0, 200))
      return { _errors: [`백링크 API ${res.status}`] }
    }

    const data = await res.json()
    const counts = data?.counts

    const metrics: Partial<CompetitorData> = {
      backlinkTotal: counts?.backlinks?.total || 0,
      backlinkDoFollow: counts?.backlinks?.doFollow || 0,
      referringDomains: counts?.domains?.total || 0,
      referringDoFollow: counts?.domains?.doFollow || 0,
    }

    console.log(`[Backlink] ${domain}: API 호출 완료`, JSON.stringify(counts?.backlinks))

    // 캐시 저장 (upsert)
    try {
      const adminClient = createAdminSupabaseClient()
      await adminClient.from('backlink_cache').upsert(
        {
          domain: domain.toLowerCase(),
          metrics,
          fetched_at: new Date().toISOString(),
        },
        { onConflict: 'domain' }
      )
      console.log(`[Backlink] ${domain}: 캐시 저장 완료`)
    } catch (cacheErr: any) {
      console.error(`[Backlink] ${domain}: 캐시 저장 실패 (무시):`, cacheErr.message)
    }

    return metrics
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

  // 캐시 확인
  try {
    const adminClient = createAdminSupabaseClient()
    const cacheExpiry = new Date(
      Date.now() - METRICS_CACHE_TTL_DAYS * 24 * 60 * 60 * 1000
    ).toISOString()

    const { data: cached } = await adminClient
      .from('domain_metrics_cache')
      .select('metrics, fetched_at')
      .eq('domain', domain.toLowerCase())
      .gte('fetched_at', cacheExpiry)
      .single()

    if (cached?.metrics) {
      console.log(`[Metrics] ${domain}: 캐시 사용 (${cached.fetched_at})`)
      return cached.metrics as Partial<CompetitorData>
    }
  } catch {
    // 캐시 테이블 없거나 조회 실패 → API 호출로 진행
  }

  try {
    const res = await fetch(
      `https://domain-metrics-check.p.rapidapi.com/domain-metrics/${encodeURIComponent(domain)}/`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'domain-metrics-check.p.rapidapi.com',
        },
        signal: AbortSignal.timeout(20000),
      }
    )

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[Metrics] ${domain} 오류 ${res.status}:`, text.slice(0, 200))
      return { _errors: [`도메인 메트릭 API ${res.status}`] }
    }

    const data = await res.json()

    if (data?.status === 'error') {
      console.error(`[Metrics] ${domain} API error:`, data?.message)
      return { _errors: [`메트릭 API: ${data?.message || 'unknown'}`] }
    }

    const metrics: Partial<CompetitorData> = {
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

    console.log(`[Metrics] ${domain}: API 호출 완료`, {
      mozDA: metrics.mozDA,
      ahrefsDR: metrics.ahrefsDR,
      ahrefsTraffic: metrics.ahrefsTraffic,
    })

    // 캐시 저장 (upsert)
    try {
      const adminClient = createAdminSupabaseClient()
      await adminClient.from('domain_metrics_cache').upsert(
        {
          domain: domain.toLowerCase(),
          metrics,
          fetched_at: new Date().toISOString(),
        },
        { onConflict: 'domain' }
      )
      console.log(`[Metrics] ${domain}: 캐시 저장 완료`)
    } catch (cacheErr: any) {
      console.error(`[Metrics] ${domain}: 캐시 저장 실패 (무시):`, cacheErr.message)
    }

    return metrics
  } catch (err: any) {
    console.error(`[Metrics] ${domain} 예외:`, err.message)
    return { _errors: [`메트릭 예외: ${err.message}`] }
  }
}

/**
 * 온페이지 SEO 분석 (OpenAI 호출 없이 HTML 파싱만)
 * 빠른 비교용 요약 데이터 반환
 */
async function fetchOnPageSummary(url: string): Promise<Partial<CompetitorData>> {
  try {
    let targetUrl = url.trim()
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl
    }

    const start = Date.now()
    const res = await fetch(targetUrl, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      redirect: 'follow',
    })

    const loadTime = Date.now() - start
    const headers = Object.fromEntries(res.headers.entries())
    const html = await res.text()

    const parsed: ParsedSeo = parseHtml(html, targetUrl, res.url, res.status, loadTime, headers)

    return {
      onPage: {
        title: parsed.title,
        titleLength: parsed.titleLength,
        metaDescription: parsed.metaDescription,
        metaDescriptionLength: parsed.metaDescriptionLength,
        h1Count: parsed.h1.length,
        h2Count: parsed.h2.length,
        wordCount: parsed.wordCount,
        imgTotal: parsed.imgTotal,
        imgWithoutAlt: parsed.imgWithoutAlt,
        internalLinks: parsed.internalLinks,
        externalLinks: parsed.externalLinks,
        loadTimeMs: parsed.loadTimeMs,
        hasHttps: parsed.isHttps,
        hasStructuredData: parsed.hasStructuredData,
        hasOgTags: parsed.hasOgTitle && parsed.hasOgDescription && parsed.hasOgImage,
      },
    }
  } catch (err: any) {
    console.error(`[OnPage] ${url} 예외:`, err.message)
    return { _errors: [`온페이지 예외: ${err.message}`] }
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
 * 도메인 메트릭 + Wayback + 온페이지 분석 병렬 실행
 */
async function analyzeOneDomain(
  domain: string,
  rank: number,
  url: string,
  title: string
): Promise<CompetitorData> {
  const [domainMetrics, waybackInfo, onPageInfo] = await Promise.all([
    fetchDomainMetrics(domain),
    fetchWaybackInfo(domain),
    fetchOnPageSummary(url),
  ])

  const errors = [
    ...(domainMetrics._errors || []),
    ...(waybackInfo._errors || []),
    ...(onPageInfo._errors || []),
  ]

  return {
    rank,
    url,
    domain,
    title,
    ...domainMetrics,
    ...waybackInfo,
    ...onPageInfo,
    _errors: errors.length > 0 ? errors : undefined,
  }
}

/**
 * 메인 함수: 키워드 + 고객 사이트 URL → 경쟁사 비교 분석
 */
export async function analyzeCompetitors(
  keyword: string,
  customerSiteUrl: string,
  topN: number = 5
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
