'use client'

import { calculateCompetitorGap, type CompetitorMetrics } from '@/lib/lp-metrics'
import type { AnalyzeCompetitorAnalysis } from './AnalyzeClient'

type Props = {
  comp: AnalyzeCompetitorAnalysis | null | undefined
}

export function AnalyzeGapCard({ comp }: Props) {
  if (!comp?.customerMetrics || !comp.competitors || comp.competitors.length === 0) return null

  const top = comp.competitors[0]
  const gaps = calculateCompetitorGap(comp.customerMetrics, top).filter(g => g.isBehind)
  if (gaps.length === 0) return null

  const topDomain = top.domain || '1위 경쟁사'

  return (
    <section className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-5 sm:p-7">
      <div className="mb-4">
        <span className="inline-block rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
          격차 분석
        </span>
        <h2 className="mt-2 text-base font-bold text-rose-900 sm:text-lg">
          1위 경쟁사 <strong className="break-all">{topDomain}</strong> 대비 부족한 영역
        </h2>
      </div>

      <ul className="space-y-3">
        {gaps.map(g => (
          <li key={g.key} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-semibold text-slate-700">{g.label}</span>
              <span className="text-sm font-bold text-rose-600">
                {formatGapText(g.gap, g.suffix)} 부족
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-rose-400 transition-all"
                style={{ width: `${gapBarPercent(g.percentOfTop)}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                내 사이트 {g.myValue.toLocaleString('en-US')}
                {g.suffix ?? ''}
              </span>
              <span>
                {topDomain.length > 14 ? '1위' : topDomain} {g.topValue.toLocaleString('en-US')}
                {g.suffix ?? ''}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-rose-900">
        경쟁사는 이미 백링크·권위도·트래픽을 꾸준히 쌓고 있습니다. 지금 시작하지 않으면 격차는
        벌어집니다. 전문가에게 맞는 공략 순서를 받아보세요.
      </p>
    </section>
  )
}

function formatGapText(gap: number, suffix?: string): string {
  return `${gap.toLocaleString('en-US')}${suffix ?? '개'}`
}

function gapBarPercent(percentOfTop: number | null): number {
  if (percentOfTop === null) return 0
  return Math.max(2, Math.min(100, percentOfTop))
}
