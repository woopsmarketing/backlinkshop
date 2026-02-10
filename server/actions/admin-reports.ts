// v1.0 - 관리자 주문 보고서 업로드 액션 (2026-02-05)
/**
 * 관리자 주문 보고서 업로드 Server Actions
 * 주문에 엑셀/CSV 파일을 첨부
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser, isAdmin } from '../auth/session'
import { createAdminSupabaseClient } from '../supabase/admin'

/**
 * 보고서 업로드
 * @param orderId 주문 ID
 * @param formData 업로드 폼데이터
 */
export async function uploadOrderReportAction(orderId: string, formData: FormData) {
  try {
    const user = await getCurrentUser()
    const admin = await isAdmin()

    if (!user || !admin) {
      return { success: false, error: '관리자 권한이 필요합니다' }
    }

    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      return { success: false, error: '업로드 파일이 없습니다' }
    }

    const adminClient = createAdminSupabaseClient()

    // 파일 경로 생성
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const filePath = `orders/${orderId}/${Date.now()}_${safeName}`

    // 파일 업로드 (스토리지)
    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await adminClient.storage
      .from('order-reports')
      .upload(filePath, arrayBuffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      })

    if (uploadError) {
      console.error('보고서 업로드 실패:', uploadError)
      return { success: false, error: '보고서 업로드에 실패했습니다' }
    }

    // 주문 테이블에 메타데이터 저장
    const { error: updateError } = await adminClient
      .from('orders')
      .update({
        report_path: filePath,
        report_filename: file.name,
        report_content_type: file.type || 'application/octet-stream',
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
    console.error('보고서 업로드 오류:', error)
    return { success: false, error: '보고서 업로드 중 오류가 발생했습니다' }
  }
}
