// v1.1 - PBN 백링크 주문 필드 추가 (2026-03-03)
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
  site_url?: string | null
  keywords?: string | null
  use_sub_keywords?: boolean | null
  main_keyword_ratio?: number | null
  sub_keyword_ratio?: number | null
  report_path?: string | null
  report_filename?: string | null
  report_uploaded_at?: string | null
  created_at: string
  products: { name: string } | { name: string }[] | null
  profiles?: { email: string | null } | null
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
        'id, user_id, product_id, quantity, total_price, status, note, site_url, keywords, use_sub_keywords, main_keyword_ratio, sub_keyword_ratio, report_path, report_filename, report_uploaded_at, created_at, products(name), profiles(email)'
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

    // Supabase JOIN 결과를 안전하게 변환
    const orders = (data || []).map(order => ({
      ...order,
      products: Array.isArray(order.products) ? order.products[0] || null : order.products,
    }))

    return orders as AdminOrderRow[]
  } catch (error) {
    console.error('관리자 주문 조회 오류:', error)
    return []
  }
}
