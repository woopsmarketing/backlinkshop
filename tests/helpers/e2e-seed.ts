// v1.0 - E2E 테스트 데이터 시드 유틸 (2026-02-05)
/**
 * Supabase 서비스 롤을 사용하여 테스트 데이터 생성
 * 유저/쿠폰/상품을 생성하고 테스트 종료 후 정리
 */

import { createClient } from '@supabase/supabase-js'

export type E2ESeedData = {
  userId: string
  userEmail: string
  userPassword: string
  couponCode: string
  productId: string
  productName: string
}

export type TopupApprovalSeedData = {
  userId: string
  userEmail: string
  userPassword: string
  adminId: string
  adminEmail: string
  adminPassword: string
}

/**
 * 환경변수 검증
 */
function getEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('환경변수가 누락되었습니다: NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY')
  }

  return { supabaseUrl, serviceRoleKey }
}

/**
 * 테스트 데이터 생성
 */
export async function setupE2ESeed(): Promise<E2ESeedData> {
  const { supabaseUrl, serviceRoleKey } = getEnv()
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

  const unique = Date.now()
  const userEmail = `e2e_user_${unique}@test.local`
  const userPassword = 'Password123!'
  const couponCode = `E2E${unique}`
  const productName = `E2E 테스트 상품 ${unique}`

  // 1) 테스트 유저 생성
  const { data: userData, error: userError } = await admin.auth.admin.createUser({
    email: userEmail,
    password: userPassword,
    email_confirm: true,
  })

  if (userError || !userData?.user) {
    throw new Error(userError?.message || '테스트 유저 생성 실패')
  }

  const userId = userData.user.id

  // 1-1) 프로필 생성 (중복 무시)
  await admin.from('profiles').upsert({ user_id: userId, role: 'user' })

  // 1-2) 기본 크레딧 지급 (테스트 안정성 확보)
  await admin.rpc('apply_credit_delta', {
    p_user_id: userId,
    p_amount: 1000,
    p_reason: 'signup_bonus',
    p_ref_type: 'e2e',
    p_ref_id: String(unique),
  })

  // 2) 쿠폰 생성
  const { error: couponError } = await admin.from('coupons').insert({
    code: couponCode,
    amount: 1000,
    max_uses: 1,
    used_count: 0,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: userId,
  })

  if (couponError) {
    throw new Error(couponError.message || '테스트 쿠폰 생성 실패')
  }

  // 3) 상품 생성
  const { data: product, error: productError } = await admin
    .from('products')
    .insert({
      name: productName,
      description: 'E2E 테스트용 상품',
      price: 500,
      category: 'backlink',
      status: 'active',
      metadata: { source: 'e2e' },
    })
    .select('id')
    .single()

  if (productError || !product) {
    throw new Error(productError?.message || '테스트 상품 생성 실패')
  }

  return {
    userId,
    userEmail,
    userPassword,
    couponCode,
    productId: product.id,
    productName,
  }
}

/**
 * 테스트 데이터 정리
 */
export async function teardownE2ESeed(seed: E2ESeedData) {
  if (process.env.E2E_KEEP_DATA === '1') {
    return
  }
  const { supabaseUrl, serviceRoleKey } = getEnv()
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

  // 주문/원장/잔액 삭제 (테스트 유저 기준)
  await admin.from('orders').delete().eq('user_id', seed.userId)
  await admin.from('credit_ledger').delete().eq('user_id', seed.userId)
  await admin.from('credit_balances').delete().eq('user_id', seed.userId)
  await admin.from('coupon_redemptions').delete().eq('user_id', seed.userId)
  await admin.from('topup_requests').delete().eq('user_id', seed.userId)
  await admin.from('profiles').delete().eq('user_id', seed.userId)

  // 쿠폰/상품 삭제
  await admin.from('coupons').delete().eq('code', seed.couponCode)
  await admin.from('products').delete().eq('id', seed.productId)

  // 유저 삭제
  await admin.auth.admin.deleteUser(seed.userId)
}

/**
 * 주문 생성 여부 확인 (관리자 권한)
 */
export async function hasOrderForProduct(userId: string, productId: string) {
  const { supabaseUrl, serviceRoleKey } = getEnv()
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

  const { data, error } = await admin
    .from('orders')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .limit(1)

  if (error) {
    throw new Error(`주문 조회 실패: ${error.message}`)
  }

  return (data || []).length > 0
}

/**
 * 충전 승인 플로우용 테스트 데이터 생성
 * - 유저/관리자 계정 생성
 * - profiles role 설정
 */
export async function setupTopupApprovalSeed(): Promise<TopupApprovalSeedData> {
  const { supabaseUrl, serviceRoleKey } = getEnv()
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

  const unique = Date.now()
  const userEmail = `e2e_topup_user_${unique}@test.local`
  const adminEmail = `e2e_admin_${unique}@test.local`
  const userPassword = 'Password123!'
  const adminPassword = 'Password123!'

  const { data: userData, error: userError } = await admin.auth.admin.createUser({
    email: userEmail,
    password: userPassword,
    email_confirm: true,
  })

  if (userError || !userData?.user) {
    throw new Error(userError?.message || '테스트 유저 생성 실패')
  }

  const { data: adminData, error: adminError } = await admin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  })

  if (adminError || !adminData?.user) {
    throw new Error(adminError?.message || '테스트 관리자 생성 실패')
  }

  const userId = userData.user.id
  const adminId = adminData.user.id

  await admin.from('profiles').upsert([
    { user_id: userId, role: 'user' },
    { user_id: adminId, role: 'admin' },
  ])

  return {
    userId,
    userEmail,
    userPassword,
    adminId,
    adminEmail,
    adminPassword,
  }
}

/**
 * 충전 승인 플로우 테스트 데이터 정리
 */
export async function teardownTopupApprovalSeed(seed: TopupApprovalSeedData) {
  if (process.env.E2E_KEEP_DATA === '1') {
    return
  }
  const { supabaseUrl, serviceRoleKey } = getEnv()
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

  await admin.from('topup_requests').delete().eq('user_id', seed.userId)
  await admin.from('credit_ledger').delete().eq('user_id', seed.userId)
  await admin.from('credit_balances').delete().eq('user_id', seed.userId)
  await admin.from('profiles').delete().in('user_id', [seed.userId, seed.adminId])

  await admin.auth.admin.deleteUser(seed.userId)
  await admin.auth.admin.deleteUser(seed.adminId)
}

