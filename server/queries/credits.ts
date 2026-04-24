/**
 * 크레딧 관련 조회 함수
 * 잔액, 원장 내역 조회
 */

import { createServerSupabaseClient } from '../supabase/client'

/**
 * 유저 크레딧 잔액 조회
 * @param userId 유저 ID
 * @returns 크레딧 잔액
 */
export async function getBalance(userId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('credit_balances')
    .select('balance, updated_at')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('잔액 조회 실패:', error)
    return { balance: 0, updated_at: new Date().toISOString() }
  }

  return data
}

/**
 * 유저 크레딧 원장 조회 (최근 순)
 * @param userId 유저 ID
 * @param limit 조회 개수 (기본 50개)
 * @returns 크레딧 원장 내역
 */
export async function getLedgerHistory(userId: string, limit = 50) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('credit_ledger')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('원장 조회 실패:', error)
    return []
  }

  return data || []
}

/**
 * 크레딧 원장 통계 조회
 * @param userId 유저 ID
 * @returns 충전 총액, 사용 총액
 */
export async function getLedgerStats(userId: string) {
  const supabase = await createServerSupabaseClient()

  // 모든 원장 내역 조회
  const { data, error } = await supabase
    .from('credit_ledger')
    .select('amount')
    .eq('user_id', userId)

  if (error || !data) {
    return { totalCharged: 0, totalSpent: 0 }
  }

  // 충전(+)과 사용(-) 합계 계산
  const totalCharged = data
    .filter(item => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0)

  const totalSpent = Math.abs(
    data.filter(item => item.amount < 0).reduce((sum, item) => sum + item.amount, 0)
  )

  return { totalCharged, totalSpent }
}
