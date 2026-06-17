'use client'

import { useEffect, useState } from 'react'
import { AnalyzeTelegramCTA } from './AnalyzeTelegramCTA'

type Props = {
  domain: string
  url: string | null
  keyword: string | null
  status: 'pending_analysis' | 'analyzing'
}

const STEPS = [
  { key: 'scan', label: '기본 정보 스캔', seconds: 0 },
  { key: 'onpage', label: '온페이지 SEO 분석', seconds: 15 },
  { key: 'competitor', label: '경쟁 키워드 수집', seconds: 40 },
  { key: 'ai', label: 'AI 리포트 생성', seconds: 75 },
]

export function AnalyzePendingPoller({ domain, url, keyword, status }: Props) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  const activeStep = STEPS.reduce((acc, step, idx) => (elapsed >= step.seconds ? idx : acc), 0)

  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-orange-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
            {status === 'pending_analysis' ? '분석 대기 중' : '분석 진행 중'}
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          <span className="break-all text-orange-500">{domain}</span>
          <br className="sm:hidden" />
          <span className="text-slate-900"> 을(를) 분석하고 있어요</span>
        </h1>
        {keyword && (
          <p className="mt-2 text-sm text-slate-500">
            핵심 키워드{' '}
            <strong className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
              {keyword}
            </strong>{' '}
            기준으로 분석 중
          </p>
        )}
        {url && <p className="mt-1 break-all text-xs text-slate-400">{url}</p>}
      </header>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">진행 상태</p>
            <p className="text-xs text-slate-400">평균 30초~2분 소요됩니다</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums text-slate-900">
              {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
            </p>
            <p className="text-xs text-slate-400">경과 시간</p>
          </div>
        </div>

        <ol className="space-y-3">
          {STEPS.map((step, idx) => {
            const done = idx < activeStep
            const active = idx === activeStep
            return (
              <li key={step.key} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : active
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {done ? '✓' : idx + 1}
                </span>
                <span
                  className={`text-sm ${
                    active
                      ? 'font-semibold text-slate-900'
                      : done
                        ? 'text-slate-600'
                        : 'text-slate-400'
                  }`}
                >
                  {step.label}
                  {active && <span className="ml-2 inline-block animate-pulse">…</span>}
                </span>
              </li>
            )
          })}
        </ol>

        <div className="mt-6 space-y-3">
          <SkeletonBar widthClass="w-3/4" />
          <SkeletonBar widthClass="w-1/2" />
          <SkeletonBar widthClass="w-5/6" />
        </div>
      </section>

      {elapsed >= 60 && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-7">
          <p className="mb-1 text-sm font-semibold text-emerald-900">분석이 조금 길어지고 있어요</p>
          <p className="mb-4 text-sm leading-relaxed text-emerald-800">
            기다리기 어려우시면 <strong>도메인과 키워드만 알려주세요.</strong> 전문가가 사이트를
            직접 확인하고 가장 빠른 상위 노출 루트를 제안드립니다.
          </p>
          <AnalyzeTelegramCTA
            domain={domain}
            placement="pending"
            label="텔레그램에서 먼저 상담받기"
            subLabel="응답까지 보통 5~15분 · 분석 결과는 그대로 받으실 수 있어요"
          />
        </section>
      )}
    </div>
  )
}

function SkeletonBar({ widthClass }: { widthClass: string }) {
  return <div className={`h-3 animate-pulse rounded bg-slate-200 ${widthClass}`} />
}
