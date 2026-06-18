# AI 상담 챗봇 (이식 가능한 뼈대)

24/7 AI 1차 응대 → 사람 채널(텔레그램 등)로 승격하는 익명 상담 위젯.
**프롬프트 주입(in-context) 방식**이라, 프로젝트마다 `config.ts`만 갈아끼우면 그대로 재사용된다.
(RAG/벡터스토어 아님 — 지식이 작아 시스템 프롬프트에 통째로 넣는 게 가장 빠르고 정확하고 저렴하다.)

## 구조

| 파일                              | 역할                                                         | 프로젝트마다 수정? |
| --------------------------------- | ------------------------------------------------------------ | ------------------ |
| `lib/chatbot/config.ts`           | 브랜드·인사말·FAQ·가격·에스컬레이션·**시스템 프롬프트 내용** | ✅ **이 파일만**   |
| `lib/chatbot/types.ts`            | 타입                                                         | ❌                 |
| `lib/chatbot/engine.ts`           | 시스템 프롬프트 조립기(가드레일·톤 골격)                     | ❌                 |
| `lib/chatbot/index.ts`            | 배럴(공개 진입점)                                            | ❌                 |
| `app/components/AiChatWidget.tsx` | 플로팅 위젯 UI                                               | ❌                 |
| `app/api/chat/route.ts`           | OpenAI 호출 + IP 레이트리밋                                  | ❌                 |

엔진은 항상 동일한 가드레일 위에서 동작한다: 가격 단정 금지 · 완전 익명 · 주제 이탈 거절 ·
탈옥(프롬프트 변경) 거부 · 대화 맥락 기억 · 사람 채널로 승격.

## 다른 프로젝트로 이식하기

1. **복사**: `lib/chatbot/`, `app/components/AiChatWidget.tsx`, `app/api/chat/route.ts`,
   그리고 레이트리밋용 마이그레이션(`supabase/migrations/*_create_ai_chat_rate_limit.sql`).
2. **`config.ts` 새로 작성** — 아래 항목을 새 프로젝트에 맞게:
   - `prompt.persona` / `prompt.topicScope` / `prompt.escalationChannelName` / `prompt.offTopicReply`
   - `prompt.businessKnowledge` (서비스·가격·FAQ·핵심 입장)
   - `faqItems` / `priceItems` (클릭 시 AI 없이 즉시 노출되는 고정 답변)
   - 브랜딩(`brandName` 등) · `greeting` · `storageKey`(프로젝트마다 다르게)
   - 에스컬레이션(`escalation*`) — 텔레그램이 아니면 `escalationSessionEndpoint: null`로 두고
     `escalationFallbackUrl`만 채우면 정적 링크로 동작
   - `onEscalate` — 애널리틱스 등 프로젝트 글루(없으면 생략)
3. **환경변수**: `OPENAI_API_KEY` (필수), `OPENAI_CHAT_MODEL`(선택, 기본 `gpt-5-nano`).
4. **위젯 마운트**: 페이지에서 `<AiChatWidget />` 또는 진단 맥락이 있으면
   `<AiChatWidget context={{ domain, keyword, score }} />`.

## 의존성 (이식 시 같이 챙길 것)

- **OpenAI** — `gpt-5-nano`(추론 모델). `max_completion_tokens` + `reasoning_effort` 사용,
  `temperature` 미지원. `route.ts`에 반영돼 있음.
- **레이트리밋** — Supabase `ai_chat_usage` 테이블(IP 해시, 시간당). 없으면 graceful degrade
  (막지 않음). 다른 백엔드면 `route.ts`의 `isRateLimited`만 교체.
- **에스컬레이션 딥링크** — `escalationSessionEndpoint`가 가리키는 API. 없으면 `null` + 정적 링크.
- **애널리틱스(`onEscalate`)** — 선택. 위젯 자체는 애널리틱스 의존성이 없다(글루는 config에 격리).

## 비용 메모

`gpt-5-nano` input ≈ $0.05 / 1M tokens. 시스템 프롬프트(~수백 토큰) + 최근 대화 24개를
매 요청 재전송해도 1요청 ≈ 0.3원 수준. 24개 상한(`route.ts`의 `MAX_HISTORY`)이 비용을 묶는다.
