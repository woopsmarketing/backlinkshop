'use client'

import { useMemo } from 'react'
import type { AnalyzeCompetitorAnalysis, AnalyzeReport } from './AnalyzeClient'
import { AnalyzeTelegramCTA } from './AnalyzeTelegramCTA'
import { AnalyzeKpiCards } from './AnalyzeKpiCards'
import { AnalyzeCompetitorTable } from './AnalyzeCompetitorTable'
import { AnalyzeGapCard } from './AnalyzeGapCard'
import { AnalyzeOnPageDetail } from './AnalyzeOnPageDetail'
import { AnalyzeCachingBadge } from './AnalyzeCachingBadge'
import { AnalyzeCategoryScores } from './AnalyzeCategoryScores'
import { AnalyzePriorityPreview } from './AnalyzePriorityPreview'
import { AnalyzeSimulation } from './AnalyzeSimulation'
import { AnalyzeKeywordAnalysis } from './AnalyzeKeywordAnalysis'
import { AnalyzeTopRankedKeywords } from './AnalyzeTopRankedKeywords'
import { AnalyzeAiVisibility } from './AnalyzeAiVisibility'
import { AnalyzePrecisionScores } from './AnalyzePrecisionScores'
import { AnalyzeFullCTA } from './AnalyzeFullCTA'
import type { EnrichmentResponse } from '@/app/api/analyze/enrichment/route'
import {
  calculateCompetitorAverage,
  calculateCompetitorGap,
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
  enrichment?: EnrichmentResponse | null
  enrichmentLoading?: boolean
}

export function AnalyzeResultView({
  domain,
  url,
  keyword,
  report,
  analyzedAt,
  enrichment,
  enrichmentLoading,
}: Props) {
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

  // 격차 요약 — CTA 위에 직접 표시하기 위함
  const gapSummary = useMemo(() => {
    if (!customerMetrics || regularCompetitors.length === 0) return null
    const gaps = calculateCompetitorGap(customerMetrics, regularCompetitors).filter(g => g.isBehind)
    if (gaps.length === 0) return null
    return gaps
      .slice(0, 3)
      .map(g => `${g.label} -${Math.round(g.gap).toLocaleString('ko-KR')}${g.suffix ?? ''}`)
      .join(' · ')
  }, [customerMetrics, regularCompetitors])

  return (
    <div className="space-y-6">
      <AnalyzeCachingBadge domain={domain} analyzedAt={analyzedAt} />

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

      {/* 상단 풀 CTA — 페이지가 길어서 하단 도달 전 가치 노출 */}
      <AnalyzeFullCTA domain={domain} enrichment={enrichment} variant="top" />

      <AnalyzeKpiCards
        metrics={customerMetrics}
        average={competitorAverage}
        score={score}
        competitorCount={regularCompetitors.length}
      />

      <AnalyzeCategoryScores
        parsed={parsed}
        customerMetrics={customerMetrics}
        competitorAverage={competitorAverage}
      />

      <AnalyzePriorityPreview
        domain={domain}
        parsed={parsed}
        customerMetrics={customerMetrics}
        competitorAverage={competitorAverage}
      />

      <AnalyzeSimulation
        domain={domain}
        score={score}
        parsed={parsed}
        customerMetrics={customerMetrics}
        competitorAverage={competitorAverage}
      />

      {/* VebAPI 정밀 분석 카드들 (R3-B) */}
      <AnalyzeKeywordAnalysis
        domain={domain}
        keyword={keyword}
        singleKeyword={enrichment?.singleKeyword ?? null}
        relatedKeywords={enrichment?.relatedKeywords ?? []}
        loading={enrichmentLoading}
      />

      <AnalyzeTopRankedKeywords
        domain={domain}
        keywords={enrichment?.topRankedKeywords ?? []}
        loading={enrichmentLoading}
      />

      <AnalyzeAiVisibility
        domain={domain}
        data={enrichment?.aiVisibility ?? null}
        loading={enrichmentLoading}
      />

      <AnalyzePrecisionScores
        domain={domain}
        data={enrichment?.analyzeV2 ?? null}
        loading={enrichmentLoading}
      />

      <AnalyzeGapCard comp={competitor} />

      {hasCompetitor && <AnalyzeCompetitorTable comp={competitor} myDomainLabel={domain} />}

      <section className="rounded-2xl border-2 border-emerald-500 bg-white p-5 sm:p-7">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
            매출 상승 정밀 분석
          </span>
        </div>
        {gapSummary && (
          <div className="mb-3 inline-block rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
            현재 격차: {gapSummary}
          </div>
        )}
        <h2 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
          이 격차를 좁히면 <span className="text-emerald-600">월 문의가 1.5~3배</span>로 늘어납니다
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          위 우선순위만 적용해도 효과는 분명히 옵니다. 다만{' '}
          <strong className="text-slate-900">
            정확한 매출 상승까지 가려면 키워드 선정·진입 순서·예상 매출치
          </strong>
          를 회원님 사업 규모에 맞춰 잡아야 합니다.
        </p>
        <ul className="mb-4 space-y-2 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-emerald-500">✓</span>
            <span>
              <strong>매출이 가장 빠르게 늘어나는 키워드 3~5개</strong> 추정 (월 검색량 포함)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-emerald-500">✓</span>
            <span>
              회원님 업종 <strong>실제 매출 상승 사례</strong> 데이터
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-emerald-500">✓</span>
            <span>
              각 작업별 <strong>정확한 견적</strong>과 예상 ROI
            </span>
          </li>
        </ul>
        <p className="mb-4 text-xs text-slate-500">
          텔레그램에서 운영자가 5~15분 안에 직접 답변드립니다. 부담 없이 질문만 하셔도 OK.
        </p>
        <AnalyzeTelegramCTA
          domain={domain}
          placement="result_mid"
          label="매출 상승 정밀 분석 받기"
          subLabel="평균 응답 5~15분 · 회원가입 불필요"
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

      <AnalyzeFullCTA domain={domain} enrichment={enrichment} variant="bottom" />
    </div>
  )
}
