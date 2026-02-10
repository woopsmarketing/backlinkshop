// v1.0 - 보고서 다운로드 버튼 (2026-02-05)
/**
 * 고객용 보고서 다운로드 버튼
 * signed URL 발급 후 새 창 다운로드
 */

'use client'

import { useState } from 'react'
import { getOrderReportDownloadUrlAction } from '@/server/actions/reports'

type Props = {
  orderId: string
  label?: string
}

export default function ReportDownloadButton({ orderId, label = '다운로드' }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDownload = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getOrderReportDownloadUrlAction(orderId)
      if (result.success && result.url) {
        window.open(result.url, '_blank')
      } else {
        setError(result.error || '다운로드에 실패했습니다')
      }
    } catch (err) {
      setError('다운로드 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400"
      >
        {loading ? '요청 중...' : label}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

