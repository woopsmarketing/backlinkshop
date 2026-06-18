// 공용 LP 엔진: variant(키워드 카피) + theme(light/dark)만 다르게 주면 재사용된다.
// Hero·성과지표·최종CTA·푸터는 양쪽 테마 공통(이미 다크). 라이트/다크가 갈리는 건 본문 4개 섹션뿐.
import { LPHeroForm } from './LPHeroForm'
import { LPHeroCopy } from './LPHeroCopy'
import { LPFloatingCTA } from './LPFloatingCTA'
import { LPActivityToast } from './LPActivityToast'
import { AiChatWidget } from '@/app/components/AiChatWidget'

export type LPTheme = 'light' | 'dark'

export function LandingBody({
  variantKey,
  theme = 'light',
}: {
  variantKey?: string
  theme?: LPTheme
}) {
  const dark = theme === 'dark'
  // 본문 섹션 공용 토큰 (라이트 분기는 기존 디자인 그대로)
  const tHeading = dark ? 'text-white' : 'text-gray-900'
  const tSub = dark ? 'text-gray-400' : 'text-gray-500'
  const tBody = dark ? 'text-gray-300' : 'text-gray-600'
  const tCard = dark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-gray-100'
  const tItemCard = dark
    ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
    : 'bg-gray-50 border-gray-100 hover:bg-orange-50'

  return (
    <main className={`min-h-screen ${dark ? 'bg-slate-950' : 'bg-white'}`}>
      {/* ── SECTION 1: Hero (테마 공통, 항상 다크 그라데이션) ── */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/80 via-slate-900 to-slate-950" />
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
          <div className="text-center mb-6">
            <LPHeroCopy variantKey={variantKey} />
          </div>

          {/* 신뢰 스트립 (모바일 포함 above-fold 노출) */}
          <ul className="mb-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-300">
            {[
              '50개 항목 정밀 진단',
              '경쟁사 TOP5 비교 포함',
              '회원가입·카드 등록 없음',
              '평균 10분 내 리포트 발송',
            ].map(t => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {t}
              </li>
            ))}
          </ul>

          {/* 2컬럼: 폼(왼쪽) + 미리보기(오른쪽) */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div id="hero-form" className="scroll-mt-8">
              <LPHeroForm />
            </div>

            <div className="hidden lg:block space-y-5">
              <div className="bg-white rounded-2xl shadow-2xl p-5">
                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider text-center">
                  진단 보고서 미리보기
                </p>
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

              <div className="bg-white rounded-2xl shadow-2xl p-5">
                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider text-center">
                  SEO 최적화 후 예상 순위 변화
                </p>
                <div className="relative h-40 mb-3">
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
                  <svg
                    className="absolute left-10 top-0 right-0 bottom-0"
                    viewBox="0 0 300 140"
                    preserveAspectRatio="none"
                  >
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
                    <path
                      d="M0,120 C30,115 60,110 90,100 C120,90 140,85 170,60 C200,35 230,18 260,10 C275,7 290,5 300,4"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="0" cy="120" r="4" fill="#ef4444" />
                    <circle cx="300" cy="4" r="4" fill="#22c55e" />
                  </svg>
                </div>
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

      {/* ── SECTION 2: 핵심 성과 지표 (테마 공통, 이미 다크) ── */}
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

      {/* ── SECTION 2.5: "왜 무료냐" 안심 박스 ── */}
      <section className={`py-12 sm:py-16 px-4 ${dark ? 'bg-slate-900' : 'bg-orange-50/50'}`}>
        <div className="max-w-3xl mx-auto">
          <div
            className={`rounded-2xl border shadow-sm p-6 sm:p-10 ${dark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-orange-100'}`}
          >
            <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider mb-2">
              자주 받는 질문
            </p>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${tHeading}`}>
              왜 무료로 제공하나요?
            </h2>
            <div className={`space-y-4 leading-relaxed text-[15px] sm:text-base ${tBody}`}>
              <p>
                진단은 어디가 막혔는지를 짚는 작업입니다. 결과를 보면 두 가지로 나뉩니다. 직접
                적용해서 해결되는 경우와, 구조적으로 도움이 필요한 경우.
              </p>
              <p>
                저희는 후자에 해당하는 분들과만 따로 일합니다. 그래서 진단 자체는 비용을 받지
                않습니다.
              </p>
              <p>
                회원가입·카드 등록·자동 결제는 없습니다. 원치 않으시면 보고서만 받고 끝내셔도
                됩니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-7">
              {['회원가입 없음', '카드 등록 없음', '자동 결제 없음', '원치 않으면 연락 없음'].map(
                label => (
                  <span
                    key={label}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      dark
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5"
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
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: 3가지 막힘 ── */}
      <section className={`py-16 sm:py-24 px-4 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-600 font-semibold text-sm mb-2">왜 매출이 안 나는가</p>
            <h2 className={`text-2xl sm:text-4xl font-bold mb-4 ${tHeading}`}>
              매출이 안 나는 사이트는
              <br />
              <span className="text-orange-600">보통 3가지 중 하나입니다</span>
            </h2>
            <p className={`max-w-2xl mx-auto ${tSub}`}>
              추측해서 백링크부터 사거나 광고비를 늘리면, 돈은 쓰고 결과는 안 나옵니다. 어디가
              막혔는지부터 짚는 게 먼저입니다.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-4">
              {[
                {
                  num: '1',
                  title: '검색에 안 잡힘',
                  sub: '인덱싱·기술 SEO 문제',
                  symptom: '구글에 사이트 이름을 쳐도 안 나옴, 페이지가 색인되지 않음',
                  fix: '기술 SEO 점검부터',
                  accent: 'orange',
                },
                {
                  num: '2',
                  title: '검색에 잡히는데 클릭이 안 됨',
                  sub: '메타·제목 문제',
                  symptom: '노출은 되는데 클릭률(CTR) 1% 미만',
                  fix: '메타태그·제목 구조 재설계',
                  accent: 'amber',
                },
                {
                  num: '3',
                  title: '클릭은 되는데 문의로 안 이어짐',
                  sub: '콘텐츠·신뢰 문제',
                  symptom: '방문자는 있는데 문의·구매 전환이 거의 없음',
                  fix: '콘텐츠 신뢰 구조 개선',
                  accent: 'blue',
                },
              ].map(item => (
                <div key={item.num} className={`rounded-xl p-5 sm:p-6 shadow-sm border ${tCard}`}>
                  <div className="flex items-start gap-4">
                    <span
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-extrabold text-lg ${
                        item.accent === 'orange'
                          ? 'bg-orange-50 text-orange-600'
                          : item.accent === 'amber'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {item.num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-base sm:text-lg leading-tight ${tHeading}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 font-semibold uppercase tracking-wider">
                        {item.sub}
                      </p>
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 font-semibold flex-shrink-0 w-12">
                            증상
                          </span>
                          <span className={dark ? 'text-gray-300' : 'text-gray-700'}>
                            {item.symptom}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 font-semibold flex-shrink-0 w-12">
                            해결
                          </span>
                          <span className={`font-semibold ${tHeading}`}>{item.fix}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 space-y-4">
              {[
                {
                  bg: 'bg-orange-50',
                  color: 'text-orange-500',
                  d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
                  title: '어디가 막혔는지 모르면 광고비만 쌓입니다',
                  desc: '원인 없이 비용을 늘리는 건 가장 비싼 길입니다.',
                },
                {
                  bg: 'bg-amber-50',
                  color: 'text-amber-600',
                  d: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
                  title: '원인을 찾으면 우선순위가 보입니다',
                  desc: '막힌 지점을 알면, 어디부터 손볼지가 명확해집니다.',
                },
                {
                  bg: 'bg-blue-50',
                  color: 'text-blue-500',
                  d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                  title: '정확한 진단이 가장 빠른 길입니다',
                  desc: '추측이 아니라 데이터로 짚으면 시행착오가 줄어듭니다.',
                },
              ].map(c => (
                <div key={c.title} className={`rounded-xl p-5 shadow-sm border ${tCard}`}>
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <svg
                        className={`w-5 h-5 ${c.color}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={c.d}
                        />
                      </svg>
                    </div>
                    <div>
                      <p className={`font-semibold ${tHeading}`}>{c.title}</p>
                      <p className={`text-sm mt-1 ${tSub}`}>{c.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: 진단 포함 항목 ── */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-600 font-semibold text-sm mb-2">진단 항목</p>
            <h2 className={`text-2xl sm:text-4xl font-bold mb-4 ${tHeading}`}>
              50개 이상 항목을 정밀 분석합니다
            </h2>
            <p className={tSub}>
              외부 SEO 에이전시에 의뢰하면 30~50만원 수준의 진단을,
              <br className="hidden sm:block" />
              지금 <strong className={tHeading}>무료</strong>로 받아보세요.
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
                className={`flex items-start gap-3 p-4 rounded-xl transition-colors border ${tItemCard}`}
              >
                <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <p className={`font-semibold text-sm ${tHeading}`}>{item.title}</p>
                  <p className={`text-xs mt-1 leading-relaxed ${tSub}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 sm:p-10 text-white">
            <div className="max-w-3xl mx-auto text-center sm:text-left sm:grid sm:grid-cols-5 sm:gap-8 sm:items-center">
              <div className="sm:col-span-2 mb-5 sm:mb-0">
                <p className="text-2xl sm:text-3xl font-extrabold leading-snug">
                  진단은 어디가
                  <br className="hidden sm:block" /> 막혔는지 짚는 일입니다
                </p>
              </div>
              <div className="sm:col-span-3 text-orange-50 text-[15px] leading-relaxed">
                이 단계에서 비용을 받지 않는 이유는, 진단 결과를 보고 직접 해결하실 분과 도움이
                필요하신 분이 나뉘기 때문입니다. 어느 쪽인지부터 같이 확인해보세요.
              </div>
            </div>
            <div className="text-center mt-8">
              <a
                href="#hero-form"
                className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-xl bg-white text-orange-600 hover:bg-gray-100 hover:scale-105 shadow-2xl transition-all"
              >
                무료 진단부터 시작하기
              </a>
              <p className="text-orange-100 text-sm mt-3">
                이메일만 입력하면 10분 안에 리포트 발송
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: 프로세스 ── */}
      <section className={`py-16 sm:py-24 px-4 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-600 font-semibold text-sm mb-2">진행 과정</p>
            <h2 className={`text-2xl sm:text-4xl font-bold ${tHeading}`}>3단계면 충분합니다</h2>
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
                <h3 className={`text-lg font-bold mb-2 ${tHeading}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed mb-3 ${tSub}`}>{item.desc}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">
                  소요 시간: {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: 실제 리포트 미리보기 (이메일 목업은 양쪽 테마 모두 흰색 유지) ── */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-600 font-semibold text-sm mb-2">리포트 미리보기</p>
            <h2 className={`text-2xl sm:text-4xl font-bold mb-4 ${tHeading}`}>
              이런 리포트가 이메일로 도착합니다
            </h2>
            <p className={tSub}>30~50만원 수준의 SEO 진단 보고서를 무료로 받아보세요.</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
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

              <div className="px-6 py-6 space-y-6">
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

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />이 3가지를 먼저
                    고치면 예상되는 변화
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { fix: '메타태그 최적화', result: '검색 결과 클릭률 약 1.5~2배' },
                      { fix: '페이지 속도 개선', result: '이탈률 20~30% 감소' },
                      {
                        fix: '우선순위 백링크 구축',
                        result: '3개월 내 1페이지 진입 가능 키워드 3~5개',
                      },
                    ].map(item => (
                      <div
                        key={item.fix}
                        className="flex items-start gap-3 py-2 px-3 rounded-lg bg-orange-50/60 border border-orange-100"
                      >
                        <svg
                          className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        <div className="text-sm">
                          <span className="text-gray-700">{item.fix}</span>
                          <span className="text-gray-400 mx-1.5">→</span>
                          <span className="text-gray-900 font-semibold">{item.result}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      동일 업종 컨설팅 사례에서{' '}
                      <strong className="text-orange-600">
                        3~6개월 내 월 문의 수가 1.5~3배 사이로 증가
                      </strong>
                      한 케이스가 다수입니다. 보고서에는 키워드별 구체적 예상치가 함께 포함됩니다.
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-3 text-center">
                    * 실제 결과는 업종·키워드 경쟁도에 따라 달라질 수 있습니다
                  </p>
                </div>

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

            <div className="text-center mt-8">
              <a
                href="#hero-form"
                className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:shadow-orange-500/25 hover:scale-105 transition-all"
              >
                내 사이트 리포트 무료로 받기
              </a>
              <p className={`text-sm mt-3 ${tSub}`}>이메일 입력 후 10분 안에 발송됩니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: 최종 CTA (테마 공통, 이미 다크) ── */}
      <section className="relative py-16 sm:py-24 px-4 overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600 rounded-full filter blur-[150px] opacity-20"
          aria-hidden="true"
        />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-orange-400 font-semibold text-sm mb-3">다음 단계</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">두 가지 길이 있습니다</h2>
            <p className="text-gray-300 mb-10 max-w-xl mx-auto">
              어느 쪽이 맞을지는, 진단 결과를 보고 결정하셔도 늦지 않습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <div className="w-11 h-11 rounded-xl bg-gray-700/60 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
              <p className="text-lg font-bold text-white mb-3">직접 해결하기</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">·</span>
                  <span>보고서를 받고 개선 항목을 직접 적용</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">·</span>
                  <span>시간은 들지만 비용은 0원</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">·</span>
                  <span>보고서만 받고 끝내셔도 됩니다</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-orange-400/20">
              <div className="w-11 h-11 rounded-xl bg-orange-500/15 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-orange-300/90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-lg font-bold text-white mb-3">함께 진행하기</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">·</span>
                  <span>매출 직결 항목 3개를 1~3개월 내 같이 처리</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">·</span>
                  <span>진단 결과 보고 필요할 때만 결정</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">·</span>
                  <span>부담 없이 상담부터 가능합니다</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-200 mb-4 text-base sm:text-lg">
              어느 쪽이든, 먼저 진단부터 받아보세요
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
          </div>

          <div className="text-left space-y-4 max-w-lg mx-auto">
            {[
              {
                q: '정말 무료인가요?',
                a: '네, 회원가입·카드 등록·자동 결제 모두 없습니다. 이메일 주소만 입력하면 됩니다. 진단 결과를 보고 도움이 필요하다고 명시하신 분에게만 추가 안내를 드립니다.',
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

      {/* ── 행동 유도 장치 ── */}
      <LPActivityToast />

      {/* ── 하단 푸터 (테마 공통) ── */}
      <footer className="py-8 px-4 bg-gray-900 text-center">
        <p className="text-gray-500 text-sm">
          &copy; 2024-{new Date().getFullYear()} 백링크샵. SEO 전문 컨설팅.
        </p>
      </footer>

      {/* 중앙 하단 텔레그램 맞춤가이드 + 우측 하단 AI 위젯 */}
      <LPFloatingCTA />
      <AiChatWidget />
    </main>
  )
}
