/**
 * 재사용 가능한 AI 상담 챗봇 — 공개 진입점(배럴).
 *
 * 소비자(위젯·API)는 여기서만 가져온다:
 *   import { chatbotConfig, buildSystemPrompt, type ChatContext } from '@/lib/chatbot'
 */

export type { ChatContext, ChatQA, ChatbotConfig, ChatbotPrompt } from './types'
export { buildSystemPrompt } from './engine'
export { chatbotConfig } from './config'
