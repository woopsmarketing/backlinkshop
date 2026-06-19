// 공용 LP 엔진: variant(키워드 카피) + theme(light/dark)만 다르게 주면 재사용된다.
// hero는 키워드별 레지스트리(heroes/)에서 결정. 성과지표·최종CTA·푸터는 양쪽 테마 공통(이미 다크).
// 라이트/다크가 갈리는 건 본문 섹션. theme은 키워드에서 자동 결정, themeOverride로 테스트 가능.
import Link from 'next/link'
import { LPFloatingCTA } from './LPFloatingCTA'
import { LPActivityToast } from './LPActivityToast'
import { AiChatWidget } from '@/app/components/AiChatWidget'
import { resolveHero } from './heroes'

export type LPTheme = 'light' | 'dark'

export function LandingBody({
  variantKey,
  themeOverride,
}: {
  variantKey?: string
  themeOverride?: LPTheme
}) {
  const heroConfig = resolveHero(variantKey)
  const Hero = heroConfig.Hero
  const theme = themeOverride ?? heroConfig.theme
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
      {/* ── SECTION 1: Hero (키워드별 레지스트리에서 결정, 테마 반응형) ── */}
      <Hero variantKey={variantKey} theme={theme} />

      {/* ── SECTION 2: 핵심 성과 지표 (테마 공통, 이미 다크) ── */}
      <section className="py-4 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 text-center">
            {[
              { num: '50+', label: '진단 항목', sub: '정밀 분석' },
              { num: '1분', label: '분석 완료', sub: '즉시 보고' },
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

      {/* ── SECTION 2.7: 생성형 AI 노출(GEO) 교차 안내 — 왜무료 위 (AI 페이지엔 숨김) ── */}
      {variantKey !== 'ai' && (
        <section
          className={`py-16 sm:py-24 px-4 ${dark ? 'bg-slate-950' : 'bg-gradient-to-b from-violet-50/70 to-white'}`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 text-violet-500 text-xs font-bold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                NEW · 생성형 AI 노출 (GEO)
              </span>
              <h2 className={`text-2xl sm:text-4xl font-bold mb-3 ${tHeading}`}>
                고객은 이제 구글이 아니라
                <br />
                <span className="text-violet-500">AI에게 추천을 묻습니다</span>
              </h2>
              <p className={`max-w-2xl mx-auto ${tSub}`}>
                ChatGPT·제미나이·퍼플렉시티가 추천하는 브랜드가 매출을 가져갑니다. 내 브랜드는 지금
                AI 답변에 어떻게 노출되고 있을까요?
              </p>
            </div>

            {/* 개념 카드 3 */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: '💬',
                  bg: 'bg-violet-100 text-violet-600',
                  title: '고객은 AI에게 추천받습니다',
                  desc: "구매 전 'OO 잘하는 곳 추천해줘'를 AI에게 묻는 사람이 빠르게 늘고 있습니다.",
                },
                {
                  icon: '⚠️',
                  bg: 'bg-red-100 text-red-500',
                  title: 'AI에 없으면 추천도 없습니다',
                  desc: '내 브랜드가 AI가 신뢰하는 출처에 없으면, AI 답변엔 경쟁사만 등장합니다.',
                },
                {
                  icon: '🚀',
                  bg: 'bg-indigo-100 text-indigo-600',
                  title: '지금이 선점 타이밍',
                  desc: '아직 대부분이 GEO를 모릅니다. 먼저 최적화한 브랜드가 AI 답변을 선점합니다.',
                },
              ].map(c => (
                <div
                  key={c.title}
                  className={`rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                    dark
                      ? 'bg-slate-800/60 border-slate-700 hover:border-violet-500/40'
                      : 'bg-white border-violet-100 hover:border-violet-300'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${c.bg}`}
                  >
                    {c.icon}
                  </div>
                  <p className={`font-bold text-lg mb-2 ${tHeading}`}>{c.title}</p>
                  <p className={`text-sm leading-relaxed ${tSub}`}>{c.desc}</p>
                </div>
              ))}
            </div>

            {/* 노출 현황 미니 패널 + CTA */}
            <div
              className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 ${
                dark
                  ? 'bg-violet-950/40 border-violet-500/30'
                  : 'bg-white border-violet-100 shadow-sm'
              }`}
            >
              <div
                className="absolute -top-16 -right-16 w-64 h-64 bg-violet-500 rounded-full filter blur-[100px] opacity-20"
                aria-hidden="true"
              />
              <div className="relative grid lg:grid-cols-2 gap-6 items-center">
                <div>
                  <p className={`font-bold text-lg mb-3 ${tHeading}`}>
                    지금 AI는 경쟁사를 추천하고 있습니다
                  </p>
                  <div className="space-y-2">
                    {['ChatGPT', '제미나이', '퍼플렉시티'].map(p => (
                      <div
                        key={p}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                          dark ? 'bg-slate-800/70' : 'bg-violet-50/70'
                        }`}
                      >
                        <span className={`font-medium ${tBody}`}>{p}</span>
                        <span className="flex items-center gap-4 text-xs font-semibold">
                          <span className="text-red-500">내 브랜드 ✕</span>
                          <span className="text-green-500">경쟁사 ✓</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <p className={`text-sm mb-4 ${tSub}`}>
                    내 브랜드가 AI 답변에 어떻게 노출되는지, 경쟁사와 비교해 지금 무료로 확인하세요.
                  </p>
                  <Link
                    href="/lp/ai"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-violet-500/25 hover:scale-[1.02] transition-all"
                  >
                    내 브랜드 AI 노출 무료 진단
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 2.5: "왜 무료냐" 안심 (카드형) ── */}
      <section className={`py-16 sm:py-20 px-4 ${dark ? 'bg-slate-900' : 'bg-orange-50/50'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-orange-600 font-semibold text-sm mb-2">자주 받는 질문</p>
            <h2 className={`text-2xl sm:text-4xl font-bold ${tHeading}`}>왜 무료로 제공하나요?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              {
                step: '01',
                icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
                title: "진단은 '어디가 막혔나'를 짚는 일",
                desc: '결과를 보면 직접 적용해 해결되는 경우와, 구조적으로 도움이 필요한 경우로 나뉩니다.',
              },
              {
                step: '02',
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
                title: '저희는 후자와만 함께합니다',
                desc: '그래서 진단 자체는 비용을 받지 않습니다. 결과만 받아 직접 적용하셔도 됩니다.',
              },
              {
                step: '03',
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                title: '부담 장치가 전혀 없습니다',
                desc: '회원가입·카드 등록·자동 결제 없음. 원치 않으시면 연락도 가지 않습니다.',
              },
            ].map(c => (
              <div
                key={c.step}
                className={`rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                  dark
                    ? 'bg-slate-800/60 border-slate-700 hover:border-orange-500/40'
                    : 'bg-white border-orange-100 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={c.icon}
                      />
                    </svg>
                  </div>
                  <span className="text-2xl font-extrabold text-orange-200">{c.step}</span>
                </div>
                <p className={`font-bold text-lg mb-2 ${tHeading}`}>{c.title}</p>
                <p className={`text-sm leading-relaxed ${tSub}`}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {['회원가입 없음', '카드 등록 없음', '자동 결제 없음', '원치 않으면 연락 없음'].map(
              label => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${
                    dark
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    98<span className="text-2xl text-gray-400">/100</span>
                  </p>
                  <div className="w-48 mx-auto mt-3 bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-2.5 rounded-full"
                      style={{ width: '98%' }}
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
                      { ok: true, text: '메타태그·제목 구조 SEO 기준 충족' },
                      { ok: true, text: 'H1 단일 태그 정상 적용' },
                      { ok: true, text: 'SSL·모바일 반응형 정상 작동' },
                      { ok: true, text: '페이지 로딩 속도 0.9초 (우수)' },
                      { ok: false, text: '이미지 alt 태그 3건 보완 권장' },
                      { ok: false, text: '내부 링크 2곳 추가 시 색인 강화' },
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
                    카테고리별 정밀 점수
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { label: '기술 SEO', v: 96 },
                      { label: '콘텐츠 품질', v: 94 },
                      { label: '백링크 권위도', v: 92 },
                      { label: '페이지 속도', v: 99 },
                    ].map(c => (
                      <div key={c.label} className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 w-20 flex-shrink-0">{c.label}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                            style={{ width: `${c.v}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-900 w-7 text-right">
                          {c.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    매출 키워드 분석 (실시간 데이터)
                  </p>
                  <div className="overflow-hidden rounded-lg border border-gray-100">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-1.5 px-2 text-left text-gray-500 font-semibold">
                            키워드
                          </th>
                          <th className="py-1.5 px-2 text-right text-gray-500 font-semibold">
                            월 검색량
                          </th>
                          <th className="py-1.5 px-2 text-right text-gray-500 font-semibold">
                            진입 난이도
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {[
                          {
                            kw: '강남 인테리어 시공',
                            vol: '2,400',
                            diff: '보통',
                            color: 'text-orange-500',
                          },
                          {
                            kw: '인테리어 견적 비교',
                            vol: '5,900',
                            diff: '쉬움',
                            color: 'text-green-500',
                          },
                          {
                            kw: '아파트 리모델링 추천',
                            vol: '1,800',
                            diff: '보통',
                            color: 'text-orange-500',
                          },
                        ].map(r => (
                          <tr key={r.kw}>
                            <td className="py-1.5 px-2 text-gray-700">{r.kw}</td>
                            <td className="py-1.5 px-2 text-right text-gray-900 font-semibold">
                              {r.vol}
                            </td>
                            <td className={`py-1.5 px-2 text-right font-bold ${r.color}`}>
                              {r.diff}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">
                    * VebAPI·RapidAPI 실시간 데이터 기반 · 진입 가능 키워드 12개 추가 포함
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    생성형 AI 노출 현황
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { p: 'ChatGPT', s: '노출', tone: 'good' },
                      { p: '제미나이', s: '노출', tone: 'good' },
                      { p: '퍼플렉시티', s: '부분', tone: 'warn' },
                    ].map(a => (
                      <div key={a.p} className="text-center p-2.5 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600 mb-1">{a.p}</p>
                        <span
                          className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                            a.tone === 'good'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-orange-50 text-orange-600'
                          }`}
                        >
                          {a.s}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-start gap-2.5">
                  <svg
                    className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    더 정밀한 키워드 전략과 맞춤 견적은{' '}
                    <b className="text-emerald-700">텔레그램 1:1 상담</b>으로 바로 연결됩니다.
                    리포트 하단 버튼에서 시작하세요.
                  </p>
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
