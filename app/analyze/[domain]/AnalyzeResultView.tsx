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
            회원님 사이트 맞춤 가이드
          </span>
        </div>
        {gapSummary && (
          <div className="mb-3 inline-block rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
            현재 격차: {gapSummary}
          </div>
        )}
        <h2 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
          이 격차를 좁히는 <span className="text-emerald-600">가장 빠른 작업 순서</span>를
          알려드릴게요
        </h2>
        <ul className="mb-4 space-y-2 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-emerald-500">✓</span>
            <span>
              <strong>1순위 작업</strong>과 예상 기간 (1~2주 / 1~2개월 / 3~6개월)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-emerald-500">✓</span>
            <span>
              <strong>3~6개월 내 1페이지 진입 가능 키워드</strong> 3~5개 추정
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-emerald-500">✓</span>
            <span>회원님 업종과 비슷한 실제 사례 데이터</span>
          </li>
        </ul>
        <p className="mb-4 text-xs text-slate-500">
          텔레그램에서 운영자가 5~15분 안에 직접 답변드립니다. 부담 없이 질문만 하셔도 OK.
        </p>
        <AnalyzeTelegramCTA
          domain={domain}
          placement="result_mid"
          label="텔레그램에서 맞춤 가이드 받기"
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

      <section className="rounded-2xl bg-slate-900 p-5 text-center sm:p-8">
        <h2 className="mb-3 text-lg font-bold text-white sm:text-2xl">
          진단은 끝났습니다. <br className="sm:hidden" />
          이제 우선순위가 필요해요
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-slate-300 sm:text-base">
          위 결과를 직접 적용하셔도 됩니다.
          <br />
          어디부터 시작할지 헷갈리시면,
          <br className="sm:hidden" />
          <strong className="text-white">가장 빠른 작업 순서를 5~15분 안에 알려드릴게요.</strong>
        </p>
        <AnalyzeTelegramCTA
          domain={domain}
          placement="result_bottom"
          label="텔레그램에서 우선순위 받기"
          subLabel="회원가입 불필요 · 견적 부담 없음"
        />
      </section>
    </div>
  )
}
