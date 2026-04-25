'use client'

import { AnalyzeTelegramCTA } from './AnalyzeTelegramCTA'

type Props = {
  domain: string
  url: string | null
  keyword: string | null
}

export function AnalyzeFailedView({ domain, url, keyword }: Props) {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border-2 border-rose-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
            자동 분석 실패
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          <span className="break-all text-orange-500">{domain}</span>
          <span className="text-slate-900"> 을(를) 자동 분석하지 못했어요</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          사이트가 크롤러를 차단하고 있거나, 일시적인 응답 오류로 분석 파이프라인이 중단되었습니다.
          <strong className="text-slate-900"> 전문가가 직접 수동 진단</strong>을 도와드립니다.
        </p>
        {keyword && (
          <p className="mt-2 text-xs text-slate-500">
            요청 키워드: <strong className="text-slate-700">{keyword}</strong>
          </p>
        )}
        {url && <p className="mt-1 break-all text-xs text-slate-400">대상 URL: {url}</p>}
      </header>

      <section className="rounded-2xl border-2 border-emerald-500 bg-white p-5 sm:p-7">
        <h2 className="mb-2 text-lg font-bold text-slate-900 sm:text-xl">
          수동 진단은 무료로 진행됩니다
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          텔레그램으로 도메인만 알려주시면 전문가가 직접 확인 후 답변드립니다. 평균 응답까지 5~15분.
        </p>
        <AnalyzeTelegramCTA
          domain={domain}
          placement="failed"
          label="텔레그램으로 수동 진단 요청"
          subLabel="평균 응답 5~15분"
        />
      </section>
    </div>
  )
}
