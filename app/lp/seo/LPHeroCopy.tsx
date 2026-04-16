'use client'

import { useSearchParams } from 'next/navigation'

type Variant = {
  badge: string
  h1a: string
  h1b: string
  sub: string
  bullets: string[]
}

const VARIANTS: Record<string, Variant> = {
  backlink: {
    badge: '백링크 + SEO 통합 서비스',
    h1a: '고품질 백링크로',
    h1b: '구글 1페이지 진입',
    sub: '백링크 구매 전, 내 사이트에 필요한 항목을 10분 안에 무료로 확인하세요.',
    bullets: [
      '가입 즉시 20만 크레딧 무료 지급',
      'DA 30+ 검증 도메인 기반 백링크',
      '백링크 1건부터 맞춤 구매 가능',
      '진단 보고서 이메일 자동 발송',
    ],
  },
  rank: {
    badge: '구글 상위노출 전문',
    h1a: '구글 1페이지,',
    h1b: '지금 무료로 시작하세요',
    sub: '검색 순위가 낮은 진짜 이유를 10분 안에 무료로 진단해드립니다.',
    bullets: [
      '0~100점 종합 SEO 점수 즉시 확인',
      '상위노출 방해 요소 상세 리포트',
      '가입만 하면 20만원 상당 진단 무료',
      '10~20분 내 이메일로 보고서 발송',
    ],
  },
  audit: {
    badge: 'SEO 진단·분석 전문',
    h1a: '내 사이트 SEO,',
    h1b: '10분 만에 무료 진단',
    sub: '50개 이상 항목을 정밀 분석해 구체적 개선안을 알려드립니다.',
    bullets: [
      '0~100점 종합 SEO 점수 즉시 확인',
      '기술적 문제점 + 개선 방향 리포트',
      '가입만 하면 20만원 상당 진단 무료',
      '10~20분 내 이메일로 보고서 발송',
    ],
  },
  agency: {
    badge: '에이전시·B2B 전용',
    h1a: 'SEO 대행 전,',
    h1b: '진단부터 받아보세요',
    sub: '에이전시와 자영업자를 위한 SEO 통합 진단·대행. 카드 등록 없이 즉시 시작.',
    bullets: [
      '가입 즉시 20만 크레딧 무료 지급',
      '내부 SEO + 백링크 통합 진단',
      'B2B 전담 상담 가능',
      '이메일 리포트 자동 발송',
    ],
  },
}

const DEFAULT: Variant = VARIANTS.rank

export function LPHeroCopy() {
  const params = useSearchParams()
  const ref = params?.get('ref') || ''
  const variant = VARIANTS[ref] || DEFAULT

  return (
    <>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 text-cyan-400 text-sm font-semibold mb-6">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        {variant.badge}
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
        {variant.h1a}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
          {variant.h1b}
        </span>
      </h1>

      <p className="text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
        {variant.sub}
      </p>
    </>
  )
}
