// v1.1 - 로그인 리디렉션 및 초기화 위치 개선 (2026-02-05)
/**
 * 인증 관련 Server Actions
 * 로그인, 회원가입, 로그아웃, 초기화 처리
 */

'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../supabase/client'
import { SIGNUP_BONUS_AMOUNT, CREDIT_REASON } from '@/lib/constants'

/**
 * 이메일 로그인
 * @param email 이메일 주소
 * @param password 비밀번호
 */
/**
 * 로그인 처리
 * 성공 시 success=true 반환 (클라이언트에서 리디렉션 처리)
 */
export async function signIn(email: string, password: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * 회원가입
 * @param email 이메일 주소
 * @param password 비밀번호
 */
/**
 * 회원가입 처리
 * 이메일 확인 후 로그인 시 초기화 수행
 */
export async function signUp(email: string, password: string) {
  const supabase = await createServerSupabaseClient()

  // 1. 회원가입
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  if (!data.user) {
    return { success: false, error: '회원가입에 실패했습니다' }
  }

  // 2. 이메일 확인 후 로그인 시 ensureUserInitialized에서 초기화 처리

  return {
    success: true,
    message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
  }
}

/**
 * 로그아웃
 */
export async function signOut() {
  const supabase = await createServerSupabaseClient()

  await supabase.auth.signOut()

  redirect('/login')
}

/**
 * 첫 로그인 처리
 * - profiles row 생성
 * - credit_balances row 생성
 * - 가입 보너스 지급
 */
/**
 * 첫 로그인 처리
 * profiles 생성 + 가입 보너스 지급
 */
async function handleFirstLogin(userId: string) {
  const supabase = await createServerSupabaseClient()

  // 1. profiles 생성 (이미 있으면 무시)
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ user_id: userId, role: 'user' })
    .select()
    .single()

  if (profileError && profileError.code !== '23505') {
    throw profileError
  }

  // 2. 가입 보너스 지급 (apply_credit_delta 함수 사용)
  // credit_balances와 credit_ledger가 자동으로 생성됨
  if (SIGNUP_BONUS_AMOUNT > 0) {
    const { error: creditError } = await supabase.rpc('apply_credit_delta', {
      p_user_id: userId,
      p_amount: SIGNUP_BONUS_AMOUNT,
      p_reason: CREDIT_REASON.SIGNUP_BONUS,
      p_ref_type: null,
      p_ref_id: null,
    })

    if (creditError) {
      console.error('가입 보너스 지급 실패:', creditError)
      // 보너스 지급 실패해도 계속 진행
    }
  }
}

/**
 * 로그인 시 첫 로그인 여부 체크 및 처리
 * 미들웨어나 레이아웃에서 호출
 */
export async function ensureUserInitialized() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  // profiles 존재 여부 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  // profiles 없으면 첫 로그인 처리
  if (!profile) {
    await handleFirstLogin(user.id)
  }
}
