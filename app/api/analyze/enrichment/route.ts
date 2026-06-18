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
  getAiVisibility,
  type AnalyzeV2Result,
  type KeywordMetric,
  type AiVisibilityResult,
} from '@/lib/vebapi'
import { generateKeywordIdeas, type KeywordIdea } from '@/lib/keyword-ideas'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export type EnrichmentResponse = {
  analyzeV2: AnalyzeV2Result | null
  singleKeyword: KeywordMetric | null
  /** LLM 생성 관련 키워드 아이디어 (질적 신호) — 기존 VebAPI keywordresearch 대체 */
  keywordIdeas: KeywordIdea[]
  aiVisibility: AiVisibilityResult | null
  fetchedAt: string
}

export async function GET(request: NextRequest) {
  const rawDomain = request.nextUrl.searchParams.get('domain')?.trim()
  const keyword = request.nextUrl.searchParams.get('keyword')?.trim() || null
  const title = request.nextUrl.searchParams.get('title')?.trim() || null
  const country = request.nextUrl.searchParams.get('country')?.trim() || 'kr'

  if (!rawDomain) {
    return NextResponse.json({ error: 'domain parameter required' }, { status: 400 })
  }

  const domain = extractDomain(rawDomain)
  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: 'invalid domain' }, { status: 400 })
  }

  // 병렬 실행. 각각 실패해도 다른 데이터는 살린다.
  const [analyzeV2, singleKeyword, keywordIdeas, aiVisibility] = await Promise.all([
    safeCall(() => getAnalyzeV2(domain)),
    keyword ? safeCall(() => getSingleKeyword(keyword, country)) : Promise.resolve(null),
    keyword
      ? safeCall(() =>
          generateKeywordIdeas({ seedKeyword: keyword, domain, siteTitle: title })
        ).then(r => r ?? [])
      : Promise.resolve([] as KeywordIdea[]),
    safeCall(() => getAiVisibility(domain)),
  ])

  const body: EnrichmentResponse = {
    analyzeV2,
    singleKeyword,
    keywordIdeas: keywordIdeas ?? [],
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
