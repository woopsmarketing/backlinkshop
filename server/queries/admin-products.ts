// v1.0 - 관리자 상품 조회 추가 (2026-02-05)
/**
 * 관리자용 상품 조회 함수
 * 상태/카테고리 무관 전체 조회
 */

import { createAdminSupabaseClient } from '../supabase/admin'

export type AdminProductRow = {
  id: string
  name: string
  description: string
  price: number
  category: string
  status: string
  created_at: string
}

/**
 * 관리자 상품 목록 조회
 */
export async function getAdminProducts() {
  try {
    const adminClient = createAdminSupabaseClient()

    const { data, error } = await adminClient
      .from('products')
      .select('id, name, description, price, category, status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('관리자 상품 조회 실패:', error)
      return []
    }

    return (data || []) as AdminProductRow[]
  } catch (error) {
    console.error('관리자 상품 조회 오류:', error)
    return []
  }
}
