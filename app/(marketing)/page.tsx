/**
 * 홈 /
 *
 * ⚠️ SEO 보존 규칙
 * 이 URL 은 `백링크 구매`·`고품질 백링크`·`PBN 백링크` 3개 키워드를 잡고 있는 유일한 자산이다.
 * - URL 을 바꾸지 않는다.
 * - title 과 H1 에서 위 3개 표현을 제거하지 않는다.
 * - 하위 페이지에는 롱테일(가격·업체·구성)로 분화시키고, 대표 표현은 홈에 남긴다.
 * - 출현 횟수는 목표가 아니다. 자연스러운 자리에서만 쓰고, 숫자를 맞추려고 반복하지 않는다.
 *   (네비게이션 라벨·상품명·글 제목에서 나오는 반복은 그대로 두고 본문만 사람이 읽는 기준으로 본다)
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/layout/Container'
import { Hero } from '@/components/marketing/Hero'
import { SeoStrategyPanel } from '@/components/marketing/SeoStrategyPanel'
import { SectionHead } from '@/components/marketing/SectionHead'
import { ProblemSection } from '@/components/marketing/ProblemSection'
import { SituationSelector } from '@/components/marketing/SituationSelector'
import { ServiceGrid } from '@/components/marketing/ServiceGrid'
import { ProcessSteps } from '@/components/marketing/ProcessSteps'
import { FAQSection } from '@/components/marketing/FAQSection'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle } from '@/components/ui/Card'
import { RelatedArticles } from '@/components/content/RelatedArticles'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import { WebsiteSchema } from '@/components/seo/WebsiteSchema'

import { RANKING_FACTORS } from '@/config/services'
import { PRICING, formatKrw } from '@/config/pricing'
import { getPreviewFaq } from '@/config/faq'
import { SEO_GRAPH, resolveArticles } from '@/config/seo-graph'
import { PUBLISHED_CASES } from '@/config/cases'
import { CaseStudyCard } from '@/components/marketing/CaseStudyCard'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: { absolute: '백링크 구매 · 고품질 백링크 | 백링크샵' },
  description:
    '백링크 구매 전에 먼저 볼 것이 있습니다. 사이트 상태와 목표 키워드를 확인하고 고품질 백링크·PBN 백링크가 지금 필요한지 판단해 드립니다.',
  alternates: { canonical: '/' },
  openGraph: {
    title: '백링크 구매 · 고품질 백링크 | 백링크샵',
    description:
      '모든 사이트에 같은 백링크가 필요한 것은 아닙니다. 현재 상황을 먼저 보고 필요한 방향을 이야기합니다.',
    url: '/',
  },
}

const HOME_QUESTIONS = [
  '백링크 작업을 했는데 검색 노출이 그대로인가요?',
  '알고리즘 업데이트 때마다 순위가 크게 흔들리나요?',
  '경쟁이 심한 키워드에서 더 이상 올라가지 않나요?',
  '어떤 백링크를 선택해야 할지 기준이 없으신가요?',
]

export default function HomePage() {
  const cluster = SEO_GRAPH.home
  const articles = resolveArticles(cluster.relatedArticles)
  const faq = getPreviewFaq()
  const cases = PUBLISHED_CASES.slice(0, 2)

  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />

      <Hero
        eyebrow="SEO BACKLINK STRATEGY"
        title={
          <>
            <span className="bl-break">백링크 구매,</span>
            링크 수보다 먼저 봐야 할 것이 있습니다.
          </>
        }
        support="사이트 상태와 목표 키워드, 기존 링크 프로필이 다른데 모두에게 같은 백링크가 필요할 수는 없습니다. 현재 상황을 먼저 보고 필요한 방향을 이야기합니다."
        actions={
          <>
            <TelegramCTA source="home" position="hero" size="lg" />
            <Button href="/services" variant="secondary" size="lg">
              백링크 서비스 살펴보기
            </Button>
          </>
        }
        note="Telegram으로 연결됩니다 · 사이트 주소와 목표 키워드만 있으면 됩니다"
        visual={<SeoStrategyPanel />}
      />

      <ProblemSection
        eyebrow="01 / SITUATION"
        title={
          <>
            <span className="bl-break">백링크를 했는데도,</span>
            생각만큼 올라가지 않나요?
          </>
        }
        questions={HOME_QUESTIONS}
        closing="그렇다면 단순히 링크를 더 추가하기 전에 현재 사이트에 무엇이 부족한지부터 볼 필요가 있습니다."
        subtle
      />

      <Section ariaLabelledBy="diagnosis-title">
        <SectionHead
          eyebrow="02 / DIAGNOSIS"
          id="diagnosis-title"
          title="검색순위는 백링크 하나로만 움직이지 않습니다."
          lead="같은 링크를 받아도 결과가 다른 이유는 네 가지 조건이 함께 작용하기 때문입니다. 어디가 막혀 있는지에 따라 해야 할 일이 달라집니다."
        />
        <div className="bl-grid bl-grid--4">
          {RANKING_FACTORS.map(factor => (
            <Card key={factor.key}>
              <span className="bl-related__label">{factor.label}</span>
              <CardTitle>{factor.title}</CardTitle>
              <CardBody>{factor.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          그래서 저희는 무조건 더 많은 링크를 권하지 않습니다. 백링크 판매를 목적으로 개수를 채우는
          방식과, 지금 이 사이트에 무엇이 필요한지 판단하는 방식은 결과가 다릅니다.{' '}
          <Link href="/google-ranking">순위가 오르지 않는 이유</Link>를 먼저 정리해 두었습니다.
        </p>
      </Section>

      <Section subtle size="sm" ariaLabelledBy="situation-title">
        <SectionHead
          eyebrow="03 / START HERE"
          id="situation-title"
          title="지금 가장 가까운 상황을 선택하세요."
          lead="선택한 상황에 맞는 설명 페이지로 이동합니다. 상담 전에 먼저 읽어보셔도 됩니다."
        />
        <SituationSelector />
      </Section>

      <Section ariaLabelledBy="services-title">
        <SectionHead
          eyebrow="04 / SERVICES"
          id="services-title"
          title="문제에 맞는 작업만 구성합니다."
          lead="네 가지 작업 중 필요한 것만 골라서 진행합니다. 전부 해야 하는 경우는 많지 않습니다."
        />
        <ServiceGrid />
      </Section>

      <Section subtle ariaLabelledBy="process-title">
        <SectionHead
          eyebrow="05 / PHILOSOPHY"
          id="process-title"
          title={
            <>
              <span className="bl-break">백링크를 추가하는 것보다</span>왜 추가하는지가 중요합니다.
            </>
          }
          lead="작업을 시작하기 전에 무엇을 왜 하는지 먼저 합의합니다."
        />
        <ProcessSteps />
      </Section>

      <Section ariaLabelledBy="cases-title">
        <SectionHead
          eyebrow="06 / CASES"
          id="cases-title"
          title={
            <>
              <span className="bl-break">결과만 보여주지 않고</span>어떤 조건에서 나온 결과인지 함께
              보여드립니다.
            </>
          }
        />
        {cases.length ? (
          <div className="bl-grid bl-grid--2">
            {cases.map(study => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
        ) : (
          <div className="bl-notice">
            <p>
              <strong>사례 수치는 검증이 끝난 것만 게시합니다.</strong> 이전 사이트에는 같은 사례가
              위치마다 다른 숫자로 실려 있었습니다. 어느 값이 맞는지 확인되기 전까지는 표시하지
              않습니다.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              대신 사례를 어떤 기준으로 공개하는지를 정리해 두었습니다.
            </p>
          </div>
        )}
        <p style={{ marginTop: '1.5rem' }}>
          <Link href="/cases" className="bl-btn bl-btn--ghost">
            사례 공개 기준 보기 &rarr;
          </Link>
        </p>
      </Section>

      <Section subtle ariaLabelledBy="pricing-title">
        <SectionHead
          eyebrow="07 / PRICING"
          id="pricing-title"
          title="필요한 예산도 미리 확인하세요."
          lead="시작가는 공개합니다. 실제 구성은 키워드 경쟁도와 사이트 상태에 따라 달라집니다."
        />
        <div className="bl-grid bl-grid--4">
          {PRICING.map(group => (
            <Card key={group.service}>
              <CardTitle>{group.label}</CardTitle>
              <div className="bl-price">
                <span className="bl-price__value">{formatKrw(group.from)}</span>
                <span className="bl-price__unit">부터</span>
              </div>
              <CardBody>{group.bestFor}</CardBody>
            </Card>
          ))}
        </div>
        <p style={{ marginTop: '1.5rem' }}>
          <Link href="/pricing" className="bl-btn bl-btn--ghost">
            백링크 가격이 달라지는 이유 보기 &rarr;
          </Link>
        </p>
      </Section>

      <Section ariaLabelledBy="knowledge-title">
        <SectionHead
          eyebrow="08 / SEO KNOWLEDGE"
          id="knowledge-title"
          title="판단 기준을 먼저 가져가세요."
          lead="상담하지 않아도 스스로 판단할 수 있도록 기준을 정리해 두었습니다."
        />
        <RelatedArticles heading="먼저 읽어볼 글" posts={articles} />
        <p style={{ marginTop: '1.5rem' }}>
          <Link href="/blog" className="bl-btn bl-btn--ghost">
            SEO 가이드 전체 보기 &rarr;
          </Link>
        </p>
      </Section>

      <FAQSection items={faq} eyebrow="09 / FAQ" moreHref="/faq" subtle />

      <FinalCTA source="home" />
    </>
  )
}
