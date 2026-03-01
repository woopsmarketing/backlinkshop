/**
 * 관리자 대시보드 통계 조회
 * 미처리 주문/충전 요청 카운트
 */

import { createAdminSupabaseClient } from '../supabase/admin'

/**
 * 미처리 주문 개수 조회
 * @returns pending 상태 주문 개수
 */
export async function getPendingOrdersCount(): Promise<number> {
  try {
    const adminClient = createAdminSupabaseClient()

    const { count, error } = await adminClient
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (error) {
      console.error('미처리 주문 개수 조회 실패:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('미처리 주문 개수 조회 오류:', error)
    return 0
  }
}

/**
 * 처리중인 주문 개수 조회
 * @returns processing 상태 주문 개수
 */
export async function getProcessingOrdersCount(): Promise<number> {
  try {
    const adminClient = createAdminSupabaseClient()

    const { count, error } = await adminClient
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'processing')

    if (error) {
      console.error('처리중 주문 개수 조회 실패:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('처리중 주문 개수 조회 오류:', error)
    return 0
  }
}

/**
 * 미처리 충전 요청 개수 조회
 * @returns requested 상태 충전 요청 개수
 */
export async function getPendingTopupsCount(): Promise<number> {
  try {
    const adminClient = createAdminSupabaseClient()

    const { count, error } = await adminClient
      .from('topup_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'requested')

    if (error) {
      console.error('미처리 충전 요청 개수 조회 실패:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('미처리 충전 요청 개수 조회 오류:', error)
    return 0
  }
}

/**
 * 관리자 대시보드 통계 한번에 조회
 */
export async function getAdminStats() {
  const [pendingOrders, processingOrders, pendingTopups] = await Promise.all([
    getPendingOrdersCount(),
    getProcessingOrdersCount(),
    getPendingTopupsCount(),
  ])

  return {
    pendingOrders,
    processingOrders,
    pendingTopups,
    totalPendingTasks: pendingOrders + pendingTopups,
  }
}
