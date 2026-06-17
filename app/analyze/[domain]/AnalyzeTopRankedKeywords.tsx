'use client'

/**
 * 도메인이 이미 순위 잡은 키워드 카드 (맛보기 + 잠금).
 *
 * "회원님 사이트는 이미 N개 키워드에 등록되어 있어요" → 상위 3개 + 나머지 잠금
 * 진입 임박 키워드 분석은 텔레그램에서.
 */

import { useState } from 'react'
import type { TopRankedKeyword } from '@/lib/vebapi'

type Props = {
  domain: string
  keywords: TopRankedKeyword[]
  loading?: boolean
}

const FALLBACK_DEEPLINK = 'https://t.me/backlinkshop_seo_bot'
const VISIBLE_COUNT = 3

export function AnalyzeTopRankedKeywords({ domain, keywords, loading }: Props) {
  const [ctaLoading, setCtaLoading] = useState(false)

  if (loading) return <SkeletonCard />
  if (!keywords || keywords.length === 0) return null

  // 순위 좋은 순으로 정렬
  const sorted = [...keywords].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
  const visible = sorted.slice(0, VISIBLE_COUNT)
  const hiddenCount = Math.max(0, sorted.length - VISIBLE_COUNT)

  // 1페이지 진입 임박 키워드 카운트 (11~20위)
  const nearTop10 = sorted.filter(k => k.rank !== null && k.rank >= 11 && k.rank <= 20).length
  // 이미 1페이지
  const inTop10 = sorted.filter(k => k.rank !== null && k.rank <= 10).length

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
        body: JSON.stringify({ domain, source: 'top_ranked', ref }),
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
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
          기존 순위 분석
        </span>
      </div>
      <h2 className="mb-1 text-base font-bold text-slate-900 sm:text-lg">
        이미 구글에 노출되고 있는 키워드
      </h2>

      <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="총 노출 키워드" value={`${sorted.length}개`} accent="slate" />
        <Stat label="1페이지 진입" value={`${inTop10}개`} accent="emerald" />
        <Stat label="11~20위 (임박)" value={`${nearTop10}개`} accent="orange" />
      </div>

      <p className="mb-3 text-xs text-slate-600">🎯 상위 3개 노출 키워드:</p>
      <div className="mb-3 space-y-2">
        {visible.map(k => (
          <div
            key={k.keyword}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className={`flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-xs font-bold ${rankBadgeColor(k.rank)}`}
              >
                {k.rank ?? '?'}위
              </span>
              <span className="truncate text-sm font-medium text-slate-800">{k.keyword}</span>
            </div>
            <span className="flex-shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-700">
              월 {(k.searchVolume ?? 0).toLocaleString('ko-KR')}
            </span>
          </div>
        ))}
      </div>

      {hiddenCount > 0 && (
        <LockedTeaser
          count={hiddenCount}
          nearTop10={nearTop10}
          onClick={handleClick}
          loading={ctaLoading}
        />
      )}
    </section>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: 'slate' | 'emerald' | 'orange'
}) {
  const colors = {
    slate: 'bg-slate-50 text-slate-900',
    emerald: 'bg-emerald-50 text-emerald-700',
    orange: 'bg-orange-50 text-orange-700',
  }[accent]
  return (
    <div className={`rounded-lg ${colors} px-3 py-2.5 text-center`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-1 text-base font-extrabold sm:text-lg">{value}</p>
    </div>
  )
}

function LockedTeaser({
  count,
  nearTop10,
  onClick,
  loading,
}: {
  count: number
  nearTop10: number
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
  loading: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-4">
      <div className="space-y-1.5 opacity-30 blur-[3px]">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5"
          >
            <span className="h-3 w-32 rounded bg-slate-300" />
            <span className="h-3 w-16 rounded bg-slate-300" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50/40 to-emerald-50/95 px-4 text-center">
        <p className="mb-1 text-sm font-bold text-slate-900">
          🔒 나머지 <span className="text-emerald-600">{count}개</span> 키워드 + 진입 우선순위 분석
        </p>
        <p className="mb-3 text-[11px] leading-relaxed text-slate-600">
          {nearTop10 > 0 && (
            <>
              <strong className="text-orange-600">11~20위 임박 키워드 {nearTop10}개</strong>를 어떤
              순서로 끌어올리는 게 매출에 가장 빠른지
              <br />
            </>
          )}
          텔레그램에서 회원님 사업 맥락에 맞춰 직접 알려드립니다.
        </p>
        <a
          href="https://t.me/backlinkshop_seo_bot"
          onClick={onClick}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-600 ${
            loading ? 'opacity-70' : ''
          }`}
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
          {loading ? '연결 중...' : '진입 우선순위 받기 (전체 키워드 포함)'}
        </a>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <section className="animate-pulse rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-3 h-3 w-32 rounded bg-slate-200" />
      <div className="mb-4 h-5 w-48 rounded bg-slate-200" />
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="h-14 rounded-lg bg-slate-100" />
        <div className="h-14 rounded-lg bg-slate-100" />
        <div className="h-14 rounded-lg bg-slate-100" />
      </div>
      <div className="space-y-2">
        <div className="h-12 rounded-lg bg-slate-100" />
        <div className="h-12 rounded-lg bg-slate-100" />
        <div className="h-12 rounded-lg bg-slate-100" />
      </div>
    </section>
  )
}

function rankBadgeColor(rank: number | null): string {
  if (rank === null) return 'bg-slate-100 text-slate-600'
  if (rank <= 3) return 'bg-emerald-500 text-white'
  if (rank <= 10) return 'bg-emerald-100 text-emerald-700'
  if (rank <= 20) return 'bg-orange-100 text-orange-700'
  return 'bg-slate-100 text-slate-600'
}
