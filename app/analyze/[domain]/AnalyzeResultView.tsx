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

      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 text-white sm:p-10">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300">
            🔓 텔레그램 문의로만 받을 수 있는 것
          </div>
          <h2 className="mb-4 text-xl font-extrabold leading-tight text-white sm:text-3xl">
            여기까지는 <span className="text-slate-400">시작일 뿐</span>입니다.
            <br />
            <span className="text-emerald-400">방문자→매출까지의 진짜 길</span>은
            <br className="sm:hidden" /> 텔레그램에서 받아보세요.
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            위 진단은 <strong className="text-white">증상을 짚어드린 것</strong>이고, 이걸 실제로
            매출로 연결하는 단계는 회원님 도메인 상태/업종/예산을 같이 봐야 합니다.
            <br className="hidden sm:block" />
            <strong className="text-emerald-300">아래 8가지를 텔레그램에서 풀로 받아보세요.</strong>
          </p>
        </div>

        {/* 잠금 해제될 데이터 — 위 카드들과 연결 */}
        <div className="mb-6">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <span className="inline-block h-1 w-6 rounded bg-emerald-400" />
            🔓 페이지에서 잠겨있는 데이터
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {(() => {
              const hiddenKeywords = Math.max(0, (enrichment?.relatedKeywords?.length ?? 0) - 3)
              const aiIssues = enrichment?.aiVisibility?.issues?.length ?? 0
              const precisionIssues = enrichment?.analyzeV2?.priorityIssues?.length ?? 0
              const topRankedHidden = Math.max(0, (enrichment?.topRankedKeywords?.length ?? 0) - 3)

              const items = [
                {
                  icon: '🎯',
                  title: `매출 기회 키워드 ${hiddenKeywords > 0 ? `${hiddenKeywords}개+` : '전체'} 풀 공개`,
                  desc: '진입 우선순위·예상 매출 영향·1페이지 진입 가능성까지',
                },
                {
                  icon: '📈',
                  title: `이미 노출 중인 키워드 ${topRankedHidden > 0 ? `${topRankedHidden}개+` : '전체'}`,
                  desc: '11~20위 임박 키워드를 어떤 순서로 끌어올릴지',
                },
                {
                  icon: '🤖',
                  title: `AI 검색 SEO 문제 ${aiIssues > 0 ? `${aiIssues}개` : ''} 구체 가이드`,
                  desc: 'ChatGPT/Perplexity에서 노출되려면 뭘 고쳐야 하는지',
                },
                {
                  icon: '⚙️',
                  title: `정밀 진단 이슈 ${precisionIssues > 0 ? `${precisionIssues}개` : ''} 우선순위`,
                  desc: '어떤 이슈부터 고쳐야 매출이 빨리 오르는지',
                },
              ]
              return items.map(item => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 backdrop-blur"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>

        {/* 추가로만 받을 수 있는 것 */}
        <div className="mb-8">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <span className="inline-block h-1 w-6 rounded bg-emerald-400" />
            💎 텔레그램에서만 받을 수 있는 추가 분석
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              {
                icon: '💰',
                title: '회원님 사업 기준 매출 시뮬레이션',
                desc: '객단가·전환율·마진 반영한 실제 매출 증가분 예상',
              },
              {
                icon: '🚀',
                title: '3~6개월 내 1페이지 진입 가능 키워드',
                desc: '주력 키워드 3~5개 구체 추정 + 진입 기간',
              },
              {
                icon: '🏆',
                title: '회원님 업종의 실제 매출 상승 사례',
                desc: '비슷한 도메인이 어떤 작업으로 얼마나 늘었는지',
              },
              {
                icon: '📋',
                title: '작업별 정확한 견적',
                desc: '백링크/콘텐츠/속도/온페이지 별 맞춤 견적',
              },
            ].map(item => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl bg-emerald-500/10 px-4 py-3 backdrop-blur"
              >
                <span className="text-lg">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 비교 안내 */}
        <div className="mb-6 rounded-xl bg-white/5 p-4 backdrop-blur sm:p-5">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
            한눈에 비교
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <p className="mb-2 font-semibold text-slate-400">현재 페이지에서</p>
              <ul className="space-y-1 text-slate-500">
                <li>
                  · 관련 키워드 <strong className="text-slate-300">3개</strong>
                </li>
                <li>
                  · 노출 키워드 <strong className="text-slate-300">3개</strong>
                </li>
                <li>
                  · AI/정밀 진단 <strong className="text-slate-300">점수만</strong>
                </li>
                <li>
                  · 우선순위 <strong className="text-slate-300">3개 미리보기</strong>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-semibold text-emerald-300">텔레그램 문의 시</p>
              <ul className="space-y-1 text-slate-200">
                <li>
                  · 관련 키워드 <strong className="text-emerald-300">전체 + 분석</strong>
                </li>
                <li>
                  · 노출 키워드 <strong className="text-emerald-300">전체 + 우선순위</strong>
                </li>
                <li>
                  · AI/정밀 진단 <strong className="text-emerald-300">구체 개선 가이드</strong>
                </li>
                <li>
                  · 우선순위 <strong className="text-emerald-300">매출 시뮬 + 견적</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <AnalyzeTelegramCTA
          domain={domain}
          placement="result_bottom"
          label="🚀 텔레그램에서 전체 데이터 + 매출 가이드 받기"
          subLabel="평균 응답 5~15분 · 운영자가 직접 답변드립니다"
        />

        {/* 안심 알약 */}
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {['✓ 회원가입 없음', '✓ 카드 등록 없음', '✓ 자동 결제 없음', '✓ 견적 부담 없음'].map(
            label => (
              <span
                key={label}
                className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-200 backdrop-blur"
              >
                {label}
              </span>
            )
          )}
        </div>
      </section>
    </div>
  )
}
