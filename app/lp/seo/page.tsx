// v2.0 - Google Ads 전용 LP (풍부한 콘텐츠 + 정책 친화적) (2026-04-07)
import type { Metadata } from 'next'
import { LPHeroForm } from './LPHeroForm'
import { LPHeroCopy } from './LPHeroCopy'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '무료 SEO 진단 | 백링크샵 - 구글 상위노출 전문',
  description:
    '구글 검색 순위가 낮은 진짜 이유, 10분 안에 무료로 확인하세요. 이메일만 입력하면 경쟁사 비교 분석까지 포함된 정밀 리포트를 보내드립니다.',
  robots: { index: false, follow: false },
}

export default function LPSeoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── SECTION 1: Hero ── */}
      <section className="relative overflow-hidden text-white">
        {/* 배경 그라데이션: 상단 따뜻한 오렌지 → 하단 진한 네이비 */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/80 via-slate-900 to-slate-950" />
        {/* 좌우 비대칭 빛 효과 */}
        <div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-orange-500 rounded-full filter blur-[120px] opacity-40"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-amber-600 rounded-full filter blur-[100px] opacity-30"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-red-900 rounded-full filter blur-[120px] opacity-35"
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          {/* 카피 (센터) */}
          <div className="text-center mb-12">
            <LPHeroCopy />
          </div>

          {/* 2컬럼: 폼(왼쪽) + 미리보기(오른쪽) */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* 왼쪽: 폼 */}
            <div id="hero-form" className="scroll-mt-8">
              <LPHeroForm />
            </div>

            {/* 오른쪽: 미리보기 + 차트 */}
            <div className="hidden lg:block space-y-5">
              {/* 리포트 미리보기 카드 */}
              <div className="bg-white rounded-2xl shadow-2xl p-5">
                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider text-center">
                  진단 보고서 미리보기
                </p>

                {/* 종합 점수 */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">종합 SEO 점수</span>
                  <span className="text-lg font-extrabold text-orange-500">72 / 100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-2.5 rounded-full"
                    style={{ width: '72%' }}
                  />
                </div>

                {/* 내 사이트 분석 항목 */}
                <div className="space-y-1.5 mb-4">
                  {[
                    { label: '도메인 권위도 (DA)', value: '28', status: 'bad' },
                    { label: '페이지 속도', value: '2.4초', status: 'warn' },
                    { label: '모바일 최적화', value: '양호', status: 'good' },
                    { label: '메타태그 설정', value: '미흡', status: 'bad' },
                    { label: '백링크 수', value: '12개', status: 'bad' },
                  ].map(item => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-gray-50"
                    >
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <span
                        className={`text-xs font-bold ${
                          item.status === 'bad'
                            ? 'text-red-500'
                            : item.status === 'warn'
                              ? 'text-orange-500'
                              : 'text-green-500'
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 경쟁사 비교 */}
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  경쟁사 TOP5 비교
                </p>
                <div className="overflow-hidden rounded-lg border border-gray-100 mb-3">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-1.5 px-2 text-left text-gray-500 font-semibold">항목</th>
                        <th className="py-1.5 px-2 text-right text-gray-500 font-semibold">
                          내 사이트
                        </th>
                        <th className="py-1.5 px-2 text-right text-gray-500 font-semibold">
                          경쟁사 평균
                        </th>
                        <th className="py-1.5 px-2 text-right text-gray-500 font-semibold">격차</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr>
                        <td className="py-1.5 px-2 text-gray-700">DA</td>
                        <td className="py-1.5 px-2 text-right text-gray-900 font-semibold">28</td>
                        <td className="py-1.5 px-2 text-right text-gray-900 font-semibold">52</td>
                        <td className="py-1.5 px-2 text-right text-red-500 font-bold">-24</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2 text-gray-700">백링크</td>
                        <td className="py-1.5 px-2 text-right text-gray-900 font-semibold">12</td>
                        <td className="py-1.5 px-2 text-right text-gray-900 font-semibold">340</td>
                        <td className="py-1.5 px-2 text-right text-red-500 font-bold">-328</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2 text-gray-700">트래픽</td>
                        <td className="py-1.5 px-2 text-right text-gray-900 font-semibold">450</td>
                        <td className="py-1.5 px-2 text-right text-gray-900 font-semibold">
                          8,200
                        </td>
                        <td className="py-1.5 px-2 text-right text-red-500 font-bold">-7,750</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-center text-red-500 font-semibold">
                  이 격차를 줄이는 방법, 리포트에서 확인하세요
                </p>
              </div>

              {/* 순위 변화 차트 카드 */}
              <div className="bg-white rounded-2xl shadow-2xl p-5">
                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider text-center">
                  SEO 최적화 후 예상 순위 변화
                </p>

                {/* 순위 라인 차트 (CSS only) */}
                <div className="relative h-40 mb-3">
                  {/* Y축 가이드 라인 */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    <div className="border-b border-dashed border-gray-100 flex items-center">
                      <span className="text-[10px] text-gray-400 w-10 text-right pr-2">1위</span>
                    </div>
                    <div className="border-b border-dashed border-gray-100 flex items-center">
                      <span className="text-[10px] text-gray-400 w-10 text-right pr-2">25위</span>
                    </div>
                    <div className="border-b border-dashed border-gray-100 flex items-center">
                      <span className="text-[10px] text-gray-400 w-10 text-right pr-2">50위</span>
                    </div>
                  </div>

                  {/* 차트 영역 */}
                  <svg
                    className="absolute left-10 top-0 right-0 bottom-0"
                    viewBox="0 0 300 140"
                    preserveAspectRatio="none"
                  >
                    {/* 상승 영역 (녹색 그라데이션) */}
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,120 C30,115 60,110 90,100 C120,90 140,85 170,60 C200,35 230,18 260,10 C275,7 290,5 300,4 L300,140 L0,140 Z"
                      fill="url(#areaGrad)"
                    />
                    {/* 라인 */}
                    <path
                      d="M0,120 C30,115 60,110 90,100 C120,90 140,85 170,60 C200,35 230,18 260,10 C275,7 290,5 300,4"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* 시작점 (Before) */}
                    <circle cx="0" cy="120" r="4" fill="#ef4444" />
                    {/* 끝점 (After) */}
                    <circle cx="300" cy="4" r="4" fill="#22c55e" />
                  </svg>
                </div>

                {/* Before / After 라벨 */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div>
                      <p className="text-[10px] text-gray-400">최적화 전</p>
                      <p className="text-sm font-bold text-red-500">42위</p>
                    </div>
                  </div>
                  <div className="flex-1 mx-4 flex items-center justify-center">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50">
                      <svg
                        className="w-3.5 h-3.5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      <span className="text-xs font-bold text-green-600">+39 순위 상승</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-[10px] text-gray-400">4주 후</p>
                      <p className="text-sm font-bold text-green-500">3위</p>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 text-center mt-3">
                  * 실제 결과는 키워드 경쟁도에 따라 달라질 수 있습니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: 핵심 성과 지표 ── */}
      <section className="py-4 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 text-center">
            {[
              { num: '50+', label: '진단 항목', sub: '정밀 분석' },
              { num: '10분', label: '분석 완료', sub: '이메일 발송' },
              { num: '0원', label: '완전 무료', sub: '카드 등록 불필요' },
              { num: '1만+', label: '경쟁사 데이터', sub: 'TOP5 비교 포함' },
            ].map(item => (
              <div key={item.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">{item.num}</p>
                <p className="text-sm text-gray-300 font-semibold mt-1">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: 문제 인식 (손실 회피) ── */}
      <section className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-600 font-semibold text-sm mb-2">왜 SEO 진단이 필요한가요?</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              검색 2페이지 이후 사이트는
              <br />
              <span className="text-red-500">사실상 존재하지 않습니다</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              구글 검색 사용자의 91.5%는 1페이지에서 클릭을 완료합니다. 당신의 사이트가 2페이지
              이하라면, 매일 잠재 고객을 경쟁사에게 빼앗기고 있습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 items-center">
            {/* 왼쪽: 시각적 비교 */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-900">1페이지 (1~10위)</span>
                  <span className="text-blue-600 font-bold text-lg">91.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 h-5 rounded-full flex items-center justify-end pr-3"
                    style={{ width: '91.5%' }}
                  >
                    <span className="text-xs text-white font-semibold">클릭의 대부분</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-900">2페이지 (11~20위)</span>
                  <span className="text-orange-500 font-bold text-lg">4.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                  <div className="bg-orange-400 h-5 rounded-full" style={{ width: '4.8%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-900">3페이지 이후</span>
                  <span className="text-red-500 font-bold text-lg">0.63%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                  <div className="bg-red-400 h-5 rounded-full" style={{ width: '2%' }} />
                </div>
              </div>
            </div>

            {/* 오른쪽: 임팩트 카드 */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">매출 기회 손실</p>
                    <p className="text-sm text-gray-500 mt-1">
                      2페이지 사이트는 1페이지 대비 클릭률이{' '}
                      <strong className="text-red-500">95% 낮습니다</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">시간이 지날수록 불리</p>
                    <p className="text-sm text-gray-500 mt-1">
                      경쟁사가 SEO를 강화할수록{' '}
                      <strong className="text-orange-500">격차는 매일 벌어집니다</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">해결의 첫 걸음</p>
                    <p className="text-sm text-gray-500 mt-1">
                      정확한 진단 없이는 어디를 고쳐야 하는지{' '}
                      <strong className="text-blue-500">알 수 없습니다</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: 진단 포함 항목 (가치 제시) ── */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-600 font-semibold text-sm mb-2">진단 항목</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              50개 이상 항목을 정밀 분석합니다
            </h2>
            <p className="text-gray-500">
              외부 SEO 에이전시에 의뢰하면 30~50만원 수준의 진단을,
              <br className="hidden sm:block" />
              지금 <strong className="text-gray-900">무료</strong>로 받아보세요.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              {
                icon: '🔍',
                title: '도메인 권위도 분석',
                desc: 'DA/DR 점수, 도메인 나이, 신뢰도를 종합 평가합니다',
              },
              {
                icon: '📊',
                title: '구글 인덱싱 현황',
                desc: '구글에 몇 페이지가 등록되어 있는지, 누락된 페이지가 있는지 확인합니다',
              },
              {
                icon: '🏷️',
                title: '메타태그 & 헤딩 검증',
                desc: 'Title, Description, H1~H6 구조가 SEO에 맞게 설정되었는지 점검합니다',
              },
              {
                icon: '⚡',
                title: '페이지 속도 측정',
                desc: 'Core Web Vitals (LCP, FID, CLS) 기준으로 로딩 성능을 측정합니다',
              },
              {
                icon: '📱',
                title: '모바일 최적화 확인',
                desc: '모바일 반응형, 터치 요소 간격, 뷰포트 설정을 검사합니다',
              },
              {
                icon: '🔗',
                title: '내부 링크 구조 분석',
                desc: '사이트 내부 링크가 효율적으로 연결되어 있는지 분석합니다',
              },
              {
                icon: '📝',
                title: '콘텐츠 품질 평가',
                desc: '키워드 밀도, 콘텐츠 길이, 가독성을 기준으로 평가합니다',
              },
              {
                icon: '🛡️',
                title: '기술적 SEO 이슈',
                desc: 'robots.txt, sitemap, canonical, SSL 등 기술적 요소를 전수 검사합니다',
              },
              {
                icon: '📈',
                title: '종합 점수 & 개선안',
                desc: '0~100점 종합 점수와 우선순위별 구체적 개선 방향을 제시합니다',
              },
            ].map(item => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors border border-gray-100"
              >
                <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 가격 비교 + CTA */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 sm:p-10 text-center text-white">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div>
                <p className="text-sm text-orange-200">일반 SEO 진단 비용</p>
                <p className="text-2xl font-bold line-through text-orange-200">30~50만원</p>
              </div>
              <div className="text-3xl">→</div>
              <div>
                <p className="text-sm text-orange-100">백링크샵</p>
                <p className="text-3xl font-extrabold">무료</p>
              </div>
            </div>
            <a
              href="#hero-form"
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-xl bg-white text-orange-600 hover:bg-gray-100 hover:scale-105 shadow-2xl transition-all"
            >
              무료 SEO 진단 받기
            </a>
            <p className="text-orange-200 text-sm mt-3">이메일만 입력하면 10분 안에 리포트 발송</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: 프로세스 (간단함 강조) ── */}
      <section className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-600 font-semibold text-sm mb-2">진행 과정</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">3단계면 충분합니다</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '정보 입력',
                desc: 'URL, 핵심 키워드 1개, 이메일 주소만 입력하세요. 회원가입이나 카드 등록은 필요 없습니다.',
                time: '30초',
              },
              {
                step: '02',
                title: 'AI 정밀 분석',
                desc: '50개 이상 항목을 AI가 자동으로 분석합니다. 경쟁사 TOP5 데이터까지 비교 분석됩니다.',
                time: '약 10분',
              },
              {
                step: '03',
                title: '이메일 리포트 수신',
                desc: '종합 점수, 문제점, 우선순위별 개선안이 담긴 상세 보고서가 이메일로 발송됩니다.',
                time: '자동 발송',
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <span className="text-2xl font-extrabold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{item.desc}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">
                  소요 시간: {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: 실제 리포트 미리보기 ── */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-600 font-semibold text-sm mb-2">리포트 미리보기</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              이런 리포트가 이메일로 도착합니다
            </h2>
            <p className="text-gray-500">30~50만원 수준의 SEO 진단 보고서를 무료로 받아보세요.</p>
          </div>

          {/* 이메일 리포트 목업 */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* 이메일 헤더 */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      온페이지 SEO 점검 결과가 준비되었습니다
                    </p>
                    <p className="text-xs text-gray-500">
                      백링크샵 &lt;report@backlinkshop.co.kr&gt;
                    </p>
                  </div>
                </div>
              </div>

              {/* 이메일 본문 */}
              <div className="px-6 py-6 space-y-6">
                {/* 종합 점수 */}
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    종합 SEO 점수
                  </p>
                  <p className="text-5xl font-extrabold text-orange-500">
                    72<span className="text-2xl text-gray-400">/100</span>
                  </p>
                  <div className="w-48 mx-auto mt-3 bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-2.5 rounded-full"
                      style={{ width: '72%' }}
                    />
                  </div>
                </div>

                {/* 주요 발견 사항 */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    주요 발견 사항
                  </p>
                  <div className="space-y-2">
                    {[
                      { ok: false, text: '메타 디스크립션이 설정되지 않았습니다' },
                      { ok: false, text: 'H1 태그가 2개 이상 사용되고 있습니다' },
                      { ok: true, text: 'SSL 인증서가 정상 적용되어 있습니다' },
                      { ok: false, text: '이미지 alt 태그 누락 12건' },
                      { ok: false, text: '페이지 로딩 속도 2.4초 (권장: 1.5초 이하)' },
                      { ok: true, text: '모바일 반응형 정상 작동' },
                    ].map(item => (
                      <div key={item.text} className="flex items-start gap-2 text-sm">
                        <span
                          className={`mt-0.5 flex-shrink-0 ${item.ok ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {item.ok ? '✓' : '✗'}
                        </span>
                        <span className={item.ok ? 'text-gray-500' : 'text-gray-700'}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 경쟁사 비교 */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    경쟁사 TOP5 비교 분석
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-400">내 DA</p>
                      <p className="text-lg font-bold text-red-500">28</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-400">경쟁사 평균</p>
                      <p className="text-lg font-bold text-gray-900">52</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-50">
                      <p className="text-xs text-gray-400">격차</p>
                      <p className="text-lg font-bold text-red-500">-24</p>
                    </div>
                  </div>
                </div>

                {/* 우선 개선 항목 */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    우선순위 개선 항목
                  </p>
                  <div className="space-y-2">
                    {[
                      { n: 1, title: '메타태그 최적화', impact: '높음' },
                      { n: 2, title: '페이지 속도 개선', impact: '높음' },
                      { n: 3, title: '백링크 확보 전략', impact: '중간' },
                    ].map(item => (
                      <div
                        key={item.n}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                            {item.n}
                          </span>
                          <span className="text-sm text-gray-700">{item.title}</span>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            item.impact === '높음'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-orange-50 text-orange-600'
                          }`}
                        >
                          영향도: {item.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 흐릿한 추가 영역 (더 많은 내용이 있다는 암시) */}
                <div className="relative">
                  <div className="space-y-2 opacity-30 blur-[1px]">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                </div>
              </div>
            </div>

            {/* 하단 CTA */}
            <div className="text-center mt-8">
              <a
                href="#hero-form"
                className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:shadow-orange-500/25 hover:scale-105 transition-all"
              >
                내 사이트 리포트 무료로 받기
              </a>
              <p className="text-gray-400 text-sm mt-3">이메일 입력 후 10분 안에 발송됩니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: 최종 CTA (FOMO + 즉시성) ── */}
      <section className="relative py-16 sm:py-24 px-4 overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600 rounded-full filter blur-[150px] opacity-20"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-red-400 font-semibold text-sm mb-3">
            매일 놓치고 있는 고객이 있습니다
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            경쟁사는 이미 SEO를 하고 있습니다.
            <br />
            당신은요?
          </h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">
            하루가 지날수록 경쟁사와의 격차는 벌어집니다.
            <br />
            30초면 내 사이트의 현재 상태를 무료로 확인할 수 있습니다.
          </p>

          <a
            href="#hero-form"
            className="inline-flex items-center justify-center px-12 py-6 text-xl font-bold rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-2xl hover:shadow-orange-500/25 hover:scale-105 transition-all mb-4"
          >
            무료 SEO 진단 시작하기
          </a>

          <p className="text-gray-400 text-sm mb-12">
            이메일 입력만으로 10분 안에 리포트 발송 · 회원가입 불필요
          </p>

          {/* FAQ */}
          <div className="text-left space-y-4 max-w-lg mx-auto">
            {[
              {
                q: '정말 무료인가요?',
                a: '네, 회원가입도 카드 등록도 필요 없습니다. 이메일 주소만 입력하면 무료로 진단 리포트를 받아보실 수 있습니다.',
              },
              {
                q: '결과는 어떻게 받나요?',
                a: '입력하신 이메일로 약 10분 내에 0~100점 종합 점수, 경쟁사 비교, 구체적 개선안이 담긴 리포트가 발송됩니다.',
              },
              {
                q: '진단 후 꼭 유료 서비스를 써야 하나요?',
                a: '전혀 아닙니다. 보고서에 포함된 개선안을 직접 적용하셔도 됩니다. 전문가 도움이 필요한 경우에만 1:1 상담을 이용하시면 됩니다.',
              },
              {
                q: '어떤 사이트든 진단 가능한가요?',
                a: '네, 워드프레스, 카페24, 쇼피파이 등 플랫폼에 관계없이 모든 웹사이트를 진단할 수 있습니다.',
              },
            ].map(item => (
              <div key={item.q} className="bg-white/5 backdrop-blur rounded-xl p-5">
                <p className="font-semibold text-white mb-2">Q. {item.q}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 하단 푸터 ── */}
      <footer className="py-8 px-4 bg-gray-900 text-center">
        <p className="text-gray-500 text-sm">
          &copy; 2024-{new Date().getFullYear()} 백링크샵. SEO 전문 컨설팅.
        </p>
      </footer>
    </main>
  )
}
