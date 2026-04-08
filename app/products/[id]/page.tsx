// v1.2 - 상세 정보 강화 및 아이콘 추가 (2026-02-11)
/**
 * 상품 상세 페이지
 * 상세 정보 표시 및 구매 폼 제공
 */

import { notFound } from 'next/navigation'
import { getProductById } from '@/server/queries/products'
import { formatCredits } from '@/lib/utils'
import ProductPurchaseForm from '../components/ProductPurchaseForm'
import Link from 'next/link'
import { getCurrentUser, isAdmin } from '@/server/auth/session'
import TopNav from '@/app/components/TopNav'
import { createServerSupabaseClient } from '@/server/supabase/client'
import WelcomePopup from '../components/WelcomePopup'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ site?: string; welcome?: string }>
}

export default async function ProductDetailPage(props: Props) {
  // Next.js 15: params는 Promise
  const params = await props.params
  const searchParams = await props.searchParams
  const product = await getProductById(params.id)
  const user = await getCurrentUser()
  const admin = await isAdmin()

  // 잔액 조회
  const supabase = await createServerSupabaseClient()
  const { data: balanceData } = user
    ? await supabase.from('credit_balances').select('balance').eq('user_id', user.id).single()
    : { data: null }
  const balance = balanceData?.balance || 0

  // 첫 로그인 여부 (주문 0건 + 잔액 20만 = 신규 가입자)
  const { count: orderCount } = user
    ? await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
    : { count: 0 }
  const isNewUser = balance === 200000 && (orderCount || 0) === 0

  if (!product || product.status !== 'active') {
    notFound()
  }

  // 아이콘/하이라이트 매핑
  const getProductIcon = (name: string, categoryValue?: string) => {
    if (name.includes('PBN')) return '🏆'
    if (name.includes('플랜')) return '📦'
    if (name.includes('온페이지')) return '🧭'
    if (name.includes('콘텐츠')) return '✍️'
    if (categoryValue === 'seo') return '⚙️'
    if (categoryValue === 'content') return '📝'
    return '🔗'
  }

  const getHighlights = (name: string) => {
    if (name.includes('로직 업그레이드')) {
      return ['고유 도메인 사용', '콘텐츠 업데이트 포함', '고경쟁 키워드 대응']
    }
    if (name.includes('PBN')) {
      return ['직접 구축 네트워크', '고품질 도메인', '강력한 링크 파워']
    }
    if (name.includes('플랜')) {
      return [
        '키워드 무제한 입력 가능',
        '서브키워드 자동 생성 (LSI/롱테일)',
        '자연스러운 백링크 프로필 구축',
        '다양한 백링크 유형 조합',
        'SEO 효율 극대화',
      ]
    }
    if (name.includes('온페이지')) {
      return [
        '도메인 상태 및 권위도 분석',
        '구글 인덱싱 현황 점검',
        '내부 HTML 구조 검증 (메타태그, 헤딩, 스키마)',
        '페이지 속도 및 Core Web Vitals 측정',
        '모바일 최적화 상태 확인',
        '내부 링크 구조 분석',
        '콘텐츠 품질 및 키워드 최적화 평가',
        '기술적 SEO 이슈 전수 조사 (0-100점 종합 진단)',
        '상세 개선 보고서 제공 (PDF)',
      ]
    }
    if (name.includes('콘텐츠')) {
      return ['키워드 최적화', '콘텐츠 품질 개선', '전환율 강화']
    }
    return ['맞춤형 SEO 솔루션', '프로세스 투명화', '리포트 제공']
  }

  const metadata = product.metadata as { da_range?: string; turnaround?: string } | null
  const icon = getProductIcon(product.name, product.category)
  const highlights = getHighlights(product.name)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 메뉴 */}
      <TopNav userEmail={user?.email} isAdmin={admin} title={product.name} balance={balance} />

      {/* 첫 로그인 환영 팝업 */}
      {isNewUser && <WelcomePopup />}

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/products"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            ← 상품 목록
          </Link>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 왼쪽: 상품 정보 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
                {icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">상품 설명</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {product.category || 'backlink'}
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap mb-6">
              {product.description}
            </p>

            {/* 메타 정보 */}
            {metadata?.turnaround && (
              <div className="mb-6 flex flex-wrap gap-2">
                {metadata?.turnaround && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {metadata.turnaround} 내 완료
                  </span>
                )}
              </div>
            )}

            {/* 하이라이트 */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">포함 내용</p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {highlights.map(item => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">가격</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatCredits(Number(product.price))} 크레딧
              </p>
            </div>
          </div>

          {/* 오른쪽: 구매 폼 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">구매하기</h2>
            <ProductPurchaseForm
              productId={product.id}
              productName={product.name}
              price={Number(product.price)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
