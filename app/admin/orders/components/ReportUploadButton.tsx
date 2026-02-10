// v1.0 - 관리자 보고서 업로드 버튼 (2026-02-05)
/**
 * 관리자 주문 보고서 업로드 버튼
 * 파일 선택 후 업로드 수행
 */

'use client'

import { useRef, useState } from 'react'
import { uploadOrderReportAction } from '@/server/actions/admin-reports'

type Props = {
  orderId: string
  hasReport: boolean
  fileName?: string
}

export default function ReportUploadButton({ orderId, hasReport, fileName }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  /**
   * 파일 선택 핸들러
   */
  const handleSelect = () => {
    fileInputRef.current?.click()
  }

  /**
   * 파일 업로드 처리
   */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadOrderReportAction(orderId, formData)
      if (result.success) {
        setMessage('업로드 완료')
      } else {
        setMessage(result.error || '업로드 실패')
      }
    } catch (error) {
      setMessage('업로드 중 오류')
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleUpload}
      />
      <button
        type="button"
        onClick={handleSelect}
        disabled={loading}
        className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400"
      >
        {loading ? '업로드 중' : hasReport ? '교체' : '업로드'}
      </button>
      {fileName && (
        <span className="text-[10px] text-gray-400 max-w-[120px] truncate">
          {fileName}
        </span>
      )}
      {message && <span className="text-[10px] text-gray-500">{message}</span>}
    </div>
  )
}

