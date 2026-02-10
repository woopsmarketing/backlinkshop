// v1.0 - 주문 조회 유틸 추가 (2026-02-05)
/**
 * 주문 관련 조회 함수
 * 유저 주문 내역 조회
 */

import { createServerSupabaseClient } from '../supabase/client'

/**
 * 유저 주문 내역 조회
 * @param userId 유저 ID
 * @param limit 조회 개수 (기본 50개)
 */
export async function getMyOrders(userId: string, limit = 50) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('orders')
    .select('id, quantity, total_price, status, created_at, report_path, report_filename, products(name, price)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('주문 내역 조회 실패:', error)
    return []
  }

  return data || []
}

/**
 * 최근 보고서 목록 조회 (대시보드용)
 * @param userId 유저 ID
 * @param limit 조회 개수
 */
export async function getRecentReports(userId: string, limit = 5) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('orders')
    .select('id, report_filename, report_uploaded_at, products(name)')
    .eq('user_id', userId)
    .not('report_path', 'is', null)
    .order('report_uploaded_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('보고서 목록 조회 실패:', error)
    return []
  }

  return data || []
}

