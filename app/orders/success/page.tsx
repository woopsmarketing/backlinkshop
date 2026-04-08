/**
 * 주문 완료 성공 페이지
 * 축하 화면 + 보고서 발송 안내 + 맞춤 상품 추천 CTA
 */

import { getCurrentUser, isAdmin } from '@/server/auth/session'
import { redirect } from 'next/navigation'
import TopNav from '@/app/components/TopNav'
import { createServerSupabaseClient } from '@/server/supabase/client'
import Link from 'next/link'
import AnalysisProgress from './AnalysisProgress'

type Props = {
  searchParams: Promise<{ product?: string; type?: string }>
}

export default async function OrderSuccessPage(props: Props) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const admin = await isAdmin()
  const searchParams = await props.searchParams
  const productName = searchParams.product || '상품'
  const productType = searchParams.type || ''

  const isOnPageProduct = productType === 'onpage'

  // 잔액 조회
  const supabase = await createServerSupabaseClient()
  const { data: balanceData } = await supabase
    .from('credit_balances')
    .select('balance')
    .eq('user_id', user.id)
    .single()
  const balance = balanceData?.balance || 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNav userEmail={user.email} isAdmin={admin} balance={balance} />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* 축하 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            주문이 완료되었습니다!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold">{decodeURIComponent(productName)}</span> 주문이
            성공적으로 접수되었습니다
          </p>
        </div>

        {/* 온페이지 SEO: 분석 진행 상태 */}
        {isOnPageProduct && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <AnalysisProgress />
          </div>
        )}

        {/* 맞춤 상품 추천 CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-lg p-8 text-center text-white mb-6">
          <h2 className="text-xl font-bold mb-2">내 사이트에 맞는 SEO 전략이 궁금하신가요?</h2>
          <p className="text-white/80 text-sm mb-6">
            전문가가 사이트 분석 결과를 바탕으로 최적의 백링크 전략을 무료로 상담해드립니다
          </p>
          <a
            href="https://t.me/goat82"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
            맞춤 상품 추천받기
          </a>
        </div>

        {/* 하단 링크 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/orders"
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            주문 내역 보기
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            다른 상품 보기
          </Link>
        </div>
      </main>
    </div>
  )
}
