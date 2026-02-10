// v1.0 - 관리자 충전 승인/거절 액션 추가 (2026-02-05)
/**
 * 관리자 충전 승인/거절 Server Actions
 * 관리자 권한 검증 후 처리
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser, isAdmin } from '../auth/session'
import { createAdminSupabaseClient } from '../supabase/admin'
import { CREDIT_REASON } from '@/lib/constants'

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
      return { success: false, error: '충전 요청을 찾을 수 없습니다' }
    }

    if (request.status !== 'requested') {
      return { success: false, error: '이미 처리된 요청입니다' }
    }

    // 2. 크레딧 지급
    const { error: creditError } = await adminClient.rpc('apply_credit_delta', {
      p_user_id: request.user_id,
      p_amount: request.amount,
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

