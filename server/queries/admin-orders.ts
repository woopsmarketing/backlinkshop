// v1.2 - GOAT PBN API 연동 필드 추가 (2026-03-05)
// v1.1 - PBN 백링크 주문 필드 추가 (2026-03-03)
/**
 * 관리자용 주문 조회 함수
 * 상태 필터 및 최신순 정렬
 * GOAT PBN 캠페인 ID 및 API 에러 정보 포함
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
  goat_campaign_id?: string | null
  api_error?: string | null
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
        'id, user_id, product_id, quantity, total_price, status, note, site_url, keywords, use_sub_keywords, main_keyword_ratio, sub_keyword_ratio, goat_campaign_id, api_error, report_path, report_filename, report_uploaded_at, created_at, products(name)'
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

    if (!data || data.length === 0) {
      return []
    }

    // 모든 user_id 수집
    const userIds = [...new Set(data.map(order => order.user_id))]

    // profiles 데이터 별도 조회
    const { data: profilesData } = await adminClient
      .from('profiles')
      .select('user_id, email')
      .in('user_id', userIds)

    // user_id를 키로 하는 profiles 맵 생성
    const profilesMap = new Map((profilesData || []).map(profile => [profile.user_id, profile]))

    // Supabase JOIN 결과를 안전하게 변환
    const orders = (data || []).map(order => ({
      ...order,
      products: Array.isArray(order.products) ? order.products[0] || null : order.products,
      profiles: profilesMap.get(order.user_id) || null,
    }))

    return orders as AdminOrderRow[]
  } catch (error) {
    console.error('관리자 주문 조회 오류:', error)
    return []
  }
}
