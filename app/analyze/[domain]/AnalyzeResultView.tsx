'use client'

import { useMemo } from 'react'
import type { AnalyzeReport } from './AnalyzeClient'
import { AnalyzeTelegramCTA } from './AnalyzeTelegramCTA'
import { buildMetrics, type ParsedFields } from '@/lib/lp-metrics'

type Props = {
  domain: string
  url: string | null
  keyword: string | null
  report: AnalyzeReport
  analyzedAt: string | null
}

export function AnalyzeResultView({ domain, url, keyword, report, analyzedAt }: Props) {
  const parsed = (report?.parsedData ?? {}) as ParsedFields
  const score = typeof report?.score === 'number' ? report.score : null
  const analysisHtml = typeof report?.analysisHtml === 'string' ? report.analysisHtml : ''

  const metrics = useMemo(() => buildMetrics(parsed), [parsed])

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

      {score !== null && <ScoreCard score={score} />}

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-4 text-base font-bold text-slate-900 sm:text-lg">
          핵심 지표 ({metrics.length}개 항목)
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {metrics.map(m => (
            <li
              key={m.label}
              className={`rounded-xl border p-3 ${
                m.level === 'good'
                  ? 'border-emerald-200 bg-emerald-50'
                  : m.level === 'warn'
                    ? 'border-amber-200 bg-amber-50'
                    : m.level === 'bad'
                      ? 'border-rose-200 bg-rose-50'
                      : 'border-slate-200 bg-slate-50'
              }`}
            >
              <p className="mb-1 text-xs font-medium text-slate-500">{m.label}</p>
              <p className="text-sm font-bold text-slate-900">{m.value}</p>
              {m.hint && <p className="mt-1 text-[11px] text-slate-500">{m.hint}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border-2 border-emerald-500 bg-white p-5 sm:p-7">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
            전문가 상담
          </span>
          <span className="text-xs text-slate-500">보고서만으로 부족한 실행 전략</span>
        </div>
        <h2 className="mb-2 text-lg font-bold text-slate-900 sm:text-xl">
          지금 바로 텔레그램으로 질문하세요
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          분석 결과만으로 부족한 부분이 있죠. <br className="hidden sm:block" />
          <strong>어떤 키워드부터 공략해야 빠른지</strong>,{' '}
          <strong>경쟁사 대비 약점을 어떻게 뒤집을지</strong> 5~15분 안에 답변드립니다.
        </p>
        <AnalyzeTelegramCTA label="텔레그램 1:1 상담 시작" subLabel="평균 응답 5~15분" />
      </section>

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
          이제 실행만 남았어요
        </h2>
        <p className="mb-5 text-sm text-slate-300 sm:text-base">
          전문가가 도메인 상태에 맞는 가장 빠른 상위 노출 루트를 알려드립니다
        </p>
        <AnalyzeTelegramCTA label="텔레그램으로 전문가 상담 시작" subLabel="채널: @goat82" />
      </section>
    </div>
  )
}

function ScoreCard({ score }: { score: number }) {
  const tone = score >= 80 ? 'emerald' : score >= 60 ? 'amber' : 'rose'
  const tones: Record<string, { text: string; ring: string; label: string }> = {
    emerald: { text: 'text-emerald-600', ring: 'ring-emerald-200', label: '우수' },
    amber: { text: 'text-amber-600', ring: 'ring-amber-200', label: '개선 필요' },
    rose: { text: 'text-rose-600', ring: 'ring-rose-200', label: '집중 개선' },
  }
  const t = tones[tone]

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">종합 SEO 점수</p>
          <p className={`text-4xl font-bold ${t.text} sm:text-5xl`}>
            {score}
            <span className="text-xl text-slate-400">/100</span>
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ring-2 ${t.ring} ${t.text} bg-white`}
        >
          {t.label}
        </span>
      </div>
    </section>
  )
}
