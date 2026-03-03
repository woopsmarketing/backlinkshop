/**
 * 크레딧 관련 Server Actions
 * 쿠폰 사용, 충전 요청
 */

'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '../auth/session'
import {
  redeemCoupon as redeemCouponMutation,
  createTopupRequest as createTopupRequestMutation,
} from '../mutations/credits'

/**
 * 쿠폰 사용 Server Action
 * @param code 쿠폰 코드
 */
export async function redeemCouponAction(code: string) {
  try {
    // 로그인 확인
    const user = await requireAuth()

    // 쿠폰 사용
    const result = await redeemCouponMutation(user.id, code.trim().toUpperCase())

    // 페이지 갱신
    if (result.success) {
      revalidatePath('/credits')
      revalidatePath('/dashboard')
    }

    return result
  } catch (error) {
    return { success: false, error: '로그인이 필요합니다' }
  }
}

/**
 * 충전 요청 Server Action
 * @param packageId 패키지 ID
 * @param amount 충전 크레딧
 * @param note 요청 메모
 */
export async function createTopupRequestAction(packageId: string, amount: number, note?: string) {
  try {
    // 로그인 확인
    const user = await requireAuth()

    // 충전 요청 생성
    const result = await createTopupRequestMutation(user.id, packageId, amount, note)

    // 페이지 갱신
    if (result.success) {
      revalidatePath('/credits')
    }

    return result
  } catch (error) {
    return { success: false, error: '로그인이 필요합니다' }
  }
}
