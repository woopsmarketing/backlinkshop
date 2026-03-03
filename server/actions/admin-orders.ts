// v1.2 - 주문 상태 변경 시 이메일 알림 추가 (2026-03-01)
/**
 * 관리자 주문 상태 변경 Server Actions
 * 상태: pending → processing → completed / failed
 * 상태 변경 시 고객에게 이메일 알림 발송
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser, isAdmin } from '../auth/session'
import { createAdminSupabaseClient } from '../supabase/admin'
import { sendEmail } from '@/lib/email/send-email'
import { renderOrderStatusChangedEmail } from '@/lib/email/render'

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
      .select('id, status, total_price, user_id, product_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('주문 조회 실패:', orderError)
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

    // 4. 유저 이메일 및 상품명 조회 (이메일 발송용)
    // auth.users에서 직접 이메일 가져오기 (profiles.email이 null일 수 있음)
    const { data: { user: authUser } } = await adminClient.auth.admin.getUserById(order.user_id)
    const userEmail = authUser?.email

    const { data: product } = await adminClient
      .from('products')
      .select('name')
      .eq('id', order.product_id)
      .single()

    const productName = product?.name || '알 수 없는 상품'

    console.log('📧 [상태 변경 이메일] userEmail:', userEmail, 'productName:', productName, 'authUser:', authUser?.id)

    // 5. 이메일 발송 (고객에게 상태 변경 알림)
    if (userEmail) {
      await sendEmail(
        userEmail,
        `주문 상태가 변경되었습니다 - 백링크샵`,
        renderOrderStatusChangedEmail({
          customerEmail: userEmail,
          orderId: order.id,
          productName,
          oldStatus: order.status,
          newStatus: status,
        })
      ).catch(err => {
        console.error('상태 변경 이메일 발송 실패:', err)
        // 이메일 실패해도 상태 변경은 성공으로 처리
      })
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
