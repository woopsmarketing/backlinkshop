// 테마 반응형 hero. 라이트(backlink·audit·agency) / 다크(rank·black) 공용.
// 레이아웃: [좌] 헤드라인+값리스트+신뢰  |  [우] 폼(강조) → 그 아래 증거 띠.
// 폼은 우측 단독 칸 + 글로우로 띄워 주인공으로. 모바일은 스택 후 폼 아래 컴팩트 증거.
import type { LPTheme } from './LandingBody'
import { LPHeroForm } from './LPHeroForm'
import { LPHeroCopy } from './LPHeroCopy'
import { LPHeroPreview } from './LPHeroPreview'

// 키워드별 값 리스트 — 헤드라인이 던진 상상을 받아주는 '최종적으로 얻는 결과'.
// 아직 카피 미확정 키워드는 DEFAULT를 사용.
// tone='negative'면 체크 대신 경고/✕ 아이콘으로 렌더(경쟁사 폭로형 리스트용).
type ValueList = { headline: string; items: string[]; tone?: 'positive' | 'negative' | 'question' }

const DEFAULT_VALUE_LIST: ValueList = {
  headline: '구글 상위노출의 핵심, 진단 한 번에 전부 드러납니다',
  items: [
    '경쟁사 TOP5를 1페이지에 올린 백링크 출처 — 그대로 따라갈 목록',
    '내 사이트 순위를 막고 있는 결정적 구멍을 콕 집어서',
    '메인 키워드, 1페이지까지 남은 거리와 진입 난이도',
    '딱 몇 개만 고치면 순위가 뛰는 우선순위 리스트',
  ],
}

const VALUE_LISTS: Record<string, ValueList> = {
  backlink: {
    headline: '광고 없이도 매출이 알아서 들어오는, 자유로운 삶이 시작됩니다',
    items: [
      '꾸준히 우상향하는 매출 그래프',
      '광고비 없이도 매달 고정으로 들어오는 매출',
      '브랜드 가치 상승 → 입소문·바이럴 확산',
      '사람을 더 뽑아야 할 만큼 커지는 매출 (월 1억+ 사례)',
      '내가 자는 동안에도 돌아가는 자동 수익 구조',
      '일에서 손을 떼도 유지되는 자유로운 삶',
    ],
  },
  audit: {
    headline: '구글봇 눈에 예쁜 사이트로 바뀌면, 순위가 따라옵니다',
    items: [
      '구글봇이 읽는 내부 코드의 숨은 감점 요소',
      '메타·헤딩·구조화 데이터 등 검색엔진 이해도 점검',
      '눈엔 안 보이지만 순위를 깎는 기술적 결함',
      '코드를 고치면 광고 없이 오르는 검색 순위',
      '경쟁사는 갖췄지만 내 사이트엔 빠진 최적화',
      '순위 상승 → 꾸준한 자연 방문자와 매출',
    ],
  },
  agency: {
    tone: 'negative',
    headline: '국내 상위노출 대행사 95%는, 이 중 하나입니다',
    items: [
      '해외에서 싸게 산 백링크를 비싸게 되파는 업체',
      '백링크의 품질조차 구분하지 못하는 업체',
      '내부 최적화가 뭔지도 모르고 손도 못 대는 업체',
      '고객 문의를 그대로 GPT에 붙여넣고 답하는 업체',
      '고객이 모른다는 걸 이용해 전문가인 척하는 업체',
      '자기 실력을 끝내 보여주지 못하는 업체',
    ],
  },
  rank: {
    headline: '구글 1위가 만들어주는, 일하지 않아도 굴러가는 사업',
    items: [
      '자연검색 방문자 폭발 → 멈추지 않는 매출 상승',
      '광고비 없이도 매달 고정으로 꽂히는 매출',
      '365일 휴가를 떠나도 꾸준히 들어오는 문의',
      '월 1억 매출도 현실이 되는 장기 자산',
      '한 번 올려두면 알아서 굴러가는 자동화 수익',
      '시간과 장소에 묶이지 않는 자유로운 삶',
    ],
  },
  black: {
    tone: 'question',
    headline: '혹시, 이런 적 있으셨나요?',
    items: [
      '업체가 시키는 대로 했는데 효과가 없었나요?',
      '잠깐 올랐다가 금세 다시 떨어졌나요?',
      '몇 달을 꾸준히 했는데 매출은 그대로였나요?',
      '안 되니까 사이트를 새로 만들어보기까지 했나요?',
      '매달 수백만 원을 쓰며 버리기만 했나요?',
      '결국 시간도 돈도 둘 다 잃고 계셨나요?',
    ],
  },
}

function getValueList(key?: string): ValueList {
  return (key && VALUE_LISTS[key]) || DEFAULT_VALUE_LIST
}

// 값 리스트 톤별 아이콘 (positive=화살표/체크, negative=경고/✕, question=물음표)
const VALUE_ICONS = {
  positive: {
    header: { color: 'text-emerald-500', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    item: { color: 'text-orange-500', d: 'M13 7l5 5m0 0l-5 5m5-5H6' },
  },
  negative: {
    header: {
      color: 'text-amber-500',
      d: 'M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.71-3.01l-6.93-12a2 2 0 00-3.42 0l-6.93 12A2 2 0 005.07 19z',
    },
    item: { color: 'text-red-500', d: 'M6 18L18 6M6 6l12 12' },
  },
  question: {
    header: {
      color: 'text-indigo-400',
      d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    item: {
      color: 'text-indigo-400',
      d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  },
} as const

const TRUST_ITEMS = [
  '50개 항목 정밀 진단',
  '경쟁사 TOP5 비교 포함',
  '회원가입·카드 등록 없음',
  '평균 10분 내 리포트 발송',
]

export function LPHero({ variantKey, theme = 'dark' }: { variantKey?: string; theme?: LPTheme }) {
  const dark = theme === 'dark'
  const valueList = getValueList(variantKey)
  const icons = VALUE_ICONS[valueList.tone ?? 'positive']

  return (
    <section className={`relative overflow-hidden ${dark ? 'text-white' : 'text-gray-900'}`}>
      {/* 배경 */}
      {dark ? (
        <>
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
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />
          <div
            className="absolute -top-24 -left-24 w-[480px] h-[480px] bg-orange-200 rounded-full filter blur-[130px] opacity-50"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/4 -right-24 w-[400px] h-[400px] bg-amber-200 rounded-full filter blur-[120px] opacity-40"
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative max-w-5xl mx-auto px-4 py-14 sm:py-20">
        {/* 상단 헤드라인 블록 — 가운데 정렬, 일관된 폭으로 정돈 */}
        <div className="max-w-3xl mx-auto text-center">
          <LPHeroCopy variantKey={variantKey} theme={theme} />

          {/* 값 리스트 — sub 대신, 상위노출 핵심을 쥐는 것처럼 */}
          <div
            className={`mt-1 mb-7 rounded-2xl border p-5 sm:p-6 text-left ${
              dark
                ? 'bg-white/[0.06] border-orange-400/20 backdrop-blur'
                : 'bg-white border-orange-100 shadow-sm'
            }`}
          >
            <p
              className={`flex items-center gap-2 text-base font-bold mb-3 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}
            >
              <svg
                className={`w-5 h-5 flex-shrink-0 ${icons.header.color}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={icons.header.d}
                />
              </svg>
              {valueList.headline}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-2.5">
              {valueList.items.map(t => (
                <li
                  key={t}
                  className={`flex items-start gap-2 text-sm ${dark ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  <svg
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${icons.item.color}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={icons.item.d}
                    />
                  </svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 신뢰 스트립 */}
          <ul
            className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm ${
              dark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {TRUST_ITEMS.map(t => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-emerald-500"
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

        {/* 2컬럼: 폼(강조) | 증거 미리보기 */}
        <div className="grid lg:grid-cols-2 gap-8 items-start mt-12">
          {/* 폼 — 뒤 글로우 + 카드 자체 오렌지 링으로 라이트에서도 또렷하게 */}
          <div id="hero-form" className="relative scroll-mt-8">
            <div
              className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-orange-400/25 to-red-400/15 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative">
              <LPHeroForm />

              {/* 모바일 미리보기 — 폼 바로 아래 (데스크탑은 우측 컬럼) */}
              <div className="lg:hidden mt-5">
                <LPHeroPreview compact />
              </div>
            </div>
          </div>

          {/* 데스크탑 우측 미리보기 */}
          <div className="hidden lg:block">
            <LPHeroPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
