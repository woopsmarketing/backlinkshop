/**
 * 텔레그램 봇 자동 응답 메시지 포맷터.
 *
 * lp_requests 의 seo_report_data(JSONB) 를 받아서 사용자 메시지 / 운영자 알림 메시지로 변환한다.
 * 카피 톤은 PRD: 데이터 기반, 거품 없음, 친절하지만 전문가.
 */

import { escapeHtml, type TelegramInlineKeyboard } from './telegram'
import { calculateCompetitorGap, type CompetitorMetrics, type CompetitorGap } from './lp-metrics'
import type { AnalyzeV2Result, AiVisibilityResult, KeywordMetric, TopRankedKeyword } from './vebapi'

export type LpRequestRow = {
  id: string
  url: string
  keyword: string
  email: string
  ip_address: string | null
  created_at: string
  seo_report_data: Record<string, unknown> | null
}

export type SessionRow = {
  id: string
  source: string | null
  ref: string | null
  created_at: string
}

export type TelegramUserRow = {
  chat_id: number
  username: string | null
  first_name: string | null
  last_name: string | null
  language_code: string | null
  first_seen_at: string
  total_sessions: number
  analyzed_domains: string[]
}

export type TelegramFromPayload = {
  id: number
  is_bot?: boolean
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.backlinkshop.co.kr'

// ─────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────

function pickNum(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function pickStr(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function formatNum(n: number | null): string {
  if (n === null) return '—'
  return n.toLocaleString('ko-KR')
}

function gapLabel(mine: number | null, comp: number | null): string {
  if (mine === null || comp === null) return '—'
  const diff = mine - comp
  if (diff > 0) return `+${formatNum(diff)}`
  return formatNum(diff)
}

/**
 * 매 메뉴 응답에 자동으로 붙는 영구 메뉴 키보드.
 * 사용자가 메뉴를 누른 후에도 다음 행동으로 바로 넘어갈 수 있도록 한다.
 */
export function buildPersistentMenuKeyboard(): TelegramInlineKeyboard {
  return [
    [
      { text: '💬 1:1 상담', callback_data: 'menu:contact' },
      { text: '📊 견적 안내', callback_data: 'menu:quote' },
    ],
    [
      { text: '💰 가격', callback_data: 'menu:price' },
      { text: '🏆 사례', callback_data: 'menu:cases' },
    ],
    [
      { text: '📋 서비스', callback_data: 'menu:services' },
      { text: '❓ FAQ', callback_data: 'menu:faq' },
    ],
  ]
}

/**
 * lp_requests.seo_report_data.competitorData 를 lp-metrics 형식의 CompetitorMetrics 로 변환.
 * 필드명이 raw object 이므로 타입 단언 없이 안전하게 변환한다.
 */
function toCompetitorMetrics(raw: unknown): CompetitorMetrics | null {
  if (!raw || typeof raw !== 'object') return null
  return raw as CompetitorMetrics
}

/**
 * 경쟁사 격차 — 뒤처진 항목만 라벨 형태로 변환 (예: "백링크 -328 · Moz DA -24점").
 */
function buildGapLabels(
  customer: CompetitorMetrics | null,
  competitors: CompetitorMetrics[]
): string[] {
  if (!customer || competitors.length === 0) return []
  const gaps = calculateCompetitorGap(customer, competitors).filter(g => g.isBehind)
  return gaps.map(g => `${g.label} -${Math.round(g.gap).toLocaleString('ko-KR')}${g.suffix ?? ''}`)
}

// ─────────────────────────────────────────────────────────────
// 사용자 메시지: /start 진입 시 자동 응답 (분석 결과 있음)
// ─────────────────────────────────────────────────────────────

export function buildUserWelcomeWithReport(
  lp: LpRequestRow,
  session: SessionRow
): { text: string; keyboard: TelegramInlineKeyboard } {
  const domain = extractDomain(lp.url)
  const report = (lp.seo_report_data ?? {}) as Record<string, unknown>

  const score = pickNum(report.score)
  const parsed = (report.parsedData ?? {}) as Record<string, unknown>
  const competitor = (report.competitorData ?? {}) as Record<string, unknown>
  const customerMetrics = toCompetitorMetrics(competitor.customerMetrics)
  const competitorsRaw = Array.isArray(competitor.competitors) ? competitor.competitors : []
  const competitors: CompetitorMetrics[] = competitorsRaw
    .map(c => toCompetitorMetrics(c))
    .filter((c): c is CompetitorMetrics => c !== null)

  // 격차 (lp-metrics.calculateCompetitorGap 활용 — 분석 페이지와 동일 로직)
  const gapLabels = buildGapLabels(customerMetrics, competitors)

  // 진단 이슈 (parsed 기반)
  const issues: string[] = []
  const passes: string[] = []

  const metaDescLen = pickNum(parsed.metaDescriptionLength) ?? 0
  if (metaDescLen === 0) issues.push('메타 디스크립션 미설정')
  else if (metaDescLen < 50 || metaDescLen > 160)
    issues.push(`메타 디스크립션 길이 부적절 (${metaDescLen}자)`)
  else passes.push('메타 디스크립션 정상')

  if (parsed.duplicateH1 === true) issues.push('H1 태그 중복 사용')
  else if (Array.isArray(parsed.h1) && parsed.h1.length > 0) passes.push('H1 태그 정상')
  else issues.push('H1 태그 누락')

  const loadMs = pickNum(parsed.loadTimeMs)
  if (loadMs !== null) {
    if (loadMs > 1500) issues.push(`페이지 로딩 ${(loadMs / 1000).toFixed(1)}초 (권장 1.5초 이하)`)
    else passes.push(`페이지 로딩 ${(loadMs / 1000).toFixed(1)}초 (양호)`)
  }

  const imgNoAlt = pickNum(parsed.imgWithoutAlt) ?? 0
  if (imgNoAlt > 0) issues.push(`이미지 alt 누락 ${imgNoAlt}건`)

  // 백링크 격차가 큰 경우 issue 로도 추가
  const backlinkGap = gapLabels.find(g => g.startsWith('백링크') || g.includes('백링크'))
  if (backlinkGap) issues.push(backlinkGap)

  if (parsed.isHttps === true) passes.push('SSL 정상')
  if (parsed.hasViewport === true) passes.push('모바일 반응형 정상')
  if (parsed.hasStructuredData === true) passes.push('구조화 데이터 정상')

  // 상위 5개만
  const topIssues = issues.slice(0, 5)
  const topPasses = passes.slice(0, 3)

  // 메시지 조립
  let text = `👋 안녕하세요. <b>백링크샵</b>입니다.\n\n`
  text += `회원님의 사이트 <b>${escapeHtml(domain)}</b> 분석 결과를 정리해드릴게요.\n\n`
  text += `━━━━━━━━━━━━━━━\n`
  text += `📊 <b>종합 SEO 점수</b>\n`
  text += `${score !== null ? `${score} / 100점` : '점수 산출 중'}\n\n`
  text += `🎯 핵심 키워드: <b>${escapeHtml(lp.keyword)}</b>\n\n`

  if (gapLabels.length > 0) {
    text += `⚠️ <b>경쟁사 대비 격차</b>\n`
    text += gapLabels
      .slice(0, 4)
      .map(g => `• ${escapeHtml(g)}`)
      .join('\n')
    text += `\n`
  }
  text += `━━━━━━━━━━━━━━━\n\n`

  if (topIssues.length > 0) {
    text += `🔍 <b>우선 개선 항목</b> (전체 50개 중 핵심)\n`
    text += topIssues.map(i => `✗ ${escapeHtml(i)}`).join('\n')
    text += `\n\n`
  }
  if (topPasses.length > 0) {
    text += `✓ ${topPasses.map(p => escapeHtml(p)).join(' · ')}\n\n`
  }

  text += `━━━━━━━━━━━━━━━\n`
  text += `💡 <b>회원님 사이트의 빠른 상위 노출 루트</b>\n\n`
  text += `<b>1순위.</b> 메타태그 최적화 — 1~2주, 클릭률 1.5~2배\n`
  text += `<b>2순위.</b> 백링크 우선순위 10건 — 1~2개월, 키워드 3~5개 1페이지 진입\n`
  text += `<b>3순위.</b> 페이지 속도 개선 — 1주, 이탈률 20~30% 감소\n\n`
  text += `━━━━━━━━━━━━━━━\n`
  text += `🎯 <b>비슷한 업종 사례</b>\n`
  text += `동일 업종에서 위 순서로 진행 시 3~6개월 내 월 문의가 1.5~3배로 늘어난 케이스가 다수입니다.\n\n`
  text += `━━━━━━━━━━━━━━━\n`
  text += `💬 운영자가 <b>5~15분 안에 직접 답변</b>드립니다.\n`
  text += `편하게 질문해주세요. 또는 아래 메뉴를 활용하세요 👇`

  const analyzeUrl = `${SITE_URL}/analyze/${encodeURIComponent(domain)}`

  const keyboard: TelegramInlineKeyboard = [
    [{ text: '🔗 전체 진단 결과 웹에서 보기', url: analyzeUrl }],
    [
      { text: '📊 우선 작업 견적 묻기', callback_data: 'menu:quote' },
      { text: '💰 가격 안내', callback_data: 'menu:price' },
    ],
    [
      { text: '🏆 우리 업종 사례', callback_data: 'menu:cases' },
      { text: '📋 서비스 소개', callback_data: 'menu:services' },
    ],
    [
      { text: '💬 1:1 상담 요청', callback_data: 'menu:contact' },
      { text: '❓ FAQ', callback_data: 'menu:faq' },
    ],
  ]

  return { text, keyboard }
}

// ─────────────────────────────────────────────────────────────
// 사용자 후속 메시지: discovery question (4지선다)
// ─────────────────────────────────────────────────────────────

export function buildDiscoveryQuestion(): {
  text: string
  keyboard: TelegramInlineKeyboard
} {
  const text =
    `<b>운영자가 곧 직접 답변드릴 거예요.</b>\n` + `기다리시는 동안, 지금 가장 답답하신 게 뭔가요?`

  const keyboard: TelegramInlineKeyboard = [
    [{ text: '① 어떤 키워드부터 잡아야 할지 모르겠다', callback_data: 'discover:keyword' }],
    [{ text: '② 백링크가 진짜 필요한지 궁금하다', callback_data: 'discover:backlink' }],
    [{ text: '③ 예상 비용/기간이 궁금하다', callback_data: 'discover:cost' }],
    [{ text: '④ 그냥 직접 물어볼게요', callback_data: 'discover:direct' }],
  ]

  return { text, keyboard }
}

// ─────────────────────────────────────────────────────────────
// 사용자 메시지: /start 진입 시 (분석 결과 없음, 외부 채널)
// ─────────────────────────────────────────────────────────────

export function buildUserWelcomeNoReport(): {
  text: string
  keyboard: TelegramInlineKeyboard
} {
  const text =
    `👋 안녕하세요. <b>백링크샵 SEO 상담 봇</b>입니다.\n\n` +
    `구글 상위 노출, 어떻게 시작해야 할지 막막하신가요?\n\n` +
    `<b>저희가 도와드릴 수 있는 것:</b>\n` +
    `✓ 50개 항목 무료 SEO 진단\n` +
    `✓ 경쟁사 비교 분석 리포트\n` +
    `✓ 도메인 상태별 맞춤 실행 가이드\n` +
    `✓ 백링크/콘텐츠/온페이지 전략\n\n` +
    `먼저 무료 진단부터 받아보시려면 아래 버튼을 눌러주세요.\n` +
    `이미 진단을 받으셨다면 바로 1:1 상담을 요청해주세요.`

  const keyboard: TelegramInlineKeyboard = [
    [{ text: '🔍 무료 SEO 진단 받기', url: `${SITE_URL}/lp/seo?ref=telegram` }],
    [{ text: '💬 1:1 상담 요청', callback_data: 'menu:contact' }],
    [
      { text: '💰 가격 안내', callback_data: 'menu:price' },
      { text: '🏆 실제 사례', callback_data: 'menu:cases' },
    ],
    [
      { text: '📋 서비스 소개', callback_data: 'menu:services' },
      { text: '❓ FAQ', callback_data: 'menu:faq' },
    ],
  ]

  return { text, keyboard }
}

// ─────────────────────────────────────────────────────────────
// 메뉴 버튼 응답 메시지들
// ─────────────────────────────────────────────────────────────

export function buildMenuPrice(): string {
  return (
    `💰 <b>가격 안내</b>\n\n` +
    `서비스별 가격은 사이트 도메인 상태와 키워드 경쟁도에 따라 맞춤으로 책정됩니다.\n\n` +
    `<b>대략적인 시작가</b>\n` +
    `• 온페이지 SEO 패키지: 30만원~\n` +
    `• 백링크 우선순위 10건: 협의\n` +
    `• 종합 SEO 컨설팅: 견적 후 안내\n\n` +
    `회원님 사이트 기준 정확한 견적은 1:1 상담에서 안내드립니다.\n` +
    `편하게 질문해주세요 👇`
  )
}

export function buildMenuCases(): string {
  return (
    `🏆 <b>실제 진행 사례</b>\n\n` +
    `회원님 업종과 가장 비슷한 사례 데이터를 정리해서 1:1 상담에서 직접 보여드립니다.\n\n` +
    `(공개 가능한 사례는 운영자 검토 후 일부 공유드려요)\n\n` +
    `<b>회원님 업종을 알려주시면 해당 사례를 정리해드릴게요.</b>`
  )
}

export function buildMenuServices(): string {
  return (
    `📋 <b>백링크샵 전체 서비스</b>\n\n` +
    `🔍 SEO 진단 — 무료\n` +
    `📈 온페이지 SEO 최적화\n` +
    `🔗 백링크 패키지 (안전한 화이트햇)\n` +
    `✍️ SEO 콘텐츠 작성\n` +
    `🎯 키워드 전략 수립\n` +
    `📊 월간 SEO 리포트\n` +
    `🚀 종합 SEO 컨설팅\n\n` +
    `회원님 사이트 상태에 가장 효과적인 조합을 추천드립니다.\n` +
    `어떤 서비스가 필요하신지 편하게 말씀해주세요 👇`
  )
}

export function buildMenuFaq(): string {
  return (
    `❓ <b>자주 묻는 질문</b>\n\n` +
    `<b>Q. 정말 무료인가요?</b>\n` +
    `A. 진단까지 완전 무료. 카드 등록·자동 결제 없음.\n\n` +
    `<b>Q. 결과 신뢰할 수 있나요?</b>\n` +
    `A. Ahrefs/SEMrush 같은 글로벌 SEO 데이터 기반.\n\n` +
    `<b>Q. 얼마나 걸리나요?</b>\n` +
    `A. 온페이지 1~2주 / 백링크 1~2개월 / 키워드 진입 3~6개월\n\n` +
    `<b>Q. 직접 적용해도 되나요?</b>\n` +
    `A. 네, 보고서만 받고 끝내셔도 됩니다.\n\n` +
    `<b>Q. 결제는 어떻게?</b>\n` +
    `A. 카드/계좌이체. 계약 전 견적서 안내.\n\n` +
    `더 궁금한 점은 자유롭게 물어보세요 👇`
  )
}

export function buildMenuContact(): string {
  return (
    `💬 <b>운영자가 곧 답변드립니다</b>\n\n` +
    `평균 응답: 5~15분\n` +
    `업무 시간 외 진입 시: 다음 영업일 오전\n\n` +
    `지금 가장 궁금한 점을 자유롭게 말씀해주세요.\n\n` +
    `(예: "어떤 키워드부터 공략해야 빠를까요?"\n` +
    `"백링크 10건 패키지 견적이요" 등)`
  )
}

export function buildMenuQuote(domain?: string): string {
  return (
    `📊 <b>우선 작업 견적 안내</b>\n\n` +
    (domain ? `회원님 사이트 <b>${escapeHtml(domain)}</b> 기준\n` : '') +
    `진단된 우선순위:\n\n` +
    `<b>1단계.</b> 메타태그 최적화\n` +
    `→ 작업 기간 1~2주 / 예상 시작가 30만원~\n\n` +
    `<b>2단계.</b> 백링크 우선순위 10건\n` +
    `→ 작업 기간 1~2개월 / 별도 견적\n\n` +
    `<b>3단계.</b> 페이지 속도 개선\n` +
    `→ 작업 기간 약 1주 / 별도 견적\n\n` +
    `정확한 견적은 사이트 코드/구조를 직접 확인 후 안내드립니다.\n` +
    `먼저 작업하고 싶은 항목을 알려주세요 👇`
  )
}

// discovery question 응답 시 사용자에게 보낼 응답 + 운영자에게 전달할 의도 라벨
export function buildDiscoveryResponse(intent: string): { text: string; intentLabel: string } {
  switch (intent) {
    case 'keyword':
      return {
        intentLabel: '키워드 우선순위 궁금',
        text:
          `좋습니다. 운영자에게 <b>"키워드 우선순위"</b>에 대한 질문으로 전달했어요.\n\n` +
          `잠시 후 회원님 도메인 상태에 맞춰 어떤 키워드부터 잡으면 빠른지 직접 안내드립니다.\n\n` +
          `기다리시는 동안 추가로 궁금하신 점 적어주셔도 좋아요.`,
      }
    case 'backlink':
      return {
        intentLabel: '백링크 필요성 궁금',
        text:
          `좋습니다. 운영자에게 <b>"백링크 필요성"</b>에 대한 질문으로 전달했어요.\n\n` +
          `회원님 도메인의 현재 백링크 상태와 경쟁사 비교를 토대로 실제로 필요한지, 어느 정도가 필요한지 직접 안내드립니다.`,
      }
    case 'cost':
      return {
        intentLabel: '비용/기간 궁금',
        text:
          `좋습니다. 운영자에게 <b>"예상 비용/기간"</b>에 대한 질문으로 전달했어요.\n\n` +
          `회원님 도메인 상태 기준 가장 효율적인 작업 순서와 그에 따른 예상 비용/기간을 직접 안내드립니다.`,
      }
    case 'direct':
      return {
        intentLabel: '직접 질문 예정',
        text:
          `좋습니다. 운영자가 곧 직접 인사드릴게요.\n` +
          `지금 가장 궁금하신 점을 자유롭게 적어주세요 👇`,
      }
    default:
      return {
        intentLabel: '기타',
        text: `운영자에게 전달했어요. 곧 답변드립니다.`,
      }
  }
}

// ─────────────────────────────────────────────────────────────
// 운영자 알림 메시지
// ─────────────────────────────────────────────────────────────

export function buildAdminAlertForNewSession(
  lp: LpRequestRow | null,
  session: SessionRow,
  user: TelegramUserRow,
  from: TelegramFromPayload
): string {
  const domain = lp ? extractDomain(lp.url) : null
  const report = (lp?.seo_report_data ?? {}) as Record<string, unknown>
  const score = pickNum(report.score)
  const competitor = (report.competitorData ?? {}) as Record<string, unknown>
  const customerMetrics = toCompetitorMetrics(competitor.customerMetrics)
  const competitorsRaw = Array.isArray(competitor.competitors) ? competitor.competitors : []
  const competitors: CompetitorMetrics[] = competitorsRaw
    .map(c => toCompetitorMetrics(c))
    .filter((c): c is CompetitorMetrics => c !== null)

  const gapLabels = buildGapLabels(customerMetrics, competitors)

  const firstSeenDate = new Date(user.first_seen_at)
  const daysSinceFirst = Math.floor((Date.now() - firstSeenDate.getTime()) / (1000 * 60 * 60 * 24))
  const isReturning = user.total_sessions > 1

  const userName = [from.first_name, from.last_name].filter(Boolean).join(' ') || '(이름 없음)'
  const userHandle = from.username ? `@${from.username}` : '(유저네임 없음)'

  let text = `🔔 <b>새 텔레그램 상담 진입</b>\n\n`

  if (lp && domain) {
    text += `📌 <b>도메인 정보</b>\n`
    text += `사이트: <code>${escapeHtml(domain)}</code>\n`
    text += `키워드: <b>${escapeHtml(lp.keyword)}</b>\n`
    text += `이메일: <code>${escapeHtml(lp.email)}</code>\n`
    text += `점수: ${score !== null ? `${score}점` : '—'}\n`
    if (gapLabels.length > 0) {
      text += `주요 격차: ${gapLabels
        .slice(0, 3)
        .map(g => escapeHtml(g))
        .join(' / ')}\n`
    }
    text += `\n`
  } else {
    text += `📌 <b>외부 채널 진입</b> (분석 결과 없음)\n\n`
  }

  text += `👤 <b>사용자</b>\n`
  text += `이름: ${escapeHtml(userName)}\n`
  text += `유저네임: ${escapeHtml(userHandle)}${from.username ? ` (https://t.me/${from.username})` : ''}\n`
  text += `chat_id: <code>${from.id}</code>\n`
  text += `언어: ${escapeHtml(from.language_code || '—')}\n\n`

  text += `🌐 <b>유입 경로</b>\n`
  text += `LP 광고그룹: ${escapeHtml(refToLabel(session.ref))}\n`
  text += `CTA 위치: ${escapeHtml(session.source || '—')}\n`
  text += `진입 시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}\n\n`

  text += `📜 <b>누적 정보</b>\n`
  text += `• 첫 접점: ${firstSeenDate.toLocaleDateString('ko-KR')} (${daysSinceFirst}일 전)\n`
  text += `• 봇 진입 횟수: ${user.total_sessions}회 ${isReturning ? '🔁 재방문' : '🆕 신규'}\n`
  if (user.analyzed_domains.length > 0) {
    text += `• 분석 도메인: ${user.analyzed_domains
      .slice(0, 5)
      .map(d => escapeHtml(d))
      .join(', ')}\n`
  }
  text += `\n`

  text += `━━━━━━━━━━━━━━━\n`
  text += `🤖 <b>AI 빠른 정리</b>\n\n`

  // 사용자 유형 추정
  const userType = inferUserType(domain, lp?.keyword || '', score, session.ref)
  text += `👀 <b>사용자 유형:</b> ${escapeHtml(userType)}\n\n`

  // 가장 시급한 작업
  text += `🎯 <b>가장 시급한 작업:</b>\n`
  const urgentActions = inferUrgentActions(report)
  urgentActions.forEach((a, i) => {
    text += `${i + 1}. ${escapeHtml(a)}\n`
  })
  text += `\n`

  // 추천 견적
  text += `💰 <b>추천 견적:</b>\n`
  text += `온페이지 패키지 30~50만원 / 백링크 별도 견적\n\n`

  // 권장 첫 응답
  text += `💬 <b>권장 첫 응답:</b>\n`
  text += `"안녕하세요 ☺️ 분석 보셨군요. 회원님 사이트 보니까 ${urgentActions[0] || '메타태그'}부터 1주 안에 끝낼 수 있는데, 혹시 지금 가장 중요한 키워드 하나 알려주실 수 있을까요?"\n\n`

  text += `⏰ <b>응답 권장:</b> 5~15분 내 (광고 유입 — 식는 속도 빠름)`

  return text
}

export function buildAdminAlertForUserMessage(
  user: TelegramUserRow,
  from: TelegramFromPayload,
  messageText: string
): string {
  const userName = [from.first_name, from.last_name].filter(Boolean).join(' ') || '(이름 없음)'
  const userHandle = from.username ? `@${from.username}` : '(유저네임 없음)'

  let text = `💬 <b>사용자 메시지</b>\n\n`
  text += `👤 ${escapeHtml(userName)} (${escapeHtml(userHandle)})\n`
  text += `chat_id: <code>${from.id}</code>\n`
  if (from.username) {
    text += `직접 대화: https://t.me/${from.username}\n`
  }
  text += `\n📝 메시지:\n<blockquote>${escapeHtml(messageText)}</blockquote>`
  return text
}

export function buildAdminAlertForDiscovery(
  user: TelegramUserRow,
  from: TelegramFromPayload,
  intentLabel: string
): string {
  const userName = [from.first_name, from.last_name].filter(Boolean).join(' ') || '(이름 없음)'
  const userHandle = from.username ? `@${from.username}` : '(유저네임 없음)'

  let text = `🎯 <b>Discovery 응답</b>\n\n`
  text += `👤 ${escapeHtml(userName)} (${escapeHtml(userHandle)})\n`
  text += `chat_id: <code>${from.id}</code>\n`
  if (from.username) {
    text += `직접 대화: https://t.me/${from.username}\n`
  }
  text += `\n📌 의도: <b>${escapeHtml(intentLabel)}</b>\n\n`
  text += `→ 이 의도에 맞춰 첫 답변을 보내주세요.`
  return text
}

// ─────────────────────────────────────────────────────────────
// inference helpers (AI 정리용)
// ─────────────────────────────────────────────────────────────

function refToLabel(ref: string | null): string {
  switch (ref) {
    case 'audit':
      return 'SEO진단 (audit)'
    case 'rank':
      return '구글상위노출 (rank)'
    case 'backlink':
      return '백링크구매 (backlink)'
    case 'agency':
      return 'SEO대행 (agency)'
    case 'blog':
      return '블로그 유입'
    case 'instagram':
      return '인스타그램 유입'
    case 'telegram':
      return '텔레그램 직접 유입'
    default:
      return ref || '직접 유입'
  }
}

function inferUserType(
  domain: string | null,
  keyword: string,
  score: number | null,
  ref: string | null
): string {
  const parts: string[] = []

  // 업종 추정 (키워드 기반)
  const industryHints = [
    { pat: /(한의원|병원|치과|성형|피부|의원|클리닉|약국)/, label: '의료/헬스' },
    { pat: /(부동산|아파트|매물|중개)/, label: '부동산' },
    { pat: /(쇼핑몰|패션|의류|코스메|화장품)/, label: '이커머스' },
    { pat: /(학원|과외|교습|입시|학교)/, label: '교육' },
    { pat: /(법무|법률|변호사|세무|회계)/, label: '법무/세무' },
    { pat: /(인테리어|시공|건축|리모델링)/, label: '건축/인테리어' },
    { pat: /(맛집|식당|카페|레스토랑|배달)/, label: '외식' },
    { pat: /(여행|숙박|호텔|펜션)/, label: '여행/숙박' },
  ]
  const matched = industryHints.find(h => h.pat.test(keyword))
  parts.push(matched ? matched.label : '일반 업종')

  // SEO 수준 추정
  if (score !== null) {
    if (score >= 80) parts.push('SEO 상급')
    else if (score >= 60) parts.push('SEO 중급')
    else parts.push('SEO 초급')
  }

  // 광고 의존도 (ref 기반)
  if (ref === 'rank' || ref === 'audit') parts.push('광고 의존도 높음')

  return parts.join(' / ')
}

function inferUrgentActions(report: Record<string, unknown>): string[] {
  const parsed = (report.parsedData ?? {}) as Record<string, unknown>
  const actions: string[] = []

  // 메타 디스크립션
  const mdLen = pickNum(parsed.metaDescriptionLength) ?? 0
  if (mdLen === 0 || mdLen < 50) {
    actions.push('메타 디스크립션 + H1 정리 (즉시 효과)')
  }

  // 페이지 속도
  const loadMs = pickNum(parsed.loadTimeMs)
  if (loadMs !== null && loadMs > 2000) {
    actions.push('페이지 속도 개선 (이탈률 직접 감소)')
  }

  // 이미지 alt
  const imgNoAlt = pickNum(parsed.imgWithoutAlt) ?? 0
  if (imgNoAlt > 10) {
    actions.push(`이미지 alt 일괄 추가 (${imgNoAlt}건)`)
  }

  // 백링크 — 실제 필드명: ahrefsBacklinks 또는 backlinkTotal
  const competitor = (report.competitorData ?? {}) as Record<string, unknown>
  const myMetrics = toCompetitorMetrics(competitor.customerMetrics)
  const myBacklinks = myMetrics
    ? (pickNum(myMetrics.ahrefsBacklinks) ?? pickNum(myMetrics.backlinkTotal))
    : null
  if (myBacklinks !== null && myBacklinks < 30) {
    actions.push('백링크 우선순위 10건 확보 (DA 상승)')
  }

  if (actions.length === 0) actions.push('전반적 SEO 점검 후 우선순위 잡기')

  return actions.slice(0, 3)
}

// ─────────────────────────────────────────────────────────────
// 정밀 분석 메시지 빌더 (R3-C)
// ─────────────────────────────────────────────────────────────

/**
 * 키워드 정밀 분석 — 입력 키워드 + 관련 키워드 전체 + 도메인 기존 노출 키워드.
 * 페이지에서 잠겨 있던 데이터를 텔레그램에서 풀로 공개.
 */
export function buildKeywordDetailMessage(
  inputKeyword: string | null,
  singleKeyword: KeywordMetric | null,
  related: KeywordMetric[],
  topRanked: TopRankedKeyword[]
): string {
  if (!singleKeyword && related.length === 0 && topRanked.length === 0) return ''

  let text = `🔓 <b>키워드 정밀 분석 (전체 공개)</b>\n\n`

  if (singleKeyword && inputKeyword) {
    text += `🎯 <b>입력하신 키워드:</b> ${escapeHtml(singleKeyword.text)}\n`
    text += `• 월 검색량: <b>${(singleKeyword.searchVolume ?? 0).toLocaleString('ko-KR')}회</b>\n`
    text += `• CPC: $${singleKeyword.cpc?.toFixed(2) ?? '—'}\n`
    text += `• 경쟁도: <b>${competitionKo(singleKeyword.competition)}</b>\n\n`
  }

  if (related.length > 0) {
    const sorted = [...related].sort((a, b) => (b.searchVolume ?? 0) - (a.searchVolume ?? 0))
    text += `━━━━━━━━━━━━━━━\n`
    text += `📋 <b>매출 기회 관련 키워드 ${sorted.length}개</b> (전체 공개)\n\n`
    sorted.slice(0, 15).forEach((k, i) => {
      const vol = (k.searchVolume ?? 0).toLocaleString('ko-KR')
      text += `${i + 1}. <b>${escapeHtml(k.text)}</b>\n`
      text += `   월 ${vol}회 · ${competitionKo(k.competition)}${k.cpc ? ` · CPC $${k.cpc.toFixed(2)}` : ''}\n`
    })
    text += `\n`
  }

  if (topRanked.length > 0) {
    const sorted = [...topRanked].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
    const inTop10 = sorted.filter(k => k.rank !== null && k.rank <= 10).length
    const nearTop10 = sorted.filter(k => k.rank !== null && k.rank >= 11 && k.rank <= 20)

    text += `━━━━━━━━━━━━━━━\n`
    text += `📈 <b>이미 구글에 노출 중인 키워드 ${sorted.length}개</b>\n`
    text += `• 1페이지 진입: ${inTop10}개\n`
    text += `• 11~20위 (진입 임박): ${nearTop10.length}개 ⚡\n\n`

    if (nearTop10.length > 0) {
      text += `<b>🔥 1페이지 진입이 가장 빠른 키워드:</b>\n`
      nearTop10.slice(0, 5).forEach(k => {
        text += `• <b>${escapeHtml(k.keyword)}</b> (현재 ${k.rank}위, 월 ${(k.searchVolume ?? 0).toLocaleString('ko-KR')}회)\n`
      })
      text += `\n`
    }

    text += `<b>상위 노출 키워드 (TOP 10):</b>\n`
    sorted.slice(0, 10).forEach(k => {
      text += `• ${escapeHtml(k.keyword)} — ${k.rank}위 (월 ${(k.searchVolume ?? 0).toLocaleString('ko-KR')}회)\n`
    })
    text += `\n`
  }

  text += `━━━━━━━━━━━━━━━\n`
  text += `💬 어떤 키워드부터 공략하면 매출이 가장 빨리 늘어날지, 회원님 사업 규모에 맞춰 직접 안내드릴게요.`

  return text
}

/**
 * AI 친화도 + 정밀 진단 6분류 + 우선순위 이슈 통합 메시지.
 */
export function buildAiAndPrecisionMessage(
  aiVisibility: AiVisibilityResult | null,
  analyzeV2: AnalyzeV2Result | null
): string {
  if (!aiVisibility && !analyzeV2) return ''

  let text = `🔓 <b>AI SEO + 정밀 진단 (전체 공개)</b>\n\n`

  if (aiVisibility && aiVisibility.overall !== null) {
    text += `🤖 <b>AI 검색 친화도</b> (ChatGPT/Perplexity)\n`
    text += `• 종합 점수: <b>${aiVisibility.overall}/100${aiVisibility.grade ? ` (${aiVisibility.grade}등급)` : ''}</b>\n`
    if (aiVisibility.aiScrapable !== null) {
      text += `• AI 크롤러 접근: ${aiVisibility.aiScrapable ? '✓ 가능' : '✗ 차단됨'}\n`
    }
    text += `\n`

    if (aiVisibility.issues.length > 0) {
      text += `<b>발견된 AI SEO 문제 ${aiVisibility.issues.length}개:</b>\n`
      aiVisibility.issues.slice(0, 8).forEach(i => {
        const sev = i.severity === 'high' ? '🔴' : i.severity === 'medium' ? '🟡' : '⚪'
        text += `${sev} ${escapeHtml(i.description)}\n`
      })
      text += `\n`
    }
  }

  if (analyzeV2) {
    text += `━━━━━━━━━━━━━━━\n`
    text += `⚙️ <b>정밀 진단 6분류 점수</b>\n`
    if (analyzeV2.scores.overall !== null) {
      text += `• 종합: <b>${analyzeV2.scores.overall}/100${analyzeV2.scores.grade ? ` (${analyzeV2.scores.grade}등급)` : ''}</b>\n`
    }
    const bucketLabels: Array<[string, number | null]> = [
      ['성능', analyzeV2.scores.performance],
      ['기술 SEO', analyzeV2.scores.technical],
      ['온페이지', analyzeV2.scores.onpage],
      ['보안', analyzeV2.scores.security],
      ['AI 준비도', analyzeV2.scores.ai_readiness],
      ['접근성', analyzeV2.scores.accessibility],
    ]
    bucketLabels
      .filter(([, v]) => v !== null)
      .forEach(([label, value]) => {
        const v = value as number
        const emoji = v >= 70 ? '🟢' : v >= 40 ? '🟡' : '🔴'
        text += `${emoji} ${label}: <b>${Math.round(v)}</b>\n`
      })
    text += `\n`

    if (analyzeV2.priorityIssues.length > 0) {
      text += `<b>우선 개선 이슈 ${analyzeV2.priorityIssues.length}개:</b>\n`
      analyzeV2.priorityIssues.slice(0, 8).forEach(i => {
        const sev = i.severity === 'high' ? '🔴' : i.severity === 'medium' ? '🟡' : '⚪'
        text += `${sev} ${escapeHtml(i.issue)}`
        if (i.fix) text += ` — <i>${escapeHtml(i.fix)}</i>`
        text += `\n`
      })
      text += `\n`
    }
  }

  text += `━━━━━━━━━━━━━━━\n`
  text += `💬 이 이슈들을 어떤 순서로 고치면 매출 상승이 가장 빠른지, 회원님 도메인 상태 보고 직접 추천드릴게요.`

  return text
}

/**
 * 매출 강조 마무리 멘트 (자동 발송 마지막).
 */
export function buildClosingPitch(domain: string): string {
  return (
    `━━━━━━━━━━━━━━━\n` +
    `💎 <b>${escapeHtml(domain)} 매출 상승 로드맵</b>\n\n` +
    `여기까지 받으신 데이터를 토대로:\n` +
    `✓ <b>1순위 작업과 예상 매출 증가분</b>\n` +
    `✓ <b>3~6개월 내 1페이지 진입 가능 키워드 3~5개</b>\n` +
    `✓ <b>회원님 업종의 실제 매출 상승 사례</b>\n` +
    `✓ <b>작업별 정확한 견적</b>\n\n` +
    `이 4가지를 회원님 도메인 상태/사업 규모에 맞춰 운영자가 직접 산출해드립니다.\n\n` +
    `편하게 질문해주세요 — 평균 응답 5~15분 ☺️`
  )
}

function competitionKo(c: 'Low' | 'Medium' | 'High' | null): string {
  switch (c) {
    case 'Low':
      return '낮음 ⭐'
    case 'Medium':
      return '중간'
    case 'High':
      return '높음'
    default:
      return '—'
  }
}
