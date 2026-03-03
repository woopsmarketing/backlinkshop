/**
 * 이메일 발송 유틸리티 함수
 * Resend를 사용한 이메일 발송 래퍼
 */

'use server'

import { resend, FROM_EMAIL, ADMIN_EMAIL } from './resend'
import { ReactElement, JSXElementConstructor, ReactNode } from 'react'

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
 * @param react React 이메일 템플릿 (컴포넌트 또는 ReactElement)
 */
export async function sendEmail(
  to: string,
  subject: string,
  react: ReactNode
): Promise<SendEmailResult> {
  try {
    // Resend API 키 확인
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ [이메일 발송 실패] RESEND_API_KEY가 설정되지 않았습니다')
      console.error('   Vercel 환경변수에 RESEND_API_KEY를 추가해주세요')
      return { success: false, error: 'Email service not configured' }
    }

    console.log('📧 [이메일 발송 시도]', {
      to,
      subject,
      from: FROM_EMAIL,
      hasApiKey: !!process.env.RESEND_API_KEY,
    })

    // 이메일 발송
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      react,
      replyTo: ADMIN_EMAIL, // 답장은 관리자 이메일로 전달
    })

    if (error) {
      console.error('❌ [이메일 발송 실패]', {
        to,
        subject,
        error: error.message,
        errorDetails: error,
      })
      return { success: false, error: error.message }
    }

    console.log('✅ [이메일 발송 성공]', {
      to,
      subject,
      messageId: data?.id,
    })
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('❌ [이메일 발송 오류]', {
      to,
      subject,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return { success: false, error: 'Failed to send email' }
  }
}

/**
 * 관리자에게 이메일 발송
 * @param subject 제목
 * @param react React 이메일 템플릿 (컴포넌트 또는 ReactElement)
 */
export async function sendEmailToAdmin(
  subject: string,
  react: ReactNode
): Promise<SendEmailResult> {
  return sendEmail(ADMIN_EMAIL, subject, react)
}

/**
 * 지연 함수 (Rate Limit 회피용)
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 여러 수신자에게 동일한 이메일 발송
 * @param recipients 수신자 이메일 배열
 * @param subject 제목
 * @param react React 이메일 템플릿 (컴포넌트 또는 ReactElement)
 */
export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  react: ReactNode
): Promise<SendEmailResult[]> {
  console.log(`📧 [일괄 이메일 발송] 총 ${recipients.length}명에게 발송 시작`)
  console.log(`⏱️ [Rate Limit 준수] 각 이메일 사이 0.6초 대기 (Resend 제한: 초당 2개)`)

  // 각 이메일 발송 (Rate Limit 준수: 초당 2개 = 0.5초 간격)
  const results: SendEmailResult[] = []
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < recipients.length; i++) {
    const to = recipients[i]
    const result = await sendEmail(to, subject, react)
    results.push(result)

    if (result.success) {
      successCount++
    } else {
      failCount++
      console.error(`❌ [${i + 1}/${recipients.length}] 발송 실패: ${to} - ${result.error}`)
    }

    // 진행률 로그 (10명마다)
    if ((i + 1) % 10 === 0 || i + 1 === recipients.length) {
      console.log(
        `📊 [진행률] ${i + 1}/${recipients.length} (성공: ${successCount}, 실패: ${failCount})`
      )
    }

    // Rate Limit 회피: 마지막 이메일이 아니면 0.6초 대기
    // (Resend 제한: 초당 2개 = 0.5초 간격, 여유있게 0.6초)
    if (i < recipients.length - 1) {
      await delay(600)
    }
  }

  console.log(
    `✅ [일괄 이메일 발송 완료] 총 ${recipients.length}명 중 성공: ${successCount}, 실패: ${failCount}`
  )

  return results
}
