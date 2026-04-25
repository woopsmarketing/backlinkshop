'use client'

import { useMemo } from 'react'
import type { AnalyzeCompetitorAnalysis, AnalyzeReport } from './AnalyzeClient'
import { AnalyzeTelegramCTA } from './AnalyzeTelegramCTA'
import { AnalyzeKpiCards } from './AnalyzeKpiCards'
import { AnalyzeCompetitorTable } from './AnalyzeCompetitorTable'
import { AnalyzeGapCard } from './AnalyzeGapCard'
import { AnalyzeOnPageDetail } from './AnalyzeOnPageDetail'
import {
  calculateCompetitorAverage,
  partitionCompetitors,
  type CompetitorMetrics,
  type ParsedFields,
} from '@/lib/lp-metrics'

type Props = {
  domain: string
  url: string | null
  keyword: string | null
  report: AnalyzeReport
  analyzedAt: string | null
}

export function AnalyzeResultView({ domain, url, keyword, report, analyzedAt }: Props) {
  const score = typeof report?.score === 'number' ? report.score : null
  const analysisHtml = typeof report?.analysisHtml === 'string' ? report.analysisHtml : ''
  const competitor: AnalyzeCompetitorAnalysis | null = report?.competitorData ?? null

  const parsed = useMemo(
    () => (report?.parsedData ?? null) as ParsedFields | null,
    [report?.parsedData]
  )

  const customerMetrics: CompetitorMetrics | null = competitor?.customerMetrics ?? null
  const competitorList = useMemo(
    () => (competitor?.competitors ?? []).slice(0, 5),
    [competitor?.competitors]
  )
  const { regular: regularCompetitors } = useMemo(
    () => partitionCompetitors(competitorList),
    [competitorList]
  )
  const competitorAverage = useMemo(
    () => calculateCompetitorAverage(regularCompetitors),
    [regularCompetitors]
  )
  const hasCompetitor = competitorList.length > 0

  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            분석 완료
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          <span className="break-all text-orange-500">{domain}</span>
          <span className="text-slate-900"> SEO 진단 결과</span>
        </h1>
        {keyword && (
          <p className="mt-2 text-sm text-slate-600">
            핵심 키워드{' '}
            <strong className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
              {keyword}
            </strong>
          </p>
        )}
        {analyzedAt && (
          <p className="mt-1 text-xs text-slate-400">
            분석 시각: {new Date(analyzedAt).toLocaleString('ko-KR')}
          </p>
        )}
      </header>

      <AnalyzeKpiCards
        metrics={customerMetrics}
        average={competitorAverage}
        score={score}
        competitorCount={regularCompetitors.length}
      />

      <AnalyzeGapCard comp={competitor} />

      {hasCompetitor && <AnalyzeCompetitorTable comp={competitor} myDomainLabel={domain} />}

      <section className="rounded-2xl border-2 border-emerald-500 bg-white p-5 sm:p-7">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
            전문가 상담
          </span>
          <span className="text-xs text-slate-500">보고서 숫자만으로는 보이지 않는 실행 순서</span>
        </div>
        <h2 className="mb-2 text-lg font-bold text-slate-900 sm:text-xl">
          지금 바로 텔레그램으로 질문하세요
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          <strong>어떤 키워드부터 공략해야 빠른지</strong>,{' '}
          <strong>백링크·DA 격차를 어떻게 뒤집을지</strong> 도메인 상태에 맞춰 5~15분 안에
          답변드립니다.
        </p>
        <AnalyzeTelegramCTA
          domain={domain}
          placement="result_mid"
          label="텔레그램 1:1 상담 시작"
          subLabel="평균 응답 5~15분"
        />
      </section>

      <AnalyzeOnPageDetail parsed={parsed} />

      {analysisHtml && (
        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-4 text-base font-bold text-slate-900 sm:text-lg">AI 상세 분석</h2>
          <div
            className="prose prose-sm max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-li:text-slate-700"
            dangerouslySetInnerHTML={{ __html: analysisHtml }}
          />
        </section>
      )}

      {url && <p className="break-all text-center text-xs text-slate-400">분석 대상 URL: {url}</p>}

      <section className="rounded-2xl bg-slate-900 p-5 text-center sm:p-8">
        <h2 className="mb-3 text-lg font-bold text-white sm:text-2xl">
          진단은 끝났습니다. <br className="sm:hidden" />
          이제 실행만 남았어요
        </h2>
        <p className="mb-5 text-sm text-slate-300 sm:text-base">
          전문가가 도메인 상태에 맞는 가장 빠른 상위 노출 루트를 알려드립니다
        </p>
        <AnalyzeTelegramCTA
          domain={domain}
          placement="result_bottom"
          label="텔레그램으로 전문가 상담 시작"
          subLabel="채널: @goat82"
        />
      </section>
    </div>
  )
}
