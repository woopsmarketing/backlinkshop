/**
 * 백링크 가격 /pricing
 *
 * ⚠️ SEO · 광고 보존 규칙
 * - 이 URL 에 Google Ads 사이트링크가 연결되어 있다. 경로를 바꾸지 않는다.
 * - Primary keyword: `백링크 가격` (보조: `백링크 비용`, `PBN 가격`).
 * - 화면에 보이는 모든 금액은 config/pricing.ts 한 곳에서만 나온다. JSX 에 숫자를 직접 쓰지 않는다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Section } from '@/components/layout/Container'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { PricingCard } from '@/components/marketing/PricingCard'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { FAQSection } from '@/components/marketing/FAQSection'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle, BulletList } from '@/components/ui/Card'
import { Stat } from '@/components/ui/Stat'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedServices } from '@/components/content/RelatedServices'

import {
  PRICING,
  PRICE_FACTORS,
  CREDIT_TO_KRW,
  formatKrw,
  formatCredits,
  getPricingGroup,
} from '@/config/pricing'
import { getService, type ServiceSlug } from '@/config/services'
import { getFaqByCategory } from '@/config/faq'
import { SEO_GRAPH } from '@/config/seo-graph'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '백링크 가격 · 백링크 비용 기준 안내',
  description:
    '백링크 가격을 서비스별 시작가와 구성별 금액까지 공개합니다. 크레딧 표기는 1 크레딧 = 1원이며, PBN 가격을 포함한 백링크 비용이 왜 사이트마다 달라지는지 함께 정리했습니다.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: '백링크 가격 · 백링크 비용 기준 안내',
    description:
      '시작가와 구성별 금액, 크레딧 원화 환산, 견적이 달라지는 다섯 가지 조건을 한 페이지에 정리했습니다.',
    url: '/pricing',
  },
}

/** 표에서 "함께 보면 좋은 것" 열에 연결할 보완 서비스. 문맥 기준으로만 짝을 짓는다. */
const COMPANION_SERVICE: Record<ServiceSlug, ServiceSlug> = {
  'pbn-backlink': 'onpage-seo',
  'plan-backlink': 'pbn-backlink',
  'onpage-seo': 'content-seo',
  'content-seo': 'onpage-seo',
}

export default function PricingPage() {
  const cluster = SEO_GRAPH.pricing
  const faq = getFaqByCategory('가격')

  const lowestFrom = Math.min(...PRICING.map(group => group.from))
  const lowestLabels = PRICING.filter(group => group.from === lowestFrom)
    .map(group => group.label)
    .join(' · ')
  const openItemCount = PRICING.reduce((sum, group) => sum + group.items.length, 0)

  const pbn = getPricingGroup('pbn-backlink')
  const sampleItem = pbn?.items[0]

  return (
    <>
      <Breadcrumb trail={[{ href: '/pricing', label: '백링크 가격' }]} />

      <Hero
        eyebrow="PRICING"
        title={
          <>
            <span className="bl-break">백링크 가격,</span>
            무엇에 돈을 내는지부터 확인하세요.
          </>
        }
        support="금액만 나열된 표는 어느 쪽이 저렴한지는 알려주지만, 그 돈으로 무엇이 만들어지는지는 알려주지 않습니다. 이 페이지에는 서비스별 시작가와 구성별 금액, 그리고 같은 서비스인데도 견적이 달라지는 이유를 함께 적어 두었습니다."
        actions={
          <>
            <TelegramCTA
              source="pricing"
              position="hero"
              label="예산에 맞는 구성 문의하기"
              size="lg"
            />
            <Button href="/services" variant="secondary" size="lg">
              서비스부터 비교하기
            </Button>
          </>
        }
        note="Telegram으로 연결됩니다 · 예산 범위와 목표 키워드만 알려주시면 됩니다"
      />

      <Section size="sm" ariaLabelledBy="credit-title">
        <SectionHead
          eyebrow="01 / CREDIT"
          id="credit-title"
          title="크레딧으로 적힌 금액은 원화로 이만큼입니다."
          lead="결제 화면에서는 금액이 크레딧 단위로 표시됩니다. 환산 기준을 따로 찾지 않아도 되도록 가격을 보기 전에 먼저 적어 둡니다."
        />
        <div className="bl-grid bl-grid--3">
          <Stat
            value={`1 크레딧 = ${formatKrw(CREDIT_TO_KRW)}`}
            label="크레딧 원화 환산 기준"
            source="상품 가격표·충전 화면에 공통으로 적용되는 값"
          />
          <Stat
            value={`${formatKrw(lowestFrom)}부터`}
            label="가장 낮은 서비스 시작가"
            source={lowestLabels}
          />
          <Stat
            value={`${openItemCount}개 구성`}
            label="금액이 공개된 세부 구성 수"
            source="아래 서비스별 가격표에 전부 표기"
          />
        </div>

        <div className="bl-stack" style={{ marginTop: '2rem' }}>
          <p className="bl-body bl-measure">
            크레딧은 별도의 화폐가 아니라 결제 단위를 표기하는 방식일 뿐입니다. 환산에 계수가 붙지
            않기 때문에 크레딧 숫자를 그대로 원화로 읽으시면 됩니다.
            {sampleItem ? (
              <>
                {' '}
                예를 들어 {sampleItem.name} 구성이 {formatCredits(sampleItem.price)}로 표기되어
                있다면 실제 결제 금액은 {formatKrw(sampleItem.price)}입니다.
              </>
            ) : null}
          </p>
          <p className="bl-body bl-measure">
            이 안내를 페이지 맨 앞에 두는 이유는 단순합니다. 크레딧만 적혀 있으면 견적을 비교하려는
            분이 계산기를 한 번 더 열어야 하고, 그 사이에 판단이 미뤄집니다. 백링크 비용을 확인하러
            들어오신 분이 가장 먼저 알아야 할 것은 환산 기준과 시작가라고 생각합니다.
          </p>
          <div className="bl-notice">
            <p>
              <strong>이 페이지의 금액은 모두 하나의 가격 원본에서 불러옵니다.</strong> 페이지마다
              다른 숫자가 적혀 있어 어느 쪽이 맞는지 헷갈리는 일이 생기지 않도록, 금액을 문서에 직접
              써 넣지 않고 한 곳에서만 관리합니다.
            </p>
          </div>
        </div>
      </Section>

      <Section id="prices" ariaLabelledBy="prices-title">
        <SectionHead
          eyebrow="02 / PRICE LIST"
          id="prices-title"
          title="서비스별 시작가와 구성별 금액"
          lead="네 가지 작업의 시작가와 세부 구성 금액입니다. 시작가는 가장 작은 구성의 금액이며, 실제 견적은 그 아래에 정리한 다섯 가지 조건에 따라 달라집니다."
        />
        <div className="bl-stack" style={{ marginBottom: '2.5rem' }}>
          <p className="bl-body bl-measure">
            각 카드에는 세 가지가 함께 들어 있습니다. 어떤 상황에 맞는 작업인지, 그 금액에 무엇이
            포함되는지, 그리고 구성별로 금액이 어떻게 나뉘는지입니다. 금액만 따로 떼어 보면 비교가
            어렵기 때문에 포함 사항을 같은 자리에 두었습니다.
          </p>
          <p className="bl-body bl-measure">
            구성 이름 옆에 적힌 기간은 작업을 진행하는 데 걸리는 기간이며, 검색 결과에 반영되는
            시점과는 다릅니다. 작업이 끝나는 날과 순위가 움직이는 날이 같지 않다는 점은 미리 알고
            시작하시는 편이 좋습니다.
          </p>
        </div>
        <div className="bl-pricing">
          {PRICING.map(group => (
            <PricingCard key={group.service} group={group} />
          ))}
        </div>
        <p className="bl-closing">
          숫자만 보면 큰 구성이 좋아 보이지만, 필요한 양보다 많은 링크를 한 번에 넣는 것이 늘 도움이
          되지는 않습니다. 네 가지 중 무엇을 골라야 할지 모르겠다면{' '}
          <Link href="/services">상황별로 나눠 둔 서비스 설명</Link>을 먼저 보셔도 됩니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="factors-title">
        <SectionHead
          eyebrow="03 / WHY IT VARIES"
          id="factors-title"
          title={
            <>
              <span className="bl-break">시작가는 공개하는데</span>
              최종 견적을 미리 확정하지 않는 이유
            </>
          }
          lead="같은 서비스를 골라도 사이트마다 필요한 작업량이 다릅니다. 아래 다섯 가지가 그 차이를 만듭니다."
        />
        <div className="bl-grid bl-grid--3">
          {PRICE_FACTORS.map(factor => (
            <Card key={factor.title}>
              <CardTitle>{factor.title}</CardTitle>
              <CardBody>{factor.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          그래서 첫 상담에서 금액부터 말씀드리지 않고 사이트 주소와 목표 키워드를 먼저 여쭙습니다.
          지금 하지 않아도 되는 작업을 덜어내면 그만큼 범위가 줄어들고, 범위가 줄면 비용도 함께
          내려갑니다.
        </p>
        <div className="bl-stack" style={{ marginTop: '2rem' }}>
          <p className="bl-body bl-measure">
            PBN 가격이 다른 작업보다 높게 잡히는 것도 같은 맥락입니다. PBN은 링크가 놓이는 자리를
            직접 운영하는 방식이라 도메인 유지와 콘텐츠 관리에 계속 비용이 들어갑니다. 링크 하나의
            단가가 아니라 그 자리를 유지하는 비용이 가격에 들어 있다고 보시는 편이 정확합니다. 어떤
            구조로 운영되는지는 <Link href="/services/pbn-backlink">PBN 백링크 설명 페이지</Link>에
            정리해 두었습니다.
          </p>
          <p className="bl-body bl-measure">
            반대로 온페이지나 콘텐츠 작업은 링크를 늘리는 일이 아니라 이미 있는 페이지가 평가받을
            준비가 되었는지를 다루기 때문에 단가 구조가 다릅니다. 링크를 추가했는데 변화가 없다면
            비용을 더 쓰기 전에 이쪽부터 확인하는 편이 낫습니다. 무엇이 막혀 있는지에 대한 판단
            기준은 <Link href="/backlink">백링크가 무엇을 바꾸는지</Link> 정리한 글에 함께 적혀
            있습니다.
          </p>
        </div>
      </Section>

      <Section ariaLabelledBy="compare-title">
        <SectionHead
          eyebrow="04 / COMPARE"
          id="compare-title"
          title="같은 예산이라도 어디에 쓰느냐에 따라 받는 것이 다릅니다."
          lead="네 가지 작업이 각각 어떤 상황에 맞고, 무엇을 하고, 끝났을 때 무엇이 남는지 한 표로 비교했습니다."
        />
        <ComparisonTable
          caption="서비스별 적합 상황·시작가·작업 범위·결과물 비교"
          columns={PRICING.map(group => group.label)}
          rowHeader="비교 항목"
          rows={[
            {
              header: '적합한 상황',
              cells: PRICING.map(group => group.bestFor),
            },
            {
              header: '시작가',
              cells: PRICING.map(group => `${formatKrw(group.from)}부터`),
            },
            {
              header: '작업 범위',
              cells: PRICING.map(group => (
                <BulletList key={group.service} items={group.includes.slice(0, -1)} plain />
              )),
            },
            {
              header: '결과로 받는 것',
              cells: PRICING.map(group => group.includes[group.includes.length - 1]),
            },
            {
              header: '함께 보면 좋은 것',
              cells: PRICING.map(group => {
                const companion = getService(COMPANION_SERVICE[group.service])
                return companion ? (
                  <Link key={group.service} href={companion.href}>
                    {companion.name}
                  </Link>
                ) : (
                  '—'
                )
              }),
            },
          ]}
        />
        <p className="bl-closing">
          표에서 시작가가 가장 낮은 칸을 먼저 보게 되지만, 실제로 봐야 할 줄은 &lsquo;결과로 받는
          것&rsquo;입니다. 작업이 끝났을 때 무엇이 손에 남는지가 같은 금액을 다르게 만듭니다.
        </p>
        <div className="bl-stack" style={{ marginTop: '2rem' }}>
          <p className="bl-body bl-measure">
            견적을 비교하실 때 확인하시면 좋은 것은 세 가지입니다. 첫째, 작업이 끝난 뒤 어떤 URL에
            어떤 앵커로 링크가 생겼는지 확인할 수 있는지. 둘째, 지금 사이트에 그 작업이 왜 필요한지
            설명이 함께 오는지. 셋째, 하지 않아도 되는 항목이 견적에서 빠져 있는지입니다. 세 가지가
            모두 채워지면 금액의 높고 낮음을 판단할 기준이 생깁니다.
          </p>
          <p className="bl-body bl-measure">
            반대로 이 세 가지가 없는 상태에서는 어떤 금액이든 비싸거나 싸다고 말하기 어렵습니다.
            같은 백링크 비용을 쓰고도 결과가 갈리는 지점이 대부분 여기에 있습니다.
          </p>
        </div>
      </Section>

      <Section size="sm" ariaLabelledBy="pricing-consult-title">
        <h2 id="pricing-consult-title" className="bl-sr-only">
          예산 상담
        </h2>
        <TelegramCTABlock
          source="pricing"
          position="mid"
          title="예산 범위를 먼저 말씀해 주셔도 됩니다."
          body="가능한 범위 안에서 어떤 구성이 나오는지, 지금은 하지 않아도 되는 작업이 무엇인지 함께 정리해 드립니다. 범위가 맞지 않으면 그렇다고 말씀드립니다."
          label="예산에 맞는 구성 문의하기"
        />
      </Section>

      <FAQSection
        items={faq}
        id="pricing-faq"
        eyebrow="05 / PRICING FAQ"
        title="가격에 대해 자주 받는 질문"
        moreHref="/faq"
        moreLabel="전체 질문 보기"
        subtle
      />

      <Section ariaLabelledBy="related-title">
        <SectionHead
          eyebrow="06 / NEXT"
          id="related-title"
          title="금액을 비교하기 전에 함께 보면 좋은 것"
          lead="가격은 판단의 마지막 단계입니다. 무엇이 필요한지가 정해지면 어떤 금액이 적정한지도 함께 정해집니다."
        />
        <p className="bl-body bl-measure" style={{ marginBottom: '2.5rem' }}>
          가격대별로 무엇이 달라지는지는{' '}
          <Link href="/blog/backlink-price-guide">백링크 가격 가이드</Link>에서 더 길게 다루고,
          견적서를 받았을 때 어디를 확인해야 하는지는{' '}
          <Link href="/blog/how-to-choose-backlink-agency">업체를 고르는 기준을 정리한 글</Link>에
          적어 두었습니다.
        </p>
        <RelatedServices heading="서비스별 상세 설명" />
        <div style={{ marginTop: '2.5rem' }}>
          <RelatedContent
            heading="이어서 보면 좋은 페이지"
            hrefs={cluster.relatedPages}
            columns={3}
          />
        </div>
      </Section>

      <FinalCTA
        source="pricing"
        title="예산을 먼저 알려주셔도 괜찮습니다."
        body="사이트 주소와 목표 키워드, 생각하시는 범위를 알려주시면 그 안에서 가능한 구성과 우선순위를 정리해 드립니다."
        label="예산에 맞는 구성 문의하기"
      />
    </>
  )
}
