/**
 * Resend 이메일 클라이언트 설정
 * 환경변수 RESEND_API_KEY 필요
 */

import { Resend } from 'resend'

// Resend 클라이언트 초기화
export const resend = new Resend(process.env.RESEND_API_KEY)

// 발신자 이메일 (Resend에서 인증된 도메인 필요)
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// 관리자 이메일 (알림 수신용)
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
