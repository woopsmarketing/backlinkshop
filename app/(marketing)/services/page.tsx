/**
 * 서비스 허브 /services
 *
 * ⚠️ SEO 보존 규칙
 * 이 URL 은 기존 `/products` 계열 페이지의 301 목적지다. 경로를 바꾸거나 제거하지 않는다.
 * 개별 서비스는 /services/<slug> 로 분화되어 있고, 이 페이지는 "무엇을 먼저 할지"를 고르는
 * 판단 허브 역할만 한다. 서비스별 상세 설명은 각 하위 페이지에 둔다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { SituationSelector } from '@/components/marketing/SituationSelector'
import { ServiceGrid } from '@/components/marketing/ServiceGrid'
import { ProcessSteps } from '@/components/marketing/ProcessSteps'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { CaseStudyCard } from '@/components/marketing/CaseStudyCard'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle, BulletList } from '@/components/ui/Card'
import { IconSurface } from '@/components/ui/Icon'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedArticles } from '@/components/content/RelatedArticles'

import { PRICING, formatKrw } from '@/config/pricing'
import { ctaLabel } from '@/config/cta'
import { SEO_GRAPH, resolveArticles } from '@/config/seo-graph'
import { PUBLISHED_CASES, CASE_DISCLOSURE_RULES } from '@/config/cases'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'SEO 서비스 — 백링크·온페이지·콘텐츠 중 무엇을 먼저 할지 고르기',
  description:
    'PBN 백링크, 플랜 백링크, 온페이지 SEO, 콘텐츠 SEO 중 지금 필요한 작업을 상황에 따라 고릅니다. 네 가지 작업이 어떤 순서로 조합되는지도 함께 정리했습니다.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'SEO 서비스 — 무엇을 먼저 할지부터 고릅니다',
    description:
      '상품을 먼저 고르는 대신, 지금 막혀 있는 지점을 먼저 정합니다. 상황별로 어떤 작업이 앞에 오는지 정리했습니다.',
    url: '/services',
  },
}

const SERVICE_HREF = {
  pbn: '/services/pbn-backlink',
  plan: '/services/plan-backlink',
  onpage: '/services/onpage-seo',
  content: '/services/content-seo',
} as const

export default function ServicesPage() {
  const cluster = SEO_GRAPH.services
  const articles = resolveArticles(cluster.relatedArticles)
  const lowestFrom = Math.min(...PRICING.map(group => group.from))
  const cases = PUBLISHED_CASES.slice(0, 2)
  const relatedHrefs = [cluster.pillar, cluster.moneyPage, ...cluster.relatedPages]

  return (
    <>
      <Breadcrumb trail={[{ href: '/services', label: '서비스' }]} />

      <Hero
        eyebrow="서비스"
        title={
          <>
            <span className="bl-break">문제에 맞는</span>
            SEO 작업을 선택하세요.
          </>
        }
        support="백링크와 온페이지, 콘텐츠는 서로 다른 문제를 담당하는 작업입니다. 지금 어디가 막혀 있는지에 따라 시작점이 달라지기 때문에, 상품을 먼저 고르기보다 상황을 먼저 정리하는 쪽이 결과적으로 빠릅니다."
        actions={
          <>
            <TelegramCTA source="services" position="hero" size="lg" label={ctaLabel('services')} />
            <Button href="/pricing" variant="secondary" size="lg">
              작업별 시작가 확인하기
            </Button>
          </>
        }
        note="지금까지 해보신 작업만 알려주셔도 됩니다"
      />

      <Section ariaLabelledBy="services-why-title">
        <SectionHead
          eyebrow="01 / 판단 기준"
          id="services-why-title"
          title="같은 작업이 모든 사이트에서 같은 결과를 만들지는 않습니다."
          lead="서비스를 고르는 일은 상품을 고르는 일보다, 지금 무엇이 막혀 있는지를 정하는 일에 가깝습니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            검색 결과에서 위로 올라가지 못하는 이유는 사이트마다 다릅니다. 어떤 곳은 외부에서
            참조되는 양 자체가 적고, 어떤 곳은 참조는 쌓여 있는데 페이지가 검색엔진에 제대로 읽히지
            않습니다. 문서가 검색한 사람의 질문에 답하지 못해서 노출이 붙지 않는 경우도 있습니다.
            원인이 다른데 같은 작업을 얹으면 비용은 나가지만 무엇이 달라졌는지 확인하기 어려운
            상태가 이어집니다.
          </p>
          <p className="bl-body">
            그래서 이 페이지는 상품 목록이 아니라 판단 순서로 구성했습니다. 먼저 지금 상황과 가장
            가까운 문장을 고르고, 그 상황에서 어느 작업이 앞에 오는지 확인한 다음, 필요하면 다른
            작업을 이어 붙이는 방식입니다. 처음부터 네 가지를 전부 진행해야 하는 경우는 생각보다
            많지 않습니다.
          </p>
          <p className="bl-body">
            반대로, 한 가지만 골라 놓고 나머지를 영원히 배제하는 구조도 아닙니다. 링크 작업으로
            시작했다가 페이지 구조를 손봐야 하는 상황이 드러나기도 하고, 문서를 정리하고 나서야
            링크를 붙일 준비가 되는 경우도 있습니다.{' '}
            <Link href="/google-ranking">순위가 움직이지 않는 이유</Link>를 먼저 좁혀 두면 이후에
            무엇을 더할지 판단하기 쉬워집니다.
          </p>
        </div>
      </Section>

      <Section subtle size="sm" ariaLabelledBy="services-situation-title">
        <SectionHead
          eyebrow="02 / 상황 선택"
          id="services-situation-title"
          title="지금 상황과 가장 가까운 문장을 고르세요."
          lead="선택한 문장에 맞는 설명 페이지로 이동합니다. 상담하지 않고 먼저 읽어보셔도 됩니다."
        />
        <SituationSelector />
      </Section>

      <Section ariaLabelledBy="services-list-title">
        <SectionHead
          eyebrow="03 / 서비스"
          id="services-list-title"
          title="네 가지 작업은 각각 다른 층을 담당합니다."
          lead="외부 신호, 페이지 상태, 문서 내용은 서로 다른 층위입니다. 카드마다 어떤 상황에 쓰는 작업인지와 시작가를 함께 표시했습니다."
        />
        <ServiceGrid showPrice />
        <p className="bl-closing">
          표시된 금액은 각 작업의 시작가이며, 그중 가장 낮은 값은 {formatKrw(lowestFrom)}입니다.
          실제 금액은 키워드 경쟁 강도와 목표 페이지, 지금까지 쌓인 링크 상태에 따라 달라지므로{' '}
          <Link href="/pricing">금액이 달라지는 기준</Link>을 함께 보시는 편이 좋습니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="services-mix-title">
        <SectionHead
          eyebrow="04 / 작업 조합"
          id="services-mix-title"
          title={
            <>
              <span className="bl-break">네 가지 작업은</span>서로 배타적이지 않습니다.
            </>
          }
          lead="하나를 고르면 나머지를 포기하는 구조가 아닙니다. 대부분은 순서의 문제이고, 앞에 와야 할 작업을 뒤로 미루면 뒤에 있는 작업의 효과도 해석하기 어려워집니다."
        />
        <p className="bl-body bl-measure">
          아래는 상담에서 가장 자주 나오는 네 가지 상황과, 그때 어떤 순서로 검토하는지를 정리한
          것입니다. 표에 적힌 순서가 모든 경우에 그대로 적용되는 규칙은 아니며, 실제로는 사이트를
          확인한 뒤 조정합니다.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <ComparisonTable
            caption="상황별로 먼저 보는 작업과 이어서 검토하는 작업"
            columns={['먼저 보는 작업', '이어서 검토하는 작업', '이 순서인 이유']}
            rowHeader="상황"
            rows={[
              {
                header: '링크를 늘렸는데 순위가 그대로다',
                cells: [
                  <Link key="onpage" href={SERVICE_HREF.onpage}>
                    온페이지 SEO
                  </Link>,
                  <Link key="pbn" href={SERVICE_HREF.pbn}>
                    PBN 백링크
                  </Link>,
                  '페이지가 평가받을 준비가 되지 않은 상태에서 링크를 더하면, 움직이지 않는 원인이 링크 때문인지 페이지 때문인지 구분되지 않습니다.',
                ],
              },
              {
                header: '글은 있는데 검색 노출이 없다',
                cells: [
                  <Link key="content" href={SERVICE_HREF.content}>
                    콘텐츠 SEO
                  </Link>,
                  <Link key="plan" href={SERVICE_HREF.plan}>
                    플랜 백링크
                  </Link>,
                  '찾던 답이 담기지 않은 문서로 링크를 모으면 유입이 생겨도 다음 행동으로 이어지지 않습니다. 문서를 정리한 뒤 링크를 붙입니다.',
                ],
              },
              {
                header: '경쟁이 강한 키워드에서 막혀 있다',
                cells: [
                  <Link key="pbn2" href={SERVICE_HREF.pbn}>
                    PBN 백링크
                  </Link>,
                  <Link key="onpage2" href={SERVICE_HREF.onpage}>
                    온페이지 SEO
                  </Link>,
                  '상위 문서가 이미 두터운 구간에서는 신호의 강도를 검토하게 됩니다. 다만 강도가 높은 작업일수록 페이지 상태를 먼저 확인합니다.',
                ],
              },
              {
                header: '무엇부터 해야 할지 모르겠다',
                cells: [
                  <Link key="plan2" href={SERVICE_HREF.plan}>
                    플랜 백링크
                  </Link>,
                  <span key="rest">
                    <Link href={SERVICE_HREF.onpage}>페이지 점검</Link> ·{' '}
                    <Link href={SERVICE_HREF.content}>문서 재구성</Link>
                  </span>,
                  '한 가지 유형에 예산을 몰아넣기 전에 조합과 비율을 먼저 설계해 두면, 이후에 무엇을 조정할지 판단할 근거가 남습니다.',
                ],
              },
            ]}
          />
        </div>

        <div className="bl-grid bl-grid--3" style={{ marginTop: '2.5rem' }}>
          <Card>
            <IconSurface name="compass" />
            <CardTitle>순서를 바꾸면 판단이 어려워집니다</CardTitle>
            <CardBody>
              링크를 먼저 늘리고 나서 페이지를 손보면, 순위가 움직였을 때 무엇이 작용했는지 구분할
              수 없습니다. 원인을 좁히려면 고정할 것을 먼저 고정하는 편이 낫습니다.
            </CardBody>
          </Card>
          <Card>
            <IconSurface name="chart" />
            <CardTitle>예산을 한 번에 쓰지 않습니다</CardTitle>
            <CardBody>
              필요해 보이는 작업을 전부 나열해 한 번에 집행하기보다, 먼저 확인해야 할 구간을 좁은
              범위로 진행하고 결과를 본 다음 다음 범위를 정합니다.
            </CardBody>
          </Card>
          <Card>
            <IconSurface name="layers" />
            <CardTitle>판단이 서지 않으면 조합부터 설계합니다</CardTitle>
            <CardBody>
              어느 층이 문제인지 스스로 정하기 어려울 때는{' '}
              <Link href={SERVICE_HREF.plan}>유형 조합을 먼저 잡는 방식</Link>이 안전합니다. 한쪽에
              몰아넣은 뒤 되돌리는 것보다 조정 폭이 작습니다.
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section ariaLabelledBy="services-process-title">
        <SectionHead
          eyebrow="05 / 진행 방식"
          id="services-process-title"
          title="어떤 작업을 고르더라도 진행 방식은 같습니다."
          lead="작업을 시작하기 전에 무엇을 왜 하는지 먼저 맞춥니다. 범위가 정해지지 않은 채로 진행하지 않습니다."
        />
        <ProcessSteps />
      </Section>

      <Section size="sm">
        <TelegramCTABlock source="services" cta="services" position="mid" />
      </Section>

      <Section subtle ariaLabelledBy="services-cases-title">
        <SectionHead
          eyebrow="06 / 성공 사례"
          id="services-cases-title"
          title="어떤 작업을 골랐는지보다, 왜 그렇게 골랐는지를 공개합니다."
          lead="서비스 선택이 맞았는지는 결과 숫자만으로 판단하기 어렵습니다. 그래서 사례를 게시할 때 조건을 함께 적습니다."
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
              <strong>지금은 게시할 수 있는 사례가 없습니다.</strong> 이전 사이트에 실려 있던 사례
              수치는 페이지마다 값이 달라 어느 쪽이 맞는지 확인할 근거가 없었습니다. 확인되지 않은
              값을 골라서 싣는 대신, 검증이 끝난 건부터 순차적으로 공개합니다.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              대신 어떤 기준을 충족해야 사례로 게시하는지를 먼저 공개해 두었습니다.
            </p>
          </div>
        )}
        <div style={{ marginTop: '1.5rem' }}>
          <BulletList items={CASE_DISCLOSURE_RULES.map(rule => rule.title)} />
        </div>
        <p style={{ marginTop: '1.5rem' }}>
          <Link href="/cases" className="bl-btn bl-btn--ghost">
            사례 공개 기준 자세히 보기 &rarr;
          </Link>
        </p>
      </Section>

      <Section size="sm">
        <RelatedContent
          heading="서비스를 고르기 전에 함께 보면 좋은 페이지"
          hrefs={relatedHrefs}
          columns={2}
        />
        <div style={{ marginTop: '2.5rem' }}>
          <RelatedArticles heading="판단 기준을 직접 확인하고 싶다면" posts={articles} />
        </div>
      </Section>

      <FinalCTA
        source="services"
        cta="services"
        title="어떤 작업이 필요한지부터 같이 정리해 보시죠."
        body="네 가지 중 무엇을 고를지 미리 정하지 않으셔도 됩니다. 사이트 주소와 목표 키워드를 보고 지금 순서가 어떻게 되는지 말씀드리겠습니다."
        label="어떤 작업이 맞는지 상담하기"
      />
    </>
  )
}
