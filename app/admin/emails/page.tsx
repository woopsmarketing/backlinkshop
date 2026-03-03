/**
 * 관리자 이메일 발송 페이지
 * 일괄 이메일 발송 등
 */

'use client'

import { useState } from 'react'
import AdminNav from '../components/AdminNav'
import { sendAnnouncementToAllUsersAction } from '@/server/actions/admin-emails'

export default function AdminEmailsPage() {
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message?: string
    stats?: { total: number; success: number; fail: number }
  } | null>(null)

  const handleSendAnnouncement = async () => {
    if (!confirm('모든 회원에게 공지사항 이메일을 발송하시겠습니까?')) {
      return
    }

    setSending(true)
    setResult(null)

    try {
      const res = await sendAnnouncementToAllUsersAction()
      setResult(res)
    } catch (error) {
      setResult({
        success: false,
        message: '이메일 발송 중 오류가 발생했습니다',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">이메일 발송</h1>

        <AdminNav current="emails" />

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">일괄 이메일 발송</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">📢 공지사항 발송</h3>
              <p className="text-sm text-blue-800 mb-4">
                모든 회원에게 주문 정보 확인 요청 이메일을 발송합니다.
                <br />
                (사이트 주소 및 키워드 제출 안내)
              </p>

              <button
                onClick={handleSendAnnouncement}
                disabled={sending}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                  sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {sending ? '발송 중...' : '모든 회원에게 발송'}
              </button>
            </div>

            {result && (
              <div
                className={`border-l-4 p-4 rounded ${
                  result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <h3
                  className={`font-semibold mb-2 ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {result.success ? '✅ 발송 완료' : '❌ 발송 실패'}
                </h3>
                <p className={`text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </p>

                {result.stats && (
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded">
                      <div className="text-gray-600">총 발송</div>
                      <div className="text-2xl font-bold text-gray-900">{result.stats.total}</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="text-green-600">성공</div>
                      <div className="text-2xl font-bold text-green-600">
                        {result.stats.success}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="text-red-600">실패</div>
                      <div className="text-2xl font-bold text-red-600">{result.stats.fail}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ 주의사항</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 일괄 발송은 모든 회원에게 동일한 이메일을 발송합니다</li>
            <li>• 발송 후 취소할 수 없으니 신중하게 진행해주세요</li>
            <li>• 대량 발송 시 시간이 소요될 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
