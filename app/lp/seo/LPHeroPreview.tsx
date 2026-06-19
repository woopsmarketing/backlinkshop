'use client'

// "백링크샵 적용 후" 결과 미리보기: 점수 게이지(카운트업, 이전→98) + 핵심 KPI 3 +
// 세부 지표 before→after + 떡상 순위 그래프(그려지는 애니) + 개선 완료 체크리스트.
// 라이트/다크 hero 양쪽에서 흰 카드로 동작. compact=모바일용(세부지표·체크리스트 생략).
import { useEffect, useRef, useState } from 'react'

// 뷰 진입 시 0→target 카운트업. easeOutCubic.
function useCountUp(target: number, { duration = 1300, delay = 200 } = {}) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!seen) return
    let raf = 0
    let startTs: number | undefined
    const timer = setTimeout(() => {
      const step = (ts: number) => {
        if (startTs === undefined) startTs = ts
        const p = Math.min((ts - startTs) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(target * eased)
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [seen, target, duration, delay])

  return { val, ref, seen }
}

const DETAIL_METRICS = [
  { label: '도메인 권위도', before: '28', after: '52' },
  { label: '페이지 속도', before: '2.4s', after: '0.9s' },
  { label: '백링크 수', before: '12', after: '340' },
  { label: '색인 페이지', before: '18', after: '64' },
]

const IMPROVEMENTS = [
  '메타태그·제목 구조 재설계 완료',
  '페이지 속도 2.4s → 0.9s 개선',
  '우선순위 백링크 328개 확보',
]

export function LPHeroPreview({ compact = false }: { compact?: boolean }) {
  const score = useCountUp(98)
  const rank = useCountUp(39, { delay: 350 })
  const traffic = useCountUp(3.0, { delay: 450 })
  const inquiry = useCountUp(2.4, { delay: 550 })

  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    if (!score.seen) return
    const t = setTimeout(() => setDrawn(true), 250)
    return () => clearTimeout(t)
  }, [score.seen])

  const scoreVal = Math.round(score.val)

  return (
    <div
      ref={score.ref}
      className={`bg-white rounded-2xl shadow-2xl text-gray-900 overflow-hidden ${compact ? 'p-4' : 'p-5'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
          백링크샵 적용 후, 이렇게 바뀝니다
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
          ▲ 떡상
        </span>
      </div>

      {/* 점수 게이지 */}
      <div className="flex items-end justify-between mb-1">
        <div>
          <span className="text-sm font-semibold text-gray-900">종합 SEO 점수</span>
          <span className="ml-2 text-[11px] text-gray-400 line-through">이전 41</span>
        </div>
        <span className="font-extrabold text-orange-500 leading-none">
          <span className={compact ? 'text-2xl' : 'text-3xl'}>{scoreVal}</span>
          <span className="text-sm text-gray-400 font-bold"> / 100</span>
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-400 to-red-500 h-2.5 rounded-full transition-[width] duration-1000 ease-out"
          style={{ width: `${score.seen ? 98 : 0}%` }}
        />
      </div>

      {/* 핵심 KPI 3 */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded-xl bg-green-50 p-2.5 text-center">
          <p className="font-extrabold text-green-600 leading-none text-lg">
            +{Math.round(rank.val)}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">순위 상승</p>
        </div>
        <div className="rounded-xl bg-orange-50 p-2.5 text-center">
          <p className="font-extrabold text-orange-600 leading-none text-lg">
            ×{traffic.val.toFixed(1)}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">트래픽</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-2.5 text-center">
          <p className="font-extrabold text-blue-600 leading-none text-lg">
            ×{inquiry.val.toFixed(1)}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">문의</p>
        </div>
      </div>

      {/* 예상 매출 임팩트 — 감정 자극 (양쪽 모두 노출) */}
      <div className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-3 text-white mb-4">
        <p className="text-[10px] uppercase tracking-wider text-orange-100 mb-1.5">
          예상 매출 임팩트
        </p>
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] text-orange-100">월 문의</p>
            <p className="text-base font-extrabold leading-none">24 → 320건</p>
          </div>
          <svg
            className="w-5 h-5 flex-shrink-0 text-orange-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <div className="text-right">
            <p className="text-[10px] text-orange-100">매출 상승률</p>
            <p className="text-base font-extrabold leading-none">월 최대 1200%</p>
          </div>
        </div>
        <p className="text-[9px] text-orange-100/90 mt-1.5">* 업종 평균 객단가 기준 추정치</p>
      </div>

      {/* 세부 지표 before→after (데스크탑/풀) */}
      {!compact && (
        <>
          <p className="text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            세부 지표 변화
          </p>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {DETAIL_METRICS.map(m => (
              <div
                key={m.label}
                className="flex items-center justify-between rounded-lg bg-gray-50 py-1.5 px-2.5"
              >
                <span className="text-[11px] text-gray-600">{m.label}</span>
                <span className="text-[11px] font-semibold">
                  <span className="text-gray-400">{m.before}</span>
                  <span className="text-gray-300 mx-1">→</span>
                  <span className="text-green-600">{m.after}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 떡상 순위 그래프 */}
      <p className="text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-wider">
        순위 변화 (4주)
      </p>
      <div className={`relative overflow-hidden rounded-lg ${compact ? 'h-32' : 'h-40'} mb-2`}>
        <div className="absolute inset-0 flex flex-col justify-between">
          {['1위', '25위', '50위'].map(label => (
            <div key={label} className="border-b border-dashed border-gray-100 flex items-center">
              <span className="text-[10px] text-gray-400 w-9 text-right pr-2">{label}</span>
            </div>
          ))}
        </div>
        <svg
          className="absolute left-9 top-0 right-0 bottom-0 h-full w-[calc(100%-2.25rem)]"
          viewBox="0 0 300 140"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="hpArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {/* 떡상: 한동안 낮게 유지하다 막판 급상승 */}
          <path
            d="M0,124 C50,123 100,122 140,118 C170,114 190,107 210,90 C228,74 240,44 258,22 C272,10 286,5 300,3 L300,140 L0,140 Z"
            fill="url(#hpArea)"
            style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.9s ease 0.4s' }}
          />
          <path
            d="M0,124 C50,123 100,122 140,118 C170,114 190,107 210,90 C228,74 240,44 258,22 C272,10 286,5 300,3"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            style={{
              strokeDashoffset: drawn ? 0 : 1,
              transition: 'stroke-dashoffset 1.4s ease-out',
            }}
          />
        </svg>
        {/* 마커 */}
        <span className="absolute left-9 bottom-2 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] font-bold text-red-500">42위</span>
        </span>
        <span className="absolute right-0 top-0 flex items-center gap-1">
          <span className="text-sm">🚀</span>
          <span className="text-[10px] font-bold text-green-600">3위</span>
          <span className="w-2 h-2 rounded-full bg-green-500" />
        </span>
      </div>

      {/* 개선 완료 체크리스트 (데스크탑/풀) */}
      {!compact && (
        <div className="mt-3 mb-1 space-y-1.5">
          {IMPROVEMENTS.map(t => (
            <div key={t} className="flex items-start gap-2">
              <svg
                className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-[11px] text-gray-600">{t}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-gray-400 text-center mt-2">
        * 실제 결과는 키워드 경쟁도에 따라 달라질 수 있습니다
      </p>
    </div>
  )
}
