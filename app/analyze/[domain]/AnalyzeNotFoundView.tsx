'use client'

import Link from 'next/link'
import { AnalyzeTelegramCTA } from './AnalyzeTelegramCTA'

export function AnalyzeNotFoundView({ domain }: { domain: string }) {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          <span className="break-all text-orange-500">{domain}</span> 의 진단 기록이 없어요
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          해당 도메인으로 분석 요청을 접수한 적이 없거나, 30일 이상 경과되어 기록이 만료되었을 수
          있습니다. 홈에서 무료 진단을 다시 신청하거나 전문가에게 바로 상담해보세요.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-4 text-base font-bold text-slate-900 sm:text-lg">다음 단계</h2>
        <div className="space-y-3">
          <Link
            href="/lp/seo"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-orange-500 bg-white px-6 py-4 text-base font-semibold text-orange-600 transition-colors hover:bg-orange-50"
          >
            무료 SEO 진단 다시 신청
          </Link>
          <AnalyzeTelegramCTA
            domain={domain}
            placement="notfound"
            label="전문가에게 바로 상담 요청"
            subLabel="평균 응답 5~15분"
          />
        </div>
      </section>
    </div>
  )
}
