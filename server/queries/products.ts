// v1.0 - 상품 조회 유틸 추가 (2026-02-05)
/**
 * 상품 관련 조회 함수
 * 활성 상품 목록 및 상세 조회
 */

import { createServerSupabaseClient } from '../supabase/client'

/**
 * 활성 상품 목록 조회
 * @param category 카테고리 필터 (선택)
 */
export async function getActiveProducts(category?: string) {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('상품 목록 조회 실패:', error)
    return []
  }

  return data || []
}

/**
 * 상품 상세 조회
 * @param productId 상품 ID
 */
export async function getProductById(productId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (error) {
    console.error('상품 상세 조회 실패:', error)
    return null
  }

  return data
}

