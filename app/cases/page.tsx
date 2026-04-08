/**
 * 성공사례 페이지 (사이트링크용)
 * Google Ads 사이트링크: "성공사례"
 */

import { ClientCTAButton } from '@/app/components/ClientCTAButton'

export const dynamic = 'force-static'

export const metadata = {
  title: '구글 상위노출 성공사례 | 백링크샵',
  description:
    '백링크샵 고객들의 실제 구글 상위노출 성공사례를 확인하세요. 평균 2~4주 내 순위 변화, 트래픽 327% 증가.',
}

const cases = [
  {
    industry: '의류 쇼핑몰',
    keyword: '여성 의류 쇼핑몰',
    before: '47위',
    after: '3위',
    period: '3주',
    service: 'PBN 백링크 50',
    quote: '경쟁이 치열한 키워드였는데 3주 만에 1페이지 진입했습니다. 매출이 2배 이상 늘었어요.',
    name: '김** 대표',
    metric: '매출 +210%',
  },
  {
    industry: '치과 클리닉',
    keyword: '강남 치과',
    before: '미검색',
    after: '7위',
    period: '5주',
    service: 'PBN 백링크 50 + 온페이지 SEO',
    quote: '지역 키워드로 상위에 노출되니 전화 문의가 눈에 띄게 늘었습니다.',
    name: '이** 원장',
    metric: '문의 +180%',
  },
  {
    industry: 'SaaS 스타트업',
    keyword: '프로젝트 관리 도구',
    before: '32위',
    after: '5위',
    period: '4주',
    service: '플랜 백링크 A',
    quote: 'LSI 키워드까지 자동으로 잡아주니 관련 검색어에서도 노출이 늘었어요.',
    name: '박** CTO',
    metric: '트래픽 +340%',
  },
  {
    industry: '법률사무소',
    keyword: '이혼 전문 변호사',
    before: '25위',
    after: '2위',
    period: '6주',
    service: 'PBN 백링크 100 + 콘텐츠 최적화',
    quote: '온페이지 점검에서 발견된 문제를 수정하고 백링크를 구축했더니 빠르게 올라갔습니다.',
    name: '최** 변호사',
    metric: '상담 +250%',
  },
  {
    industry: '인테리어 업체',
    keyword: '아파트 인테리어',
    before: '미검색',
    after: '4위',
    period: '4주',
    service: 'PBN 백링크 50',
    quote: '구글에서 아예 안 나오던 사이트가 한 달 만에 4위에 올라갔어요. 놀라운 결과입니다.',
    name: '정** 실장',
    metric: '견적 문의 +190%',
  },
]

export default function CasesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">구글 상위노출 성공사례</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          1,247개 프로젝트에서 검증된 실제 결과
        </p>
        {/* 핵심 지표 */}
        <div className="flex justify-center gap-8 mt-8">
          <div>
            <p className="text-3xl font-bold">327%</p>
            <p className="text-gray-400 text-sm">평균 트래픽 증가</p>
          </div>
          <div>
            <p className="text-3xl font-bold">2~4주</p>
            <p className="text-gray-400 text-sm">평균 순위 변화</p>
          </div>
          <div>
            <p className="text-3xl font-bold">98%</p>
            <p className="text-gray-400 text-sm">고객 만족도</p>
          </div>
        </div>
      </header>

      {/* 사례 카드 */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {cases.map(c => (
            <div
              key={c.keyword}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* 순위 변화 */}
                <div className="flex-shrink-0 flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Before</p>
                    <p className="text-2xl font-bold text-red-500">{c.before}</p>
                  </div>
                  <div className="text-2xl text-gray-300">&rarr;</div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">After</p>
                    <p className="text-2xl font-bold text-green-500">{c.after}</p>
                  </div>
                </div>

                {/* 내용 */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      {c.industry}
                    </span>
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      &ldquo;{c.keyword}&rdquo;
                    </span>
                    <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                      {c.period} 만에 달성
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2 italic">&ldquo;{c.quote}&rdquo;</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{c.name}</span>
                    <span>이용 서비스: {c.service}</span>
                    <span className="font-bold text-blue-600">{c.metric}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">다음 성공사례의 주인공이 되세요</h2>
        <p className="text-white/80 mb-6">
          회원가입만 하면 20만 크레딧 무료 지급, 온페이지 SEO 점검 무료
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ClientCTAButton variant="white" size="lg" />
          <a
            href="https://t.me/goat82"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
          >
            1:1 전문가 상담
          </a>
        </div>
      </section>
    </main>
  )
}
