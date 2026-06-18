/**
 * 재사용 가능한 AI 상담 챗봇 위젯 — 타입 정의.
 *
 * 이 폴더(lib/chatbot)는 "엔진"이고, 프로젝트별로 바뀌는 값은 전부 config.ts에 모은다.
 * 다른 프로젝트에 이식할 때는 config.ts만 새로 작성하면 된다. README.md 참고.
 */

/** 방문자의 (선택적) 진단/맥락 데이터. 시스템 프롬프트에 주입되어 맞춤 답변에 쓰인다. */
export type ChatContext = {
  domain?: string | null
  keyword?: string | null
  score?: number | null
  /** 경쟁사 대비 뒤처진 항목 라벨 (예: "백링크 -328") */
  gaps?: string[]
  /** 진단된 우선 개선 항목 요약 */
  issues?: string[]
  /** 분석 시각(ISO). 같은 URL은 14일간 캐시 → AI가 캐시 여부를 안내할 수 있게 전달. */
  analyzedAt?: string | null
}

/** 빠른 메뉴(FAQ·가격)의 한 항목 — 클릭 시 AI 호출 없이 고정 답변을 즉시 노출. */
export type ChatQA = { q: string; a: string }

/** 챗봇 1개 분량의 모든 프로젝트별 설정. */
export type ChatbotConfig = {
  // ── UI / 브랜딩 ──
  brandName: string
  brandSubtitle: string
  /** 런처 버튼 라벨(데스크톱) */
  launcherLabel: string
  /** 런처 버튼 라벨(모바일) */
  launcherLabelShort: string
  /** 첫 인사말 (대화 맨 위 고정 노출) */
  greeting: string
  /** sessionStorage 키 — 프로젝트마다 다르게 (충돌 방지) */
  storageKey: string

  // ── 빠른 메뉴 ──
  faqHint?: string
  priceHint?: string
  faqItems: ChatQA[]
  priceItems: ChatQA[]

  // ── 에스컬레이션 (사람 상담 채널로 승격) ──
  /** 승격 버튼 문구 */
  escalationLabel: string
  /** 딥링크 발급 실패 시 열 기본 URL (예: 텔레그램 봇 링크) */
  escalationFallbackUrl: string
  /** 딥링크 발급 API 경로. null이면 fallbackUrl을 그대로 연다. */
  escalationSessionEndpoint: string | null
  /** 세션/트래킹용 소스 라벨 */
  escalationSource: string
  /** 선택: 승격 클릭 시 부수효과(애널리틱스 등) — 프로젝트 글루를 여기로 격리. */
  onEscalate?: (context?: ChatContext) => void

  // ── AI 프롬프트(브레인) ──
  prompt: ChatbotPrompt
}

export type ChatbotPrompt = {
  /** 페르소나 한 줄 (예: '당신은 한국 SEO 대행사 "백링크샵"의 상담 AI입니다. …') */
  persona: string
  /** 답변 허용 주제 범위 (예: 'SEO·구글 상위 노출·백링크·백링크샵 서비스/견적') */
  topicScope: string
  /** 사람 상담 채널 이름 (예: '텔레그램') */
  escalationChannelName: string
  /** 주제 이탈 시 거절 예시 문구 */
  offTopicReply: string
  /** 비즈니스 지식베이스 (서비스·가격·FAQ·핵심 입장 등) */
  businessKnowledge: string
}
