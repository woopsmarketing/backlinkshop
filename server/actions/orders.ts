// v1.5 - 온페이지 SEO/콘텐츠 최적화 상품 검증 추가 (2026-03-09)
// v1.4 - GOAT PBN API 연동 추가 (2026-03-05)
// v1.3 - 플랜 백링크 주문 필드 추가 (2026-03-03)
/**
 * 주문 관련 Server Actions
 * 상품 구매(주문 생성) 및 이메일 알림
 * - PBN 백링크 상품: 사이트 URL, 키워드 필수 + GOAT PBN API 자동 호출
 * - 플랜 백링크 상품: 사이트 URL, 키워드, 서브키워드 옵션, 비율 설정
 * - 온페이지 SEO 점검: 사이트 URL, 핵심 키워드 1개 필수
 * - 콘텐츠 최적화: 사이트 URL, 핵심 키워드 1개 필수
 */

'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '../auth/session'
import { createServerSupabaseClient } from '../supabase/client'
import { createAdminSupabaseClient } from '../supabase/admin'
import { CREDIT_REASON } from '@/lib/constants'
import { sendEmail, sendEmailToAdmin } from '@/lib/email/send-email'
import { renderOrderCreatedCustomerEmail, renderOrderCreatedAdminEmail } from '@/lib/email/render'

/**
 * 상품 구매 (주문 생성)
 * @param productId 상품 ID
 * @param quantity 수량
 * @param note 요청사항
 * @param siteUrl 사이트 URL (백링크/SEO/콘텐츠 상품에서 필수)
 * @param keywords 키워드 (백링크/SEO/콘텐츠 상품에서 필수)
 * @param useSubKeywords 서브키워드 사용 여부 (플랜 백링크 전용)
 * @param mainKeywordRatio 메인키워드 비율 (플랜 백링크 전용)
 * @param subKeywordRatio 서브키워드 비율 (플랜 백링크 전용)
 */
export async function createOrderAction(
  productId: string,
  quantity: number,
  note?: string,
  siteUrl?: string,
  keywords?: string,
  useSubKeywords?: boolean,
  mainKeywordRatio?: number,
  subKeywordRatio?: number
) {
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

    // 4. 백링크 및 SEO 점검/콘텐츠 최적화 상품 필수 필드 검증
    // PBN 상품: 'PBN' 포함하지만 '플랜'은 제외 (플랜 백링크는 별도 처리)
    const isPBNProduct = product.name.includes('PBN') && !product.name.includes('플랜')
    const isPlanProduct = product.name.includes('플랜')
    const isOnPageProduct = product.name.includes('온페이지')
    const isContentProduct = product.name.includes('콘텐츠')

    if (isPBNProduct || isPlanProduct || isOnPageProduct || isContentProduct) {
      if (!siteUrl || !siteUrl.trim()) {
        return { success: false, error: '사이트 URL을 입력해주세요' }
      }
      if (!keywords || !keywords.trim()) {
        return { success: false, error: '키워드를 입력해주세요' }
      }
    }

    // 5. 주문 생성
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity,
        total_price: totalPrice,
        status: 'pending',
        note: note || null,
        site_url: siteUrl || null,
        keywords: keywords || null,
        use_sub_keywords: useSubKeywords ?? null,
        main_keyword_ratio: mainKeywordRatio ?? null,
        sub_keyword_ratio: subKeywordRatio ?? null,
      })
      .select()
      .single()

    if (orderError || !order) {
      return { success: false, error: '주문 생성에 실패했습니다' }
    }

    // 6. 크레딧 차감 (원장 기록)
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

    // 주문 생성 시에는 API 호출하지 않음
    // 관리자가 "처리중" 상태로 변경할 때 API 호출됨

    // 7. 이메일 발송 (고객)
    if (user.email) {
      await sendEmail(
        user.email,
        '주문이 접수되었습니다 - 백링크샵',
        renderOrderCreatedCustomerEmail({
          customerEmail: user.email,
          orderId: order.id,
          productName: product.name,
          quantity,
          totalPrice,
          note: note || undefined,
          siteUrl: siteUrl || undefined,
          keywords: keywords || undefined,
          useSubKeywords: useSubKeywords,
          mainKeywordRatio: mainKeywordRatio,
          subKeywordRatio: subKeywordRatio,
        })
      ).catch(err => {
        console.error('고객 이메일 발송 실패:', err)
        // 이메일 실패해도 주문은 성공으로 처리
      })

      // 8. 이메일 발송 (관리자)
      await sendEmailToAdmin(
        `[신규 주문] ${product.name} - ${user.email}`,
        renderOrderCreatedAdminEmail({
          customerEmail: user.email,
          orderId: order.id,
          productName: product.name,
          quantity,
          totalPrice,
          note: note || undefined,
          siteUrl: siteUrl || undefined,
          keywords: keywords || undefined,
          useSubKeywords: useSubKeywords,
          mainKeywordRatio: mainKeywordRatio,
          subKeywordRatio: subKeywordRatio,
        })
      ).catch(err => {
        console.error('관리자 이메일 발송 실패:', err)
        // 이메일 실패해도 주문은 성공으로 처리
      })
    }

    // 9. 캐시 갱신
    revalidatePath('/orders')
    revalidatePath('/dashboard')
    revalidatePath('/credits')

    return { success: true, message: '주문이 완료되었습니다', orderId: order.id }
  } catch (error) {
    return { success: false, error: '주문 처리 중 오류가 발생했습니다' }
  }
}
