/**
 * 테스트 이메일 발송 Server Action
 */

'use server'

import { sendEmail } from '@/lib/email/send-email'
import { renderAnnouncementEmail } from '@/lib/email/render'

/**
 * 테스트 이메일 발송
 */
export async function sendTestEmailAction(recipientEmail: string) {
  try {
    // 이메일 발송
    const result = await sendEmail(
      recipientEmail,
      '[백링크샵] 중요 공지사항 - 주문 정보 확인 요청',
      renderAnnouncementEmail({ customerEmail: recipientEmail })
    )

    if (result.success) {
      return {
        success: true,
        message: `테스트 이메일이 ${recipientEmail}로 발송되었습니다!`,
      }
    } else {
      return {
        success: false,
        message: result.error || '이메일 발송에 실패했습니다',
      }
    }
  } catch (error) {
    console.error('❌ [테스트 이메일 발송 오류]', error)
    return {
      success: false,
      message: '이메일 발송 중 오류가 발생했습니다',
    }
  }
}
