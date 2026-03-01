/**
 * 이메일 발송 유틸리티 함수
 * Resend를 사용한 이메일 발송 래퍼
 */

'use server'

import { resend, FROM_EMAIL, ADMIN_EMAIL } from './resend'
import { ReactElement } from 'react'

/**
 * 이메일 발송 결과 타입
 */
export type SendEmailResult = {
  success: boolean
  error?: string
  messageId?: string
}

/**
 * 이메일 발송 함수
 * @param to 수신자 이메일
 * @param subject 제목
 * @param react React 이메일 템플릿
 */
export async function sendEmail(
  to: string,
  subject: string,
  react: ReactElement
): Promise<SendEmailResult> {
  try {
    // Resend API 키 확인
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY가 설정되지 않았습니다')
      return { success: false, error: 'Email service not configured' }
    }

    // 이메일 발송
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      react,
    })

    if (error) {
      console.error('이메일 발송 실패:', error)
      return { success: false, error: error.message }
    }

    console.log('이메일 발송 성공:', { to, subject, messageId: data?.id })
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('이메일 발송 오류:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

/**
 * 관리자에게 이메일 발송
 * @param subject 제목
 * @param react React 이메일 템플릿
 */
export async function sendEmailToAdmin(
  subject: string,
  react: ReactElement
): Promise<SendEmailResult> {
  return sendEmail(ADMIN_EMAIL, subject, react)
}

/**
 * 여러 수신자에게 동일한 이메일 발송
 * @param recipients 수신자 이메일 배열
 * @param subject 제목
 * @param react React 이메일 템플릿
 */
export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  react: ReactElement
): Promise<SendEmailResult[]> {
  const results = await Promise.all(recipients.map(to => sendEmail(to, subject, react)))
  return results
}
