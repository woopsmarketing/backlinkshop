// 생성형 AI 노출(GEO) 전용 hero — 다크. 손실 회피 훅 + AI 노출 현황 증거카드.
// 폼은 공용 LPHeroForm 재사용. 카피는 추후 키워드별로 다듬을 예정(현재는 초기안).
// 항상 다크 고정이라 variantKey·theme prop은 받지 않는다(registry는 props 적은 컴포넌트도 허용).
import { LPHeroForm } from './LPHeroForm'

const AI_VALUE_HEADLINE = 'AI 답변이 비즈니스 성장에 얼마나 도움 되는지 알고 계신가요?'
const AI_VALUE_ITEMS = [
  '검색 점유율을 넘어 AI 답변 점유율까지 대폭 확대',
  '아직 늦지 않은 시장, 지금이 가장 빠르게 점유할 때',
  '쭉쭉 오르는 브랜드 인지도 + 유입률',
  'AI 추천으로 이어지는 눈에 보이는 매출 상승',
  '검증된 링크 구축 + 인용 로직으로 AI가 신뢰하는 출처화',
  '검색이 흔들려도 AI에서 들어오는 새 유입 채널',
]

const TRUST_ITEMS = [
  'ChatGPT·제미나이·퍼플렉시티 분석',
  '경쟁사 AI 노출 비교',
  '회원가입·카드 등록 없음',
  '평균 10분 내 리포트 발송',
]

const PLATFORMS = ['ChatGPT', '제미나이', '퍼플렉시티', 'Claude']

export function LPHeroAi() {
  return (
    <section className="relative overflow-hidden text-white">
      {/* 배경 — AI/미래지향 다크 (보라·청록 그라데이션) */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/80 via-slate-900 to-slate-950" />
      <div
        className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-violet-600 rounded-full filter blur-[120px] opacity-40"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -right-20 w-[420px] h-[420px] bg-cyan-600 rounded-full filter blur-[110px] opacity-25"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-indigo-800 rounded-full filter blur-[120px] opacity-35"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 py-14 sm:py-20">
        {/* 상단 헤드라인 블록 */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 backdrop-blur-md border border-violet-400/30 text-violet-300 text-sm font-semibold mb-5">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            AEO/GEO AI 답변 노출 최적화
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 text-white">
            AI 답변에 내 비즈니스가
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              노출되고 있나요?
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 font-semibold mb-7">
            경쟁사는 이미 ChatGPT·제미나이 답변에 등장하고 있습니다.{' '}
            <span className="text-white">늦지 않았습니다.</span>
          </p>

          {/* 값 리스트 */}
          <div className="mb-7 rounded-2xl border border-violet-400/20 bg-white/[0.06] backdrop-blur p-5 sm:p-6 text-left">
            <p className="flex items-center gap-2 text-base font-bold mb-3 text-white">
              <svg
                className="w-5 h-5 flex-shrink-0 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {AI_VALUE_HEADLINE}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-2.5">
              {AI_VALUE_ITEMS.map(t => (
                <li key={t} className="flex items-start gap-2 text-sm text-gray-200">
                  <svg
                    className="w-4 h-4 flex-shrink-0 mt-0.5 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 신뢰 스트립 */}
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-300">
            {TRUST_ITEMS.map(t => (
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
        </div>

        {/* 2컬럼: 폼 | AI 노출 현황 증거 */}
        <div className="grid lg:grid-cols-2 gap-8 items-start mt-12">
          <div id="hero-form" className="relative scroll-mt-8">
            <div
              className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-violet-500/25 to-cyan-400/15 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative">
              <LPHeroForm />
              <div className="lg:hidden mt-5">
                <AIVisibilityCard />
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <AIVisibilityCard />
          </div>
        </div>
      </div>
    </section>
  )
}

// AI 노출 현황 증거카드 — 내 브랜드 미노출 vs 경쟁사 노출 (손실 회피 시각화)
function AIVisibilityCard() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-5 text-gray-900 overflow-hidden">
      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-3">
        AI 답변 노출 현황
      </p>

      <div className="overflow-hidden rounded-xl border border-gray-100 mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 text-left text-gray-500 font-semibold text-xs">플랫폼</th>
              <th className="py-2 px-3 text-center text-gray-500 font-semibold text-xs">
                내 브랜드
              </th>
              <th className="py-2 px-3 text-center text-gray-500 font-semibold text-xs">경쟁사</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PLATFORMS.map(name => (
              <tr key={name}>
                <td className="py-2 px-3 text-gray-700 font-medium">{name}</td>
                <td className="py-2 px-3 text-center font-bold text-red-500">✕</td>
                <td className="py-2 px-3 text-center font-bold text-green-500">✓</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl bg-red-50 p-3 text-center">
          <p className="text-2xl font-extrabold text-red-500 leading-none">0곳</p>
          <p className="text-[11px] text-gray-500 mt-1">내 브랜드 노출</p>
        </div>
        <div className="rounded-xl bg-green-50 p-3 text-center">
          <p className="text-2xl font-extrabold text-green-600 leading-none">4곳</p>
          <p className="text-[11px] text-gray-500 mt-1">경쟁사 노출</p>
        </div>
      </div>

      <p className="text-xs text-center text-red-500 font-semibold">
        지금도 AI는 경쟁사를 추천하고 있습니다
      </p>
    </div>
  )
}
