// v1.0 - 관리자 상품 생성/상태 변경 액션 추가 (2026-02-05)
/**
 * 관리자 상품 관리 Server Actions
 * 상품 생성 및 활성/비활성 전환
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser, isAdmin } from '../auth/session'
import { createAdminSupabaseClient } from '../supabase/admin'

/**
 * 상품 생성
 */
export async function createProductAction(input: {
  name: string
  description: string
  price: number
  category: string
}) {
  try {
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return { success: false, error: '관리자 권한이 필요합니다' }
    }

    if (!input.name || !input.description || !input.category || !Number.isFinite(input.price)) {
      return { success: false, error: '필수 입력값이 누락되었습니다' }
    }

    if (input.price <= 0) {
      return { success: false, error: '가격은 0보다 커야 합니다' }
    }

    const adminClient = createAdminSupabaseClient()

    const { error } = await adminClient.from('products').insert({
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category,
      status: 'active',
      metadata: {},
    })

    if (error) {
      console.error('상품 생성 실패:', error)
      return { success: false, error: '상품 생성에 실패했습니다' }
    }

    revalidatePath('/admin/products')
    revalidatePath('/products')

    return { success: true, message: '상품이 생성되었습니다' }
  } catch (error) {
    console.error('상품 생성 오류:', error)
    return { success: false, error: '상품 생성 중 오류가 발생했습니다' }
  }
}

/**
 * 상품 상태 변경 (active/inactive)
 */
export async function toggleProductStatusAction(productId: string, status: string) {
  try {
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return { success: false, error: '관리자 권한이 필요합니다' }
    }

    if (status !== 'active' && status !== 'inactive') {
      return { success: false, error: '유효하지 않은 상태입니다' }
    }

    const adminClient = createAdminSupabaseClient()

    const { error } = await adminClient
      .from('products')
      .update({ status })
      .eq('id', productId)

    if (error) {
      console.error('상품 상태 변경 실패:', error)
      return { success: false, error: '상품 상태 변경에 실패했습니다' }
    }

    revalidatePath('/admin/products')
    revalidatePath('/products')

    return { success: true, message: '상품 상태가 변경되었습니다' }
  } catch (error) {
    console.error('상품 상태 변경 오류:', error)
    return { success: false, error: '상품 상태 변경 중 오류가 발생했습니다' }
  }
}

