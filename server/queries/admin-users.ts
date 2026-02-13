// v1.0 - 관리자 회원 목록 조회 추가 (2026-02-13)
/**
 * 관리자용 회원 목록 조회 함수
 * auth.users + profiles + credit_balances 조인하여 통합 회원 정보 제공
 */

import { createAdminSupabaseClient } from '../supabase/admin'

/** 회원 정보 타입 */
export type AdminUserRow = {
  id: string // user UUID
  email: string // 이메일
  role: string // 역할 (user | admin)
  creditBalance: number // 현재 크레딧 잔액
  createdAt: string // 가입일 (auth.users.created_at)
  lastSignInAt: string | null // 마지막 로그인
}

/**
 * 전체 회원 목록 조회
 * - Supabase Auth Admin API로 유저 목록 가져옴
 * - profiles, credit_balances와 매칭하여 통합 정보 반환
 * @returns AdminUserRow[] 회원 목록 (최신 가입순)
 */
export async function getAdminUsers(): Promise<AdminUserRow[]> {
  try {
    const adminClient = createAdminSupabaseClient()

    // 1. Supabase Auth Admin API로 전체 유저 목록 조회
    const { data: authData, error: authError } = await adminClient.auth.admin.listUsers({
      perPage: 1000, // 최대 1000명까지 조회
    })

    if (authError) {
      console.error('유저 목록 조회 실패 (Auth):', authError)
      return []
    }

    const authUsers = authData?.users || []

    if (authUsers.length === 0) {
      return []
    }

    // 2. profiles 테이블에서 역할 정보 조회
    const userIds = authUsers.map(u => u.id)
    const { data: profiles } = await adminClient
      .from('profiles')
      .select('user_id, role')
      .in('user_id', userIds)

    // 3. credit_balances 테이블에서 잔액 조회
    const { data: balances } = await adminClient
      .from('credit_balances')
      .select('user_id, balance')
      .in('user_id', userIds)

    // 4. 매핑 테이블 생성 (빠른 조회용)
    const profileMap = new Map((profiles || []).map(p => [p.user_id, p.role as string]))
    const balanceMap = new Map((balances || []).map(b => [b.user_id, Number(b.balance)]))

    // 5. 통합 데이터 조합 (최신 가입순 정렬)
    const userList: AdminUserRow[] = authUsers
      .map(user => ({
        id: user.id,
        email: user.email || '(이메일 없음)',
        role: profileMap.get(user.id) || 'user',
        creditBalance: balanceMap.get(user.id) || 0,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at || null,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return userList
  } catch (error) {
    console.error('회원 목록 조회 오류:', error)
    return []
  }
}
