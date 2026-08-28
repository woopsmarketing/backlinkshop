/**
 * 백링크 가격 /pricing
 *
 * ⚠️ SEO · 광고 보존 규칙
 * - 이 URL 에 Google Ads 사이트링크가 연결되어 있다. 경로를 바꾸지 않는다.
 * - Primary keyword: `백링크 가격` (보조: `백링크 비용`, `PBN 가격`).
 * - 화면에 보이는 모든 금액은 config/pricing.ts 한 곳에서만 나온다. JSX 에 숫자를 직접 쓰지 않는다.
 * - 홈에서 가격 표기를 전부 걷어냈기 때문에 가격에 대한 설명은 이 페이지가 단독으로 책임진다.
 *   할인율·묶음 금액처럼 확인되지 않은 숫자는 만들지 않고, 구조만 설명한다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Section } from '@/components/layout/Container'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { PricingCard } from '@/components/marketing/PricingCard'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { ConsultServices } from '@/components/marketing/ConsultServices'
import { InsightBlock } from '@/components/marketing/InsightBlock'
import { FAQSection } from '@/components/marketing/FAQSection'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle, BulletList } from '@/components/ui/Card'
import { IconSurface } from '@/components/ui/Icon'
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
import { ctaLabel } from '@/config/cta'
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

/** PRICE_FACTORS(config)는 아이콘을 갖고 있지 않다. 표시용 매핑만 여기서 붙인다. */
const FACTOR_ICONS: Record<string, string> = {
  '키워드 경쟁도': 'target',
  '목표 페이지': 'file',
  '도메인 상태': 'globe',
  '필요한 링크 유형': 'link',
  '작업 범위': 'layers',
}

/**
 * 링크 한 건의 값을 만드는 요소.
 * PRICE_FACTORS 가 "견적 전체가 달라지는 조건"이라면, 여기는 그 아래 단계다.
 */
const LINK_COST_DRIVERS = [
  {
    icon: 'globe',
    title: '도메인 품질',
    body: '링크가 놓이는 자리의 사이트가 어떤 문서를 갖고 있고 어떻게 관리되는지에 따라 그 자리를 확보하고 유지하는 비용이 달라집니다. 지표 하나로 요약되는 값이 아니라서, 어떤 성격의 사이트에 실리는지 설명을 들을 수 있는지가 실제 판단 기준이 됩니다.',
  },
  {
    icon: 'link',
    title: '링크 유형',
    body: '직접 만들 수 있는 유형과 자체 운영 네트워크나 매체 관계가 있어야 하는 유형은 준비 과정 자체가 다릅니다. 같은 한 건이라도 어떤 유형인지에 따라 들어가는 작업이 달라지고, 단가도 함께 달라집니다.',
  },
  {
    icon: 'layers',
    title: '수량',
    body: '필요한 링크 수가 늘면 총액은 올라가지만 단위당 금액이 같은 비율로 따라 올라가지는 않습니다. 위 가격표에서 같은 계열의 구성을 나란히 놓고 보시면 그 차이를 직접 확인하실 수 있습니다.',
  },
  {
    icon: 'pen',
    title: '앵커 구성',
    body: '목표 키워드 하나에 몰지 않고 브랜드·주소·일반 문구를 섞으려면 자리마다 다른 문장을 준비해야 합니다. 구성안을 설계하고 실제 사용된 문구를 기록하는 작업이 금액에 함께 들어갑니다.',
  },
  {
    icon: 'clock',
    title: '유지 기간',
    body: '링크의 값은 게시되는 순간이 아니라 남아 있는 기간 동안 발생합니다. 자리를 계속 유지하려면 도메인과 문서를 관리하는 비용이 이어지고, 그 부분이 단가에 반영됩니다.',
  },
]

/** 서비스마다 무엇에 값이 매겨지는지. 라벨은 PRICING 에서 가져오고 여기서는 설명만 붙인다. */
const PRICE_STRUCTURE: Record<ServiceSlug, { unit: string; body: string }> = {
  'pbn-backlink': {
    unit: '링크가 놓일 자리를 직접 운영하는 비용',
    body: '링크 한 건의 값만으로 금액이 만들어지지 않습니다. 도메인을 확보하고 문서를 관리하는 비용이 계속 들어가기 때문에, 그 자리를 얼마나 갖추고 얼마나 유지하는지가 가격을 결정합니다.',
  },
  'plan-backlink': {
    unit: '여러 유형을 어떤 비율로 섞을지에 대한 설계',
    body: '한 가지 유형을 몇 개 넣는 작업이 아니라 비어 있는 자리를 찾아 비율을 맞추는 작업입니다. 그래서 링크 수보다 조합의 폭과 설계 범위가 금액을 가릅니다.',
  },
  'onpage-seo': {
    unit: '한 번의 점검과 그 결과로 남는 리포트',
    body: '수량을 늘려 가는 구조가 아닙니다. 사이트를 한 번 훑고 우선순위가 정리된 수정 권고를 남기는 작업이라, 손에 남는 것이 링크가 아니라 문서입니다.',
  },
  'content-seo': {
    unit: '문서 단위의 재설계 작업량',
    body: '검색의도를 정의하고 문서 구조를 다시 짜는 작업입니다. 대상 문서의 수와 현재 상태에 따라 범위가 정해지므로, 링크 수와는 애초에 세는 단위가 다릅니다.',
  },
}

/** 예산이 정해지는 순서. 금액에서 출발하지 않는 이유를 단계로 보여준다. */
const BUDGET_ORDER = [
  {
    step: '순서 01',
    icon: 'target',
    title: '올리려는 키워드를 먼저 정합니다',
    body: '금액을 먼저 정하면 그 금액에 맞는 구성을 고르게 되고, 정작 그 구성이 목표에 필요한 양인지는 확인되지 않은 채로 남습니다. 어떤 키워드에서 무엇을 얻고 싶은지가 먼저입니다.',
  },
  {
    step: '순서 02',
    icon: 'trending',
    title: '그 키워드의 경쟁 강도를 봅니다',
    body: '이미 상위에 있는 사이트들이 어떤 참조를 쌓아 왔는지에 따라 필요한 작업량이 정해집니다. 같은 업종이라도 키워드가 달라지면 필요한 범위가 달라집니다.',
  },
  {
    step: '순서 03',
    icon: 'search',
    title: '현재 사이트 상태를 확인합니다',
    body: '색인 상태, 페이지 구성, 지금까지 쌓인 링크가 어디까지 와 있는지를 봅니다. 이미 채워져 있는 자리에 예산을 다시 쓰지 않기 위해서입니다.',
  },
  {
    step: '순서 04',
    icon: 'gauge',
    title: '그다음에 범위와 금액이 나옵니다',
    body: '앞의 세 가지가 정해지면 해야 할 작업이 좁혀지고, 그 범위에 해당하는 금액이 따라옵니다. 예산이 그 범위보다 작다면 무엇을 먼저 할지 순서를 정하는 대화로 넘어갑니다.',
  },
]

/** 같은 예산을 어디에 먼저 쓸지. 증상에 따라 답이 갈린다. */
const BUDGET_PRIORITY = [
  {
    icon: 'alert',
    title: '검색 결과에 아예 나타나지 않는다면',
    body: '순위 문제가 아니라 색인이나 페이지 구조 문제일 수 있습니다. 이 상태에서 링크를 더 사면 아직 평가 대상이 아닌 페이지로 신호를 보내게 됩니다. 먼저 볼 곳은 사이트 구조입니다.',
  },
  {
    icon: 'file',
    title: '노출은 되는데 위로 올라가지 못한다면',
    body: '검색한 사람이 찾던 답이 페이지 안에 있는지부터 봅니다. 문서가 다른 질문에 답하고 있다면 참조가 늘어도 자리가 크게 바뀌지 않습니다.',
  },
  {
    icon: 'network',
    title: '문서와 구조는 정리됐는데 정체돼 있다면',
    body: '안쪽에서 할 수 있는 일을 대체로 마친 구간입니다. 여기서부터는 외부 참조가 차이를 만들기 때문에 링크에 쓰는 예산의 효율이 가장 높아집니다.',
  },
]

/** 여러 사이트를 함께 볼 때 병렬화되는 영역. 금액이 아니라 구조만 설명한다. */
const MULTISITE_SHARED = [
  {
    icon: 'chart',
    title: '분석',
    body: '업종이나 목표 키워드가 겹칠수록 앞선 사이트에서 확인한 경쟁 구도를 다음 사이트에 그대로 이어 쓸 수 있습니다. 같은 조사를 처음부터 다시 하지 않아도 되는 만큼 준비 단계가 짧아집니다.',
  },
  {
    icon: 'server',
    title: '인프라',
    body: '호스팅과 도메인 구성을 처음부터 함께 설계할 수 있습니다. 사이트를 따로 진행할 때 나중에 발견되는 기술적 중복 위험을 미리 줄이는 쪽에 가깝습니다.',
  },
  {
    icon: 'wrench',
    title: '운영',
    body: '작업 일정과 확인 주기를 하나의 흐름으로 묶으면 사이트마다 따로 주고받을 때보다 왕복이 줄어듭니다. 같은 판단을 여러 번 반복하지 않아도 됩니다.',
  },
  {
    icon: 'file',
    title: '리포팅',
    body: '같은 형식으로 정리하면 사이트별 결과를 나란히 놓고 볼 수 있습니다. 어느 쪽이 먼저 움직이는지가 보이면 다음 예산을 어디에 둘지도 함께 정해집니다.',
  },
]

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
        eyebrow="백링크 가격"
        title={
          <>
            <span className="bl-break">백링크 가격,</span>
            무엇에 돈을 내는지부터 확인하세요.
          </>
        }
        support="금액만 나열된 표는 어느 쪽이 저렴한지는 알려주지만, 그 돈으로 무엇이 만들어지는지는 알려주지 않습니다. 이 페이지에는 서비스별 시작가와 구성별 금액, 같은 서비스인데도 견적이 달라지는 이유, 그리고 예산을 어떤 순서로 정하는지까지 함께 적어 두었습니다."
        actions={
          <>
            <TelegramCTA source="pricing" position="hero" label={ctaLabel('budget')} size="lg" />
            <Button href="/services" variant="secondary" size="lg">
              서비스부터 비교하기
            </Button>
          </>
        }
      />

      <Section size="sm" ariaLabelledBy="credit-title">
        <SectionHead
          eyebrow="01 / 크레딧 환산"
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
          eyebrow="02 / 서비스별 가격"
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
          eyebrow="03 / 견적이 달라지는 이유"
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
              <IconSurface name={FACTOR_ICONS[factor.title] ?? 'spark'} />
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
      </Section>

      <Section ariaLabelledBy="drivers-title">
        <SectionHead
          eyebrow="04 / 링크 가격의 구성"
          id="drivers-title"
          title="백링크 가격은 이 다섯 가지에서 만들어집니다."
          lead="앞의 다섯 가지가 견적 전체의 범위를 정한다면, 여기는 링크 한 건의 값이 어디에서 나오는지에 대한 이야기입니다. 견적서를 읽을 때 어느 항목이 빠져 있는지 확인하는 기준으로 쓰셔도 됩니다."
        />
        <div className="bl-grid bl-grid--3">
          {LINK_COST_DRIVERS.map(item => (
            <Card key={item.title}>
              <IconSurface name={item.icon} />
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <div className="bl-stack" style={{ marginTop: '2rem' }}>
          <p className="bl-body bl-measure">
            다섯 가지는 서로 맞물려 있습니다. 경쟁이 강한 키워드에서는 도메인 품질이 높은 자리가
            필요해지고, 그런 자리를 여러 건 확보하려면 수량과 유지 기간이 함께 늘어납니다. 그래서 한
            항목만 낮춰 금액을 맞추면 다른 항목이 대신 늘어나는 경우가 많습니다.
          </p>
          <p className="bl-body bl-measure">
            반대로 링크 하나하나의 조건을 따지지 않은 견적은 대개 수량만 남습니다. 몇 건인지는 적혀
            있는데 어디에 어떤 문구로 걸리고 얼마나 남는지가 없다면, 같은 금액을 두고도 무엇을
            비교하는지 알 수 없게 됩니다. 판단 기준은{' '}
            <Link href="/backlink">링크가 어떻게 평가에 반영되는지</Link> 정리한 페이지에 더 길게
            적어 두었습니다.
          </p>
        </div>
      </Section>

      <Section subtle ariaLabelledBy="structure-title">
        <SectionHead
          eyebrow="05 / 서비스별 가격 구조"
          id="structure-title"
          title="네 가지 작업은 같은 단위로 비교할 수 없습니다."
          lead="가격표를 나란히 놓으면 같은 성격의 상품처럼 보이지만, 각 작업은 산출물이 다릅니다. 무엇에 값이 매겨지는지가 다르기 때문에 시작가만으로 우열을 가릴 수 없습니다."
        />
        <div className="bl-grid bl-grid--2">
          {PRICING.map(group => {
            const structure = PRICE_STRUCTURE[group.service]
            const service = getService(group.service)
            return (
              <Card key={group.service}>
                <IconSurface name={service?.icon ?? 'spark'} />
                <CardTitle>{group.label}</CardTitle>
                <CardBody>
                  <strong>무엇에 값이 매겨지는가</strong>
                  <br />
                  {structure.unit}
                </CardBody>
                <CardBody>{structure.body}</CardBody>
              </Card>
            )
          })}
        </div>
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
            비용을 더 쓰기 전에 이쪽부터 확인하는 편이 낫습니다. 링크 작업과 나란히 비교하기보다,
            지금 막혀 있는 지점이 어느 쪽인지를 먼저 정하는 것이 순서에 맞습니다.
          </p>
        </div>
      </Section>

      <Section ariaLabelledBy="compare-title">
        <SectionHead
          eyebrow="06 / 예산 배분 비교"
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
        <TelegramCTABlock source="pricing" cta="budget" position="mid" />
      </Section>

      <Section subtle ariaLabelledBy="budget-order-title">
        <SectionHead
          eyebrow="07 / 예산을 정하는 순서"
          id="budget-order-title"
          title="금액을 먼저 정하면 순서가 뒤집힙니다."
          lead="월 얼마를 쓸지부터 정하고 그 금액에 맞는 구성을 고르는 방식이 가장 흔합니다. 다만 그렇게 정해진 금액은 목표에 필요한 양과 무관하게 결정된 숫자입니다. 저희는 아래 순서로 접근합니다."
        />
        <div className="bl-grid bl-grid--4">
          {BUDGET_ORDER.map(item => (
            <Card key={item.step}>
              <IconSurface name={item.icon} />
              <span className="bl-related__label">{item.step}</span>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          이 순서를 지키면 예산이 부족할 때도 대화가 끊기지 않습니다. 필요한 범위가 먼저 그려져
          있으면 그중 무엇을 이번에 하고 무엇을 다음으로 미룰지 고를 수 있기 때문입니다. 범위가
          그려지지 않은 채 금액만 정해져 있으면 고를 대상 자체가 없습니다.
        </p>
      </Section>

      <Section ariaLabelledBy="priority-title">
        <SectionHead
          eyebrow="08 / 지출 우선순위"
          id="priority-title"
          title="같은 예산이라도 어디에 먼저 쓰느냐로 결과가 갈립니다."
          lead="예산이 충분한 경우는 많지 않습니다. 그래서 실제로 중요한 판단은 얼마를 쓰느냐가 아니라 무엇에 먼저 쓰느냐입니다. 지금 사이트에서 관찰되는 증상에 따라 먼저 볼 곳이 달라집니다."
        />
        <div className="bl-grid bl-grid--3">
          {BUDGET_PRIORITY.map(item => (
            <Card key={item.title}>
              <IconSurface name={item.icon} />
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <InsightBlock
          tone="accent"
          title="링크가 병목이 아닌 사이트에서 링크를 더 사는 것이 가장 비싼 선택이 됩니다."
        >
          금액이 커서가 아니라, 지출은 발생했는데 막혀 있던 지점이 그대로 남기 때문입니다. 색인이
          닫혀 있거나 페이지가 다른 질문에 답하고 있는 상태에서는 참조가 늘어도 그 신호를 받을 자리
          자체가 준비되어 있지 않습니다. 그래서 상담에서 지금은 링크가 아니라 구조부터 보는 편이
          낫다고 판단되면 그렇게 말씀드립니다. 어떤 조건이 함께 작용하는지는{' '}
          <Link href="/google-ranking">검색 결과가 결정되는 방식</Link>에 정리해 두었습니다.
        </InsightBlock>
      </Section>

      <Section subtle ariaLabelledBy="multisite-title">
        <SectionHead
          eyebrow="09 / 다사이트 운영"
          id="multisite-title"
          title="여러 사이트를 함께 진행하면 겹치는 작업이 줄어듭니다."
          lead="사이트를 하나씩 따로 맡기면 분석과 준비가 매번 처음부터 반복됩니다. 함께 보면 일부 작업을 병렬로 처리할 수 있고, 사이트 수가 늘어날수록 개별 진행보다 효율적인 비용 구조를 설계할 수 있습니다."
        />
        <div className="bl-grid bl-grid--4">
          {MULTISITE_SHARED.map(item => (
            <Card key={item.title}>
              <IconSurface name={item.icon} />
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <div className="bl-stack" style={{ marginTop: '2rem' }}>
          <p className="bl-body bl-measure">
            다만 사이트 수만으로 금액이 정해지지는 않습니다. 업종과 목표 키워드가 얼마나 겹치는지,
            각 사이트가 지금 어느 단계에 있는지에 따라 실제로 병렬화되는 범위가 달라지기 때문입니다.
            겹치는 부분이 많을수록 함께 처리할 수 있는 작업이 늘고, 사이트마다 상태가 전혀 다르면
            나눠서 보는 편이 나은 경우도 있습니다.
          </p>
          <p className="bl-body bl-measure">
            그래서 이 페이지에는 사이트 수에 따른 묶음 금액을 따로 적지 않았습니다. 확인되지 않은
            기준을 표로 만들어 두면 실제 상담에서 다시 뒤집어야 하기 때문입니다. 운영 중인 사이트
            목록과 각각의 목표를 알려주시면 어디를 묶고 어디를 따로 진행할지부터 정리해 드립니다.
          </p>
        </div>
      </Section>

      <Section ariaLabelledBy="mix-title">
        <SectionHead
          eyebrow="10 / 상담형 구성"
          id="mix-title"
          title="패키지를 고르는 대신 필요한 작업을 조합합니다."
          lead="위 가격표는 자주 진행되는 구성을 정리해 둔 것이지, 그중 하나를 반드시 골라야 하는 목록은 아닙니다. 실제 진행은 지금 필요한 작업만 남기고 나머지를 덜어내는 쪽에 가깝습니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            예를 들어 링크가 이미 어느 정도 쌓여 있는 사이트라면 링크를 더 늘리는 대신 구조 점검과
            문서 재설계에 예산을 쓰는 편이 나을 수 있습니다. 반대로 페이지 준비가 끝난 사이트라면
            링크 쪽에 예산을 모으는 것이 맞습니다. 같은 금액을 어떻게 나누는지가 구성입니다.
          </p>
          <p className="bl-body">
            아래는 가격표에 금액이 적혀 있지 않고 상담으로만 진행하는 작업입니다. 사이트마다 필요한
            범위가 크게 달라서 미리 금액을 정해 두지 않았습니다.
          </p>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <ConsultServices />
        </div>
        <p className="bl-closing">
          어떤 조합이 맞는지는 사이트 상태를 보고 정합니다. 서비스별로 무엇을 하는 작업인지는{' '}
          <Link href="/services">서비스 안내</Link>에, 맡길 곳을 비교할 때 확인할 항목은{' '}
          <Link href="/backlink-agency">백링크 업체 판단 기준</Link>에 정리해 두었습니다.
        </p>
      </Section>

      <Section size="sm" ariaLabelledBy="pricing-multisite-cta-title">
        <h2 id="pricing-multisite-cta-title" className="bl-sr-only">
          다사이트 구성 상담
        </h2>
        <TelegramCTABlock
          source="pricing"
          cta="budget"
          position="mid"
          title="여러 사이트를 함께 보고 계신가요?"
          body="사이트 목록과 각각의 목표 키워드를 알려주시면 어디를 묶고 어디를 따로 진행할지부터 정리해 드립니다. 지금 진행하지 않아도 되는 사이트가 있으면 그렇게 말씀드립니다."
          label="다사이트 구성 상담하기"
        />
      </Section>

      <FAQSection
        items={faq}
        id="pricing-faq"
        eyebrow="11 / 자주 묻는 질문"
        title="가격에 대해 자주 받는 질문"
        moreHref="/faq"
        moreLabel="전체 질문 보기"
        subtle
      />

      <Section ariaLabelledBy="related-title">
        <SectionHead
          eyebrow="12 / 다음 단계"
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
        cta="budget"
        title="예산을 먼저 알려주셔도 괜찮습니다."
        body="사이트 주소와 목표 키워드, 생각하시는 범위를 알려주시면 그 안에서 가능한 구성과 우선순위를 정리해 드립니다."
        label="예산에 맞는 구성 문의하기"
      />
    </>
  )
}
