/**
 * 이메일 미리보기 및 테스트 발송 페이지
 * 간단하게 이메일 내용을 확인하고 테스트 발송할 수 있습니다
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendTestEmailAction } from '@/server/actions/admin-test-email'

export default function EmailTestPage() {
  const [testEmail, setTestEmail] = useState('vnfm0580@gmail.com')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleTestSend = async () => {
    if (!testEmail) {
      alert('테스트 이메일 주소를 입력해주세요')
      return
    }

    setSending(true)
    setResult(null)

    try {
      // Server Action 호출
      const res = await sendTestEmailAction(testEmail)
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">이메일 테스트</h1>
          <Link href="/admin/emails" className="text-sm text-blue-600 hover:text-blue-700">
            ← 이메일 관리로 돌아가기
          </Link>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📧 이메일 미리보기 및 테스트 발송</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-3">테스트 이메일 발송</h3>
              <p className="text-sm text-blue-800 mb-4">
                본인 이메일로 테스트 발송하여 실제 이메일을 미리 확인할 수 있습니다.
              </p>

              <div className="flex gap-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  placeholder="테스트 이메일 주소"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleTestSend}
                  disabled={sending}
                  className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
                    sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {sending ? '발송 중...' : '테스트 발송'}
                </button>
              </div>
            </div>

            {result && (
              <div
                className={`border-l-4 p-4 rounded ${
                  result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {result.success ? '✅ 발송 완료' : '❌ 발송 실패'}
                </p>
                <p className={`text-sm mt-1 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </p>
              </div>
            )}

            <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
              <h3 className="font-semibold text-purple-900 mb-2">📋 이메일 내용 요약</h3>
              <ul className="text-sm text-purple-800 space-y-2">
                <li>• 정식 오픈 안내 및 감사 인사</li>
                <li>• MVP 테스트 중 불편 사항 사과</li>
                <li>• 백링크 작업을 위한 정보 요청 (사이트 주소, 키워드)</li>
                <li>• 24시간 텔레그램 문의 버튼 (t.me/goat82)</li>
                <li>• 주문내역 바로가기 / 백링크샵 바로가기 버튼</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
              <h3 className="font-semibold text-yellow-900 mb-2">💡 팁</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• 테스트 발송으로 실제 이메일을 확인해보세요</li>
                <li>• 텔레그램 버튼이 제대로 작동하는지 확인하세요</li>
                <li>• 모바일에서도 확인해보시면 좋습니다</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📝 이메일 내용 수정</h2>
          <p className="text-sm text-gray-600 mb-4">
            이메일 내용을 수정하려면 다음 파일을 편집하세요:
          </p>
          <code className="block bg-gray-100 p-3 rounded text-sm">
            lib/email/templates/announcement.tsx
          </code>
          <p className="text-sm text-gray-600 mt-3">
            수정 후 GitHub에 푸시하면 Vercel에서 자동으로 배포됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
