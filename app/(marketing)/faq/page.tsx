/**
 * 자주 묻는 질문 /faq
 *
 * ⚠️ URL 보존 규칙
 * 이 경로는 Google Ads 사이트링크가 직접 연결된 주소다. 세그먼트를 바꾸거나 리다이렉트로 옮기면
 * 광고 확장이 끊긴다. 경로를 변경하지 않는다.
 *
 * ⚠️ 구조화 데이터 규칙
 * FaqSchema 는 이 페이지에서 정확히 한 번만 출력한다. 화면에는 FAQ_ITEMS 전체가 카테고리별로
 * 나뉘어 모두 렌더링되므로, 스키마에도 FAQ_ITEMS 전체를 그대로 넘겨 화면과 일치시킨다.
 * (카테고리별로 FaqSchema 를 나눠 넣으면 FAQPage 가 여러 개 출력되어 무효 처리된다.)
 */
import type { Metadata } from 'next'
import { Fragment, type ReactNode } from 'react'
import Link from 'next/link'

import { Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { FAQSection } from '@/components/marketing/FAQSection'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedArticles } from '@/components/content/RelatedArticles'
import { FaqSchema } from '@/components/seo/FaqSchema'

import { FAQ_ITEMS, FAQ_CATEGORIES, getFaqByCategory, type FaqCategory } from '@/config/faq'
import { ctaLabel } from '@/config/cta'
import { PRICING, formatKrw } from '@/config/pricing'
import { SEO_GRAPH, resolveArticles, pageLabel } from '@/config/seo-graph'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '백링크·SEO 자주 묻는 질문',
  description:
    '백링크 효과, PBN 구성, 작업 과정, 비용, 확인 시점, 환불까지 상담 전에 많이 받는 질문을 카테고리별로 정리했습니다. 실제 상담에서 드리는 설명과 같은 기준으로 답했습니다.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: '백링크·SEO 자주 묻는 질문 | 백링크샵',
    description:
      '상담 전에 확인해 두면 좋은 질문을 여섯 묶음으로 나눠 정리했습니다. 답변은 실제 상담에서 드리는 설명과 같은 기준으로 작성했습니다.',
    url: '/faq',
  },
}

/**
 * 본문 문맥 링크로 이미 다루는 경로. RelatedContent 카드에서는 제외한다.
 * /refund 는 '환불 · 정책' 안내문 안에서 문장으로 연결하므로 하단 카드에 중복 노출하지 않는다.
 */
const CONTEXT_LINKED_PAGES: string[] = ['/refund']

/** 서비스별 시작가 중 가장 낮은 값. 숫자를 직접 쓰지 않고 config/pricing.ts 에서 계산한다. */
const LOWEST_START_PRICE = Math.min(...PRICING.map(group => group.from))

/**
 * 카테고리 → 앵커 슬러그·헤딩·안내문 매핑.
 *
 * 슬러그를 한글 카테고리명 대신 여기서 고정하는 이유
 *  1) 앵커 URL(#faq-pbn 등)이 카테고리 문구를 다듬어도 깨지지 않는다.
 *  2) FAQSection 이 아코디언 항목마다 `faq-<item.id>` 를 id 로 쓴다. 항목 id 중 `process` 가 있어
 *     '작업 과정' 을 `faq-process` 로 두면 DOM id 가 충돌한다. 그래서 `faq-workflow` 를 쓴다.
 */
const CATEGORY_META: Record<
  FaqCategory,
  { slug: string; eyebrow: string; heading: string; intro: ReactNode }
> = {
  '백링크 기본': {
    slug: 'faq-basics',
    eyebrow: '02 / 백링크 기본',
    heading: '백링크가 무엇을 바꾸고, 무엇은 바꾸지 못하는지',
    intro:
      '백링크를 처음 알아보는 단계에서는 "효과가 있느냐"가 가장 큰 질문입니다. 그런데 실제로 판단이 갈리는 지점은 효과의 유무가 아니라, 지금 이 사이트에서 링크가 정말 병목인지 아닌지입니다. 아래 세 질문은 그 구분을 먼저 하기 위한 것입니다.',
  },
  PBN: {
    slug: 'faq-pbn',
    eyebrow: '03 / PBN',
    heading: 'PBN을 두고 설명이 가장 많이 갈리는 부분',
    intro:
      'PBN은 소개하는 곳마다 쓰는 표현이 달라서 제안을 나란히 놓고 비교하기가 어렵습니다. 어떤 구조로 만들어지고 어느 지점에서 품질 차이가 생기는지를 알면, 받은 제안이 어느 쪽에 가까운지 스스로 가늠할 수 있습니다.',
  },
  '작업 과정': {
    slug: 'faq-workflow',
    eyebrow: '04 / 작업 과정',
    heading: '시작하기 전에 정해지는 것과, 끝나고 남는 것',
    intro:
      '외부에 작업을 맡길 때 가장 불안한 부분은 결과보다 과정입니다. 어디까지가 합의된 범위이고 작업이 끝난 뒤 무엇을 확인할 수 있는지가 미리 정해져 있으면, 진행 도중에 해석이 엇갈릴 일이 줄어듭니다.',
  },
  가격: {
    slug: 'faq-pricing',
    eyebrow: '05 / 가격',
    heading: '같은 이름의 서비스인데 견적이 달라지는 이유',
    intro: (
      <>
        금액만 나란히 놓고 비교하면 정작 무엇을 사는지가 보이지 않습니다. 공개된 시작가는 서비스에
        따라 {formatKrw(LOWEST_START_PRICE)}부터이고, 그 위로 무엇이 더해지는지는 사이트마다
        다릅니다. 구성별 표기는 <Link href="/pricing">가격을 정리한 페이지</Link>에서 함께 보실 수
        있습니다.
      </>
    ),
  },
  '결과 · 기간': {
    slug: 'faq-results',
    eyebrow: '06 / 결과와 기간',
    heading: '언제 확인하고, 무엇으로 확인하는지',
    intro:
      '기간에 대한 질문은 대개 "언제 오르나요"로 시작합니다. 다만 실무에서 더 도움이 되는 것은 상승 시점을 약속받는 일이 아니라, 어떤 지표를 어느 시점에 함께 볼지 작업 전에 정해 두는 일입니다.',
  },
  '환불 · 정책': {
    slug: 'faq-policy',
    eyebrow: '07 / 환불과 정책',
    heading: '중간에 멈추게 되면 어떻게 되는지',
    intro: (
      <>
        정책 문서는 보통 문제가 생긴 다음에 읽게 되지만, 실제로 도움이 되는 시점은 시작하기
        전입니다. 어느 지점까지 되돌릴 수 있는지가 결국 계약의 실질이기 때문입니다. 조건 전문은{' '}
        <Link href="/refund">환불 규정 문서</Link>에 그대로 공개해 두었습니다.
      </>
    ),
  },
}

export default function FaqPage() {
  const cluster = SEO_GRAPH.faq
  const relatedPages = cluster.relatedPages.filter(
    href => !CONTEXT_LINKED_PAGES.includes(href) && pageLabel(href) !== href
  )
  const articles = resolveArticles(cluster.relatedArticles)
  const tabs = FAQ_CATEGORIES.map(category => ({
    href: `#${CATEGORY_META[category].slug}`,
    label: category,
  }))

  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />

      <Breadcrumb trail={[{ href: '/faq', label: '자주 묻는 질문' }]} />

      <Hero
        eyebrow="자주 묻는 질문"
        title={
          <>
            <span className="bl-break">상담 전에 많이 묻는 질문을</span>정리했습니다.
          </>
        }
        support="메시지를 보내기 전에 확인해 두면 좋은 내용을 한 페이지에 모았습니다. 답변은 실제 상담에서 드리는 설명과 같은 기준으로 썼고, 확인할 수 없는 수치나 결과를 약속하는 문장은 넣지 않았습니다. 읽다가 우리 사이트에는 어떻게 적용되는지가 궁금해지면 그때 물어보셔도 됩니다."
        actions={
          <>
            <TelegramCTA source="faq" position="hero" label={ctaLabel('faq')} size="lg" />
            <Button href="/services" variant="secondary" size="lg">
              서비스부터 살펴보기
            </Button>
          </>
        }
      />

      <Section size="sm" subtle ariaLabelledBy="faq-map-title">
        <SectionHead
          eyebrow="01 / 질문 지도"
          id="faq-map-title"
          title="궁금한 쪽부터 보셔도 됩니다."
          lead="질문을 여섯 묶음으로 나눠 두었습니다. 백링크 자체를 처음 검토 중이라면 기본부터, 이미 다른 곳에서 견적을 받아보셨다면 가격과 작업 과정부터 보시는 편이 빠릅니다. 모든 답변은 접혀 있어도 페이지 안에 그대로 들어 있어, 브라우저 검색으로도 바로 찾을 수 있습니다."
        />
        <Tabs label="FAQ 카테고리" items={tabs} />
        <p className="bl-closing">
          답변을 읽다 보면 용어에서 걸리는 지점이 생길 수 있습니다. 그럴 때는{' '}
          <Link href="/backlink">링크가 검색엔진에 어떻게 읽히는지</Link> 먼저 보시면 나머지 질문이
          훨씬 빨리 이해됩니다.
        </p>
      </Section>

      {FAQ_CATEGORIES.map((category, index) => {
        const meta = CATEGORY_META[category]
        const items = getFaqByCategory(category)
        if (!items.length) return null
        const subtle = index % 2 === 1

        return (
          <Fragment key={meta.slug}>
            <Section size="sm" subtle={subtle}>
              <p className="bl-lead bl-measure">{meta.intro}</p>
            </Section>
            <FAQSection
              id={meta.slug}
              items={items}
              eyebrow={meta.eyebrow}
              title={meta.heading}
              subtle={subtle}
            />
          </Fragment>
        )
      })}

      <Section size="sm">
        <TelegramCTABlock
          source="faq"
          cta="faq"
          position="mid"
          title="여기에 없는 질문이 남아 있다면"
          body="사이트 주소와 목표 키워드만 알려주시면 해당되는 부분만 골라서 답해 드립니다. 견적을 먼저 요청하지 않으셔도 됩니다."
          label="남은 질문 물어보기"
        />
      </Section>

      <Section subtle ariaLabelledBy="faq-next-title">
        <SectionHead
          eyebrow="08 / 다음 단계"
          id="faq-next-title"
          title="더 길게 읽고 판단하고 싶다면"
          lead="FAQ의 답변은 요약입니다. 판단 기준을 직접 세워 두고 싶다면 아래 문서에서 같은 내용을 근거까지 펼쳐 설명해 두었습니다."
        />
        <RelatedContent heading="이어서 볼 페이지" hrefs={relatedPages} />
        <RelatedArticles heading="배경까지 정리한 글" posts={articles} />
        <p className="bl-closing">
          저희가 성과 수치를 쉽게 말하지 않는 이유가 궁금하시다면{' '}
          <Link href="/cases">사례를 공개하는 기준</Link>도 함께 보시면 이해가 빠릅니다.
        </p>
      </Section>

      <FinalCTA
        source="faq"
        cta="faq"
        title="읽어보셔도 판단이 서지 않는다면"
        body="질문이 깔끔하게 정리되지 않아도 괜찮습니다. 사이트 주소와 지금 걸리는 부분만 알려주시면 어디부터 봐야 할지 같이 정리하겠습니다."
        label="내 상황부터 이야기하기"
      />
    </>
  )
}
