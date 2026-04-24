// v1.0 - 관리자 쿠폰 조회 추가 (2026-02-05)
/**
 * 관리자용 쿠폰 조회 함수
 * 생성된 쿠폰 목록 조회
 */

import { createAdminSupabaseClient } from '../supabase/admin'

export type AdminCouponRow = {
  code: string
  amount: number
  max_uses: number
  used_count: number
  expires_at: string | null
  created_at: string
}

/**
 * 쿠폰 목록 조회
 */
export async function getAdminCoupons() {
  try {
    const adminClient = createAdminSupabaseClient()

    const { data, error } = await adminClient
      .from('coupons')
      .select('code, amount, max_uses, used_count, expires_at, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('관리자 쿠폰 조회 실패:', error)
      return []
    }

    return (data || []) as AdminCouponRow[]
  } catch (error) {
    console.error('관리자 쿠폰 조회 오류:', error)
    return []
  }
}
