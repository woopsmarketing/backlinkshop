'use client'

/**
 * 우선순위 1~3순위 미리보기 카드.
 *
 * 분석 결과에 따라 가장 빠른 작업 순서 3가지를 추정해서 보여준다.
 * "전체 작업 가이드 + 견적은 텔레그램에서" 로 자연스럽게 유도.
 */

import { useMemo, useState } from 'react'
import type { ParsedFields, CompetitorMetrics } from '@/lib/lp-metrics'

type Props = {
  domain: string
  parsed: ParsedFields | null
  customerMetrics: CompetitorMetrics | null
  competitorAverage: CompetitorMetrics | null
}

type Priority = {
  order: number
  title: string
  duration: string
  expectedGain: string
  why: string
}

const FALLBACK_DEEPLINK = 'https://t.me/backlinkshop_seo_bot'

export function AnalyzePriorityPreview({
  domain,
  parsed,
  customerMetrics,
  competitorAverage,
}: Props) {
  const [loading, setLoading] = useState(false)

  const priorities = useMemo<Priority[]>(() => {
    const out: Priority[] = []
    if (!parsed) return out

    // 점수 매겨서 정렬할 후보들
    const candidates: { score: number; p: Omit<Priority, 'order'> }[] = []

    // 메타태그
    const titleLen = parsed.titleLength ?? parsed.title?.length ?? 0
    const mdLen = parsed.metaDescriptionLength ?? 0
    const titleBad = !(titleLen >= 10 && titleLen <= 60)
    const mdBad = !(mdLen >= 50 && mdLen <= 160)
    if (titleBad || mdBad) {
      candidates.push({
        score: 10,
        p: {
          title: '메타태그 + H1 정리',
          duration: '1~2주',
          expectedGain: '검색 노출 클릭률 1.5~2배',
          why: '검색 결과에서 직접 클릭 받는 첫 관문 — 가장 빠르게 효과',
        },
      })
    }

    // 페이지 속도
    const loadMs = parsed.loadTimeMs ?? null
    if (loadMs !== null && loadMs > 1500) {
      candidates.push({
        score: loadMs > 3000 ? 9 : 7,
        p: {
          title: '페이지 속도 개선',
          duration: '약 1주',
          expectedGain: '이탈률 20~30% 감소 · 매출 직접 영향',
          why: `현재 ${(loadMs / 1000).toFixed(1)}초 — Google 권장 1.5초 이하`,
        },
      })
    }

    // 백링크
    const myBl = customerMetrics?.ahrefsBacklinks ?? customerMetrics?.backlinkTotal ?? null
    const avgBl = competitorAverage?.ahrefsBacklinks ?? competitorAverage?.backlinkTotal ?? null
    if (myBl !== null && avgBl !== null && avgBl > 0 && myBl < avgBl * 0.5) {
      candidates.push({
        score: 8,
        p: {
          title: '백링크 우선순위 10건 확보',
          duration: '1~2개월',
          expectedGain: `키워드 3~5개 1페이지 진입 · 월 문의 1.5~3배`,
          why: `경쟁사 평균 ${Math.round(avgBl).toLocaleString('ko-KR')}개 vs 회원님 ${Math.round(myBl).toLocaleString('ko-KR')}개 — 격차 좁히면 매출 직결`,
        },
      })
    }

    // 이미지 alt
    const imgNoAlt = parsed.imgWithoutAlt ?? 0
    if (imgNoAlt >= 10) {
      candidates.push({
        score: 5,
        p: {
          title: `이미지 alt 일괄 추가 (${imgNoAlt}건)`,
          duration: '약 3~5일',
          expectedGain: '이미지 검색 노출 + 접근성 향상',
          why: 'Google 이미지 검색에서 누락 중',
        },
      })
    }

    // 구조화 데이터
    if (parsed.hasStructuredData !== true) {
      candidates.push({
        score: 6,
        p: {
          title: '구조화 데이터 (Schema.org) 추가',
          duration: '약 1주',
          expectedGain: '리치 결과 노출 — 클릭률 30% 향상',
          why: '검색 결과에서 별점/가격/FAQ 같은 부가 정보 표시 가능',
        },
      })
    }

    // 점수 내림차순 → 상위 3개
    candidates.sort((a, b) => b.score - a.score)
    return candidates.slice(0, 3).map((c, i) => ({ ...c.p, order: i + 1 }))
  }, [parsed, customerMetrics, competitorAverage])

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
        body: JSON.stringify({ domain, source: 'priority_preview', ref }),
      })
      const data = await res.json().catch(() => null)
      window.open(data?.deeplink || FALLBACK_DEEPLINK, '_blank', 'noopener,noreferrer')
    } catch {
      window.open(FALLBACK_DEEPLINK, '_blank', 'noopener,noreferrer')
    } finally {
      setLoading(false)
    }
  }

  if (priorities.length === 0) return null

  return (
    <section className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-5 sm:p-7">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
          매출 직결 우선순위
        </span>
      </div>
      <h2 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
        이 사이트에서 <span className="text-orange-600">매출이 가장 빨리 늘어나는 작업 순서</span>
      </h2>
      <p className="mb-5 text-sm leading-relaxed text-slate-600">
        진단 결과를 기준으로, 회원님 사이트에 가장 빠른 효과가 나오는 순서로 정리했어요.
      </p>

      <div className="space-y-3">
        {priorities.map(p => (
          <div key={p.order} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-base font-extrabold text-white">
              {p.order}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 sm:text-base">{p.title}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  ⏱ {p.duration}
                </span>
                <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  📈 {p.expectedGain}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{p.why}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-slate-900">
          🎯 더 정밀한 분석 → 매출 상승 전략
        </p>
        <ul className="mb-4 space-y-1.5 text-xs text-slate-600">
          <li>
            • <strong>4~5순위</strong> 작업까지 전체 가이드
          </li>
          <li>
            • <strong>3~6개월 내 1페이지 진입 가능</strong> 키워드 3~5개 추정
          </li>
          <li>
            • 회원님 업종/규모와 비슷한 <strong>실제 매출 상승 사례</strong>
          </li>
          <li>
            • 각 작업별 <strong>정확한 견적</strong>
          </li>
        </ul>
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
          {loading ? '연결 중...' : '텔레그램에서 정밀 분석 + 매출 상승 가이드 받기'}
        </a>
        <p className="mt-2 text-center text-[11px] text-slate-500">
          평균 응답 5~15분 · 회원가입 불필요 · 견적 부담 없음
        </p>
      </div>
    </section>
  )
}
