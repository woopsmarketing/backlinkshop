'use client'

/**
 * Before / After 시뮬레이션 그래프.
 *
 * 진단 데이터를 기반으로 "이대로 둘 때" vs "우선순위 작업 적용 시" 예상치를
 * 시각적으로 비교해서 보여준다.
 *
 * 추정치는 보수적으로 잡았다 (업종 평균 케이스 기반):
 *   - SEO 점수: 작업 후 +15 ~ +25
 *   - 월 검색 트래픽: 작업 후 +30% ~ +120% (3~6개월)
 *   - 1페이지 진입 가능 키워드: 현재 0~2 → 작업 후 3~5
 *
 * 정확한 예측은 텔레그램 상담에서 도메인/업종/예산을 보고 제공한다는 흐름.
 */

import { useMemo, useState } from 'react'
import type { ParsedFields, CompetitorMetrics } from '@/lib/lp-metrics'
import type { TopRankedKeyword, AnalyzeV2Result } from '@/lib/vebapi'

type Props = {
  domain: string
  score: number | null
  parsed: ParsedFields | null
  customerMetrics: CompetitorMetrics | null
  competitorAverage: CompetitorMetrics | null
  /** VebAPI 실데이터 — 도메인 기존 노출 키워드 (1페이지 진입 추정 정확화) */
  topRankedKeywords?: TopRankedKeyword[]
  /** VebAPI 실데이터 — 정밀 6분류 점수 (종합 점수 정확화) */
  analyzeV2?: AnalyzeV2Result | null
  loading?: boolean
}

const FALLBACK_DEEPLINK = 'https://t.me/backlinkshop_seo_bot'

type SimMetric = {
  key: string
  label: string
  icon: string
  before: number
  after: number
  unit: string
  hint: string
}

export function AnalyzeSimulation({
  domain,
  score,
  parsed,
  customerMetrics,
  competitorAverage,
  topRankedKeywords = [],
  analyzeV2 = null,
  loading: dataLoading = false,
}: Props) {
  const [loading, setLoading] = useState(false)

  const metrics = useMemo<SimMetric[]>(() => {
    const out: SimMetric[] = []

    // 1) SEO 점수 — 정밀 점수(analyzeV2)가 있으면 그걸 기준으로, 없으면 LP 종합 점수
    //    실데이터 기반이면 "추정"이 아니라 "실측 → 목표" 흐름이라 신뢰도 ↑
    const precisionScore = analyzeV2?.scores.overall ?? null
    const baseScore = precisionScore ?? (typeof score === 'number' ? score : null)
    if (baseScore !== null) {
      const room = Math.max(0, 100 - baseScore)
      const gain = Math.min(25, Math.max(10, Math.round(room * 0.5)))
      out.push({
        key: 'score',
        label: '종합 SEO 점수',
        icon: '📊',
        before: baseScore,
        after: Math.min(98, baseScore + gain),
        unit: '점',
        hint: precisionScore !== null ? '정밀 진단 실측 기준 · 우선순위 3가지 적용 시' : '우선순위 3가지 적용 시',
      })
    }

    // 2) 월간 트래픽 — 현재 → 작업 후 (경쟁사 평균의 50% 수준까지 목표)
    const myTraffic = customerMetrics?.ahrefsTraffic ?? null
    const avgTraffic = competitorAverage?.ahrefsTraffic ?? null
    if (myTraffic !== null) {
      let after: number
      if (avgTraffic !== null && avgTraffic > myTraffic) {
        // 경쟁사 평균의 50% 수준 또는 현재의 2배 중 큰 쪽
        after = Math.max(myTraffic * 2, Math.round(avgTraffic * 0.5))
      } else {
        after = Math.round(myTraffic * 1.5)
      }
      // 너무 작은 도메인은 최소 200까지 끌어올림
      if (after < 200 && myTraffic < 200) after = Math.max(after, 200)
      out.push({
        key: 'traffic',
        label: '월간 검색 트래픽',
        icon: '📈',
        before: myTraffic,
        after,
        unit: '회',
        hint: '3~6개월 내 예상치',
      })
    }

    // 3) 1페이지 진입 키워드 — VebAPI 실데이터(topRanked) 우선, 없으면 추정으로 폴백
    const rankedWithRank = topRankedKeywords.filter(k => typeof k.rank === 'number')
    if (rankedWithRank.length > 0) {
      // 실측: 현재 1페이지(≤10위) 개수 → 11~20위(진입 임박) 중 최대 5개 끌어올림
      const inTop10 = rankedWithRank.filter(k => (k.rank as number) <= 10).length
      const nearTop10 = rankedWithRank.filter(k => {
        const r = k.rank as number
        return r >= 11 && r <= 20
      }).length
      const gainable = Math.max(3, Math.min(nearTop10, 5))
      out.push({
        key: 'keywords',
        label: '1페이지 진입 키워드',
        icon: '🎯',
        before: inTop10,
        after: inTop10 + gainable,
        unit: '개',
        hint:
          nearTop10 > 0
            ? `현재 11~20위 ${nearTop10}개 중 우선순위 작업 시 진입 예상 (실측 기준)`
            : '주력 키워드 진입 예상 (실측 기준)',
      })
    } else {
      const myKw = customerMetrics?.ahrefsOrganicKeywords ?? null
      if (myKw !== null) {
        const beforeTop10 = Math.round(Math.min(myKw * 0.1, 50))
        const after = Math.max(beforeTop10 + 3, Math.round(beforeTop10 * 2))
        out.push({
          key: 'keywords',
          label: '1페이지 진입 키워드',
          icon: '🎯',
          before: beforeTop10,
          after,
          unit: '개',
          hint: '주력 키워드 3~5개 진입 예상',
        })
      }
    }

    // 4) 월간 문의 — 트래픽 기반 추정 (전환율 1% 가정)
    if (myTraffic !== null) {
      const beforeInquiry = Math.max(1, Math.round(myTraffic * 0.01))
      // 작업 후 트래픽 × 전환율 1.5% (전환율도 같이 개선)
      const afterTraffic =
        avgTraffic !== null && avgTraffic > myTraffic
          ? Math.max(myTraffic * 2, Math.round(avgTraffic * 0.5))
          : Math.round(myTraffic * 1.5)
      const afterInquiry = Math.max(beforeInquiry + 5, Math.round(afterTraffic * 0.015))
      out.push({
        key: 'inquiry',
        label: '월 추정 문의 수',
        icon: '💬',
        before: beforeInquiry,
        after: afterInquiry,
        unit: '건',
        hint: '트래픽 × 평균 전환율 1.5% 기준',
      })
    }

    return out
  }, [score, customerMetrics, competitorAverage, topRankedKeywords, analyzeV2])

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (typeof window === 'undefined' || loading) return
    setLoading(true)
    try {
      let ref: string | null = null
      try {
        ref = sessionStorage.getItem('lp_ref')
      } catch {
        /* ignore */
      }
      const res = await fetch('/api/telegram/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, source: 'simulation', ref }),
      })
      const data = await res.json().catch(() => null)
      window.open(data?.deeplink || FALLBACK_DEEPLINK, '_blank', 'noopener,noreferrer')
    } catch {
      window.open(FALLBACK_DEEPLINK, '_blank', 'noopener,noreferrer')
    } finally {
      setLoading(false)
    }
  }

  if (metrics.length === 0) return null

  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white sm:p-7">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
          매출 시뮬레이션
        </span>
      </div>
      <h2 className="mb-2 text-lg font-bold sm:text-xl">
        우선순위 작업 적용 시 <span className="text-emerald-400">예상되는 변화</span>
      </h2>
      <p className="mb-6 text-xs leading-relaxed text-slate-300 sm:text-sm">
        앞서 보여드린 우선순위 1~3순위만 적용해도 다음과 같은 변화가 예상됩니다.
        <br />
        <span className="text-slate-400">* 회원님 사이트 실측 데이터 + 동일 업종 케이스 기반 보수적 추정치</span>
        {dataLoading && (
          <>
            <br />
            <span className="inline-flex items-center gap-1 text-emerald-300/80">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              정밀 실측 데이터 반영 중…
            </span>
          </>
        )}
      </p>

      <div className="space-y-4">
        {metrics.map(m => (
          <SimulationRow key={m.key} metric={m} />
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-emerald-500/10 border border-emerald-400/30 p-4">
        <p className="mb-2 text-sm font-semibold text-white">
          💰 회원님 사업 기준 <span className="text-emerald-300">실제 매출 시뮬레이션</span>은
        </p>
        <p className="mb-4 text-xs leading-relaxed text-slate-300">
          업종 평균이 아닌 <strong className="text-white">회원님 객단가/전환율/마진율</strong>을
          반영한 정확한 예상 매출 증가분을 텔레그램에서 직접 산출해드립니다.
        </p>
        <a
          href={FALLBACK_DEEPLINK}
          onClick={handleClick}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-600 ${
            loading ? 'opacity-70' : ''
          }`}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
          {loading ? '연결 중...' : '내 사업 매출 시뮬레이션 받기'}
        </a>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          평균 응답 5~15분 · 회원가입 불필요
        </p>
      </div>
    </section>
  )
}

function SimulationRow({ metric: m }: { metric: SimMetric }) {
  const gain = m.after - m.before
  const gainPct = m.before > 0 ? Math.round((gain / m.before) * 100) : null
  const max = Math.max(m.before, m.after, 1)
  const beforeWidth = Math.max(8, Math.round((m.before / max) * 100))
  const afterWidth = Math.max(beforeWidth + 5, Math.round((m.after / max) * 100))

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{m.icon}</span>
          <span className="text-sm font-semibold">{m.label}</span>
        </div>
        {gainPct !== null && gain > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
            ▲ +{gainPct.toLocaleString('ko-KR')}%
          </span>
        )}
      </div>

      {/* Before bar */}
      <div className="mb-1 flex items-center gap-3">
        <span className="w-14 flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          현재
        </span>
        <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-slate-700">
          <div
            className="absolute inset-y-0 left-0 flex items-center justify-end rounded-md bg-slate-500 px-2 text-xs font-bold text-white"
            style={{ width: `${beforeWidth}%` }}
          >
            {m.before.toLocaleString('ko-KR')}
            {m.unit}
          </div>
        </div>
      </div>

      {/* After bar */}
      <div className="flex items-center gap-3">
        <span className="w-14 flex-shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          작업 후
        </span>
        <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-slate-700">
          <div
            className="absolute inset-y-0 left-0 flex items-center justify-end rounded-md bg-gradient-to-r from-emerald-500 to-emerald-400 px-2 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/30"
            style={{ width: `${afterWidth}%`, transition: 'width 0.8s ease-out' }}
          >
            {m.after.toLocaleString('ko-KR')}
            {m.unit}
          </div>
        </div>
      </div>

      <p className="mt-1.5 text-[10px] text-slate-400">{m.hint}</p>
    </div>
  )
}
