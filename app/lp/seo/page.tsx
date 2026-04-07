// v1.0 - Google Ads 전용 랜딩페이지 (정책 친화적, 전환 최적화) (2026-04-07)
import type { Metadata } from 'next'
import { LPHeroForm } from './LPHeroForm'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '무료 SEO 진단 | 내 사이트 검색 순위 확인',
  description:
    '구글 검색 순위가 낮은 이유, 10분 안에 무료로 진단해드립니다. 1,247개 기업이 선택한 SEO 전문가의 정밀 분석 보고서를 받아보세요.',
  robots: { index: false, follow: false },
}

export default function LPSeoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── SECTION 1: Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        {/* 배경 블롭 */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          <p className="text-cyan-400 font-semibold text-sm sm:text-base mb-4">
            1,247개 기업이 선택한 SEO 전문가
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6">
            지금 당신의 웹사이트,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              구글에서 몇 페이지인가요?
            </span>
          </h1>

          <p className="text-gray-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            무료 SEO 진단으로 현재 문제점을
            <br className="sm:hidden" /> 10분 안에 확인하세요
          </p>

          {/* URL 입력 폼 */}
          <LPHeroForm />

          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              10초 가입
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              카드 없음
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              즉시 결과
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: 문제 인식 (손실 회피) ── */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            검색 2페이지 이후 사이트는
            <br />
            <span className="text-red-500">클릭률이 0.63%</span>에 불과합니다
          </h2>

          {/* 시각적 비교 바 */}
          <div className="max-w-md mx-auto space-y-4 mb-10 text-left">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-900">1페이지</span>
                <span className="text-blue-600 font-bold">91.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 h-4 rounded-full"
                  style={{ width: '91.5%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-900">2페이지</span>
                <span className="text-orange-500 font-bold">4.8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-orange-400 h-4 rounded-full" style={{ width: '4.8%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-900">3페이지 이후</span>
                <span className="text-red-500 font-bold">0.63%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-red-400 h-4 rounded-full" style={{ width: '2%' }} />
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed">
            당신의 경쟁사는 이미 1페이지에 있습니다.
            <br />
            <strong className="text-gray-900">
              지금 확인하지 않으면, 그 격차는 매일 벌어집니다.
            </strong>
          </p>
        </div>
      </section>

      {/* ── SECTION 3: 진단 포함 항목 (가치 제시) ── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            무료 SEO 진단에 포함된 항목
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              '도메인 상태 및 권위도 분석',
              '구글 인덱싱 현황 점검',
              'HTML 구조 검증 (메타태그, 헤딩, 스키마)',
              '페이지 속도 및 Core Web Vitals',
              '모바일 최적화 상태 확인',
              '내부 링크 구조 분석',
              '콘텐츠 품질 및 키워드 평가',
              '기술적 SEO 이슈 전수 조사 (0~100점)',
              '상세 개선 보고서 이메일 발송',
            ].map(item => (
              <div key={item} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-500 mb-6">
              이 진단을 외부에 의뢰하면{' '}
              <span className="line-through text-gray-400">30~50만원</span>입니다.
              <br />
              <strong className="text-gray-900">지금 무료로 받아보세요.</strong>
            </p>

            <a
              href="/login?from=lp"
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-xl hover:scale-105 transition-all"
            >
              무료 SEO 진단 받기
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: 사회적 증거 ── */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {/* 핵심 수치 */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { num: '3년', label: '운영 기간' },
              { num: '1,247', label: '완료 프로젝트' },
              { num: '98%', label: '고객 재구매율' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">{item.num}</p>
                <p className="text-sm text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* 사례 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <p className="text-sm text-blue-600 font-semibold mb-2">실제 고객 사례</p>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              쇼핑몰 A사: 월 방문자 340명에서 4,200명으로
            </h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Before</p>
                <p className="text-2xl font-bold text-gray-400">340</p>
                <p className="text-xs text-gray-400">월 방문자</p>
              </div>
              <div className="text-3xl text-gray-300">→</div>
              <div className="text-center">
                <p className="text-sm text-gray-500">After (4주)</p>
                <p className="text-2xl font-bold text-blue-600">4,200</p>
                <p className="text-xs text-gray-400">월 방문자</p>
              </div>
              <div className="ml-auto px-4 py-2 bg-green-50 rounded-full">
                <p className="text-green-600 font-bold text-lg">+1,135%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: 최종 CTA (FOMO + 즉시성) ── */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-cyan-400 font-semibold text-sm mb-2">이번 달 무료 진단</p>
          <p className="text-4xl sm:text-5xl font-extrabold mb-6">
            잔여 <span className="text-cyan-400">19</span>석
          </p>

          <a
            href="/login?from=lp"
            className="inline-flex items-center justify-center px-12 py-6 text-xl font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:shadow-2xl hover:scale-105 transition-all mb-4"
          >
            무료 SEO 진단 시작하기
          </a>

          <p className="text-gray-400 text-sm mb-12">가입 후 10초면 진단이 시작됩니다</p>

          {/* 간결한 FAQ */}
          <div className="text-left space-y-4 max-w-lg mx-auto">
            <div className="bg-white/5 backdrop-blur rounded-xl p-5">
              <p className="font-semibold text-white mb-2">Q. 정말 무료인가요?</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                네, 가입 시 20만 크레딧이 지급되며 SEO 진단은 이 크레딧으로 무료 이용 가능합니다.
                카드 등록도 필요 없습니다.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-5">
              <p className="font-semibold text-white mb-2">Q. 결과는 어떻게 받나요?</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                가입하신 이메일로 10~20분 내에 0~100점 종합 점수와 함께 상세 개선 보고서가
                발송됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 하단 간결 푸터 ── */}
      <footer className="py-8 px-4 bg-gray-900 text-center">
        <p className="text-gray-500 text-sm">
          &copy; 2024-{new Date().getFullYear()} 백링크샵. SEO 전문 컨설팅.
        </p>
      </footer>
    </main>
  )
}
