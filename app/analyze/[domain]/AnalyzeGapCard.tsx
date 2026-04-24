'use client'

import { calculateCompetitorGap, type CompetitorMetrics } from '@/lib/lp-metrics'
import type { AnalyzeCompetitorAnalysis } from './AnalyzeClient'

type Props = {
  comp: AnalyzeCompetitorAnalysis | null | undefined
}

export function AnalyzeGapCard({ comp }: Props) {
  if (!comp?.customerMetrics || !comp.competitors || comp.competitors.length === 0) return null

  const gaps = calculateCompetitorGap(comp.customerMetrics, comp.competitors).filter(
    g => g.isBehind
  )
  if (gaps.length === 0) return null

  const competitorCount = comp.competitors.length

  return (
    <section className="rounded-2xl border-2 border-rose-200 bg-white p-5 sm:p-7">
      <div className="mb-4">
        <span className="inline-block rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
          격차 분석
        </span>
        <h2 className="mt-2 text-base font-bold text-slate-900 sm:text-lg">
          상위 <span className="text-rose-600">{competitorCount}개 경쟁사 평균</span> 대비 부족한
          영역
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          검색 결과 상위권 사이트의 평균 수치를 기준으로 내 사이트와의 격차를 보여드려요
        </p>
      </div>

      <ul className="space-y-3">
        {gaps.map(g => (
          <GapRow key={g.key} gap={g} />
        ))}
      </ul>

      <p className="mt-5 rounded-xl bg-rose-50 p-3 text-xs leading-relaxed text-rose-900">
        상위권 경쟁사는 이미 백링크·권위도·트래픽을 꾸준히 쌓고 있습니다. 지금 시작하지 않으면
        격차는 벌어집니다. 전문가에게 도메인 상태에 맞는 공략 순서를 받아보세요.
      </p>
    </section>
  )
}

type GapRowProps = {
  gap: {
    key: string
    label: string
    myValue: number
    avgValue: number
    gap: number
    percentOfAvg: number | null
    isBehind: boolean
    suffix?: string
  }
}

function GapRow({ gap }: GapRowProps) {
  const suffix = gap.suffix ?? '개'
  const myPct = clampPercent(gap.percentOfAvg)

  return (
    <li className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800">{gap.label}</span>
        <span className="text-sm font-bold text-rose-600">
          {formatNumber(gap.gap)}
          {suffix} 부족
        </span>
      </div>

      <div className="relative mb-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500"
          style={{ width: `${myPct}%` }}
          aria-hidden
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>
          <span className="font-semibold text-slate-700">내 사이트</span>{' '}
          {formatNumber(gap.myValue)}
          {suffix}
        </span>
        <span className="text-right">
          <span className="font-semibold text-slate-700">경쟁사 평균</span>{' '}
          {formatNumber(gap.avgValue)}
          {suffix}
        </span>
      </div>
    </li>
  )
}

function clampPercent(p: number | null): number {
  if (p === null) return 0
  if (p < 2) return 2 // 0 이어도 살짝 보이도록
  if (p > 100) return 100
  return Math.round(p)
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}
