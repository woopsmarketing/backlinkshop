// v1.2 - 보고서 업로드 시 이메일 알림 추가 (2026-03-01)
/**
 * 관리자 주문 보고서 업로드 Server Actions
 * 주문에 엑셀/CSV 파일을 첨부하고 고객에게 이메일 알림 발송
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser, isAdmin } from '../auth/session'
import { createAdminSupabaseClient } from '../supabase/admin'
import { sendEmail } from '@/lib/email/send-email'
import { ReportUploadedEmail } from '@/lib/email/templates/report-uploaded'
import { createElement } from 'react'

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

    // 1. 주문 정보 조회
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('id, user_id, product_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('주문 조회 실패:', orderError)
      return { success: false, error: '주문을 찾을 수 없습니다' }
    }

    // 2. 주문 테이블에 메타데이터 저장
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

    // 3. 유저 이메일 및 상품명 조회 (이메일 발송용)
    const { data: userProfile } = await adminClient
      .from('profiles')
      .select('email')
      .eq('id', order.user_id)
      .single()

    const { data: product } = await adminClient
      .from('products')
      .select('name')
      .eq('id', order.product_id)
      .single()

    const userEmail = userProfile?.email
    const productName = product?.name || '알 수 없는 상품'

    // 4. 이메일 발송 (고객에게 보고서 업로드 알림)
    if (userEmail) {
      await sendEmail(
        userEmail,
        '보고서가 업로드되었습니다 - 백링크샵',
        createElement(ReportUploadedEmail, {
          customerEmail: userEmail,
          orderId: order.id,
          productName,
          reportFilename: fileName,
        })
      ).catch(err => {
        console.error('보고서 업로드 이메일 발송 실패:', err)
        // 이메일 실패해도 업로드는 성공으로 처리
      })
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
