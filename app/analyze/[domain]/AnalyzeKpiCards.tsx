'use client'

import { buildKpiCards, type CompetitorMetrics, type MetricLevel } from '@/lib/lp-metrics'

type Props = {
  metrics: CompetitorMetrics | null | undefined
  score?: number | null
}

export function AnalyzeKpiCards({ metrics, score }: Props) {
  const cards = buildKpiCards(metrics)
  if (cards.length === 0 && (score === null || score === undefined)) return null

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">내 사이트 핵심 KPI</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Ahrefs · Moz · Majestic · VebAPI 통합 데이터
          </p>
        </div>
        {typeof score === 'number' && <ScorePill score={score} />}
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map(card => (
          <li key={card.key} className={`rounded-xl border p-4 ${toneClasses(card.level)}`}>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              {card.label}
            </p>
            <p className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              {card.value}
            </p>
            {card.hint && (
              <p className="mt-1.5 text-[11px] leading-snug text-slate-500">{card.hint}</p>
            )}
          </li>
        ))}
      </ul>

      {cards.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          아직 외부 도메인 데이터가 수집되지 않았습니다. 분석이 완료되면 자동으로 표시됩니다.
        </p>
      )}
    </section>
  )
}

function toneClasses(level: MetricLevel): string {
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

function ScorePill({ score }: { score: number }) {
  const tone = score >= 80 ? 'emerald' : score >= 60 ? 'amber' : 'rose'
  const map: Record<string, string> = {
    emerald: 'bg-emerald-500 text-white',
    amber: 'bg-amber-500 text-white',
    rose: 'bg-rose-500 text-white',
  }
  return (
    <div className="flex flex-col items-end">
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${map[tone]}`}>
        종합 {score}/100
      </span>
      <span className="mt-1 text-[10px] text-slate-400">AI 종합 점수</span>
    </div>
  )
}
