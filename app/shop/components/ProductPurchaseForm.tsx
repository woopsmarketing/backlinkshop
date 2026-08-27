// v3.1 - 온페이지 SEO/콘텐츠 최적화 상품 양식 추가 (2026-03-09)
// v3.0 - 플랜 백링크 상품 전용 양식 추가 (2026-03-03)
/**
 * 상품 구매 폼 컴포넌트
 * - PBN 백링크: 사이트 URL, 키워드 입력 (수량 고정 1)
 * - 플랜 백링크: 사이트 URL, 키워드, 서브키워드 옵션, 비율 설정 (수량 고정 1)
 * - 온페이지 SEO 점검: 사이트 URL, 핵심 키워드 1개 입력 (수량 고정 1)
 * - 콘텐츠 최적화: 사이트 URL, 핵심 키워드 1개 입력 (수량 고정 1)
 * - 기타 상품: 수량, 요청사항 입력
 */

'use client'

import { useState } from 'react'
import { createOrderAction } from '@/server/actions/orders'
import { formatCredits } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  productId: string
  productName: string
  price: number
}

export default function ProductPurchaseForm({ productId, productName, price }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // LP에서 전달된 사이트 URL 자동 입력
  const prefilledSite = searchParams.get('site') || ''

  // 상품 타입 확인
  const isPBNProduct = productName.includes('PBN')
  const isPlanProduct = productName.includes('플랜')
  const isOnPageProduct = productName.includes('온페이지')
  const isContentProduct = productName.includes('콘텐츠')

  // 기본 필드
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')

  // 백링크 공통 필드
  const [siteUrl, setSiteUrl] = useState(prefilledSite)
  const [keywords, setKeywords] = useState('')

  // 플랜 백링크 전용 필드
  const [useSubKeywords, setUseSubKeywords] = useState(true)
  const [mainKeywordRatio, setMainKeywordRatio] = useState(70)
  const [subKeywordRatio, setSubKeywordRatio] = useState(30)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 백링크 및 SEO 점검/콘텐츠 최적화 상품은 수량 고정 1, 기타 상품은 입력된 수량 사용
  const actualQuantity =
    isPBNProduct || isPlanProduct || isOnPageProduct || isContentProduct ? 1 : quantity
  const totalPrice = price * actualQuantity

  // 비율 조정 핸들러
  const handleMainRatioChange = (value: number) => {
    const newMainRatio = Math.max(0, Math.min(100, value))
    setMainKeywordRatio(newMainRatio)
    setSubKeywordRatio(100 - newMainRatio)
  }

  const handleSubRatioChange = (value: number) => {
    const newSubRatio = Math.max(0, Math.min(100, value))
    setSubKeywordRatio(newSubRatio)
    setMainKeywordRatio(100 - newSubRatio)
  }

  /**
   * 구매 요청 처리
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // 백링크 및 SEO 점검/콘텐츠 최적화 상품 필수 필드 검증
    if (isPBNProduct || isPlanProduct || isOnPageProduct || isContentProduct) {
      if (!siteUrl.trim()) {
        setMessage({ type: 'error', text: '사이트 URL을 입력해주세요' })
        return
      }
      if (!keywords.trim()) {
        setMessage({ type: 'error', text: '키워드를 입력해주세요' })
        return
      }
    }

    setLoading(true)

    try {
      const result = await createOrderAction(
        productId,
        actualQuantity,
        note,
        isPBNProduct || isPlanProduct || isOnPageProduct || isContentProduct ? siteUrl : undefined,
        isPBNProduct || isPlanProduct || isOnPageProduct || isContentProduct ? keywords : undefined,
        isPlanProduct ? useSubKeywords : undefined,
        isPlanProduct ? mainKeywordRatio : undefined,
        isPlanProduct ? subKeywordRatio : undefined
      )

      if (result.success) {
        // 성공 페이지로 리디렉트
        const successUrl = new URL('/orders/success', window.location.origin)
        successUrl.searchParams.set('product', encodeURIComponent(productName))
        if (isOnPageProduct) {
          successUrl.searchParams.set('type', 'onpage')
        }
        router.push(successUrl.pathname + successUrl.search)
      } else {
        setMessage({ type: 'error', text: result.error || '주문에 실패했습니다' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '오류가 발생했습니다' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 메시지 */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}
        >
          {message.text.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < message.text.split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
      )}

      {/* 상품명 */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">상품명</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{productName}</p>
      </div>

      {/* 백링크 및 SEO 점검/콘텐츠 최적화 상품: 사이트 URL, 키워드 입력 */}
      {isPBNProduct || isPlanProduct || isOnPageProduct || isContentProduct ? (
        <>
          {/* 사이트 URL (필수) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              사이트 URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={siteUrl}
              onChange={e => setSiteUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isOnPageProduct
                ? 'SEO 점검을 받을 사이트의 URL을 입력해주세요'
                : isContentProduct
                  ? '콘텐츠 최적화를 받을 사이트의 URL을 입력해주세요'
                  : '백링크를 받을 사이트의 URL을 입력해주세요'}
            </p>
          </div>

          {/* 키워드 (필수) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {isOnPageProduct || isContentProduct ? '핵심 키워드' : '메인 키워드'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder={
                isOnPageProduct || isContentProduct
                  ? '예) SEO 최적화'
                  : '예) SEO 최적화, 백링크 구매, 검색엔진 최적화'
              }
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isOnPageProduct || isContentProduct
                ? '핵심 키워드 1개를 입력해주세요'
                : isPlanProduct
                  ? '타겟 키워드를 입력해주세요 (여러 개 입력 가능, 쉼표로 구분)'
                  : '타겟 키워드를 입력해주세요 (여러 개는 쉼표로 구분)'}
            </p>
          </div>

          {/* 플랜 백링크 전용: 서브키워드 옵션 (온페이지 SEO는 제외) */}
          {isPlanProduct && !isOnPageProduct && (
            <>
              {/* 서브키워드 추가 옵션 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="useSubKeywords"
                    checked={useSubKeywords}
                    onChange={e => setUseSubKeywords(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="useSubKeywords"
                      className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
                    >
                      서브키워드 추가 (권장)
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      메인키워드를 기반으로 생성된 다양한 LSI키워드 및 롱테일키워드를 자동으로
                      추가합니다. 약 100개 가량 추가되며, SEO 측면에서 자연스럽고 효율이 좋습니다.
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        ✓ 자연스러운 링크 프로필
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        ✓ 다양한 키워드 커버
                      </span>
                    </div>
                  </div>
                </div>

                {/* 키워드 비율 설정 */}
                {useSubKeywords && (
                  <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      키워드 비율 설정
                    </p>

                    {/* 메인키워드 비율 */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-gray-700 dark:text-gray-300">
                          메인키워드
                        </label>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {mainKeywordRatio}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={mainKeywordRatio}
                        onChange={e => handleMainRatioChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>

                    {/* 서브키워드 비율 */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-gray-700 dark:text-gray-300">
                          서브키워드 (LSI/롱테일)
                        </label>
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {subKeywordRatio}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={subKeywordRatio}
                        onChange={e => handleSubRatioChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      💡 권장 비율: 메인 70% / 서브 30% (자연스러운 백링크 프로필)
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* 요청사항 (선택) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              요청사항 (선택)
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="예) 특정 앵커 텍스트 요청, 추가 요구사항 등"
            />
          </div>
        </>
      ) : (
        <>
          {/* 일반 상품: 수량 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              수량
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 요청사항 (선택) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              요청사항 (선택)
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="예) 특정 키워드 포함 요청"
            />
          </div>
        </>
      )}

      {/* 총액 */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">총 결제 크레딧</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatCredits(totalPrice)} 크레딧
        </p>
      </div>

      {/* 구매 버튼 + 로딩 프로그레스 */}
      {loading ? (
        <div className="space-y-3">
          <button
            type="button"
            disabled
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center gap-2"
          >
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            주문 처리 중...
          </button>
          <div className="rounded-lg overflow-hidden">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                style={{
                  animation: 'progressPulse 2s ease-in-out infinite',
                }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-center">
              잠시만 기다려주세요. 주문을 접수하고 있습니다
            </p>
          </div>
        </div>
      ) : (
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          구매하기
        </button>
      )}
    </form>
  )
}
