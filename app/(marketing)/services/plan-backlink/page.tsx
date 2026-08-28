/**
 * /services/plan-backlink — 플랜 백링크 (보조 키워드: 백링크 패키지)
 *
 * 이 페이지의 역할
 * - "무엇부터 해야 할지 모르겠다"는 상태를 조합 설계라는 관점으로 옮긴다.
 * - 다른 서비스 페이지와 문장을 공유하지 않는다. 핵심 섹션은 "조합을 설계하는 방식"이다.
 * - 표시되는 금액은 전부 config/pricing.ts 에서 나온다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { ProblemSection } from '@/components/marketing/ProblemSection'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { ProcessSteps } from '@/components/marketing/ProcessSteps'
import { PricingCard } from '@/components/marketing/PricingCard'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardTitle, CardBody, BulletList } from '@/components/ui/Card'
import { IconSurface } from '@/components/ui/Icon'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedServices } from '@/components/content/RelatedServices'
import { ServiceSchema } from '@/components/seo/ServiceSchema'

import { SERVICES, getService } from '@/config/services'
import { getPricingGroup } from '@/config/pricing'
import { ctaLabel } from '@/config/cta'
import { SEO_GRAPH } from '@/config/seo-graph'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '플랜 백링크 — 유형을 조합해 설계하는 백링크 패키지',
  description:
    '플랜 백링크는 상품 하나를 고르는 방식이 아니라 여러 링크 유형의 조합과 키워드 비율을 먼저 설계하는 백링크 패키지입니다. 어떤 기준으로 구성을 잡는지 공개합니다.',
  alternates: { canonical: '/services/plan-backlink' },
  openGraph: {
    title: '플랜 백링크 — 유형을 조합해 설계하는 백링크 패키지',
    description:
      '무엇부터 해야 할지 모르겠다면 상품보다 조합부터 봅니다. 링크 유형과 키워드 비율을 어떤 기준으로 나누는지 설명합니다.',
    url: '/services/plan-backlink',
  },
}

const PLAN_QUESTIONS = [
  'PBN이 지금 우리 사이트에 필요한 작업인지 판단이 서지 않나요?',
  '여러 유형을 섞어야 한다는 말은 들었는데, 어떻게 섞어야 할지 모르겠나요?',
  '예산을 어느 항목에 얼마나 배분해야 하는지 기준이 없으신가요?',
  '크게 시작해야 하는지, 작게 시작해도 되는지 결정이 어려우신가요?',
]

const WHEN_COMBINATION = [
  {
    icon: 'link',
    title: '외부 참조 이력이 거의 없는 사이트',
    body: '아직 어디에서도 언급된 적이 없는 상태에서 한 가지 경로로만 링크를 빠르게 쌓으면, 링크가 늘어난 모양이 지나치게 단조로워집니다. 시작 단계일수록 성격이 다른 경로에서 조금씩 들어오는 형태가 설명하기 쉽습니다.',
  },
  {
    icon: 'layers',
    title: '같은 유형만 반복해 온 사이트',
    body: '이전에 받은 링크가 특정 유형이나 특정 앵커 텍스트에 몰려 있다면, 같은 방향으로 더 쌓는다고 상황이 바뀌지 않을 수 있습니다. 이미 채워진 쪽이 아니라 비어 있는 쪽을 채우는 편이 낫습니다.',
  },
  {
    icon: 'target',
    title: '올려야 할 키워드가 여러 개인 사이트',
    body: '대표 키워드 하나에 모든 작업을 집중하면 나머지 페이지는 그대로 남습니다. 목표가 여러 개라면 어느 페이지에 얼마만큼 보낼지 배분을 먼저 정해야 합니다.',
  },
  {
    icon: 'chart',
    title: '예산을 나눠 단계적으로 진행하려는 경우',
    body: '한 번에 큰 금액을 쓰지 않고 작게 시작한 뒤 반응을 보며 넓히는 진행이 가능합니다. 이때 처음 잡아둔 구성이 이후 확장의 기준이 되므로, 첫 구성을 대충 만들지 않습니다.',
  },
]

const CRITERIA_ROWS = [
  {
    header: '기존 링크 이력',
    cells: [
      '지금까지 어떤 성격의 경로에서 링크를 받아왔는지',
      '이미 몰려 있는 유형은 비중을 줄이고, 비어 있는 쪽을 채웁니다',
    ],
  },
  {
    header: '목표 페이지',
    cells: [
      '홈을 올릴지, 상세·카테고리 페이지를 올릴지',
      '링크를 받는 대상 URL과 내부 연결 구조가 달라집니다',
    ],
  },
  {
    header: '키워드 구성',
    cells: [
      '대표 키워드 외에 함께 다뤄야 할 표현이 몇 개인지',
      '메인과 서브에 나눌 비율이 달라집니다',
    ],
  },
  {
    header: '색인·페이지 상태',
    cells: [
      '해당 페이지가 검색결과에 정상적으로 잡히고 있는지',
      '색인에서 막혀 있으면 링크보다 온페이지를 먼저 봅니다',
    ],
  },
  {
    header: '진행 속도',
    cells: ['한 번에 진행할지, 나눠서 확장할지', '시작 구성과 이후에 늘릴 순서가 달라집니다'],
  },
]

const BUDGET_ORDER = [
  '첫째, 링크가 향하는 목표 페이지를 넓힙니다. 받는 쪽이 한 페이지뿐이면 예산을 늘려도 같은 자리에 계속 쌓일 뿐입니다.',
  '둘째, 앵커 텍스트의 종류를 늘립니다. 같은 표현을 반복하는 것보다 부르는 방식을 나누는 편이 자연스럽습니다.',
  '셋째, 링크 유형의 폭을 넓힙니다. 쓰던 유형을 두 배로 늘리기보다 아직 쓰지 않은 경로를 더합니다.',
  '넷째, 그다음에 수량을 늘립니다. 앞의 세 가지가 정리되지 않은 상태에서 개수만 키우면 치우침도 같이 커집니다.',
]

const BEFORE_START = [
  '목표 사이트 주소',
  '올리고 싶은 메인 키워드 (여러 개면 함께 알려주시면 됩니다)',
  '서브 키워드를 함께 쓸지 여부',
  '메인·서브 키워드에 나눌 비율',
  '따로 반영해야 할 요청 사항',
]

export default function PlanBacklinkPage() {
  const service = getService('plan-backlink')
  const pricing = getPricingGroup('plan-backlink')
  const cluster = SEO_GRAPH.planBacklink
  // 서비스 페이지는 아래 RelatedServices 가 따로 다루므로 여기서는 제외해 중복 노출을 막는다.
  const serviceHrefs = new Set(SERVICES.map(item => item.href))
  const relatedHrefs = Array.from(
    new Set([cluster.pillar, cluster.moneyPage, ...cluster.relatedPages])
  ).filter(href => !serviceHrefs.has(href))
  const otherServiceSlugs = SERVICES.filter(item => item.slug !== 'plan-backlink').map(
    item => item.slug
  )

  return (
    <>
      {service ? <ServiceSchema service={service} /> : null}

      <Breadcrumb
        trail={[
          { href: '/services', label: '서비스' },
          { href: '/services/plan-backlink', label: '플랜 백링크' },
        ]}
      />

      <Hero
        eyebrow="플랜 백링크"
        title={
          <>
            <span className="bl-break">어떤 백링크를 선택해야 할지 모르겠다면,</span>
            하나의 상품보다 조합부터 봅니다.
          </>
        }
        support="플랜 백링크는 정해진 상품 하나를 골라 담는 방식이 아니라, 어떤 링크 유형을 어떤 비율로 섞을지부터 정하는 작업입니다. 사이트에 지금 무엇이 비어 있는지 확인한 다음 구성을 잡습니다."
        actions={
          <>
            <TelegramCTA
              source="plan-backlink"
              position="hero"
              label={ctaLabel('plan')}
              size="lg"
            />
            <Button href="/pricing" variant="secondary" size="lg">
              백링크 가격 기준 보기
            </Button>
          </>
        }
      />

      <ProblemSection
        eyebrow="01 / 현재 상황"
        title={
          <>
            <span className="bl-break">상품 목록을 아무리 봐도</span>무엇을 골라야 할지 정해지지
            않나요?
          </>
        }
        questions={PLAN_QUESTIONS}
        closing="이 질문들은 상품 설명을 한 번 더 읽는다고 풀리지 않습니다. 지금 사이트가 어떤 상태인지 확인해야 답이 나오는 질문이기 때문입니다."
        subtle
      />

      <Section ariaLabelledBy="when-title">
        <SectionHead
          eyebrow="02 / 필요한 상황"
          id="when-title"
          title="조합이 필요한 상황은 따로 있습니다."
          lead="모든 사이트에 조합형 구성이 맞는 것은 아닙니다. 아래 네 가지 중 하나에 해당한다면 단일 유형보다 조합을 먼저 검토할 이유가 있습니다."
        />
        <div className="bl-grid bl-grid--2">
          {WHEN_COMBINATION.map(item => (
            <Card key={item.title}>
              <IconSurface name={item.icon} />
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          반대로 경쟁이 아주 강한 키워드 하나를 정면으로 공략해야 한다면 조합보다 강도가 우선일 수
          있습니다. 그 경우에는{' '}
          <Link href="/services/pbn-backlink">PBN이 어떤 조건에서 유리한지</Link>를 먼저 확인하는
          편이 빠릅니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="criteria-title">
        <SectionHead
          eyebrow="03 / 판단 기준"
          id="criteria-title"
          title="구성을 짜기 전에 사이트를 먼저 봅니다."
          lead="같은 예산이라도 사이트 상태에 따라 구성이 달라집니다. 다음 다섯 가지를 확인한 뒤에야 어떤 유형을 얼마나 넣을지 정할 수 있습니다."
        />
        <ComparisonTable
          caption="플랜 백링크 구성을 정할 때 확인하는 기준"
          columns={['확인하는 내용', '구성이 달라지는 지점']}
          rowHeader="기준"
          rows={CRITERIA_ROWS}
        />
        <p className="bl-closing">
          확인 결과 색인이나 페이지 구조에서 막혀 있다고 판단되면 링크를 늘리자고 하지 않습니다.
          그때는 <Link href="/services/onpage-seo">페이지가 순위를 받을 준비가 되었는지부터</Link>{' '}
          정리하는 편이 결과적으로 비용이 덜 듭니다.
        </p>
      </Section>

      <Section size="lg" narrow ariaLabelledBy="design-title">
        <SectionHead
          eyebrow="04 / 설계 방식"
          id="design-title"
          title="조합을 설계하는 방식"
          lead="플랜 백링크에서 실제로 하는 일은 링크를 많이 만드는 것이 아니라, 링크가 생기는 방식이 한쪽으로 쏠리지 않게 나누는 것입니다. 어떤 기준으로 나누는지 그대로 적습니다."
        />

        <div className="bl-stack">
          <h3 className="bl-h3">한 가지 유형에 몰아넣지 않는 이유</h3>
          <p className="bl-body bl-measure">
            검색엔진은 링크의 개수만 세지 않습니다. 어떤 성격의 사이트에서, 어떤 문맥으로, 어느
            속도로 참조가 늘었는지를 함께 봅니다. 그래서 같은 수의 링크라도 전부 같은 유형·같은
            형태로 들어오면 그 링크들이 자연스럽게 생겼다고 보기 어려운 모양이 됩니다.
          </p>
          <p className="bl-body bl-measure">
            성격이 다른 경로가 섞여 있으면 이야기가 달라집니다. 한 경로의 평가가 낮아져도 링크
            프로필 전체가 한 번에 흔들리지 않습니다. 하나의 큰 기둥에 전부 걸어두는 대신 여러 지점에
            나눠 세우는 쪽에 가깝습니다. 조합을 설계한다는 말은 결국 이 분산을 의도적으로 만든다는
            뜻입니다.
          </p>
          <p className="bl-body bl-measure">
            다만 분산은 목적이 아니라 수단입니다. 유형을 늘리는 것 자체가 좋다고 보고 무작정 종류만
            늘리면, 목표 페이지와 관련이 옅은 링크가 섞이면서 구성이 흐려집니다. 그래서 유형을 고를
            때는 &lsquo;섞였는가&rsquo;가 아니라 &lsquo;이 페이지를 소개하는 자리로 말이
            되는가&rsquo;를 기준으로 판단합니다.
          </p>

          <h3 className="bl-h3">메인 키워드와 서브 키워드를 나누는 이유</h3>
          <p className="bl-body bl-measure">
            모든 링크의 앵커 텍스트를 목표 키워드 하나로 맞추면, 그 링크들이 순위를 목적으로
            만들어진 것이라는 사실이 그대로 드러납니다. 실제로 자연스럽게 쌓인 링크는 브랜드명,
            페이지 제목, 문장 일부, 관련 표현처럼 여러 형태로 흩어져 있습니다.
          </p>
          <p className="bl-body bl-measure">
            그래서 앵커를 메인 키워드와 서브 키워드(연관 표현·롱테일)로 나눠 배분합니다. 주문
            화면에서 기본값으로 제안하는 시작 비율은 메인 70 · 서브 30이며, 이 값은 고정된 규칙이
            아니라 조정할 수 있는 출발점입니다. 이미 특정 앵커가 많이 쌓여 있다면 메인 비중을
            낮추고, 아직 어떤 링크도 없는 사이트라면 브랜드·일반 표현부터 채우는 식으로 조정합니다.
          </p>
          <p className="bl-body bl-measure">
            비율을 나누면 다루는 표현의 폭도 함께 넓어집니다. 대표 키워드 한 개만 겨냥할 때보다 관련
            검색어에서 페이지가 언급될 자리가 늘어나기 때문입니다. 순위를 약속하는 이야기가 아니라,
            같은 예산으로 노려볼 수 있는 표현의 범위가 달라진다는 뜻입니다.
          </p>

          <h3 className="bl-h3">예산이 늘어나면 무엇부터 늘리는가</h3>
          <p className="bl-body bl-measure">
            예산이 커졌다고 모든 항목을 같은 배수로 늘리지 않습니다. 늘리는 데에도 순서가 있고, 이
            순서를 지키지 않으면 금액만 커지고 구성은 그대로인 결과가 나옵니다.
          </p>
          <BulletList items={BUDGET_ORDER} />
          <p className="bl-body bl-measure">
            이 순서대로 확장하면 예산을 두 배로 올렸을 때 링크 수만 두 배가 되는 것이 아니라, 링크가
            향하는 페이지와 부르는 표현, 들어오는 경로가 함께 넓어집니다. 반대로 순서를 건너뛰고
            수량부터 올리면 이미 치우쳐 있던 부분이 그대로 확대됩니다.
          </p>
          <p className="bl-body bl-measure">
            그리고 어느 단계에서는 조합만으로 부족하다고 판단될 때가 있습니다. 그때는 지금 구성 위에
            강도가 높은 작업을 얹는 것이 맞는지 함께 봅니다. 필요하지 않다고 판단되면 권하지
            않습니다.
            <Link href="/backlink">백링크가 어떤 원리로 작용하는지</Link> 알고 나면, 이 판단이 왜
            사이트마다 달라지는지도 같이 보입니다.
          </p>
        </div>
      </Section>

      <Section subtle ariaLabelledBy="included-title">
        <SectionHead
          eyebrow="05 / 포함 범위"
          id="included-title"
          title="무엇이 포함되고, 무엇을 먼저 여쭤보는지"
          lead="구성이 사람마다 달라지는 작업일수록 범위를 미리 적어두는 편이 낫습니다."
        />
        <div className="bl-grid bl-grid--2">
          <Card feature>
            <IconSurface name="check" />
            <CardTitle>구성에 포함되는 것</CardTitle>
            {pricing ? <BulletList items={pricing.includes} /> : null}
          </Card>
          <Card>
            <IconSurface name="search" />
            <CardTitle>시작 전에 확인하는 것</CardTitle>
            <BulletList items={BEFORE_START} />
          </Card>
        </div>
        <p className="bl-closing">
          작업이 끝나면 어떤 주소에 어떤 형태로 링크가 만들어졌는지 확인할 수 있도록 내역을 함께
          드립니다. 무엇을 했는지 확인할 수 없는 작업은 다음 판단의 근거가 되지 못하기 때문입니다.
        </p>
      </Section>

      <Section ariaLabelledBy="process-title">
        <SectionHead
          eyebrow="06 / 진행 방식"
          id="process-title"
          title="구성부터 확정하고 시작합니다."
          lead="무엇을 왜 넣었는지 합의한 다음에 작업을 시작합니다. 진행 중에 구성을 바꿔야 할 이유가 생기면 그것도 먼저 말씀드립니다."
        />
        <ProcessSteps />
      </Section>

      <Section subtle ariaLabelledBy="pricing-title">
        <SectionHead
          eyebrow="07 / 가격"
          id="pricing-title"
          title="플랜 백링크 가격"
          lead="구성 규모에 따라 라인업이 나뉩니다. 어느 라인업이 맞는지는 목표 키워드 수와 현재 링크 상태를 보고 정합니다."
        />
        {pricing ? <PricingCard group={pricing} /> : null}
        <p className="bl-closing">
          같은 라인업이라도 실제 구성은 사이트마다 달라집니다. 무엇이 금액을 움직이는지는{' '}
          <Link href="/pricing">가격이 달라지는 기준</Link>에 따로 정리해 두었습니다.
        </p>
      </Section>

      <Section size="sm">
        <TelegramCTABlock source="plan-backlink" cta="plan" position="mid" />
      </Section>

      <Section size="sm" bordered>
        <RelatedContent heading="함께 보면 좋은 페이지" hrefs={relatedHrefs} columns={2} />
        <div style={{ marginTop: '2.5rem' }}>
          <RelatedServices heading="다른 작업이 더 맞을 수도 있습니다" slugs={otherServiceSlugs} />
        </div>
      </Section>

      <FinalCTA
        source="plan-backlink"
        cta="plan"
        title="어떤 조합이 맞는지부터 정리해 드립니다."
        body="사이트 주소와 목표 키워드, 지금까지 해본 작업만 알려주시면 됩니다. 필요하지 않은 구성은 권하지 않습니다."
        label="조합 상담하기"
      />
    </>
  )
}
