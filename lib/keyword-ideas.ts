/**
 * LLM 기반 관련 키워드 아이디어 생성.
 *
 * VebAPI keywordresearch 는 한국 시장 커버리지가 얇고(니치 키워드는 1~2개) 검색량도
 * 버킷형 추정이라, 관련 키워드는 LLM(gpt-4o-mini)으로 생성한다.
 *
 * ⚠️ 설계 원칙: LLM은 키워드 아이디어·전략 분류에 강하지만 "월 검색량" 같은 정확한
 * 숫자는 모른다. 가짜 숫자를 만들면 신뢰가 깨지므로, 숫자 대신 질적 신호
 * (검색 의도 / 상업성 / 공략 난이도 / 추천 이유)만 생성한다.
 *
 * 캐시: seo_enrichment_cache 14일 (vebapi.ts 캐시 헬퍼 재사용).
 */

import { getCached, setCached } from './vebapi'

export type KeywordIntent = '정보형' | '거래형' | '지역형' | '브랜드형'
export type QualLevel = '상' | '중' | '하'

export type KeywordIdea = {
  keyword: string
  intent: KeywordIntent
  /** 구매/문의 전환으로 이어질 상업적 가치 */
  commercialValue: QualLevel
  /** 유기적 상위 노출까지의 추정 난이도 */
  difficulty: QualLevel
  /** 왜 이 키워드를 노려야 하는지 한 줄 */
  reason: string
}

const IDEAS_TTL_DAYS = 14
const INTENTS: KeywordIntent[] = ['정보형', '거래형', '지역형', '브랜드형']
const LEVELS: QualLevel[] = ['상', '중', '하']

export async function generateKeywordIdeas(params: {
  seedKeyword: string
  domain: string
  siteTitle?: string | null
  count?: number
}): Promise<KeywordIdea[]> {
  const { seedKeyword, domain, siteTitle, count = 9 } = params
  const seed = seedKeyword?.trim()
  if (!seed) return []

  const cacheKey = `ideas:${seed.toLowerCase()}:${domain}`
  const cached = await getCached(cacheKey, IDEAS_TTL_DAYS)
  if (cached) return cached as KeywordIdea[]

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return []

  const systemPrompt =
    '당신은 한국 시장 전문 SEO 키워드 전략가입니다. ' +
    '주어진 사업의 씨앗 키워드를 바탕으로, 실제 한국 사용자가 구글에 검색할 법한 ' +
    '관련/롱테일 키워드를 발굴합니다. 검색량 같은 정확한 숫자는 추측하지 말고, ' +
    '검색 의도와 상업적 가치, 공략 난이도 같은 질적 판단만 제공합니다. ' +
    '반드시 한국어 키워드로, 실제 검색 행태에 맞게 제안하세요.'

  const ctx: string[] = [`씨앗 키워드: "${seed}"`, `도메인: ${domain}`]
  if (siteTitle?.trim()) ctx.push(`사이트 제목/설명: ${siteTitle.trim().slice(0, 200)}`)

  const userPrompt =
    ctx.join('\n') +
    `\n\n위 사업과 직접 관련된 한국어 관련 키워드 ${count}개를 발굴해주세요.\n` +
    '각 키워드마다 다음을 판단해 JSON으로만 답하세요.\n' +
    '- keyword: 한국어 키워드 (씨앗 키워드와 중복 금지, 서로 다른 각도로 다양하게)\n' +
    '- intent: 검색 의도 — "정보형" | "거래형" | "지역형" | "브랜드형" 중 하나\n' +
    '- commercialValue: 문의/구매 전환 가치 — "상" | "중" | "하"\n' +
    '- difficulty: 유기적 상위 노출 난이도 추정 — "상" | "중" | "하"\n' +
    '- reason: 이 키워드를 노려야 하는 이유 한 줄 (40자 이내)\n\n' +
    '형식: {"keywords": [{"keyword": "...", "intent": "...", "commercialValue": "...", "difficulty": "...", "reason": "..."}]}'

  // gpt-5-nano: 추론 모델 → max_completion_tokens 사용, temperature 생략,
  // reasoning_effort=low (키워드 발굴엔 약간의 추론이 도움). 모델은 env로 교체 가능.
  const model = process.env.OPENAI_CHAT_MODEL || 'gpt-5-nano'
  const payload: Record<string, unknown> = {
    model,
    max_completion_tokens: 1500,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  }
  if (model.startsWith('gpt-5')) payload.reasoning_effort = 'low'

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: AbortSignal.timeout(25000),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('[keyword-ideas] OpenAI 오류:', response.status)
      return []
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return []

    const parsed = JSON.parse(content) as { keywords?: unknown }
    const arr = Array.isArray(parsed.keywords) ? parsed.keywords : []
    const ideas = arr
      .map(normalizeIdea)
      .filter((k): k is KeywordIdea => k !== null && k.keyword.toLowerCase() !== seed.toLowerCase())
      .slice(0, count)

    if (ideas.length > 0) await setCached(cacheKey, ideas)
    return ideas
  } catch (err) {
    console.error('[keyword-ideas] 생성 실패:', err)
    return []
  }
}

function normalizeIdea(raw: unknown): KeywordIdea | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const keyword = typeof o.keyword === 'string' ? o.keyword.trim() : ''
  if (!keyword) return null
  const intent = INTENTS.includes(o.intent as KeywordIntent)
    ? (o.intent as KeywordIntent)
    : '정보형'
  const commercialValue = LEVELS.includes(o.commercialValue as QualLevel)
    ? (o.commercialValue as QualLevel)
    : '중'
  const difficulty = LEVELS.includes(o.difficulty as QualLevel) ? (o.difficulty as QualLevel) : '중'
  const reason = typeof o.reason === 'string' ? o.reason.trim().slice(0, 60) : ''
  return { keyword, intent, commercialValue, difficulty, reason }
}
