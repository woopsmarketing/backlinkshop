/**
 * 가격표 페이지 (사이트링크용)
 * Google Ads 사이트링크: "가격표 보기"
 */

import Link from 'next/link'
import { ClientCTAButton } from '@/app/components/ClientCTAButton'

export const dynamic = 'force-static'

export const metadata = {
  title: 'SEO 백링크 가격표 | 백링크샵',
  description:
    '백링크샵의 SEO 백링크 가격을 한눈에 비교하세요. 온페이지 SEO 점검 무료, PBN 백링크 300,000 크레딧부터.',
}

const plans = [
  {
    name: '무료 체험',
    badge: '가입 즉시',
    price: '0원',
    credits: '200,000 크레딧 무료 지급',
    color: 'from-green-500 to-emerald-500',
    features: [
      '온페이지 SEO 점검 1회 무료',
      '47개 항목 정밀 진단',
      '상세 PDF 보고서 제공',
      'AI 전문가 분석 의견',
    ],
    cta: '무료로 시작하기',
    href: '/lp/seo',
    highlight: false,
  },
  {
    name: 'PBN 백링크 50',
    badge: '인기',
    price: '300,000',
    credits: '크레딧',
    color: 'from-blue-500 to-cyan-500',
    features: [
      'PBN 백링크 50개 구축',
      '직접 운영 네트워크',
      '고품질 도메인 (DA 20+)',
      '10분 내 작업 시작',
      '상세 엑셀 리포트',
    ],
    cta: '상품 보기',
    href: '/products/category/pbn',
    highlight: true,
  },
  {
    name: '플랜 백링크 A',
    badge: '추천',
    price: '500,000',
    credits: '크레딧',
    color: 'from-purple-500 to-violet-500',
    features: [
      '다양한 백링크 유형 조합',
      'LSI/롱테일 키워드 자동 생성',
      '자연스러운 링크 프로필',
      '키워드 비율 설정 가능',
      'SEO 효율 극대화',
    ],
    cta: '상품 보기',
    href: '/products/category/plan',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">투명한 가격 정책</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          숨겨진 비용 없이, 크레딧으로 간편하게 이용하세요. 회원가입만 하면 20만 크레딧 무료 지급!
        </p>
      </header>

      {/* 가격 카드 */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.highlight
                  ? 'bg-white shadow-2xl border-2 border-blue-500 scale-105'
                  : 'bg-white shadow-lg border border-gray-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  가장 많이 선택
                </div>
              )}
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${plan.color} mb-4`}
              >
                {plan.badge}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 text-sm ml-1">{plan.credits}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg
                      className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 첫 충전 보너스 */}
      <section className="py-12 px-6 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">첫 충전 100% 보너스</h2>
          <p className="text-gray-600 mb-2">5만원 충전 시 10만 크레딧 지급 (1회 한정)</p>
          <p className="text-sm text-gray-500">
            가입 보너스 20만 + 충전 보너스 10만 = 30만 크레딧으로 PBN 백링크를 바로 시작하세요
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">지금 무료로 시작하세요</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ClientCTAButton variant="primary" size="lg" />
          <a
            href="https://t.me/goat82"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            1:1 전문가 상담
          </a>
        </div>
      </section>
    </main>
  )
}
