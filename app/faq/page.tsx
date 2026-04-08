/**
 * FAQ 전용 페이지 (사이트링크용)
 * Google Ads 사이트링크: "자주 묻는 질문"
 */

import { FAQList } from '@/app/components/FAQList'
import { FAQStructuredData } from '@/app/components/StructuredData'
import { ClientCTAButton } from '@/app/components/ClientCTAButton'

export const dynamic = 'force-static'

export const metadata = {
  title: '자주 묻는 질문 (FAQ) | 백링크샵',
  description:
    '백링크샵 서비스에 대한 자주 묻는 질문과 답변. PBN 백링크 안전성, 효과, 가격, 환불 정책까지.',
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <FAQStructuredData />

      {/* 헤더 */}
      <header className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">자주 묻는 질문</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          백링크샵 서비스에 대해 궁금한 점을 확인하세요
        </p>
      </header>

      {/* FAQ 목록 */}
      <section className="py-16 px-6">
        <FAQList />
      </section>

      {/* 추가 문의 */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">더 궁금한 점이 있으신가요?</h2>
          <p className="text-gray-600 mb-6">전문가가 1:1로 친절하게 답변해드립니다</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/goat82"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
              텔레그램으로 문의하기
            </a>
            <ClientCTAButton variant="primary" size="lg" />
          </div>
        </div>
      </section>
    </main>
  )
}
