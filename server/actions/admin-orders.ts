// v1.1 - 실패 처리 시 환불 로직 추가 (2026-02-05)
/**
 * 관리자 주문 상태 변경 Server Actions
 * 상태: pending → processing → completed / failed
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser, isAdmin } from '../auth/session'
import { createAdminSupabaseClient } from '../supabase/admin'

const allowedStatuses = ['pending', 'processing', 'completed', 'failed'] as const

/**
 * 주문 상태 변경
 * @param orderId 주문 ID
 * @param status 변경할 상태
 */
export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return { success: false, error: '관리자 권한이 필요합니다' }
    }

    if (!allowedStatuses.includes(status as any)) {
      return { success: false, error: '유효하지 않은 상태입니다' }
    }

    const adminClient = createAdminSupabaseClient()

    // 1. 주문 확인
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('id, status, total_price, user_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return { success: false, error: '주문을 찾을 수 없습니다' }
    }

    if (order.status === status) {
      return { success: false, error: '이미 해당 상태입니다' }
    }

    const allowedTransitions: Record<string, string[]> = {
      pending: ['processing', 'failed'],
      processing: ['completed', 'failed'],
      completed: [],
      failed: [],
    }

    if (!allowedTransitions[order.status]?.includes(status)) {
      return { success: false, error: '허용되지 않는 상태 변경입니다' }
    }

    // 2. 실패 처리 시 환불
    if (status === 'failed') {
      // 중복 환불 방지
      const { data: refund } = await adminClient
        .from('credit_ledger')
        .select('id')
        .eq('ref_type', 'order')
        .eq('ref_id', order.id)
        .eq('reason', 'refund')
        .limit(1)
        .maybeSingle()

      if (refund) {
        return { success: false, error: '이미 환불 처리된 주문입니다' }
      }

      const totalPrice = Number(order.total_price)
      if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
        return { success: false, error: '환불 금액이 올바르지 않습니다' }
      }

      const { error: refundError } = await adminClient.rpc('apply_credit_delta', {
        p_user_id: order.user_id,
        p_amount: totalPrice,
        p_reason: 'refund',
        p_ref_type: 'order',
        p_ref_id: order.id,
      })

      if (refundError) {
        console.error('환불 실패:', refundError)
        return { success: false, error: '환불 처리에 실패했습니다' }
      }
    }

    // 3. 상태 업데이트
    const updatePayload: Record<string, any> = { status }
    if (status === 'completed') {
      updatePayload.completed_at = new Date().toISOString()
    }

    const { error: updateError } = await adminClient
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)

    if (updateError) {
      console.error('주문 상태 업데이트 실패:', updateError)
      return { success: false, error: '주문 상태 업데이트 실패' }
    }

    revalidatePath('/admin/orders')
    revalidatePath('/orders')
    revalidatePath('/credits')
    revalidatePath('/dashboard')

    return { success: true, message: '주문 상태가 업데이트되었습니다' }
  } catch (error) {
    console.error('주문 상태 변경 오류:', error)
    return { success: false, error: '주문 상태 변경 중 오류가 발생했습니다' }
  }
}

