'use client'

/**
 * 카테고리별 점수 카드 — 기술 / 콘텐츠 / 속도 / 백링크 4분류.
 *
 * 50개 진단 항목을 카테고리로 묶어서 한눈에 어디가 약한지 보이게 한다.
 * 점수는 0~100, 색상은 good(>=70) / warn(40-69) / bad(<40).
 */

import { useMemo } from 'react'
import type { ParsedFields, CompetitorMetrics } from '@/lib/lp-metrics'

type Props = {
  parsed: ParsedFields | null
  customerMetrics: CompetitorMetrics | null
  competitorAverage: CompetitorMetrics | null
}

type Category = {
  key: string
  label: string
  icon: string
  score: number
  hint: string
}

export function AnalyzeCategoryScores({ parsed, customerMetrics, competitorAverage }: Props) {
  const categories = useMemo<Category[]>(() => {
    if (!parsed) return []

    // 1) 기술 SEO 점수
    let techScore = 0
    let techMax = 0
    const techChecks: [boolean | undefined, number][] = [
      [parsed.isHttps, 15],
      [parsed.hasViewport, 10],
      [parsed.hasCharset, 5],
      [parsed.hasFavicon, 5],
      [parsed.hasOgTitle, 10],
      [parsed.hasOgDescription, 10],
      [parsed.hasOgImage, 10],
      [parsed.hasStructuredData, 15],
      [parsed.hasHsts, 5],
      [parsed.hasGzip, 5],
      [(parsed.redirectCount ?? 0) <= 1, 10],
    ]
    for (const [ok, w] of techChecks) {
      techMax += w
      if (ok) techScore += w
    }
    const techPct = techMax ? Math.round((techScore / techMax) * 100) : 0

    // 2) 콘텐츠 점수
    let contentScore = 0
    let contentMax = 0
    const titleLen = parsed.titleLength ?? parsed.title?.length ?? 0
    const titleOk = titleLen >= 10 && titleLen <= 60
    const mdLen = parsed.metaDescriptionLength ?? 0
    const mdOk = mdLen >= 50 && mdLen <= 160
    const h1Ok = Array.isArray(parsed.h1) && parsed.h1.length === 1
    const wcOk = (parsed.wordCount ?? 0) >= 300
    const imgAltOk = (parsed.imgWithoutAlt ?? 0) === 0
    const contentChecks: [boolean, number][] = [
      [titleOk, 20],
      [mdOk, 20],
      [h1Ok, 20],
      [wcOk, 20],
      [imgAltOk, 20],
    ]
    for (const [ok, w] of contentChecks) {
      contentMax += w
      if (ok) contentScore += w
    }
    const contentPct = contentMax ? Math.round((contentScore / contentMax) * 100) : 0

    // 3) 속도 점수
    let speedPct = 50
    const loadMs = parsed.loadTimeMs ?? null
    if (loadMs !== null) {
      if (loadMs <= 1000) speedPct = 100
      else if (loadMs <= 1500) speedPct = 85
      else if (loadMs <= 2500) speedPct = 60
      else if (loadMs <= 4000) speedPct = 35
      else speedPct = 15
    }

    // 4) 백링크 점수 (경쟁사 평균 대비)
    let backlinkPct = 50
    const myBl = customerMetrics?.ahrefsBacklinks ?? customerMetrics?.backlinkTotal ?? null
    const avgBl = competitorAverage?.ahrefsBacklinks ?? competitorAverage?.backlinkTotal ?? null
    if (myBl !== null && avgBl !== null && avgBl > 0) {
      const ratio = (myBl / avgBl) * 100
      backlinkPct = Math.max(5, Math.min(100, Math.round(ratio)))
    } else if (myBl === 0) {
      backlinkPct = 10
    }

    return [
      {
        key: 'tech',
        label: '기술 SEO',
        icon: '⚙️',
        score: techPct,
        hint: techPct >= 70 ? '안정적' : techPct >= 40 ? '보강 권장' : '시급한 보강 필요',
      },
      {
        key: 'content',
        label: '콘텐츠',
        icon: '📝',
        score: contentPct,
        hint:
          contentPct >= 70
            ? '검색 친화적'
            : contentPct >= 40
              ? '키워드/메타 정리 권장'
              : '메타·H1 정리 시급',
      },
      {
        key: 'speed',
        label: '페이지 속도',
        icon: '⚡',
        score: speedPct,
        hint: speedPct >= 70 ? '빠름' : speedPct >= 40 ? '체감 가능한 지연' : '이탈률 직접 영향',
      },
      {
        key: 'backlink',
        label: '백링크 경쟁력',
        icon: '🔗',
        score: backlinkPct,
        hint:
          backlinkPct >= 70
            ? '경쟁사 수준'
            : backlinkPct >= 40
              ? '경쟁사 대비 부족'
              : '경쟁사 대비 매우 부족 — 매출 직결',
      },
    ]
  }, [parsed, customerMetrics, competitorAverage])

  if (categories.length === 0) return null

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
          한눈에 진단
        </span>
      </div>
      <h2 className="mb-1 text-base font-bold text-slate-900 sm:text-lg">카테고리별 SEO 점수</h2>
      <p className="mb-5 text-xs text-slate-500">
        50개 항목을 4개 카테고리로 묶어 한눈에 어디가 약한지 확인하세요.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map(c => (
          <CategoryCard key={c.key} category={c} />
        ))}
      </div>
    </section>
  )
}

function CategoryCard({ category: c }: { category: Category }) {
  const level = c.score >= 70 ? 'good' : c.score >= 40 ? 'warn' : 'bad'
  const colors = {
    good: { ring: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50' },
    warn: { ring: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50' },
    bad: { ring: '#ef4444', text: 'text-red-600', bg: 'bg-red-50' },
  }[level]

  const circumference = 2 * Math.PI * 28
  const offset = circumference - (c.score / 100) * circumference

  return (
    <div className={`flex flex-col items-center rounded-xl ${colors.bg} p-4`}>
      <div className="relative h-20 w-20">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={colors.ring}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl">{c.icon}</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-700">{c.label}</p>
      <p className={`mt-0.5 text-lg font-extrabold ${colors.text}`}>{c.score}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-slate-500 text-center">{c.hint}</p>
    </div>
  )
}
