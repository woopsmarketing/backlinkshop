'use client'

import {
  buildKpiCards,
  type CompetitorMetrics,
  type KpiCard,
  type MetricLevel,
} from '@/lib/lp-metrics'

type Props = {
  metrics: CompetitorMetrics | null | undefined
  average: CompetitorMetrics | null | undefined
  score?: number | null
  competitorCount?: number
}

export function AnalyzeKpiCards({ metrics, average, score, competitorCount }: Props) {
  const cards = buildKpiCards(metrics, average)
  if (cards.length === 0 && (score === null || score === undefined)) return null

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">내 사이트 핵심 지표</h2>
          {average && competitorCount ? (
            <p className="mt-0.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                상위 {competitorCount}개 경쟁사 평균
              </span>
              과 바로 비교할 수 있어요
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-slate-500">
              경쟁사 데이터 수집 후 평균 비교가 표시됩니다
            </p>
          )}
        </div>
        {typeof score === 'number' && <ScorePill score={score} />}
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map(card => (
          <KpiCardView key={card.key} card={card} />
        ))}
      </ul>
    </section>
  )
}

function KpiCardView({ card }: { card: KpiCard }) {
  const { tone, meta } = avgBadgeProps(card.vsAverage)

  return (
    <li className={`flex flex-col justify-between rounded-xl border p-4 ${toneBg(card.level)}`}>
      <div>
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {card.label}
        </p>
        <p className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{card.value}</p>
        {card.hint && <p className="mt-1.5 text-[11px] leading-snug text-slate-500">{card.hint}</p>}
      </div>
      {card.vsAverage !== null && (
        <div
          className={`mt-3 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${tone}`}
        >
          <span>평균 대비</span>
          <span className="font-bold tabular-nums">{card.vsAverage}%</span>
          <span className="text-[10px] font-normal">{meta}</span>
        </div>
      )}
    </li>
  )
}

function toneBg(level: MetricLevel): string {
  switch (level) {
    case 'good':
      return 'border-emerald-200 bg-emerald-50'
    case 'warn':
      return 'border-amber-200 bg-amber-50'
    case 'bad':
      return 'border-rose-200 bg-rose-50'
    default:
      return 'border-slate-200 bg-slate-50'
  }
}

function avgBadgeProps(vsAverage: number | null) {
  if (vsAverage === null) return { tone: '', meta: '' }
  if (vsAverage >= 100) {
    return { tone: 'bg-emerald-100 text-emerald-700', meta: '우세' }
  }
  if (vsAverage >= 50) {
    return { tone: 'bg-amber-100 text-amber-700', meta: '근접' }
  }
  return { tone: 'bg-rose-100 text-rose-700', meta: '부족' }
}

function ScorePill({ score }: { score: number }) {
  const tone = score >= 80 ? 'emerald' : score >= 60 ? 'amber' : 'rose'
  const map: Record<string, string> = {
    emerald: 'bg-emerald-500 text-white',
    amber: 'bg-amber-500 text-white',
    rose: 'bg-rose-500 text-white',
  }
  return (
    <div className="flex flex-col items-end shrink-0">
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${map[tone]}`}>
        종합 {score}/100
      </span>
      <span className="mt-1 text-[10px] text-slate-400">AI 종합 점수</span>
    </div>
  )
}
