/**
 * 서비스 소개 페이지 (사이트링크용)
 * Google Ads 사이트링크: "서비스 소개"
 */

import Link from 'next/link'
import { ClientCTAButton } from '@/app/components/ClientCTAButton'

export const dynamic = 'force-static'

export const metadata = {
  title: 'SEO 서비스 소개 | 백링크샵',
  description:
    '백링크샵이 제공하는 SEO 서비스를 소개합니다. PBN 백링크, 플랜 백링크, 온페이지 SEO 점검, 무료 도메인 분석.',
}

const services = [
  {
    icon: '🧭',
    title: '온페이지 SEO 점검',
    description: '47개 항목을 정밀 진단하여 사이트 내부 최적화 상태를 점검합니다.',
    details: [
      '메타태그, 헤딩 구조, 스키마 검증',
      'Core Web Vitals 및 페이지 속도 측정',
      '모바일 최적화 상태 확인',
      '콘텐츠 품질 및 키워드 정합성 평가',
      '0~100점 종합 진단 + AI 분석 보고서',
    ],
    badge: '무료 (20만 크레딧)',
    href: '/products/category/seo',
  },
  {
    icon: '🏆',
    title: 'PBN 백링크',
    description: '직접 구축한 PBN 네트워크에서 강력한 백링크를 제공합니다.',
    details: [
      '100% 자체 운영 PBN (DA 20+)',
      '분산 호스팅, 고유 IP, 고유 콘텐츠',
      '10분 내 자동 작업 시작',
      '상세 엑셀 리포트 제공',
      '3년간 구글 패널티 0건',
    ],
    badge: '300,000 크레딧~',
    href: '/products/category/pbn',
  },
  {
    icon: '📦',
    title: '플랜 백링크',
    description: '다양한 유형의 백링크를 조합하여 자연스러운 링크 프로필을 구축합니다.',
    details: [
      'WEB2.0, EDU, GOV, Wiki 등 10+ 유형',
      'LSI/롱테일 키워드 자동 생성',
      '메인/서브 키워드 비율 설정',
      '자연스러운 백링크 프로필 구축',
      '초기 SEO 성장에 최적',
    ],
    badge: '500,000 크레딧~',
    href: '/products/category/plan',
  },
  {
    icon: '🌐',
    title: '무료 도메인 분석',
    description: '경쟁사 대비 내 도메인의 SEO 상태를 무료로 분석합니다.',
    details: [
      'DA/PA 점수 확인',
      '백링크 현황 분석',
      '경쟁사 비교 분석',
      '경매/만료/프리미엄 도메인 검색',
      '100% 무료 이용',
    ],
    badge: '무료',
    href: 'https://domainchecker.co.kr',
    external: true,
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">SEO 전문 서비스</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          3년간 1,247개 프로젝트를 성공시킨 검증된 SEO 솔루션
        </p>
      </header>

      {/* 서비스 목록 */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {services.map(service => (
            <div
              key={service.title}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="text-5xl">{service.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      {service.badge}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="grid sm:grid-cols-2 gap-2 mb-6">
                    {service.details.map(d => (
                      <li key={d} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-0.5">&#10003;</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                  {service.external ? (
                    <a
                      href={service.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      무료로 이용하기 &rarr;
                    </a>
                  ) : (
                    <Link
                      href={service.href}
                      className="inline-block px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      자세히 보기 &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 차별점 */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">백링크샵이 다른 이유</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-3xl font-bold text-blue-600 mb-2">100%</p>
              <p className="text-sm font-semibold text-gray-900">자체 인프라 운영</p>
              <p className="text-xs text-gray-500 mt-1">KWORK/FIVERR 재판매 아님</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-3xl font-bold text-blue-600 mb-2">0건</p>
              <p className="text-sm font-semibold text-gray-900">구글 패널티</p>
              <p className="text-xs text-gray-500 mt-1">3년간 무사고 기록</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-3xl font-bold text-blue-600 mb-2">98%</p>
              <p className="text-sm font-semibold text-gray-900">재구매율</p>
              <p className="text-xs text-gray-500 mt-1">100명 중 98명</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">무료 SEO 진단부터 시작하세요</h2>
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
