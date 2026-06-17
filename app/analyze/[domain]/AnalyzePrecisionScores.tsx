'use client'

/**
 * analyze/v2 정밀 진단 점수 카드.
 *
 * VebAPI 의 5분류 점수(performance/technical/onpage/security/ai_readiness/accessibility)를
 * 페이지에 표시. 항목별 우선순위 이슈는 텔레그램에서.
 */

import { useState } from 'react'
import type { AnalyzeV2Result } from '@/lib/vebapi'

type Props = {
  domain: string
  data: AnalyzeV2Result | null
  loading?: boolean
}

const FALLBACK_DEEPLINK = 'https://t.me/backlinkshop_seo_bot'

export function AnalyzePrecisionScores({ domain, data, loading }: Props) {
  const [ctaLoading, setCtaLoading] = useState(false)

  if (loading) return <SkeletonCard />
  if (!data) return null

  const buckets = [
    { key: 'performance', label: '성능', icon: '⚡', value: data.scores.performance },
    { key: 'technical', label: '기술 SEO', icon: '⚙️', value: data.scores.technical },
    { key: 'onpage', label: '온페이지', icon: '📝', value: data.scores.onpage },
    { key: 'security', label: '보안', icon: '🔒', value: data.scores.security },
    { key: 'ai_readiness', label: 'AI 준비도', icon: '🤖', value: data.scores.ai_readiness },
    { key: 'accessibility', label: '접근성', icon: '♿', value: data.scores.accessibility },
  ].filter(b => b.value !== null)

  if (buckets.length === 0 && data.scores.overall === null) return null

  const issueCount = data.priorityIssues.length

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (typeof window === 'undefined' || ctaLoading) return
    setCtaLoading(true)
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
        body: JSON.stringify({ domain, source: 'precision_scores', ref }),
      })
      const data = await res.json().catch(() => null)
      window.open(data?.deeplink || FALLBACK_DEEPLINK, '_blank', 'noopener,noreferrer')
    } catch {
      window.open(FALLBACK_DEEPLINK, '_blank', 'noopener,noreferrer')
    } finally {
      setCtaLoading(false)
    }
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          정밀 진단
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
          6분류 정밀 점수
        </span>
      </div>
      <h2 className="mb-1 text-base font-bold text-slate-900 sm:text-lg">VebAPI 정밀 분석 점수</h2>
      <p className="mb-5 text-xs text-slate-500">외부 SEO 진단 엔진으로 6개 분야 정밀 측정</p>

      {data.scores.overall !== null && (
        <div className="mb-5 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
          <div
            className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold ${gradeBgColor(data.scores.grade)}`}
          >
            {data.scores.grade ?? data.scores.overall}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              종합 정밀 점수
            </p>
            <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {data.scores.overall}
              <span className="text-base font-bold text-slate-400">/100</span>
            </p>
          </div>
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {buckets.map(b => (
          <BucketCard key={b.key} label={b.label} icon={b.icon} value={b.value as number} />
        ))}
      </div>

      {issueCount > 0 && (
        <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-4">
          <div className="space-y-1.5 opacity-30 blur-[3px]">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 flex-1 rounded bg-slate-300" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50/40 to-emerald-50/95 px-4 text-center">
            <p className="mb-1 text-sm font-bold text-slate-900">
              🔒 <span className="text-emerald-600">{issueCount}개 발견된 이슈</span>의 우선순위 +
              구체 개선 방법
            </p>
            <p className="mb-3 text-[11px] leading-relaxed text-slate-600">
              어떤 이슈를 먼저 고쳐야 매출이 빨리 올라가는지,
              <br />각 이슈별 작업 방법과 예상 효과까지 텔레그램에서.
            </p>
            <a
              href="https://t.me/backlinkshop_seo_bot"
              onClick={handleClick}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-600 ${
                ctaLoading ? 'opacity-70' : ''
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
              {ctaLoading ? '연결 중...' : '우선순위 + 구체 개선 가이드 받기'}
            </a>
          </div>
        </div>
      )}
    </section>
  )
}

function BucketCard({ label, icon, value }: { label: string; icon: string; value: number }) {
  const level = value >= 70 ? 'good' : value >= 40 ? 'warn' : 'bad'
  const colors = {
    good: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warn: 'bg-amber-50 text-amber-700 border-amber-100',
    bad: 'bg-red-50 text-red-700 border-red-100',
  }[level]
  return (
    <div className={`rounded-xl border ${colors} p-3 text-center`}>
      <div className="mb-1 text-lg">{icon}</div>
      <p className="text-[11px] font-semibold opacity-70">{label}</p>
      <p className="mt-0.5 text-xl font-extrabold">{Math.round(value)}</p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <section className="animate-pulse rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-3 h-3 w-32 rounded bg-slate-200" />
      <div className="mb-4 h-5 w-48 rounded bg-slate-200" />
      <div className="mb-5 h-16 rounded-xl bg-slate-100" />
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-20 rounded-xl bg-slate-100" />
        ))}
      </div>
    </section>
  )
}

function gradeBgColor(grade: string | null): string {
  switch (grade) {
    case 'A':
    case 'A+':
      return 'bg-emerald-500 text-white'
    case 'B':
    case 'B+':
      return 'bg-emerald-200 text-emerald-900'
    case 'C':
    case 'C+':
      return 'bg-amber-200 text-amber-900'
    case 'D':
    case 'D+':
      return 'bg-orange-300 text-orange-900'
    case 'F':
      return 'bg-red-500 text-white'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}
