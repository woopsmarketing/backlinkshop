// v1.0 - 관리자 주문 조회 추가 (2026-02-05)
/**
 * 관리자용 주문 조회 함수
 * 상태 필터 및 최신순 정렬
 */

import { createAdminSupabaseClient } from '../supabase/admin'

export type AdminOrderRow = {
  id: string
  user_id: string
  product_id: string
  quantity: number
  total_price: number
  status: string
  note: string | null
  report_path?: string | null
  report_filename?: string | null
  report_uploaded_at?: string | null
  created_at: string
  products: { name: string } | null
}

/**
 * 주문 목록 조회
 * @param status 상태 필터 (선택)
 */
export async function getAdminOrders(status?: string) {
  try {
    const adminClient = createAdminSupabaseClient()

    let query = adminClient
      .from('orders')
      .select(
        'id, user_id, product_id, quantity, total_price, status, note, report_path, report_filename, report_uploaded_at, created_at, products(name)'
      )
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('관리자 주문 조회 실패:', error)
      return []
    }

    return (data || []) as AdminOrderRow[]
  } catch (error) {
    console.error('관리자 주문 조회 오류:', error)
    return []
  }
}
