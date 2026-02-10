// v1.0 - 주문 보고서 다운로드 링크 생성 (2026-02-05)
/**
 * 고객용 보고서 다운로드 Server Action
 * 주문 소유자인지 확인 후 signed URL 발급
 */

'use server'

import { getCurrentUser } from '../auth/session'
import { createAdminSupabaseClient } from '../supabase/admin'

/**
 * 주문 보고서 다운로드 URL 생성
 * @param orderId 주문 ID
 */
export async function getOrderReportDownloadUrlAction(orderId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    const adminClient = createAdminSupabaseClient()

    // 주문 소유자 확인 및 보고서 경로 조회
    const { data: order, error } = await adminClient
      .from('orders')
      .select('user_id, report_path')
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return { success: false, error: '주문을 찾을 수 없습니다' }
    }

    if (order.user_id !== user.id) {
      return { success: false, error: '권한이 없습니다' }
    }

    if (!order.report_path) {
      return { success: false, error: '보고서가 아직 업로드되지 않았습니다' }
    }

    // signed URL 발급 (60초)
    const { data: signed, error: signError } = await adminClient.storage
      .from('order-reports')
      .createSignedUrl(order.report_path, 60)

    if (signError || !signed?.signedUrl) {
      return { success: false, error: '다운로드 링크 생성 실패' }
    }

    return { success: true, url: signed.signedUrl }
  } catch (error) {
    console.error('다운로드 링크 생성 오류:', error)
    return { success: false, error: '다운로드 링크 생성 중 오류가 발생했습니다' }
  }
}
