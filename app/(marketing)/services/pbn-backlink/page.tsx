/**
 * /services/pbn-backlink — PBN 백링크 (Tier A)
 *
 * 검색의도 메모
 * `PBN 백링크` 를 검색하는 사람의 다수는 구매 직전이 아니라 "이게 위험한가" 를 확인하려는 상태다.
 * 그래서 이 페이지는 강도 자랑이 아니라 (1) 구조 설명 (2) 맞지 않는 경우의 명시
 * (3) 리스크의 정직한 서술 순서로 구성한다.
 *
 * ⚠️ 금지: 확인되지 않은 성과 수치, 안전·무위험 단언, 기간을 못박은 순위 약속, 경쟁사 일반화 비방.
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
import { FAQSection } from '@/components/marketing/FAQSection'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle, BulletList } from '@/components/ui/Card'
import { KeyTakeaways } from '@/components/content/KeyTakeaways'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedArticles } from '@/components/content/RelatedArticles'
import { ServiceSchema } from '@/components/seo/ServiceSchema'

import { getService } from '@/config/services'
import { getPricingGroup, formatKrw, PRICE_FACTORS } from '@/config/pricing'
import { getFaqByCategory } from '@/config/faq'
import { SEO_GRAPH, resolveArticles } from '@/config/seo-graph'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'PBN 백링크 — 구성 방식과 리스크까지 확인하기',
  description:
    'PBN 백링크가 어떻게 구성되는지, 어떤 사이트에는 권하지 않는지, 감수해야 하는 리스크는 무엇인지 정리했습니다. 품질 판단 기준과 구성별 가격도 함께 공개합니다.',
  alternates: { canonical: '/services/pbn-backlink' },
  openGraph: {
    title: 'PBN 백링크 — 구성 방식과 리스크까지 확인하기',
    description:
      '강하다는 말 대신 구조를 공개합니다. PBN이 맞는 경우와 권하지 않는 경우, 품질을 가르는 항목, 그리고 한계까지 적었습니다.',
    url: '/services/pbn-backlink',
  },
}

const PBN_QUESTIONS = [
  'PBN이 정확히 무엇인지, 일반적인 백링크와 무엇이 다른지 궁금하신가요?',
  'PBN은 위험하다는 글을 읽고 판단이 서지 않으신가요?',
  '경쟁이 심한 키워드에서 지금 방식으로는 더 올라가지 않나요?',
  '견적은 받았는데 어떤 사이트에서 링크가 생기는지는 듣지 못하셨나요?',
]

const TAKEAWAYS = [
  'PBN은 링크가 걸리는 사이트를 직접 운영하는 방식입니다. 외부에 요청해서 얻는 링크와 통제 범위가 다릅니다.',
  '같은 이름을 쓰더라도 도메인 이력·콘텐츠·호스팅 구성에 따라 품질 편차가 큽니다.',
  '구글이 권장하는 링크 획득 방식은 아닙니다. 위험이 0이라고 말할 수 있는 링크 작업은 없습니다.',
  '검색의도에 맞는 문서가 아직 없는 사이트라면, PBN보다 먼저 정리할 것이 있습니다.',
]

const FIT_ROWS = [
  {
    header: '콘텐츠 상태',
    cells: [
      '목표 키워드에 대응하는 문서가 이미 있고, 들어온 사람이 읽을 내용이 채워져 있습니다.',
      '검색의도에 맞는 문서가 아직 없어 유입이 생겨도 받아낼 페이지가 없습니다.',
    ],
  },
  {
    header: '링크 프로필',
    cells: [
      '유입 경로와 앵커가 비교적 고르게 퍼져 있어 신호를 더할 여지가 있습니다.',
      '이미 특정 앵커 한두 개에 링크가 몰려 있어, 추가 작업이 편중을 더 키우게 됩니다.',
    ],
  },
  {
    header: '목표 키워드',
    cells: [
      '상위에 있는 경쟁 사이트가 강해 현재 신호로는 밀리는 키워드입니다.',
      '경쟁이 약해 온페이지 정리와 문서 보완만으로도 움직일 수 있는 키워드입니다.',
    ],
  },
  {
    header: '브랜드 리스크',
    cells: [
      '검색 유입이 흔들리는 상황을 감당할 수 있는 범위 안에 있습니다.',
      '검색 유입이 사실상 유일한 매출 창구라 변동을 감수할 수 없는 상태입니다.',
    ],
  },
  {
    header: '사이트 성격',
    cells: [
      '일반 상업 사이트로, 권위 신호를 늘려야 하는 단계에 있습니다.',
      '금융·의료·법률처럼 신뢰성 평가가 엄격한 영역이거나 공식성이 중요한 사이트입니다.',
    ],
  },
  {
    header: '이후 운영 계획',
    cells: [
      '작업 이후에도 콘텐츠와 온페이지를 이어서 손볼 계획이 있습니다.',
      '링크 한 번으로 끝낼 계획이라 이후 관리 주체가 정해져 있지 않습니다.',
    ],
  },
]

const QUALITY_CRITERIA = [
  {
    title: '도메인의 이력',
    body: '지표가 좋아 보여도 과거에 스팸 목적으로 소모된 흔적이 있으면 사용하지 않습니다. 그 도메인이 원래 어떤 주제로 운영됐는지를 먼저 확인합니다.',
  },
  {
    title: '사이트별 고유 콘텐츠',
    body: '같은 문장을 복사해 여러 사이트를 채우면 네트워크 전체가 하나의 패턴으로 묶입니다. 사이트마다 다루는 주제와 문서를 따로 둡니다.',
  },
  {
    title: '호스팅과 IP 구성',
    body: '여러 사이트가 같은 서버, 같은 대역에 몰려 있으면 사이트 사이의 관계가 그대로 드러납니다. 호스팅 환경과 IP를 나눠 운영합니다.',
  },
  {
    title: '링크가 놓이는 문맥',
    body: '본문 흐름과 상관없는 자리에 링크만 끼워 넣지 않습니다. 문서의 주제와 링크 대상이 자연스럽게 이어지는 위치에 배치합니다.',
  },
  {
    title: '앵커 텍스트 분산',
    body: '목표 키워드만 반복해서 걸면 링크 프로필이 한쪽으로 기울어집니다. 브랜드명·URL·일반 표현을 섞어 비율을 먼저 설계합니다.',
  },
  {
    title: '내보내는 링크의 밀도',
    body: '한 사이트가 서로 무관한 사이트로 링크를 끝없이 내보내면 그 사이트의 신뢰도부터 떨어집니다. 아웃바운드 링크의 수와 주제 범위를 관리합니다.',
  },
]

const DELIVERABLES = [
  {
    title: '작업 URL 목록',
    body: '링크가 생성된 페이지 주소를 그대로 전달드립니다. 직접 열어보고 어떤 문서에 어떤 형태로 놓였는지 확인하실 수 있습니다.',
  },
  {
    title: '앵커 텍스트 내역',
    body: '각 링크에 어떤 문구를 썼는지, 전체 비율이 어떻게 구성됐는지 함께 적습니다. 앵커가 한쪽으로 몰리지 않았는지 직접 확인하실 수 있습니다.',
  },
  {
    title: '이후 방향 정리',
    body: '이번 작업으로 어떤 부분이 채워졌고 다음에 볼 영역은 어디인지 정리해 드립니다. 링크를 더 넣는 것이 답이 아닌 경우도 그대로 말씀드립니다.',
  },
]

const RISK_CONTROLS = [
  {
    title: '인프라를 나눕니다',
    body: '호스팅 업체와 IP 대역을 나눠 사용합니다. 네트워크 전체가 하나의 발자국으로 묶이지 않게 하는 최소 조건이라고 보고 있습니다.',
  },
  {
    title: '사이트를 콘텐츠로 유지합니다',
    body: '링크만 걸린 껍데기 문서를 만들지 않습니다. 각 사이트가 자기 주제를 갖고 문서를 유지하도록 운영합니다.',
  },
  {
    title: '앵커와 속도를 분산합니다',
    body: '같은 문구를 한 번에 몰아 넣지 않습니다. 기간과 앵커를 나눠 진행해 링크가 급격히 한 방향으로 쏠리지 않게 합니다.',
  },
  {
    title: '맞지 않으면 권하지 않습니다',
    body: '상담 과정에서 지금 단계에 PBN이 필요하지 않다고 판단되면 그대로 말씀드립니다. 판매만 생각한다면 굳이 하지 않을 이야기입니다.',
  },
]

export default function PbnBacklinkPage() {
  const service = getService('pbn-backlink')!
  const pricing = getPricingGroup('pbn-backlink')!
  const cluster = SEO_GRAPH.pbnBacklink
  const faq = getFaqByCategory('PBN')
  const articles = resolveArticles(cluster.relatedArticles)
  const relatedPages = [cluster.pillar, cluster.moneyPage, ...cluster.relatedPages]

  return (
    <>
      <ServiceSchema service={service} />

      <Breadcrumb
        trail={[
          { href: '/services', label: '서비스' },
          { href: '/services/pbn-backlink', label: 'PBN 백링크' },
        ]}
      />

      <Hero
        eyebrow="PBN BACKLINK"
        title={
          <>
            <span className="bl-break">PBN 백링크,</span>
            강하다는 말보다 어떻게 구성되는지를 확인하세요.
          </>
        }
        support="PBN은 링크가 생기는 자리를 직접 운영하는 방식입니다. 그래서 같은 이름을 붙이더라도 네트워크를 어떻게 만들고 관리하느냐에 따라 결과가 전혀 달라집니다. 이 페이지에는 구성 방식과 판단 기준, 그리고 감수해야 하는 부분까지 함께 적었습니다."
        actions={
          <>
            <TelegramCTA
              source="pbn-backlink"
              position="hero"
              size="lg"
              label="PBN 구성이 맞는지 상담하기"
            />
            <Button href="/pricing" variant="secondary" size="lg">
              가격이 달라지는 이유 보기
            </Button>
          </>
        }
        note="Telegram으로 연결됩니다 · 사이트 주소와 목표 키워드만 있으면 됩니다"
      />

      <ProblemSection
        eyebrow="01 / SITUATION"
        title={
          <>
            <span className="bl-break">PBN을 찾아보는 분들은</span>
            대체로 이런 상황에 있습니다.
          </>
        }
        questions={PBN_QUESTIONS}
        closing="네 질문 모두 결국 한 지점을 향합니다. PBN이 센지 약한지가 아니라, 지금 내 사이트에 이 방식이 맞는지입니다. 그래서 아래는 자랑 대신 구조부터 설명하겠습니다."
        subtle
      />

      <Section ariaLabelledBy="pbn-definition-title">
        <SectionHead
          eyebrow="02 / DEFINITION"
          id="pbn-definition-title"
          title="PBN은 링크가 놓이는 자리를 직접 운영하는 방식입니다."
          lead="Private Blog Network의 줄임말입니다. 외부 사이트에 게재를 요청하는 방식과 달리, 링크가 걸릴 사이트 자체를 운영 주체가 직접 관리합니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            어떤 도메인에서, 어떤 문서 안에서, 어떤 문장 옆에 링크가 놓일지를 작업하는 쪽이 정할 수
            있다는 뜻입니다. 외부 매체에 요청해서 얻는 링크는 게재 여부와 문맥을 상대가 정하지만,
            PBN은 그 결정을 안쪽에서 합니다. 링크가 언제, 어떤 형태로 붙는지 예측이 되는 것이 이
            방식의 실질적인 이점입니다.
          </p>
          <p className="bl-body">
            그런데 바로 그 통제권이 위험 지점이기도 합니다. 원하는 맥락으로 배치할 수 있는 만큼,
            네트워크를 성의 없이 굴리면 그 흔적도 그대로 남기 때문입니다. 사이트를 한 서버에
            몰아넣고 자동 생성한 글로 채운 네트워크는 사람이 열어봐도 부자연스럽고, 기계가 패턴을
            찾아내기도 상대적으로 쉽습니다.
          </p>
          <p className="bl-body">
            그래서 PBN이냐 아니냐라는 질문은 절반만 유효합니다. 실제로 결과를 가르는 것은 그
            네트워크가 어떤 도메인으로, 어떤 콘텐츠 위에서, 어떤 인프라를 쓰며 운영되는지입니다.
            이어지는 내용은 그 확인 항목을 정리한 것입니다. 링크라는 신호 자체가 어떻게 작동하는지
            부터 보고 싶다면 <Link href="/backlink">백링크의 작동 구조</Link>를 먼저 읽어보셔도
            됩니다.
          </p>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <KeyTakeaways items={TAKEAWAYS} />
        </div>
      </Section>

      <Section subtle ariaLabelledBy="pbn-fit-title">
        <SectionHead
          eyebrow="03 / FIT"
          id="pbn-fit-title"
          title="PBN은 모든 사이트에 권하지 않습니다."
          lead="이 문장을 서비스 페이지에 적는 것이 이상해 보일 수 있습니다. 그런데 맞지 않는 상태에서 진행하면 비용만 쓰고 원인은 그대로 남습니다. 아래 표는 상담에서 실제로 확인하는 항목입니다."
        />
        <ComparisonTable
          caption="PBN을 검토할 수 있는 경우와 지금은 권하지 않는 경우 비교"
          columns={['PBN을 검토할 수 있는 경우', '지금은 권하지 않는 경우']}
          rowHeader="판단 항목"
          rows={FIT_ROWS}
        />
        <div className="bl-stack bl-measure" style={{ marginTop: '2.5rem' }}>
          <p className="bl-body">
            권하지 않는 쪽을 조금 더 구체적으로 적겠습니다. 첫째, 목표 키워드로 들어온 사람이 읽을
            문서가 아직 없는 사이트입니다. 링크는 이 페이지를 봐 달라는 신호이지, 페이지 안에 없는
            답을 만들어내지 못합니다. 이런 경우에는{' '}
            <Link href="/services/content-seo">검색의도에 맞는 문서를 먼저 만드는 작업</Link>이
            순서상 앞섭니다.
          </p>
          <p className="bl-body">
            둘째, 이미 특정 앵커 한두 개에 링크가 몰려 있는 사이트입니다. 여기에 같은 방향의 링크를
            더하면 편중이 완화되는 것이 아니라 심해집니다. 이럴 때는 단일 상품보다{' '}
            <Link href="/services/plan-backlink">유형 조합부터 다시 설계하는 방식</Link>이
            안전합니다.
          </p>
          <p className="bl-body">
            셋째, 브랜드 리스크를 감수할 수 없는 경우입니다. 검색 유입이 유일한 매출 창구이거나,
            신뢰성 평가가 엄격한 업종이거나, 노출이 흔들리는 기간을 견딜 여력이 없다면 이 방식은
            선택지에서 빼는 편이 낫습니다. 넷째, 링크를 늘렸는데 변화가 없었던 사이트입니다. 이때
            같은 처방을 반복하기 전에{' '}
            <Link href="/services/onpage-seo">페이지가 평가받을 준비가 됐는지</Link> 확인하는 것이
            먼저입니다.
          </p>
        </div>
      </Section>

      <Section ariaLabelledBy="pbn-quality-title">
        <SectionHead
          eyebrow="04 / QUALITY"
          id="pbn-quality-title"
          title="품질은 개수가 아니라 이 항목들에서 갈립니다."
          lead="몇 개를 넣는지는 견적서에 적기 쉬운 숫자일 뿐입니다. 실제로 차이를 만드는 것은 링크 하나가 어떤 환경에 놓이는가입니다. 업체를 비교하실 때 그대로 질문해 보셔도 좋습니다."
        />
        <div className="bl-grid bl-grid--3">
          {QUALITY_CRITERIA.map(item => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          여섯 항목 중 어느 하나만 무너져도 나머지가 상쇄해 주지 않습니다. 판단 기준을 좀 더 넓게
          가져가고 싶다면{' '}
          <Link href="/blog/high-quality-backlink-criteria">좋은 백링크를 가르는 기준</Link>을 함께
          보시면 도움이 됩니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="pbn-process-title">
        <SectionHead
          eyebrow="05 / PROCESS"
          id="pbn-process-title"
          title="합의 없이 링크부터 심지 않습니다."
          lead="주문을 받자마자 작업을 시작하지 않습니다. 무엇을 왜 하는지 먼저 맞추고, 그 범위 안에서만 진행합니다."
        />
        <ProcessSteps />
        <p className="bl-closing">
          PBN에서는 세 번째 단계에서 정할 것이 하나 더 있습니다. 링크를 어느 페이지로 보낼지, 그리고
          앵커를 어떤 비율로 나눌지입니다. 홈으로 몰아주는 것과 상세 페이지로 나누는 것은 이후
          흐름이 완전히 달라지기 때문에, 이 결정을 작업자 임의로 하지 않고 먼저 확인합니다.
        </p>
      </Section>

      <Section size="sm" ariaLabelledBy="pbn-deliverables-title">
        <SectionHead
          eyebrow="06 / DELIVERABLES"
          id="pbn-deliverables-title"
          title="무엇을 했는지 확인할 수 없는 상태로 작업을 끝내지 않습니다."
          lead="링크 작업은 눈에 잘 보이지 않아서, 끝난 뒤에 무엇이 남았는지가 특히 중요합니다."
        />
        <div className="bl-grid bl-grid--3">
          {DELIVERABLES.map(item => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <div className="bl-notice" style={{ marginTop: '2rem' }}>
          <p>
            <strong>리포트에 들어가지 않는 것도 미리 말씀드립니다.</strong> 특정 순위나 특정 시점을
            약속하는 항목은 없습니다. 검색 결과는 검색엔진의 판단과 경쟁 사이트의 움직임에 함께
            좌우되기 때문에, 저희가 확인해 드릴 수 있는 것은 실제로 수행한 작업의 내역입니다.
          </p>
        </div>
      </Section>

      <Section subtle bordered ariaLabelledBy="pbn-risk-title">
        <SectionHead
          eyebrow="07 / RISK"
          id="pbn-risk-title"
          title="위험이 없다고 말하지는 않겠습니다."
          lead="이 부분을 흐리게 넘기는 설명이 많아서, 먼저 분명히 적어 두겠습니다."
        />
        <div className="bl-notice">
          <p>
            <strong>PBN은 구글이 권장하는 링크 획득 방식이 아닙니다.</strong> 구글의 스팸 정책은
            순위를 목적으로 만들어진 링크를 조작 신호로 봅니다. PBN도 그 범주에서 검토되는 방식이며,
            이를 다르게 표현하지 않겠습니다.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            그리고 위험이 0인 링크 작업은 존재하지 않습니다. 외부에서 얻는 어떤 링크든 검색엔진의
            평가 기준이 바뀌면 함께 다시 평가됩니다. 안전을 단언하는 설명이 있다면 그 근거를
            물어보시는 편이 좋습니다.
          </p>
        </div>
        <div className="bl-grid bl-grid--2" style={{ marginTop: '2.5rem' }}>
          {RISK_CONTROLS.map(item => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <div className="bl-stack bl-measure" style={{ marginTop: '2.5rem' }}>
          <p className="bl-body">
            한계도 함께 적겠습니다. 링크는 사이트의 권위 신호를 다루는 작업이지, 콘텐츠가 비어 있는
            문제를 대신 해결해 주지 않습니다. 문서가 검색한 사람의 질문에 답하지 못하면 신호를
            더해도 체류와 재방문에서 다시 걸립니다.
          </p>
          <p className="bl-body">
            반영 시점도 미리 약속할 수 없습니다. 사이트 상태와 키워드 경쟁 강도에 따라 며칠 안에
            변화가 보이는 경우도 있고, 몇 달에 걸쳐 천천히 움직이는 경우도 있습니다. 그래서 저희는
            기간과 순위를 숫자로 약속하는 대신, 어떤 지표를 언제 확인할지를 시작 시점에 함께
            정합니다. 순위가 움직이지 않는 이유가 링크 밖에 있을 가능성은{' '}
            <Link href="/google-ranking">구글 상위노출에서 막히는 지점</Link>에 따로 정리해
            두었습니다.
          </p>
        </div>
      </Section>

      <Section ariaLabelledBy="pbn-pricing-title">
        <SectionHead
          eyebrow="08 / PRICING"
          id="pbn-pricing-title"
          title="구성별 가격을 먼저 공개합니다."
          lead={`${pricing.label} 구성은 ${formatKrw(pricing.from)}에서 시작합니다. 다만 같은 구성이라도 사이트 상태와 키워드 경쟁도에 따라 필요한 작업량이 달라지므로, 최종 구성은 상황을 본 뒤에 안내드립니다.`}
        />
        <div className="bl-grid bl-grid--2">
          <PricingCard group={pricing} />
          <Card>
            <CardTitle>같은 서비스인데 견적이 달라지는 이유</CardTitle>
            <CardBody>
              가격표의 숫자만으로는 무엇에 비용을 내는지 알기 어렵습니다. 아래 다섯 가지가 실제로
              작업량을 결정합니다.
            </CardBody>
            <BulletList items={PRICE_FACTORS.map(factor => factor.title)} />
            <p className="bl-card__meta">
              <Link href="/pricing" className="bl-btn bl-btn--ghost">
                항목별 설명 보기 &rarr;
              </Link>
            </p>
          </Card>
        </div>
      </Section>

      <Section size="sm">
        <TelegramCTABlock
          source="pbn-backlink"
          position="mid"
          title="지금 단계에 PBN이 필요한지부터 확인해 보세요."
          body="사이트 주소와 목표 키워드를 알려주시면, 현재 상태에서 이 방식이 맞는지 아니면 먼저 정리할 것이 있는지 판단해 드립니다. 맞지 않으면 맞지 않는다고 말씀드립니다."
          label="PBN 구성이 맞는지 상담하기"
        />
      </Section>

      <FAQSection
        items={faq}
        id="faq-pbn"
        eyebrow="09 / FAQ"
        title="PBN에서 자주 받는 질문"
        moreHref="/faq"
        moreLabel="다른 질문도 보기"
        subtle
      />

      <Section size="sm">
        <RelatedContent heading="함께 보면 좋은 페이지" hrefs={relatedPages} columns={2} />
        <div style={{ marginTop: '2.5rem' }}>
          <RelatedArticles heading="판단 기준을 더 챙기고 싶다면" posts={articles} />
        </div>
      </Section>

      <FinalCTA
        source="pbn-backlink"
        title="PBN이 맞는 상황인지, 한 번 확인해 보시겠어요?"
        body="사이트 주소와 목표 키워드만 있으면 첫 판단은 가능합니다. 필요하지 않다고 보이면 그 이유를 함께 말씀드립니다."
        label="PBN 구성이 맞는지 상담하기"
      />
    </>
  )
}
