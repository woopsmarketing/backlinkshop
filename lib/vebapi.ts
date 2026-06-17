/**
 * VebAPI 통합 모듈.
 *
 * 5개 엔드포인트를 단일 인터페이스로 묶고, seo_enrichment_cache 활용해 호출량 절감.
 *  - analyze/v2 (도메인 정밀 진단)
 *  - keywordresearch (관련 키워드)
 *  - singlekeyword (단일 키워드)
 *  - topsearchkeywords (도메인 기존 순위 키워드)
 *  - ai-visibility-checker/v2 (AI 친화도)
 *
 * 캐시 TTL: 도메인 데이터 30일, 키워드 데이터 14일 (검색량 변동 고려).
 */

import { createAdminSupabaseClient } from '@/server/supabase/admin'

const BASE = 'https://vebapi.com/api/seo'
const DOMAIN_TTL_DAYS = 30
const KEYWORD_TTL_DAYS = 14

function ttlCutoff(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function getApiKey(): string | null {
  return process.env.VEBAPI_KEY || null
}

async function fetchVeb(path: string, params: Record<string, string>): Promise<unknown> {
  const key = getApiKey()
  if (!key) throw new Error('VEBAPI_KEY 미설정')

  const qs = new URLSearchParams(params).toString()
  const url = `${BASE}${path}?${qs}`

  const res = await fetch(url, {
    headers: {
      'X-API-KEY': key,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(20000),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`VebAPI ${path} ${res.status}: ${txt.slice(0, 200)}`)
  }

  return res.json()
}

async function getCached(cacheKey: string, ttlDays: number): Promise<unknown | null> {
  try {
    const supabase = createAdminSupabaseClient()
    const { data } = await supabase
      .from('seo_enrichment_cache')
      .select('data, fetched_at')
      .eq('cache_key', cacheKey)
      .gte('fetched_at', ttlCutoff(ttlDays))
      .maybeSingle()
    return data?.data ?? null
  } catch (err) {
    console.warn('[vebapi.cache] 조회 실패:', err)
    return null
  }
}

async function setCached(cacheKey: string, data: unknown): Promise<void> {
  try {
    const supabase = createAdminSupabaseClient()
    await supabase
      .from('seo_enrichment_cache')
      .upsert(
        { cache_key: cacheKey, data, fetched_at: new Date().toISOString() },
        { onConflict: 'cache_key' }
      )
  } catch (err) {
    console.warn('[vebapi.cache] 저장 실패:', err)
  }
}

// ─────────────────────────────────────────────────────────────
// analyze/v2 — 도메인 정밀 진단 (5분류 점수)
// ─────────────────────────────────────────────────────────────

export type AnalyzeV2Scores = {
  overall: number | null
  grade: string | null
  performance: number | null
  technical: number | null
  onpage: number | null
  security: number | null
  ai_readiness: number | null
  accessibility: number | null
}

export type AnalyzeV2Result = {
  scores: AnalyzeV2Scores
  priorityIssues: Array<{ category: string; severity: string; issue: string; fix?: string }>
  raw?: Record<string, unknown>
}

export async function getAnalyzeV2(domain: string): Promise<AnalyzeV2Result | null> {
  const cacheKey = `analyze:${domain}`
  const cached = await getCached(cacheKey, DOMAIN_TTL_DAYS)
  if (cached) return cached as AnalyzeV2Result

  try {
    const raw = (await fetchVeb('/analyze/v2', { website: domain })) as Record<string, unknown>
    const summary = (raw.summary ?? {}) as Record<string, unknown>
    const scores = (raw.scores ?? {}) as Record<string, unknown>
    const buckets = (scores.buckets ?? scores) as Record<string, unknown>

    const result: AnalyzeV2Result = {
      scores: {
        overall: pickNum(summary.overall_score ?? scores.overall),
        grade: pickStr(summary.grade),
        performance: pickNum(buckets.performance),
        technical: pickNum(buckets.technical),
        onpage: pickNum(buckets.onpage),
        security: pickNum(buckets.security),
        ai_readiness: pickNum(buckets.ai_readiness),
        accessibility: pickNum(buckets.accessibility),
      },
      priorityIssues: Array.isArray(summary.priority_issues)
        ? (summary.priority_issues as Array<Record<string, unknown>>)
            .map(i => ({
              category: pickStr(i.category) ?? '',
              severity: pickStr(i.severity) ?? '',
              issue: pickStr(i.issue) ?? '',
              fix: pickStr(i.fix) ?? undefined,
            }))
            .filter(i => i.issue)
        : [],
    }

    await setCached(cacheKey, result)
    return result
  } catch (err) {
    console.error('[vebapi.getAnalyzeV2] 실패:', err)
    return null
  }
}

// ─────────────────────────────────────────────────────────────
// singlekeyword — 단일 키워드 분석
// ─────────────────────────────────────────────────────────────

export type KeywordMetric = {
  text: string
  searchVolume: number | null
  cpc: number | null
  competition: 'Low' | 'Medium' | 'High' | null
  score: number | null
}

export async function getSingleKeyword(
  keyword: string,
  country: string = 'kr'
): Promise<KeywordMetric | null> {
  const cacheKey = `keyword:${keyword.toLowerCase()}:${country}`
  const cached = await getCached(cacheKey, KEYWORD_TTL_DAYS)
  if (cached) return cached as KeywordMetric

  try {
    const raw = (await fetchVeb('/singlekeyword', { keyword, country })) as Record<string, unknown>
    const result: KeywordMetric = parseKeywordItem(raw, keyword)
    await setCached(cacheKey, result)
    return result
  } catch (err) {
    console.error('[vebapi.getSingleKeyword] 실패:', err)
    return null
  }
}

// ─────────────────────────────────────────────────────────────
// keywordresearch — 관련 키워드 (배열)
// ─────────────────────────────────────────────────────────────

export async function getRelatedKeywords(
  keyword: string,
  country: string = 'kr'
): Promise<KeywordMetric[]> {
  const cacheKey = `related:${keyword.toLowerCase()}:${country}`
  const cached = await getCached(cacheKey, KEYWORD_TTL_DAYS)
  if (cached) return cached as KeywordMetric[]

  try {
    const raw = (await fetchVeb('/keywordresearch', { keyword, country })) as unknown
    const items: KeywordMetric[] = Array.isArray(raw)
      ? (raw as Array<Record<string, unknown>>)
          .map(item => parseKeywordItem(item, ''))
          .filter(k => k.text)
          .slice(0, 15)
      : []
    await setCached(cacheKey, items)
    return items
  } catch (err) {
    console.error('[vebapi.getRelatedKeywords] 실패:', err)
    return []
  }
}

function parseKeywordItem(raw: Record<string, unknown>, fallbackText: string): KeywordMetric {
  const compRaw = pickStr(raw.competition)
  const comp = compRaw === 'Low' || compRaw === 'Medium' || compRaw === 'High' ? compRaw : null

  return {
    text: pickStr(raw.text) ?? fallbackText,
    searchVolume: pickNum(raw.vol ?? raw.v),
    cpc: parseCpc(raw.cpc),
    competition: comp,
    score: parseCpc(raw.score),
  }
}

function parseCpc(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = parseFloat(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// topsearchkeywords — 도메인 기존 순위 키워드
// ─────────────────────────────────────────────────────────────

export type TopRankedKeyword = {
  keyword: string
  rank: number | null
  searchVolume: number | null
  rankingDifficulty: number | null
  seoClicks: number | null
  cpc: number | null
  countryCode: string | null
}

export async function getTopRankedKeywords(domain: string): Promise<TopRankedKeyword[]> {
  const cacheKey = `topkw:${domain}`
  const cached = await getCached(cacheKey, DOMAIN_TTL_DAYS)
  if (cached) return cached as TopRankedKeyword[]

  try {
    const raw = (await fetchVeb('/topsearchkeywords', { website: domain })) as Record<
      string,
      unknown
    >
    const items: TopRankedKeyword[] = Array.isArray(raw.keywords)
      ? (raw.keywords as Array<Record<string, unknown>>)
          .map(k => ({
            keyword: pickStr(k.keyword) ?? '',
            rank: pickNum(k.rank),
            searchVolume: pickNum(k.searchVolume),
            rankingDifficulty: pickNum(k.rankingDifficulty),
            seoClicks: pickNum(k.seoClicks),
            cpc: parseCpc(k.broadCostPerClick ?? k.phraseCostPerClick),
            countryCode: pickStr(k.countryCode),
          }))
          .filter(k => k.keyword)
          .slice(0, 30)
      : []
    await setCached(cacheKey, items)
    return items
  } catch (err) {
    console.error('[vebapi.getTopRankedKeywords] 실패:', err)
    return []
  }
}

// ─────────────────────────────────────────────────────────────
// ai-visibility-checker/v2 — AI 친화도 점수
// ─────────────────────────────────────────────────────────────

export type AiVisibilityResult = {
  overall: number | null
  grade: string | null
  crawlability: number | null
  structure: number | null
  contentDepth: number | null
  semanticMarkup: number | null
  technicalCleanliness: number | null
  aiScrapable: boolean | null
  issues: Array<{ severity: string; description: string }>
}

export async function getAiVisibility(domain: string): Promise<AiVisibilityResult | null> {
  const cacheKey = `aivis:${domain}`
  const cached = await getCached(cacheKey, DOMAIN_TTL_DAYS)
  if (cached) return cached as AiVisibilityResult

  try {
    const raw = (await fetchVeb('/ai-visibility-checker/v2', { website: domain })) as Record<
      string,
      unknown
    >
    const score = (raw.ai_score ?? {}) as Record<string, unknown>
    const dims = (score.dimensions ?? score) as Record<string, unknown>

    const result: AiVisibilityResult = {
      overall: pickNum(score.total ?? score.overall),
      grade: pickStr(score.grade),
      crawlability: pickNum(dims.crawlability),
      structure: pickNum(dims.structure),
      contentDepth: pickNum(dims.content_depth ?? dims.contentDepth),
      semanticMarkup: pickNum(dims.semantic_markup ?? dims.semanticMarkup),
      technicalCleanliness: pickNum(dims.technical_cleanliness ?? dims.technicalCleanliness),
      aiScrapable: typeof raw.ai_scrapable === 'boolean' ? raw.ai_scrapable : null,
      issues: Array.isArray(raw.issues)
        ? (raw.issues as Array<Record<string, unknown>>)
            .map(i => ({
              severity: pickStr(i.severity) ?? '',
              description: pickStr(i.description) ?? pickStr(i.issue) ?? '',
            }))
            .filter(i => i.description)
            .slice(0, 10)
        : [],
    }

    await setCached(cacheKey, result)
    return result
  } catch (err) {
    console.error('[vebapi.getAiVisibility] 실패:', err)
    return null
  }
}

// ─────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────

function pickNum(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = parseFloat(v)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function pickStr(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null
}
