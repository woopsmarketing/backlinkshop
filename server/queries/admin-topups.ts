// v1.0 - 관리자 충전 요청 조회 추가 (2026-02-05)
/**
 * 관리자용 충전 요청 조회 함수
 * 상태별 필터 지원
 */

import { createAdminSupabaseClient } from '../supabase/admin'

export type TopupRequestRow = {
  id: string
  user_id: string
  package_id: string
  amount: number
  status: string
  note: string | null
  processed_by: string | null
  processed_at: string | null
  created_at: string
}

/**
 * 충전 요청 목록 조회
 * @param status 상태 필터 (선택)
 */
export async function getTopupRequests(status?: string) {
  try {
    const adminClient = createAdminSupabaseClient()

    let query = adminClient
      .from('topup_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('충전 요청 조회 실패:', error)
      return []
    }

    return (data || []) as TopupRequestRow[]
  } catch (error) {
    console.error('충전 요청 조회 오류:', error)
    return []
  }
}

