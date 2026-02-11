// v1.1 - 대용량 업로드 대응 (Signed Upload URL) (2026-02-11)
/**
 * 관리자 주문 보고서 업로드 Server Actions
 * 주문에 엑셀/CSV 파일을 첨부
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser, isAdmin } from '../auth/session'
import { createAdminSupabaseClient } from '../supabase/admin'

/**
 * 보고서 업로드용 Signed URL 발급
 * - 대용량 업로드 대응 (Vercel 413 회피)
 */
export async function createOrderReportUploadUrlAction(orderId: string, fileName: string) {
  try {
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return { success: false, error: '관리자 권한이 필요합니다' }
    }

    if (!fileName) {
      return { success: false, error: '파일명이 없습니다' }
    }

    const adminClient = createAdminSupabaseClient()

    // 파일 경로 생성
    const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const filePath = `orders/${orderId}/${Date.now()}_${safeName}`

    // Signed Upload URL 생성 (2시간 유효)
    const { data, error } = await adminClient.storage
      .from('order-reports')
      .createSignedUploadUrl(filePath, { upsert: true })

    if (error || !data) {
      console.error('Signed URL 생성 실패:', error)
      return { success: false, error: '업로드 URL 생성에 실패했습니다' }
    }

    return {
      success: true,
      path: data.path,
      token: data.token,
    }
  } catch (error) {
    console.error('Signed URL 발급 오류:', error)
    return { success: false, error: '업로드 URL 발급 중 오류가 발생했습니다' }
  }
}

/**
 * 보고서 메타데이터 저장
 * - 업로드 완료 후 주문 테이블 업데이트
 */
export async function saveOrderReportMetaAction(
  orderId: string,
  filePath: string,
  fileName: string,
  contentType: string
) {
  try {
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return { success: false, error: '관리자 권한이 필요합니다' }
    }

    if (!filePath) {
      return { success: false, error: '파일 경로가 없습니다' }
    }

    const adminClient = createAdminSupabaseClient()

    // 주문 테이블에 메타데이터 저장
    const { error: updateError } = await adminClient
      .from('orders')
      .update({
        report_path: filePath,
        report_filename: fileName,
        report_content_type: contentType || 'application/octet-stream',
        report_uploaded_at: new Date().toISOString(),
        report_uploaded_by: user.id,
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('보고서 메타데이터 업데이트 실패:', updateError)
      return { success: false, error: '보고서 정보 저장에 실패했습니다' }
    }

    revalidatePath('/admin/orders')
    revalidatePath('/orders')
    revalidatePath('/dashboard')

    return { success: true, message: '보고서가 업로드되었습니다' }
  } catch (error) {
    console.error('보고서 메타데이터 저장 오류:', error)
    return { success: false, error: '보고서 정보 저장 중 오류가 발생했습니다' }
  }
}
