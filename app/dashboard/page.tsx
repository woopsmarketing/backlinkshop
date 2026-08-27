// v1.3 - 빠른 이동 섹션 추가 (2026-03-09)
// v1.2 - 보고서 다운로드 섹션 추가 (2026-02-05)
/**
 * 대시보드 페이지
 * 잔액, 주문 요약, CTA 버튼, 상단 메뉴
 * 20만 크레딧 추천 상품, 인기 상품 빠른 구매, 전문가 상담 섹션
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
import { getActiveProducts } from '@/server/queries/products'
import OnboardingChecklist from './components/OnboardingChecklist'
import FirstChargeBonusTimer from './components/FirstChargeBonusTimer'
import { TELEGRAM_URL } from '@/config/site'

type Props = {
  searchParams: Promise<{ from?: string; site?: string }>
}

export default async function DashboardPage(props: Props) {
  // 유저 확인
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // 첫 로그인 처리 확인
  await ensureUserInitialized()

  // LP에서 온 경우: 온페이지 SEO 상품 페이지로 자동 리디렉트
  const searchParams = await props.searchParams
  if (searchParams.from === 'lp') {
    const allProductsForRedirect = await getActiveProducts()
    const seoProduct = allProductsForRedirect.find((p: any) => p.name === '온페이지 SEO 점검')
    if (seoProduct) {
      const redirectPath = searchParams.site
        ? `/shop/${seoProduct.id}?site=${encodeURIComponent(searchParams.site)}`
        : `/shop/${seoProduct.id}`
      redirect(redirectPath)
    }
  }

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

  // SEO 점검 주문 여부 (온보딩 체크리스트용)
  const { data: seoOrders } = await supabase
    .from('orders')
    .select('id, products!inner(name)')
    .eq('user_id', user.id)
    .like('products.name', '%SEO%')
    .limit(1)

  // 충전 이력 여부 (온보딩 체크리스트용)
  const { count: topupCount } = await supabase
    .from('topup_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'approved')

  // 최근 보고서 조회
  const recentReports = await getRecentReports(user.id, 5)

  // 빠른 구매용 상품 조회
  const allProducts = await getActiveProducts()

  /**
   * 특정 상품명으로 상품 찾기
   * @param name 상품명
   */
  const findProduct = (name: string) => {
    return allProducts.find((p: any) => p.name === name)
  }

  // 20만 크레딧 추천 상품 (온페이지 SEO 점검만 - 고품질 백링크는 20만으로 이용 불가)
  const starterProducts = [findProduct('온페이지 SEO 점검')].filter(Boolean)

  // 인기 상품
  const popularProducts = [
    findProduct('PBN 백링크 50'),
    findProduct('로직 업그레이드 PBN 100'),
    findProduct('플랜 백링크 A'),
    findProduct('온페이지 SEO 점검'),
  ].filter(Boolean)

  // 현재 잔액
  const currentBalance = balance?.balance || 0
  // 20만 크레딧 이상인 경우 추천 상품 섹션 표시
  const showStarterSection = currentBalance >= 200000

  // 첫 충전 보너스 타이머: 미충전 유저에게만 표시
  const hasTopup = (topupCount || 0) > 0
  const userCreatedAt = user.created_at || new Date().toISOString()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user.email} isAdmin={admin} title="대시보드" balance={currentBalance} />

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

          {/* 첫 충전 100% 보너스 카운트다운 (미충전 유저) */}
          {!hasTopup && (
            <div className="col-span-full">
              <FirstChargeBonusTimer createdAt={userCreatedAt} bonusDays={7} />
            </div>
          )}

          {/* 온보딩 체크리스트 (주문 없는 신규 사용자) */}
          {(orderCount || 0) === 0 && (
            <div className="col-span-full">
              <OnboardingChecklist
                hasSeoOrder={!!seoOrders && seoOrders.length > 0}
                hasTopup={(topupCount || 0) > 0}
                balance={currentBalance}
              />
            </div>
          )}

          {/* 주문 통계 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">총 주문</h3>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{orderCount || 0}개</p>
          </div>

          {/* 빠른 액션 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-4">빠른 액션</h3>
            <div className="space-y-2">
              <Link
                href="/shop"
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
              <p className="text-sm text-gray-500 dark:text-gray-400">아직 보고서가 없습니다</p>
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

        {/* 20만 크레딧으로 시작하기 섹션 (조건부) */}
        {showStarterSection && starterProducts.length > 0 && (
          <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎯</span>
              <h2 className="text-xl font-bold text-green-900 dark:text-green-100">
                20만 크레딧으로 시작하기
              </h2>
            </div>
            <p className="text-green-700 dark:text-green-300 text-sm mb-6">
              가입 보너스로 바로 시작할 수 있는 추천 상품입니다
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {starterProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                      추천
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCredits(Number(product.price))} 크레딧
                    </p>
                    <Link
                      href={`/shop/${product.id}`}
                      className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      무료 체험
                    </Link>
                  </div>
                </div>
              ))}

              {/* 1:1 문의 카드 (텔레그램 연동) */}
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-5 shadow-md text-white">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">1:1 전문가 상담</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/20 font-medium">
                    무료
                  </span>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  백링크, SEO 전략이 궁금하신가요? 전문가가 직접 상담해드립니다
                </p>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white hover:bg-gray-100 text-blue-600 rounded-lg transition-colors text-sm font-semibold"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                  텔레그램으로 문의하기
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 인기 상품 빠른 구매 섹션 */}
        {popularProducts.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">⚡</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                인기 상품 빠른 구매
              </h2>
            </div>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {popularProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">
                    {formatCredits(Number(product.price))}
                  </p>
                  <Link
                    href={`/shop/${product.id}`}
                    className="block w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors text-sm font-medium"
                  >
                    구매하기
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 전문가 실시간 상담 섹션 */}
        <div className="mt-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <span className="text-5xl">💬</span>
              <div>
                <h2 className="text-2xl font-bold mb-2">전문가와 실시간 상담</h2>
                <p className="text-purple-100 text-sm">
                  SEO 전문가와 1:1 상담을 통해 최적의 전략을 수립하세요
                </p>
              </div>
            </div>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-3 px-6 bg-white hover:bg-gray-100 text-purple-600 rounded-lg transition-colors font-semibold shadow-lg whitespace-nowrap"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
              텔레그램으로 상담하기
            </a>
          </div>
        </div>

        {/* 환영 메시지 (가입 보너스 안내) */}
        {balance?.balance === 200000 && (orderCount || 0) === 0 && (
          <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎉</span>
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-1">
                  환영합니다!
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  가입 보너스 20만 크레딧이 지급되었습니다. 마음껏 사용해보세요!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
