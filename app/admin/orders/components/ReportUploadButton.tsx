// v1.1 - 대용량 업로드 대응 (Signed URL) (2026-02-11)
/**
 * 관리자 주문 보고서 업로드 버튼
 * 파일 선택 후 업로드 수행
 */

'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  createOrderReportUploadUrlAction,
  saveOrderReportMetaAction,
} from '@/server/actions/admin-reports'

type Props = {
  orderId: string
  hasReport: boolean
  fileName?: string
}

export default function ReportUploadButton({ orderId, hasReport, fileName }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const maxFileSizeMb = 50

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

    // 용량 제한 체크
    const fileSizeMb = file.size / (1024 * 1024)
    if (fileSizeMb > maxFileSizeMb) {
      setMessage(`파일 용량이 너무 큽니다. 최대 ${maxFileSizeMb}MB까지 업로드 가능합니다.`)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // 1) Signed Upload URL 발급
      const signedResult = await createOrderReportUploadUrlAction(orderId, file.name)
      if (!signedResult.success || !signedResult.path || !signedResult.token) {
        setMessage(signedResult.error || '업로드 URL 발급 실패')
        return
      }

      // 2) Supabase Storage로 직접 업로드 (Vercel 413 회피)
      const supabase = createClient()
      const uploadResult = await supabase.storage
        .from('order-reports')
        .uploadToSignedUrl(signedResult.path, signedResult.token, file, {
          contentType: file.type || 'application/octet-stream',
        })

      if (uploadResult.error) {
        setMessage('스토리지 업로드에 실패했습니다')
        return
      }

      // 3) 메타데이터 저장
      const metaResult = await saveOrderReportMetaAction(
        orderId,
        signedResult.path,
        file.name,
        file.type || 'application/octet-stream'
      )
      if (metaResult.success) {
        setMessage('업로드 완료')
      } else {
        setMessage(metaResult.error || '메타데이터 저장 실패')
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
        <span className="text-[10px] text-gray-400 max-w-[120px] truncate">{fileName}</span>
      )}
      {message && <span className="text-[10px] text-gray-500">{message}</span>}
    </div>
  )
}
