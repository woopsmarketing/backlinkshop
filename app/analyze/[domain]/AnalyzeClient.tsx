'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnalyzePendingPoller } from './AnalyzePendingPoller'
import { AnalyzeResultView } from './AnalyzeResultView'
import { AnalyzeStickyCTA } from './AnalyzeStickyCTA'
import { AnalyzeFailedView } from './AnalyzeFailedView'
import { AnalyzeNotFoundView } from './AnalyzeNotFoundView'
import { AnalyzePageView } from './AnalyzePageView'
import { AiChatWidget } from '@/app/components/AiChatWidget'
import type { EnrichmentResponse } from '@/app/api/analyze/enrichment/route'

export type AnalyzeStatus =
  | 'pending_analysis'
  | 'analyzing'
  | 'processing'
  | 'sending_report'
  | 'completed'
  | 'failed'
  | 'none'

import type { CompetitorMetrics } from '@/lib/lp-metrics'

export type AnalyzeCompetitorAnalysis = {
  keyword?: string
  customerDomain?: string
  customerMetrics?: CompetitorMetrics | null
  competitors?: CompetitorMetrics[]
}

export type AnalyzeReport = {
  score?: number | null
  analysisHtml?: string
  parsedData?: Record<string, unknown>
  competitorData?: AnalyzeCompetitorAnalysis | null
} | null

export type AnalyzeInitialState = {
  status: AnalyzeStatus
  domain: string
  url: string | null
  keyword: string | null
  requestedAt: string | null
  analyzedAt: string | null
  completedAt: string | null
  report: AnalyzeReport
}

type StatusResponse = {
  status: AnalyzeStatus
  hasReport: boolean
  domain: string
  url?: string
  keyword?: string
  requestedAt?: string
  analyzedAt?: string
  completedAt?: string
  report?: AnalyzeReport
}

const PENDING_STATUSES: AnalyzeStatus[] = ['pending_analysis', 'analyzing']
const POLL_INTERVAL_MS = 2000
const MAX_POLL_ATTEMPTS = 600 // 약 20분

export function AnalyzeClient({ initial }: { initial: AnalyzeInitialState }) {
  const [state, setState] = useState<AnalyzeInitialState>(initial)
  const [enrichment, setEnrichment] = useState<EnrichmentResponse | null>(null)
  const [enrichmentLoading, setEnrichmentLoading] = useState(false)
  const enrichmentFetchedRef = useRef<string | null>(null)
  const attemptsRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchStatus = useCallback(async (domain: string) => {
    const res = await fetch(`/api/lp/status?domain=${encodeURIComponent(domain)}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as StatusResponse
  }, [])

  const shouldPoll = PENDING_STATUSES.includes(state.status)

  // 분석 완료 후 한 번만 enrichment fetch
  const isResultReady =
    state.status === 'processing' ||
    state.status === 'sending_report' ||
    state.status === 'completed'

  useEffect(() => {
    if (!isResultReady) return
    if (enrichmentFetchedRef.current === state.domain) return
    enrichmentFetchedRef.current = state.domain

    const params = new URLSearchParams({ domain: state.domain })
    if (state.keyword) params.set('keyword', state.keyword)
    // 사이트 제목/설명을 LLM 키워드 생성 맥락으로 전달 (사업 이해도 ↑)
    const siteTitle =
      (state.report?.parsedData?.title as string | undefined) ||
      (state.report?.parsedData?.metaDescription as string | undefined)
    if (siteTitle) params.set('title', siteTitle.slice(0, 200))

    setEnrichmentLoading(true)
    fetch(`/api/analyze/enrichment?${params.toString()}`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then((data: EnrichmentResponse | null) => {
        if (data) setEnrichment(data)
      })
      .catch(() => {
        /* silent — UI 카드들이 null 처리 */
      })
      .finally(() => setEnrichmentLoading(false))
  }, [isResultReady, state.domain, state.keyword])

  useEffect(() => {
    if (!shouldPoll) return

    let cancelled = false

    const tick = async () => {
      if (cancelled) return
      attemptsRef.current += 1
      if (attemptsRef.current > MAX_POLL_ATTEMPTS) return

      if (typeof document !== 'undefined' && document.hidden) {
        timerRef.current = setTimeout(tick, POLL_INTERVAL_MS)
        return
      }

      const data = await fetchStatus(state.domain)
      if (cancelled) return

      if (data && data.status !== 'none') {
        setState(prev => ({
          ...prev,
          status: data.status,
          url: data.url ?? prev.url,
          keyword: data.keyword ?? prev.keyword,
          requestedAt: data.requestedAt ?? prev.requestedAt,
          analyzedAt: data.analyzedAt ?? prev.analyzedAt,
          completedAt: data.completedAt ?? prev.completedAt,
          report: data.hasReport ? (data.report ?? prev.report) : prev.report,
        }))
        if (!PENDING_STATUSES.includes(data.status)) return
      }

      timerRef.current = setTimeout(tick, POLL_INTERVAL_MS)
    }

    timerRef.current = setTimeout(tick, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [shouldPoll, state.domain, fetchStatus])

  return (
    <main className="min-h-screen bg-slate-50">
      <AnalyzePageView domain={state.domain} />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10 pb-32 sm:pb-10">
        {state.status === 'none' && <AnalyzeNotFoundView domain={state.domain} />}

        {(state.status === 'pending_analysis' || state.status === 'analyzing') && (
          <AnalyzePendingPoller
            domain={state.domain}
            url={state.url}
            keyword={state.keyword}
            status={state.status}
          />
        )}

        {(state.status === 'processing' ||
          state.status === 'sending_report' ||
          state.status === 'completed') && (
          <AnalyzeResultView
            domain={state.domain}
            url={state.url}
            keyword={state.keyword}
            report={state.report}
            analyzedAt={state.analyzedAt}
            enrichment={enrichment}
            enrichmentLoading={enrichmentLoading}
          />
        )}

        {state.status === 'failed' && (
          <AnalyzeFailedView domain={state.domain} url={state.url} keyword={state.keyword} />
        )}
      </div>

      {state.status !== 'none' && <AnalyzeStickyCTA domain={state.domain} />}

      <AiChatWidget
        context={{
          domain: state.domain,
          keyword: state.keyword,
          score: state.report?.score ?? null,
          analyzedAt: state.analyzedAt,
        }}
      />
    </main>
  )
}
