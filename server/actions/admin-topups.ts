// v1.2 - 충전 승인 시 이메일 알림 추가 (2026-03-01)
/**
 * 관리자 충전 승인/거절 Server Actions
 * 관리자 권한 검증 후 처리 및 이메일 알림 발송
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser, isAdmin } from '../auth/session'
import { createAdminSupabaseClient } from '../supabase/admin'
import { CREDIT_REASON } from '@/lib/constants'
import { calculateTopupBonus } from '@/lib/topup'
import { sendEmail } from '@/lib/email/send-email'
import { renderTopupApprovedEmail } from '@/lib/email/render'

/**
 * 충전 요청 승인
 * @param requestId 충전 요청 ID
 */
export async function approveTopupRequestAction(requestId: string) {
  try {
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return { success: false, error: '관리자 권한이 필요합니다' }
    }

    const adminClient = createAdminSupabaseClient()

    // 1. 요청 조회 및 상태 확인
    const { data: request, error: requestError } = await adminClient
      .from('topup_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (requestError || !request) {
      console.error('충전 요청 조회 실패:', requestError)
      return { success: false, error: '충전 요청을 찾을 수 없습니다' }
    }

    if (request.status !== 'requested') {
      return { success: false, error: '이미 처리된 요청입니다' }
    }

    // 금액 검증 (부정 요청 방지)
    const requestAmount = Number(request.amount)
    if (!Number.isFinite(requestAmount) || requestAmount <= 0) {
      return { success: false, error: '유효하지 않은 충전 금액입니다' }
    }

    // 2. 보너스 계산 후 크레딧 지급
    const bonusInfo = calculateTopupBonus(requestAmount)
    const totalCredits = requestAmount + bonusInfo.bonus

    const { error: creditError } = await adminClient.rpc('apply_credit_delta', {
      p_user_id: request.user_id,
      p_amount: totalCredits,
      p_reason: CREDIT_REASON.MANUAL_TOPUP,
      p_ref_type: 'topup_request',
      p_ref_id: request.id,
    })

    if (creditError) {
      console.error('크레딧 지급 실패:', creditError)
      return { success: false, error: '크레딧 지급에 실패했습니다' }
    }

    // 3. 요청 상태 업데이트
    const { error: updateError } = await adminClient
      .from('topup_requests')
      .update({
        status: 'approved',
        processed_by: user.id,
        processed_at: new Date().toISOString(),
      })
      .eq('id', request.id)

    if (updateError) {
      console.error('요청 상태 업데이트 실패:', updateError)
      return { success: false, error: '요청 상태 업데이트 실패' }
    }

    // 4. 유저 이메일 및 현재 잔액 조회 (이메일 발송용)
    // auth.users에서 직접 이메일 가져오기 (profiles.email이 null일 수 있음)
    const { data: { user: authUser } } = await adminClient.auth.admin.getUserById(request.user_id)
    const userEmail = authUser?.email

    const { data: profile } = await adminClient
      .from('profiles')
      .select('credit_balance')
      .eq('id', request.user_id)
      .single()

    const newBalance = profile?.credit_balance || totalCredits

    // 5. 이메일 발송 (고객에게 충전 승인 알림)
    if (userEmail) {
      await sendEmail(
        userEmail,
        '크레딧 충전이 완료되었습니다 - 백링크샵',
        renderTopupApprovedEmail({
          customerEmail: userEmail,
          amount: totalCredits,
          newBalance,
        })
      ).catch(err => {
        console.error('충전 승인 이메일 발송 실패:', err)
        // 이메일 실패해도 승인은 성공으로 처리
      })
    }

    revalidatePath('/admin/topups')
    revalidatePath('/credits')
    revalidatePath('/dashboard')

    return { success: true, message: '충전 승인 완료' }
  } catch (error) {
    console.error('충전 승인 오류:', error)
    return { success: false, error: '충전 승인 중 오류가 발생했습니다' }
  }
}

/**
 * 충전 요청 거절
 * @param requestId 충전 요청 ID
 */
export async function rejectTopupRequestAction(requestId: string) {
  try {
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return { success: false, error: '관리자 권한이 필요합니다' }
    }

    const adminClient = createAdminSupabaseClient()

    // 1. 요청 조회 및 상태 확인
    const { data: request, error: requestError } = await adminClient
      .from('topup_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (requestError || !request) {
      return { success: false, error: '충전 요청을 찾을 수 없습니다' }
    }

    if (request.status !== 'requested') {
      return { success: false, error: '이미 처리된 요청입니다' }
    }

    // 2. 요청 상태 업데이트
    const { error: updateError } = await adminClient
      .from('topup_requests')
      .update({
        status: 'rejected',
        processed_by: user.id,
        processed_at: new Date().toISOString(),
      })
      .eq('id', request.id)

    if (updateError) {
      console.error('요청 상태 업데이트 실패:', updateError)
      return { success: false, error: '요청 상태 업데이트 실패' }
    }

    revalidatePath('/admin/topups')

    return { success: true, message: '충전 거절 완료' }
  } catch (error) {
    console.error('충전 거절 오류:', error)
    return { success: false, error: '충전 거절 중 오류가 발생했습니다' }
  }
}
