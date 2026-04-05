// v1.6 - PBN 주문 즉시 자동처리 (주문 생성 시 바로 캠페인 생성 + processing 전환) (2026-03-10)
// v1.5 - 온페이지 SEO/콘텐츠 최적화 상품 검증 추가 (2026-03-09)
// v1.4 - GOAT PBN API 연동 추가 (2026-03-05)
// v1.3 - 플랜 백링크 주문 필드 추가 (2026-03-03)
/**
 * 주문 관련 Server Actions
 * 상품 구매(주문 생성) 및 이메일 알림
 * - PBN 백링크 상품: 사이트 URL, 키워드 필수 + GOAT PBN API 자동 호출
 * - 플랜 백링크 상품: 사이트 URL, 키워드, 서브키워드 옵션, 비율 설정
 * - 온페이지 SEO 점검: 사이트 URL, 핵심 키워드 1개 필수
 * - 콘텐츠 최적화: 사이트 URL, 핵심 키워드 1개 필수
 */

'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '../auth/session'
import { createServerSupabaseClient } from '../supabase/client'
import { createAdminSupabaseClient } from '../supabase/admin'
import { CREDIT_REASON } from '@/lib/constants'
import { sendEmail, sendEmailToAdmin } from '@/lib/email/send-email'
import {
  renderOrderCreatedCustomerEmail,
  renderOrderCreatedAdminEmail,
  renderOrderStatusChangedEmail,
} from '@/lib/email/render'
import { createGoatPBNCampaign } from '@/lib/api/goat-pbn'
import { getProductDuration, extractPBNQuantity } from '@/lib/constants/product-config'
import { fetchAndAnalyze } from '@/lib/seo-analyzer'
import { markdownToHtml } from '@/lib/markdown-to-html'
// renderSeoReportEmail은 /api/cron/seo-reports 라우트에서 사용

/**
 * 상품 구매 (주문 생성)
 * @param productId 상품 ID
 * @param quantity 수량
 * @param note 요청사항
 * @param siteUrl 사이트 URL (백링크/SEO/콘텐츠 상품에서 필수)
 * @param keywords 키워드 (백링크/SEO/콘텐츠 상품에서 필수)
 * @param useSubKeywords 서브키워드 사용 여부 (플랜 백링크 전용)
 * @param mainKeywordRatio 메인키워드 비율 (플랜 백링크 전용)
 * @param subKeywordRatio 서브키워드 비율 (플랜 백링크 전용)
 */
export async function createOrderAction(
  productId: string,
  quantity: number,
  note?: string,
  siteUrl?: string,
  keywords?: string,
  useSubKeywords?: boolean,
  mainKeywordRatio?: number,
  subKeywordRatio?: number
) {
  try {
    const user = await requireAuth()
    const supabase = await createServerSupabaseClient()
    const adminClient = createAdminSupabaseClient()

    // 1. 수량 검증
    if (!Number.isFinite(quantity) || quantity < 1) {
      return { success: false, error: '수량은 1 이상이어야 합니다' }
    }

    // 2. 상품 조회
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('status', 'active')
      .single()

    if (productError || !product) {
      return { success: false, error: '상품을 찾을 수 없습니다' }
    }

    // 3. 가격 검증 및 총액 계산
    const productPrice = Number(product.price)
    if (!Number.isFinite(productPrice) || productPrice <= 0) {
      return { success: false, error: '상품 가격이 올바르지 않습니다' }
    }
    const totalPrice = productPrice * quantity

    // 4. 백링크 및 SEO 점검/콘텐츠 최적화 상품 필수 필드 검증
    // PBN 상품: 'PBN' 포함하지만 '플랜'은 제외 (플랜 백링크는 별도 처리)
    const isPBNProduct = product.name.includes('PBN') && !product.name.includes('플랜')
    const isPlanProduct = product.name.includes('플랜')
    const isOnPageProduct = product.name.includes('온페이지')
    const isContentProduct = product.name.includes('콘텐츠')

    if (isPBNProduct || isPlanProduct || isOnPageProduct || isContentProduct) {
      if (!siteUrl || !siteUrl.trim()) {
        return { success: false, error: '사이트 URL을 입력해주세요' }
      }
      if (!keywords || !keywords.trim()) {
        return { success: false, error: '키워드를 입력해주세요' }
      }
    }

    // 5. PBN 상품이면 주문 저장 전에 GOAT PBN 캠페인 먼저 생성
    // API 성공 여부에 따라 초기 status와 campaign_id 결정
    let initialStatus: 'pending' | 'processing' | 'completed' = 'pending'
    let goatCampaignId: string | null = null
    let pbnApiError: string | null = null

    if (isPBNProduct && siteUrl && keywords && user.email) {
      try {
        const duration = getProductDuration(product.name)
        const pbnQuantity = extractPBNQuantity(product.name)

        console.log('🚀 PBN 주문 즉시 캠페인 생성 시작:', {
          productName: product.name,
          siteUrl,
          pbnQuantity,
          duration,
        })

        const campaignResult = await createGoatPBNCampaign({
          orderId: 'pending-order', // 주문 ID는 아직 없으므로 임시값
          productName: product.name,
          customerEmail: user.email,
          siteUrl,
          keywords,
          quantity: pbnQuantity,
          duration,
        })

        if (campaignResult.success && campaignResult.campaign_id) {
          initialStatus = 'processing'
          goatCampaignId = campaignResult.campaign_id
          console.log(
            '✅ PBN 캠페인 생성 성공 - 주문을 processing으로 저장:',
            campaignResult.campaign_id
          )
        } else {
          throw new Error(campaignResult.error || '캠페인 생성 실패')
        }
      } catch (apiError: any) {
        // API 실패 시 pending으로 저장하고 api_error 기록 (관리자가 재시도 가능)
        pbnApiError = apiError.message || 'GOAT PBN API 호출 실패'
        console.error('❌ PBN 캠페인 생성 실패 - 주문을 pending으로 저장:', pbnApiError)
      }
    }

    // 5-2. 온페이지 SEO 상품이면 자동 분석 실행 (결과는 DB에 저장, 이메일은 지연 발송)
    let seoAnalysisData: {
      score: number | null
      analysisHtml: string
      parsedData: import('@/lib/seo-analyzer').ParsedSeo
    } | null = null

    if (isOnPageProduct && siteUrl) {
      try {
        console.log('🔍 온페이지 SEO 자동 분석 시작:', { siteUrl })

        const { parsed, analysis, score } = await fetchAndAnalyze(siteUrl, keywords)
        const analysisHtml = markdownToHtml(analysis)

        seoAnalysisData = { score, analysisHtml, parsedData: parsed }
        initialStatus = 'processing' // 분석 완료했지만 "처리중"으로 표시 (지연 발송 위해)

        console.log('✅ 온페이지 SEO 분석 완료 - 지연 발송 예약:', { score, siteUrl })
      } catch (seoError: any) {
        console.error('❌ SEO 자동 분석 실패 - pending으로 처리:', seoError.message)
        pbnApiError = `SEO 분석 실패: ${seoError.message}`
      }
    }

    // 6. 주문 생성
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity,
        total_price: totalPrice,
        status: initialStatus,
        note: note || null,
        site_url: siteUrl || null,
        keywords: keywords || null,
        use_sub_keywords: useSubKeywords ?? null,
        main_keyword_ratio: mainKeywordRatio ?? null,
        sub_keyword_ratio: subKeywordRatio ?? null,
        goat_campaign_id: goatCampaignId,
        api_error: pbnApiError,
        completed_at: null,
        seo_report_data: seoAnalysisData
          ? {
              score: seoAnalysisData.score,
              analysisHtml: seoAnalysisData.analysisHtml,
              parsedData: seoAnalysisData.parsedData,
            }
          : null,
      })
      .select()
      .single()

    if (orderError || !order) {
      return { success: false, error: '주문 생성에 실패했습니다' }
    }

    // 7. 크레딧 차감 (원장 기록)
    const { error: creditError } = await adminClient.rpc('apply_credit_delta', {
      p_user_id: user.id,
      p_amount: -totalPrice,
      p_reason: CREDIT_REASON.PRODUCT_PURCHASE,
      p_ref_type: 'order',
      p_ref_id: order.id,
    })

    if (creditError) {
      // 크레딧 차감 실패 시 주문 롤백
      await adminClient.from('orders').delete().eq('id', order.id)
      return { success: false, error: '크레딧이 부족합니다' }
    }

    // 8. 이메일 발송
    if (user.email) {
      if (isOnPageProduct && seoAnalysisData) {
        // SEO 점검: 접수 이메일만 즉시 발송 (분석 결과는 크론잡이 5분 후 발송)
        await sendEmail(
          user.email,
          '온페이지 SEO 점검이 접수되었습니다 - 백링크샵',
          renderOrderCreatedCustomerEmail({
            customerEmail: user.email,
            orderId: order.id,
            productName: product.name,
            quantity,
            totalPrice,
            siteUrl: siteUrl || undefined,
            keywords: keywords || undefined,
          })
        ).catch(err => {
          console.error('SEO 접수 이메일 발송 실패:', err)
        })
      } else if (isPBNProduct && initialStatus === 'processing') {
        // PBN 주문 + 캠페인 생성 성공 → 처리중 상태 이메일 발송
        await sendEmail(
          user.email,
          '주문 상태가 변경되었습니다 - 백링크샵',
          renderOrderStatusChangedEmail({
            customerEmail: user.email,
            orderId: order.id,
            productName: product.name,
            oldStatus: 'pending',
            newStatus: 'processing',
          })
        ).catch(err => {
          console.error('고객 처리중 이메일 발송 실패:', err)
        })
      } else {
        // 비PBN 주문 또는 PBN API 실패 → 주문 접수 이메일 발송
        await sendEmail(
          user.email,
          '주문이 접수되었습니다 - 백링크샵',
          renderOrderCreatedCustomerEmail({
            customerEmail: user.email,
            orderId: order.id,
            productName: product.name,
            quantity,
            totalPrice,
            note: note || undefined,
            siteUrl: siteUrl || undefined,
            keywords: keywords || undefined,
            useSubKeywords: useSubKeywords,
            mainKeywordRatio: mainKeywordRatio,
            subKeywordRatio: subKeywordRatio,
          })
        ).catch(err => {
          console.error('고객 이메일 발송 실패:', err)
        })
      }

      // 9. 관리자 이메일 발송 (모든 주문 공통)
      await sendEmailToAdmin(
        `[신규 주문] ${product.name} - ${user.email}`,
        renderOrderCreatedAdminEmail({
          customerEmail: user.email,
          orderId: order.id,
          productName: product.name,
          quantity,
          totalPrice,
          note: note || undefined,
          siteUrl: siteUrl || undefined,
          keywords: keywords || undefined,
          useSubKeywords: useSubKeywords,
          mainKeywordRatio: mainKeywordRatio,
          subKeywordRatio: subKeywordRatio,
        })
      ).catch(err => {
        console.error('관리자 이메일 발송 실패:', err)
      })
    }

    // 9. 캐시 갱신
    revalidatePath('/orders')
    revalidatePath('/dashboard')
    revalidatePath('/credits')

    return { success: true, message: '주문이 완료되었습니다', orderId: order.id }
  } catch (error) {
    return { success: false, error: '주문 처리 중 오류가 발생했습니다' }
  }
}
