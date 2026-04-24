/**
 * 인증 세션 관리 유틸
 * 현재 로그인한 유저 정보 조회 및 검증
 */

import { createServerSupabaseClient } from '../supabase/client'

/**
 * 현재 로그인한 유저 정보 조회
 * @returns 유저 정보 또는 null (비로그인)
 */
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * 로그인 필수 페이지에서 사용
 * 비로그인 시 에러 throw
 */
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}

/**
 * Admin 권한 확인
 * @returns true if admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return false
  }

  return data.role === 'admin'
}

/**
 * Admin 권한 필수 페이지에서 사용
 * Admin 아닌 경우 에러 throw
 */
export async function requireAdmin() {
  const admin = await isAdmin()

  if (!admin) {
    throw new Error('Admin access required')
  }

  return true
}
