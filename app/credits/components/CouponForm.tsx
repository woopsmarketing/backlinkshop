/**
 * 쿠폰 입력 폼 컴포넌트
 * Client Component
 */

'use client'

import { useState } from 'react'
import { redeemCouponAction } from '@/server/actions/credits'

export default function CouponForm() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) {
      setMessage({ type: 'error', text: '쿠폰 코드를 입력하세요' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const result = await redeemCouponAction(code)

      if (result.success) {
        setMessage({ type: 'success', text: result.message || '쿠폰이 적용되었습니다' })
        setCode('')
      } else {
        setMessage({ type: 'error', text: result.error || '쿠폰 적용에 실패했습니다' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '오류가 발생했습니다' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* 메시지 */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="쿠폰 코드 입력"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white uppercase"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? '처리 중...' : '쿠폰 적용'}
        </button>
      </form>

      {/* 안내 */}
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        쿠폰 코드를 입력하면 즉시 크레딧이 지급됩니다
      </p>
    </div>
  )
}
