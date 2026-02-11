// v1.1 - 충전 금액 서버 검증 추가 (2026-02-11)
/**
 * 크레딧 관련 Mutation 함수
 * 쿠폰 사용, 충전 요청 등
 */

import { createServerSupabaseClient } from '../supabase/client'
import { CREDIT_REASON } from '@/lib/constants'

/**
 * 쿠폰 사용
 * @param userId 유저 ID
 * @param code 쿠폰 코드
 * @returns 성공 여부 및 메시지
 */
export async function redeemCoupon(userId: string, code: string) {
  const supabase = await createServerSupabaseClient()

  try {
    // 1. 쿠폰 존재 및 유효성 확인
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .single()

    if (couponError || !coupon) {
      return { success: false, error: '유효하지 않은 쿠폰 코드입니다' }
    }

    // 2. 만료 확인
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { success: false, error: '만료된 쿠폰입니다' }
    }

    // 3. 사용 횟수 확인
    if (coupon.used_count >= coupon.max_uses) {
      return { success: false, error: '사용 가능 횟수가 초과되었습니다' }
    }

    // 4. 중복 사용 확인
    const { data: existingRedemption } = await supabase
      .from('coupon_redemptions')
      .select('id')
      .eq('user_id', userId)
      .eq('code', code)
      .single()

    if (existingRedemption) {
      return { success: false, error: '이미 사용한 쿠폰입니다' }
    }

    // 5. 크레딧 지급
    const { error: creditError } = await supabase.rpc('apply_credit_delta', {
      p_user_id: userId,
      p_amount: coupon.amount,
      p_reason: CREDIT_REASON.COUPON,
      p_ref_type: 'coupon',
      p_ref_id: code,
    })

    if (creditError) {
      console.error('크레딧 지급 실패:', creditError)
      return { success: false, error: '크레딧 지급에 실패했습니다' }
    }

    // 6. 쿠폰 사용 기록 + 사용 횟수 증가
    const { error: redemptionError } = await supabase
      .from('coupon_redemptions')
      .insert({ user_id: userId, code })

    if (redemptionError) {
      console.error('쿠폰 사용 기록 실패:', redemptionError)
      // 크레딧은 이미 지급됨 (롤백 불가)
    }

    // 사용 횟수 증가
    await supabase
      .from('coupons')
      .update({ used_count: coupon.used_count + 1 })
      .eq('code', code)

    return {
      success: true,
      message: `${coupon.amount} 크레딧이 지급되었습니다`,
      amount: coupon.amount,
    }
  } catch (err) {
    console.error('쿠폰 사용 오류:', err)
    return { success: false, error: '쿠폰 사용 중 오류가 발생했습니다' }
  }
}

/**
 * 충전 요청 생성
 * @param userId 유저 ID
 * @param packageId 패키지 ID
 * @param amount 충전 크레딧
 * @param note 요청 메모 (선택)
 * @returns 성공 여부
 */
export async function createTopupRequest(
  userId: string,
  packageId: string,
  amount: number,
  note?: string
) {
  const supabase = await createServerSupabaseClient()

  // 금액 검증 (서버 기준)
  if (!Number.isFinite(amount) || amount < 1000) {
    return { success: false, error: '최소 1,000 크레딧부터 충전 가능합니다' }
  }

  const { data, error } = await supabase
    .from('topup_requests')
    .insert({
      user_id: userId,
      package_id: packageId,
      amount,
      note,
      status: 'requested',
    })
    .select()
    .single()

  if (error) {
    console.error('충전 요청 생성 실패:', error)
    return { success: false, error: '충전 요청에 실패했습니다' }
  }

  return {
    success: true,
    message: '충전 요청이 완료되었습니다. 관리자 승인을 기다려주세요.',
    data,
  }
}
