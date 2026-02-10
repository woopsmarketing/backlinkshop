// v1.2 - 보고서 다운로드 섹션 추가 (2026-02-05)
/**
 * 대시보드 페이지
 * 잔액, 주문 요약, CTA 버튼, 상단 메뉴
 */

import { createServerSupabaseClient } from '@/server/supabase/client'
import { getCurrentUser, isAdmin } from '@/server/auth/session'
import { ensureUserInitialized } from '@/server/actions/auth'
import { formatCredits } from '@/lib/utils'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import TopNav from '@/app/components/TopNav'
import { getRecentReports } from '@/server/queries/orders'
import ReportDownloadButton from '@/app/components/ReportDownloadButton'

export default async function DashboardPage() {
  // 유저 확인
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // 첫 로그인 처리 확인
  await ensureUserInitialized()

  const supabase = await createServerSupabaseClient()
  const admin = await isAdmin()

  // 잔액 조회
  const { data: balance } = await supabase
    .from('credit_balances')
    .select('balance')
    .eq('user_id', user.id)
    .single()

  // 주문 개수 조회
  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // 최근 보고서 조회
  const recentReports = await getRecentReports(user.id, 5)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user.email} isAdmin={admin} title="대시보드" />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 크레딧 잔액 카드 (강조) */}
          <div className="col-span-full md:col-span-2 lg:col-span-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">현재 잔액</p>
                <p className="text-5xl font-bold">
                  {formatCredits(balance?.balance || 0)}
                  <span className="text-2xl ml-2 text-blue-100">크레딧</span>
                </p>
              </div>
              <div className="text-6xl opacity-20">💰</div>
            </div>
          </div>

          {/* 주문 통계 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                총 주문
              </h3>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {orderCount || 0}개
            </p>
          </div>

          {/* 빠른 액션 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-4">
              빠른 액션
            </h3>
            <div className="space-y-2">
              <Link
                href="/products"
                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors text-sm font-medium"
              >
                상품 보기
              </Link>
              <Link
                href="/credits"
                className="block w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center rounded-lg transition-colors text-sm font-medium"
              >
                크레딧 충전
              </Link>
            </div>
          </div>

        {/* 최근 보고서 카드 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-4">
            보고서 다운로드
          </h3>
          {recentReports.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              아직 보고서가 없습니다
            </p>
          ) : (
            <div className="space-y-2">
              {recentReports.map((report: any) => (
                <div key={report.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
                    {report.products?.name || '보고서'}
                  </span>
                  <ReportDownloadButton orderId={report.id} label="다운로드" />
                </div>
              ))}
            </div>
          )}
          <Link
            href="/orders"
            className="inline-block mt-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
          >
            주문 내역 보기 →
          </Link>
        </div>
        </div>

        {/* 환영 메시지 (가입 보너스 안내) */}
        {balance?.balance === 300 && (
          <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎉</span>
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-1">
                  환영합니다!
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  가입 보너스 300 크레딧이 지급되었습니다. 마음껏 사용해보세요!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
