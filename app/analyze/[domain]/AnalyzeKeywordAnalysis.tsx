'use client'

/**
 * 키워드 분석 카드 (맛보기 + 잠금).
 *
 * - 사용자 입력 키워드: 추정 검색량 / CPC / 구글애즈 유료광고 경쟁도 (VebAPI, 전체 공개)
 * - 관련 키워드: LLM 생성 질적 신호(의도/상업성/난이도) 상위 3개 공개 + 나머지 잠금 + CTA
 *
 * 목표: "오 우리 키워드 진짜 분석해주네!" → "나머지 키워드 전략은 뭐지?" → 텔레그램 클릭
 */

import { useState } from 'react'
import type { KeywordMetric, AdCompetition } from '@/lib/vebapi'
import type { KeywordIdea, QualLevel } from '@/lib/keyword-ideas'

type Props = {
  domain: string
  keyword: string | null
  singleKeyword: KeywordMetric | null
  keywordIdeas: KeywordIdea[]
  loading?: boolean
}

const FALLBACK_DEEPLINK = 'https://t.me/backlinkshop_seo_bot'
const VISIBLE_COUNT = 3

export function AnalyzeKeywordAnalysis({
  domain,
  keyword,
  singleKeyword,
  keywordIdeas,
  loading,
}: Props) {
  const [ctaLoading, setCtaLoading] = useState(false)

  if (loading) return <SkeletonCard />
  if (!keyword || !singleKeyword) return null

  const visible = keywordIdeas.slice(0, VISIBLE_COUNT)
  const hiddenCount = Math.max(0, keywordIdeas.length - VISIBLE_COUNT)

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
        body: JSON.stringify({ domain, source: 'keyword_analysis', ref }),
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
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
          키워드 분석
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          키워드 시장 데이터
        </span>
      </div>
      <h2 className="mb-1 text-base font-bold text-slate-900 sm:text-lg">
        회원님 키워드의 시장 데이터
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        구글애즈 기준 검색 규모·광고 경쟁도와, 사업에 맞춘 관련 키워드 기회를 정리했어요.
      </p>

      {/* 사용자 입력 키워드 — 풀 공개 */}
      <div className="mb-5 rounded-xl border border-purple-200 bg-purple-50/40 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-purple-700">
          입력하신 키워드
        </p>
        <p className="mb-3 text-base font-bold text-slate-900 sm:text-lg">
          &ldquo;{singleKeyword.text}&rdquo;
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Metric label="추정 검색량" value={fmt(singleKeyword.searchVolume, '회')} />
          <Metric label="CPC" value={fmt(singleKeyword.cpc, '$', true)} />
          <Metric label="유료광고 경쟁도" value={competitionLabel(singleKeyword.competition)} />
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
          * 경쟁도는 구글애즈(유료광고) 입찰 경쟁 기준이며, 자연 검색 노출 난이도와는 다릅니다.
        </p>
      </div>

      {/* 관련 키워드 — LLM 질적 신호, 3개 공개 + 잠금 */}
      {visible.length > 0 && (
        <div>
          <p className="mb-1 text-sm font-semibold text-slate-700">
            🎯 매출 기회가 큰 관련 키워드 ({keywordIdeas.length}개 발굴)
          </p>
          <p className="mb-3 text-[11px] text-slate-400">
            AI가 회원님 사업 맥락에 맞춰 공략 가치를 분석했어요.
          </p>
          <div className="mb-3 space-y-2">
            {visible.map((k, i) => (
              <div
                key={k.keyword}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-purple-100 text-xs font-bold text-purple-700">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                    {k.keyword}
                  </span>
                  <span className="flex-shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                    {k.intent}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-8">
                  <Tag label="상업성" level={k.commercialValue} positiveHigh />
                  <Tag label="공략 난이도" level={k.difficulty} positiveHigh={false} />
                  {k.reason && <span className="text-[11px] text-slate-500">· {k.reason}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* 잠금 영역 */}
          {hiddenCount > 0 && (
            <LockedTeaser count={hiddenCount} onClick={handleClick} loading={ctaLoading} />
          )}
        </div>
      )}
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-2 py-2 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-slate-900 sm:text-base">{value}</p>
    </div>
  )
}

/** 질적 레벨 태그. 상업성은 상=좋음(녹색), 난이도는 상=어려움(빨강)이라 색 방향이 반대. */
function Tag({
  label,
  level,
  positiveHigh,
}: {
  label: string
  level: QualLevel
  positiveHigh: boolean
}) {
  const good = positiveHigh ? level === '상' : level === '하'
  const bad = positiveHigh ? level === '하' : level === '상'
  const color = good
    ? 'bg-emerald-100 text-emerald-700'
    : bad
      ? 'bg-red-100 text-red-700'
      : 'bg-amber-100 text-amber-700'
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${color}`}>
      {label} {level}
    </span>
  )
}

function LockedTeaser({
  count,
  onClick,
  loading,
}: {
  count: number
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
  loading: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-4">
      {/* 흐릿한 가짜 행 */}
      <div className="space-y-1.5 opacity-30 blur-[3px]">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5"
          >
            <span className="h-3 w-32 rounded bg-slate-300" />
            <span className="h-3 w-16 rounded bg-slate-300" />
          </div>
        ))}
      </div>

      {/* 잠금 오버레이 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50/40 to-emerald-50/95 px-4 text-center">
        <p className="mb-1 text-sm font-bold text-slate-900">
          🔒 나머지 <span className="text-emerald-600">{count}개</span> 키워드는 가려져 있어요
        </p>
        <p className="mb-3 text-[11px] leading-relaxed text-slate-600">
          어떤 키워드부터 공략해야 방문자가 빨리 느는지, 진입 전략까지
          <br />
          텔레그램에서 풀로 받아보세요.
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
          {loading ? '연결 중...' : '잠금 해제 — 전체 키워드 전략 받기'}
        </a>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <section className="animate-pulse rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-3 h-3 w-32 rounded bg-slate-200" />
      <div className="mb-5 h-5 w-48 rounded bg-slate-200" />
      <div className="mb-4 h-24 rounded-xl bg-slate-100" />
      <div className="space-y-2">
        <div className="h-12 rounded-lg bg-slate-100" />
        <div className="h-12 rounded-lg bg-slate-100" />
        <div className="h-12 rounded-lg bg-slate-100" />
      </div>
    </section>
  )
}

function fmt(n: number | null, suffix: string, isFloat = false): string {
  if (n === null) return '—'
  if (isFloat) return `${suffix}${n.toFixed(2)}`
  return `${n.toLocaleString('ko-KR')}${suffix}`
}

function competitionLabel(c: AdCompetition | null): string {
  switch (c) {
    case 'Low':
      return '낮음'
    case 'Medium':
      return '보통'
    case 'High':
      return '높음'
    case 'Very High':
      return '매우 높음'
    default:
      return '—'
  }
}
