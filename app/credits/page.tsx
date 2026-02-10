// v1.1 - 상단 메뉴 추가 (2026-02-05)
/**
 * 크레딧 관리 페이지
 * 잔액, 원장 내역, 쿠폰 사용, 충전 요청
 */

import { getCurrentUser, isAdmin } from '@/server/auth/session'
import { getBalance, getLedgerHistory, getLedgerStats } from '@/server/queries/credits'
import { formatCredits, formatDate } from '@/lib/utils'
import CouponForm from './components/CouponForm'
import TopupPackages from './components/TopupPackages'
import LedgerTable from './components/LedgerTable'
import { redirect } from 'next/navigation'
import TopNav from '@/app/components/TopNav'

export default async function CreditsPage() {
  // 로그인 확인
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const admin = await isAdmin()

  // 데이터 조회
  const balance = await getBalance(user.id)
  const ledgerHistory = await getLedgerHistory(user.id, 50)
  const stats = await getLedgerStats(user.id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user.email} isAdmin={admin} title="크레딧 관리" />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 왼쪽: 잔액 + 통계 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 현재 잔액 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
              <p className="text-blue-100 text-sm font-medium mb-2">현재 잔액</p>
              <p className="text-5xl font-bold mb-4">
                {formatCredits(balance.balance)}
                <span className="text-2xl ml-2 text-blue-100">크레딧</span>
              </p>
              <p className="text-blue-100 text-sm">
                마지막 업데이트: {formatDate(balance.updated_at)}
              </p>
            </div>

            {/* 통계 카드 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    총 충전
                  </h3>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCredits(stats.totalCharged)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    총 사용
                  </h3>
                  <span className="text-2xl">💸</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCredits(stats.totalSpent)}
                </p>
              </div>
            </div>

            {/* 원장 내역 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                크레딧 내역
              </h2>
              <LedgerTable ledger={ledgerHistory} />
            </div>
          </div>

          {/* 오른쪽: 쿠폰 + 충전 */}
          <div className="space-y-6">
            {/* 쿠폰 입력 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                쿠폰 사용
              </h2>
              <CouponForm />
            </div>

            {/* 충전 패키지 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                크레딧 충전
              </h2>
              <TopupPackages />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
