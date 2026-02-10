// v1.0 - 관리자 쿠폰 생성/만료 액션 추가 (2026-02-05)
/**
 * 관리자 쿠폰 관리 Server Actions
 * 쿠폰 생성 및 만료 처리
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser, isAdmin } from '../auth/session'
import { createAdminSupabaseClient } from '../supabase/admin'

/**
 * 쿠폰 생성
 */
export async function createCouponAction(input: {
  code: string
  amount: number
  maxUses: number
  expiresAt?: string | null
}) {
  try {
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return { success: false, error: '관리자 권한이 필요합니다' }
    }

    if (!input.code || !Number.isFinite(input.amount) || !Number.isFinite(input.maxUses)) {
      return { success: false, error: '필수 입력값이 누락되었습니다' }
    }

    if (input.amount <= 0 || input.maxUses <= 0) {
      return { success: false, error: '금액/횟수는 0보다 커야 합니다' }
    }

    const adminClient = createAdminSupabaseClient()

    const { error } = await adminClient.from('coupons').insert({
      code: input.code.trim().toUpperCase(),
      amount: input.amount,
      max_uses: input.maxUses,
      used_count: 0,
      expires_at: input.expiresAt || null,
      created_by: user.id,
    })

    if (error) {
      console.error('쿠폰 생성 실패:', error)
      return { success: false, error: '쿠폰 생성에 실패했습니다' }
    }

    revalidatePath('/admin/coupons')
    return { success: true, message: '쿠폰이 생성되었습니다' }
  } catch (error) {
    console.error('쿠폰 생성 오류:', error)
    return { success: false, error: '쿠폰 생성 중 오류가 발생했습니다' }
  }
}

/**
 * 쿠폰 만료 처리 (즉시 만료)
 */
export async function expireCouponAction(code: string) {
  try {
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return { success: false, error: '관리자 권한이 필요합니다' }
    }

    const adminClient = createAdminSupabaseClient()

    const { error } = await adminClient
      .from('coupons')
      .update({ expires_at: new Date().toISOString() })
      .eq('code', code)

    if (error) {
      console.error('쿠폰 만료 처리 실패:', error)
      return { success: false, error: '쿠폰 만료 처리에 실패했습니다' }
    }

    revalidatePath('/admin/coupons')
    return { success: true, message: '쿠폰이 만료 처리되었습니다' }
  } catch (error) {
    console.error('쿠폰 만료 처리 오류:', error)
    return { success: false, error: '쿠폰 만료 처리 중 오류가 발생했습니다' }
  }
}

