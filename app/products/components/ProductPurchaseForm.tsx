// v1.0 - 상품 구매 폼 추가 (2026-02-05)
/**
 * 상품 구매 폼 컴포넌트
 * 수량/요청사항 입력 후 주문 생성
 */

'use client'

import { useState } from 'react'
import { createOrderAction } from '@/server/actions/orders'
import { formatCredits } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Props = {
  productId: string
  productName: string
  price: number
}

export default function ProductPurchaseForm({ productId, productName, price }: Props) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const totalPrice = price * quantity

  /**
   * 구매 요청 처리
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      const result = await createOrderAction(productId, quantity, note)

      if (result.success) {
        setMessage({ type: 'success', text: result.message || '주문이 완료되었습니다' })
        // 주문 내역으로 이동
        router.push('/orders')
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
          {message.text}
        </div>
      )}

      {/* 상품명 */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">상품명</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{productName}</p>
      </div>

      {/* 수량 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          수량
        </label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* 요청사항 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          요청사항 (선택)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="예) 특정 키워드 포함 요청"
        />
      </div>

      {/* 총액 */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">총 결제 크레딧</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatCredits(totalPrice)} 크레딧
        </p>
      </div>

      {/* 구매 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
      >
        {loading ? '처리 중...' : '구매하기'}
      </button>
    </form>
  )
}

