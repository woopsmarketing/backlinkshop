/**
 * 관리자 이메일 발송 Server Actions
 * 일괄 이메일 발송 등
 */

'use server'

import { getCurrentUser, isAdmin } from '../auth/session'
import { createAdminSupabaseClient } from '../supabase/admin'
import { sendBulkEmail } from '@/lib/email/send-email'
import * as React from 'react'
import { AnnouncementEmail } from '@/lib/email/templates/announcement'

/**
 * 모든 회원에게 공지사항 이메일 일괄 발송
 */
export async function sendAnnouncementToAllUsersAction() {
  try {
    // 1. 관리자 권한 확인
    const user = await getCurrentUser()
    if (!user || !(await isAdmin())) {
      return { success: false, error: '관리자 권한이 필요합니다' }
    }

    const adminClient = createAdminSupabaseClient()

    // 2. auth.users에서 모든 회원 이메일 조회 (profiles.email은 null일 수 있음)
    const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers()

    if (usersError) {
      console.error('❌ [회원 조회 실패]', usersError)
      return { success: false, error: '회원 목록을 가져오는데 실패했습니다' }
    }

    if (!usersData || !usersData.users || usersData.users.length === 0) {
      return { success: false, error: '발송할 회원이 없습니다' }
    }

    // 3. 이메일 주소 추출 (이메일이 있고, 이메일 인증된 사용자만)
    const emails = usersData.users
      .filter(u => u.email && u.email_confirmed_at) // 이메일 인증된 사용자만
      .map(u => u.email!)

    if (emails.length === 0) {
      return { success: false, error: '유효한 이메일 주소가 없습니다' }
    }

    console.log(
      `📧 [일괄 이메일 발송 시작] 총 ${emails.length}명 (전체 회원: ${usersData.users.length}명)`
    )

    // 4. 일괄 이메일 발송 (renderAnnouncementEmail 사용)
    const results = await sendBulkEmail(
      emails,
      '[백링크샵] 중요 공지사항 - 주문 정보 확인 요청',
      React.createElement(AnnouncementEmail, { customerEmail: '고객' })
    )

    // 5. 결과 집계
    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    // 실패한 이메일 목록 로깅
    if (failCount > 0) {
      const failedEmails = emails.filter((_, idx) => !results[idx].success)
      console.error(`❌ [실패한 이메일 목록] ${failCount}건:`, failedEmails)
    }

    console.log(`✅ [일괄 이메일 발송 완료] 성공: ${successCount}, 실패: ${failCount}`)

    return {
      success: true,
      message: `총 ${emails.length}명 중 ${successCount}명에게 발송 완료`,
      stats: {
        total: emails.length,
        success: successCount,
        fail: failCount,
      },
    }
  } catch (error) {
    console.error('일괄 이메일 발송 오류:', error)
    return { success: false, error: '이메일 발송 중 오류가 발생했습니다' }
  }
}
