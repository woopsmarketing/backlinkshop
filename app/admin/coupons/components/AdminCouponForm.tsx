// v1.0 - 관리자 쿠폰 생성 폼 추가 (2026-02-05)
/**
 * 관리자 쿠폰 생성 폼
 * 코드/금액/사용횟수/만료일 입력
 */

'use client'

import { useState } from 'react'
import { createCouponAction } from '@/server/actions/admin-coupons'

export default function AdminCouponForm() {
  const [code, setCode] = useState('')
  const [amount, setAmount] = useState(0)
  const [maxUses, setMaxUses] = useState(1)
  const [expiresAt, setExpiresAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  /**
   * 쿠폰 생성 처리
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      const result = await createCouponAction({
        code: code.trim().toUpperCase(),
        amount: Number(amount),
        maxUses: Number(maxUses),
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      })

      if (result.success) {
        setMessage({ type: 'success', text: result.message || '쿠폰 생성 완료' })
        setCode('')
        setAmount(0)
        setMaxUses(1)
        setExpiresAt('')
      } else {
        setMessage({ type: 'error', text: result.error || '쿠폰 생성 실패' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '쿠폰 생성 중 오류가 발생했습니다' })
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

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            쿠폰 코드
          </label>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            required
            placeholder="WELCOME500"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white uppercase"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            만료일 (선택)
          </label>
          <input
            type="date"
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            지급 크레딧
          </label>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            최대 사용 횟수
          </label>
          <input
            type="number"
            min={1}
            value={maxUses}
            onChange={e => setMaxUses(Number(e.target.value))}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
      >
        {loading ? '처리 중...' : '쿠폰 생성'}
      </button>
    </form>
  )
}
