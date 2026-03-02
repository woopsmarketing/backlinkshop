// v1.1 - 주문 생성 시 이메일 알림 추가 (2026-03-01)
/**
 * 주문 관련 Server Actions
 * 상품 구매(주문 생성) 및 이메일 알림
 */

'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '../auth/session'
import { createServerSupabaseClient } from '../supabase/client'
import { createAdminSupabaseClient } from '../supabase/admin'
import { CREDIT_REASON } from '@/lib/constants'
import { sendEmail, sendEmailToAdmin } from '@/lib/email/send-email'
import { OrderCreatedCustomerEmail } from '@/lib/email/templates/order-created-customer'
import { OrderCreatedAdminEmail } from '@/lib/email/templates/order-created-admin'

/**
 * 상품 구매 (주문 생성)
 * @param productId 상품 ID
 * @param quantity 수량
 * @param note 요청사항
 */
export async function createOrderAction(productId: string, quantity: number, note?: string) {
  try {
    const user = await requireAuth()
    const supabase = await createServerSupabaseClient()
    const adminClient = createAdminSupabaseClient()

    // 1. 수량 검증
    if (!Number.isFinite(quantity) || quantity < 1) {
      return { success: false, error: '수량은 1 이상이어야 합니다' }
    }

    // 2. 상품 조회
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('status', 'active')
      .single()

    if (productError || !product) {
      return { success: false, error: '상품을 찾을 수 없습니다' }
    }

    // 3. 가격 검증 및 총액 계산
    const productPrice = Number(product.price)
    if (!Number.isFinite(productPrice) || productPrice <= 0) {
      return { success: false, error: '상품 가격이 올바르지 않습니다' }
    }
    const totalPrice = productPrice * quantity

    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity,
        total_price: totalPrice,
        status: 'pending',
        note: note || null,
      })
      .select()
      .single()

    if (orderError || !order) {
      return { success: false, error: '주문 생성에 실패했습니다' }
    }

    // 4. 크레딧 차감 (원장 기록)
    const { error: creditError } = await adminClient.rpc('apply_credit_delta', {
      p_user_id: user.id,
      p_amount: -totalPrice,
      p_reason: CREDIT_REASON.PRODUCT_PURCHASE,
      p_ref_type: 'order',
      p_ref_id: order.id,
    })

    if (creditError) {
      // 크레딧 차감 실패 시 주문 롤백
      await adminClient.from('orders').delete().eq('id', order.id)
      return { success: false, error: '크레딧이 부족합니다' }
    }

    // 5. 이메일 발송 (고객)
    if (user.email) {
      await sendEmail(
        user.email,
        '주문이 접수되었습니다 - 백링크샵',
        OrderCreatedCustomerEmail({
          customerEmail: user.email,
          orderId: order.id,
          productName: product.name,
          quantity,
          totalPrice,
          note: note || undefined,
        })
      ).catch(err => {
        console.error('고객 이메일 발송 실패:', err)
        // 이메일 실패해도 주문은 성공으로 처리
      })

      // 6. 이메일 발송 (관리자)
      await sendEmailToAdmin(
        `[신규 주문] ${product.name} - ${user.email}`,
        OrderCreatedAdminEmail({
          customerEmail: user.email,
          orderId: order.id,
          productName: product.name,
          quantity,
          totalPrice,
          note: note || undefined,
        })
      ).catch(err => {
        console.error('관리자 이메일 발송 실패:', err)
        // 이메일 실패해도 주문은 성공으로 처리
      })
    }

    // 7. 캐시 갱신
    revalidatePath('/orders')
    revalidatePath('/dashboard')
    revalidatePath('/credits')

    return { success: true, message: '주문이 완료되었습니다', orderId: order.id }
  } catch (error) {
    return { success: false, error: '주문 처리 중 오류가 발생했습니다' }
  }
}
