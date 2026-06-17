/**
 * GET /api/analyze/enrichment?domain=&keyword=
 *
 * 분석 결과 페이지의 정밀 분석 카드들에 필요한 VebAPI 데이터를 한 번에 모아 반환.
 * 5개 엔드포인트를 병렬 호출하고 각각 실패해도 부분 응답을 보장한다.
 * 캐시는 vebapi.ts 내부에서 처리되므로 동일 도메인 재요청은 빠르다.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { extractDomain, isValidDomain } from '@/lib/domain'
import {
  getAnalyzeV2,
  getSingleKeyword,
  getRelatedKeywords,
  getTopRankedKeywords,
  getAiVisibility,
  type AnalyzeV2Result,
  type KeywordMetric,
  type TopRankedKeyword,
  type AiVisibilityResult,
} from '@/lib/vebapi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export type EnrichmentResponse = {
  analyzeV2: AnalyzeV2Result | null
  singleKeyword: KeywordMetric | null
  relatedKeywords: KeywordMetric[]
  topRankedKeywords: TopRankedKeyword[]
  aiVisibility: AiVisibilityResult | null
  fetchedAt: string
}

export async function GET(request: NextRequest) {
  const rawDomain = request.nextUrl.searchParams.get('domain')?.trim()
  const keyword = request.nextUrl.searchParams.get('keyword')?.trim() || null
  const country = request.nextUrl.searchParams.get('country')?.trim() || 'kr'

  if (!rawDomain) {
    return NextResponse.json({ error: 'domain parameter required' }, { status: 400 })
  }

  const domain = extractDomain(rawDomain)
  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: 'invalid domain' }, { status: 400 })
  }

  // 5개 호출 병렬 실행. 각각 실패해도 다른 데이터는 살린다.
  const [analyzeV2, singleKeyword, relatedKeywords, topRankedKeywords, aiVisibility] =
    await Promise.all([
      safeCall(() => getAnalyzeV2(domain)),
      keyword ? safeCall(() => getSingleKeyword(keyword, country)) : Promise.resolve(null),
      keyword
        ? safeCall(() => getRelatedKeywords(keyword, country)).then(r => r ?? [])
        : Promise.resolve([] as KeywordMetric[]),
      safeCall(() => getTopRankedKeywords(domain)).then(r => r ?? []),
      safeCall(() => getAiVisibility(domain)),
    ])

  const body: EnrichmentResponse = {
    analyzeV2,
    singleKeyword,
    relatedKeywords,
    topRankedKeywords,
    aiVisibility,
    fetchedAt: new Date().toISOString(),
  }

  return NextResponse.json(body)
}

async function safeCall<T>(fn: () => Promise<T | null>): Promise<T | null> {
  try {
    return await fn()
  } catch (err) {
    console.error('[enrichment.safeCall]', err)
    return null
  }
}
