// v1.0 - 서비스 롤 Supabase 클라이언트 추가 (2026-02-05)
/**
 * Admin 전용 Supabase 클라이언트
 * 서비스 롤 키로 RLS를 우회하여 관리자 작업 수행
 */

import { createClient } from '@supabase/supabase-js'

/**
 * Admin 클라이언트 생성
 * 환경변수 누락 시 예외 발생
 */
export function createAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase 환경변수가 누락되었습니다')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })
}
