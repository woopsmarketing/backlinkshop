'use client'

/**
 * 분석 결과 페이지의 풀 CTA 섹션 (상단/하단 양쪽에서 재사용).
 *
 * - 상단(top): "더 깊이 보고 싶으시다면" Hero 톤 — 페이지 진입 즉시 가치 노출
 * - 하단(bottom): "여기까지는 시작일 뿐" 마무리 톤 — 콘텐츠 다 보고 결정 단계
 *
 * 두 위치 모두 동일한 가치 그리드 + 비교 표 + 안심 알약을 보여줘서
 * 사용자가 어디서 결정하든 동일한 정보로 텔레그램 진입 가능하게 한다.
 */

import { AnalyzeTelegramCTA } from './AnalyzeTelegramCTA'
import type { EnrichmentResponse } from '@/app/api/analyze/enrichment/route'

type Props = {
  domain: string
  enrichment?: EnrichmentResponse | null
  variant: 'top' | 'bottom'
}

export function AnalyzeFullCTA({ domain, enrichment, variant }: Props) {
  const isTop = variant === 'top'

  const hiddenKeywords = Math.max(0, (enrichment?.keywordIdeas?.length ?? 0) - 3)
  const aiIssues = enrichment?.aiVisibility?.issues?.length ?? 0
  const precisionIssues = enrichment?.analyzeV2?.priorityIssues?.length ?? 0

  const lockedItems = [
    {
      icon: '🎯',
      title: `매출 기회 키워드 ${hiddenKeywords > 0 ? `${hiddenKeywords}개+` : '전체'} 풀 공개`,
      desc: '진입 우선순위·상업적 가치·공략 난이도까지',
    },
    {
      icon: '📈',
      title: '어떤 키워드부터 공략할지 실행 순서',
      desc: '방문자를 가장 빨리 늘릴 키워드 로드맵',
    },
    {
      icon: '🤖',
      title: `AI 검색 SEO 문제 ${aiIssues > 0 ? `${aiIssues}개` : ''} 구체 가이드`,
      desc: 'ChatGPT/Perplexity에서 노출되려면 뭘 고쳐야 하는지',
    },
    {
      icon: '⚙️',
      title: `정밀 진단 이슈 ${precisionIssues > 0 ? `${precisionIssues}개` : ''} 우선순위`,
      desc: '어떤 이슈부터 고쳐야 매출이 빨리 오르는지',
    },
  ]

  const additionalItems = [
    {
      icon: '💰',
      title: '회원님 사업 기준 매출 시뮬레이션',
      desc: '객단가·전환율·마진 반영한 실제 매출 증가분 예상',
    },
    {
      icon: '🚀',
      title: '3~6개월 내 1페이지 진입 가능 키워드',
      desc: '주력 키워드 3~5개 구체 추정 + 진입 기간',
    },
    {
      icon: '🏆',
      title: '회원님 업종의 실제 매출 상승 사례',
      desc: '비슷한 도메인이 어떤 작업으로 얼마나 늘었는지',
    },
    {
      icon: '📋',
      title: '작업별 정확한 견적',
      desc: '백링크/콘텐츠/속도/온페이지 별 맞춤 견적',
    },
  ]

  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 text-white sm:p-10">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300">
          {isTop ? '🚀 더 깊이 보고 싶으신가요?' : '🔓 텔레그램 문의로만 받을 수 있는 것'}
        </div>
        {isTop ? (
          <h2 className="mb-4 text-xl font-extrabold leading-tight text-white sm:text-3xl">
            아래 진단 결과를 <span className="text-emerald-400">매출로 직접 연결</span>하고
            싶으시다면
            <br className="hidden sm:block" />
            정밀 분석을 텔레그램에서 받아보세요.
          </h2>
        ) : (
          <h2 className="mb-4 text-xl font-extrabold leading-tight text-white sm:text-3xl">
            여기까지는 <span className="text-slate-400">시작일 뿐</span>입니다.
            <br />
            <span className="text-emerald-400">방문자→매출까지의 진짜 길</span>은
            <br className="sm:hidden" /> 텔레그램에서 받아보세요.
          </h2>
        )}
        <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          {isTop ? (
            <>
              아래 결과만 봐도 도움 되시지만,{' '}
              <strong className="text-white">방문자를 늘리고 매출까지 끌어올리려면</strong> 도메인
              상태와 사업 규모에 맞춘 구체 가이드가 필요합니다.
              <br className="hidden sm:block" />
              <strong className="text-emerald-300">
                아래 8가지를 텔레그램에서 풀로 받아보세요.
              </strong>
            </>
          ) : (
            <>
              위 진단은 <strong className="text-white">증상을 짚어드린 것</strong>이고, 이걸 실제로
              매출로 연결하는 단계는 회원님 도메인 상태/업종/예산을 같이 봐야 합니다.
              <br className="hidden sm:block" />
              <strong className="text-emerald-300">
                아래 8가지를 텔레그램에서 풀로 받아보세요.
              </strong>
            </>
          )}
        </p>
      </div>

      {/* 잠금 해제될 데이터 */}
      <div className="mb-6">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
          <span className="inline-block h-1 w-6 rounded bg-emerald-400" />
          🔓 페이지에서 잠겨있는 데이터
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {lockedItems.map(item => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 backdrop-blur"
            >
              <span className="text-lg">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 추가로만 받을 수 있는 것 */}
      <div className="mb-8">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
          <span className="inline-block h-1 w-6 rounded bg-emerald-400" />
          💎 텔레그램에서만 받을 수 있는 추가 분석
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {additionalItems.map(item => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-xl bg-emerald-500/10 px-4 py-3 backdrop-blur"
            >
              <span className="text-lg">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 비교 안내 */}
      <div className="mb-6 rounded-xl bg-white/5 p-4 backdrop-blur sm:p-5">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
          한눈에 비교
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <p className="mb-2 font-semibold text-slate-400">현재 페이지에서</p>
            <ul className="space-y-1 text-slate-500">
              <li>
                · 관련 키워드 <strong className="text-slate-300">3개</strong>
              </li>
              <li>
                · 노출 키워드 <strong className="text-slate-300">3개</strong>
              </li>
              <li>
                · AI/정밀 진단 <strong className="text-slate-300">점수만</strong>
              </li>
              <li>
                · 우선순위 <strong className="text-slate-300">3개 미리보기</strong>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold text-emerald-300">텔레그램 문의 시</p>
            <ul className="space-y-1 text-slate-200">
              <li>
                · 관련 키워드 <strong className="text-emerald-300">전체 + 분석</strong>
              </li>
              <li>
                · 노출 키워드 <strong className="text-emerald-300">전체 + 우선순위</strong>
              </li>
              <li>
                · AI/정밀 진단 <strong className="text-emerald-300">구체 개선 가이드</strong>
              </li>
              <li>
                · 우선순위 <strong className="text-emerald-300">매출 시뮬 + 견적</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <AnalyzeTelegramCTA
        domain={domain}
        placement={isTop ? 'result_top' : 'result_bottom'}
        label="🚀 텔레그램에서 전체 데이터 + 매출 가이드 받기"
        subLabel="평균 응답 5~15분 · 운영자가 직접 답변드립니다"
      />

      {/* 안심 알약 */}
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {['✓ 회원가입 없음', '✓ 카드 등록 없음', '✓ 자동 결제 없음', '✓ 견적 부담 없음'].map(
          label => (
            <span
              key={label}
              className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-200 backdrop-blur"
            >
              {label}
            </span>
          )
        )}
      </div>
    </section>
  )
}
