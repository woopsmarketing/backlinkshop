'use client'

/**
 * AI 검색 친화도 카드 (5차원 점수).
 *
 * "ChatGPT/Perplexity 같은 AI 검색에서 잘 잡히는지" 분석.
 * 차별화 후크 — 다른 SEO 진단 도구가 거의 다루지 않음.
 *
 * 페이지에는 5차원 점수 + 등급만 / 구체 개선 가이드는 텔레그램에서.
 */

import { useState } from 'react'
import type { AiVisibilityResult } from '@/lib/vebapi'

type Props = {
  domain: string
  data: AiVisibilityResult | null
  loading?: boolean
}

const FALLBACK_DEEPLINK = 'https://t.me/backlinkshop_seo_bot'

export function AnalyzeAiVisibility({ domain, data, loading }: Props) {
  const [ctaLoading, setCtaLoading] = useState(false)

  if (loading) return <SkeletonCard />
  if (!data || data.overall === null) return null

  const dimensions = [
    { key: 'crawlability', label: '크롤 접근성', value: data.crawlability },
    { key: 'structure', label: '구조 명확도', value: data.structure },
    { key: 'contentDepth', label: '콘텐츠 깊이', value: data.contentDepth },
    { key: 'semanticMarkup', label: '시맨틱 마크업', value: data.semanticMarkup },
    { key: 'cleanliness', label: '기술 위생도', value: data.technicalCleanliness },
  ].filter(d => d.value !== null)

  const issueCount = data.issues.length

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
        body: JSON.stringify({ domain, source: 'ai_visibility', ref }),
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
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-5 sm:p-7">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
          AI 검색 시대
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
          ChatGPT · Perplexity 친화도
        </span>
      </div>
      <h2 className="mb-3 text-base font-bold text-slate-900 sm:text-lg">
        AI 검색에서 회원님 사이트는 잘 잡힐까요?
      </h2>

      <div className="mb-5 flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
        <div
          className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold ${gradeBgColor(data.grade)}`}
        >
          {data.grade ?? '?'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            AI 친화도 종합 점수
          </p>
          <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {data.overall ?? 0}
            <span className="text-base font-bold text-slate-400">/100</span>
          </p>
          <p className="text-[11px] text-slate-500">
            {data.aiScrapable === true
              ? '✓ AI 크롤러 접근 가능'
              : data.aiScrapable === false
                ? '✗ AI 크롤러 접근 제한됨'
                : ''}
          </p>
        </div>
      </div>

      {/* 5차원 점수 */}
      {dimensions.length > 0 && (
        <div className="mb-5 space-y-2.5">
          {dimensions.map(d => (
            <DimensionBar key={d.key} label={d.label} value={d.value as number} />
          ))}
        </div>
      )}

      {/* 잠금 — 구체 개선 가이드 */}
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-indigo-300 bg-white/60 p-4">
        <div className="space-y-1.5 opacity-30 blur-[3px]">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 flex-1 rounded bg-slate-300" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/40 to-white/95 px-4 text-center">
          <p className="mb-1 text-sm font-bold text-slate-900">
            🔒 발견된 <span className="text-indigo-600">{issueCount || '여러'}개 AI SEO 문제</span>
            의 구체적 개선 방법
          </p>
          <p className="mb-3 text-[11px] leading-relaxed text-slate-600">
            <strong>llms.txt 누락, JSON-LD 부족, robots.txt AI 봇 차단</strong> 등<br />
            ChatGPT/Perplexity 검색에서 노출되려면 어떻게 고쳐야 하는지 알려드립니다.
          </p>
          <a
            href="https://t.me/backlinkshop_seo_bot"
            onClick={handleClick}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 ${
              ctaLoading ? 'opacity-70' : ''
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
            {ctaLoading ? '연결 중...' : 'AI SEO 정밀 진단 받기'}
          </a>
        </div>
      </div>
    </section>
  )
}

function DimensionBar({ label, value }: { label: string; value: number }) {
  // VebAPI 의 5차원 점수가 0-20 스케일일 수 있어 자동 정규화
  const max = value <= 25 ? 20 : 100
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">
          {Math.round(value)}
          <span className="text-slate-400">/{max}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div
          className={`h-full ${color}`}
          style={{ width: `${pct}%`, transition: 'width 0.8s ease-out' }}
        />
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <section className="animate-pulse rounded-2xl bg-indigo-50/30 p-5 sm:p-7">
      <div className="mb-3 h-3 w-32 rounded bg-slate-200" />
      <div className="mb-4 h-5 w-64 rounded bg-slate-200" />
      <div className="mb-5 h-20 rounded-xl bg-white/60" />
      <div className="space-y-2">
        <div className="h-6 rounded bg-white/60" />
        <div className="h-6 rounded bg-white/60" />
        <div className="h-6 rounded bg-white/60" />
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
      return 'bg-slate-200 text-slate-700'
  }
}
