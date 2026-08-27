/**
 * 콘텐츠 SEO /services/content-seo
 *
 * Primary keyword: 콘텐츠 SEO
 * 이 페이지의 역할
 * - 홈이 잡고 있는 대표 표현(백링크 구매·고품질 백링크·PBN)을 가져오지 않는다.
 * - "글은 있는데 검색 노출이 없다" 상황을 문서 구조 문제로 재정의하는 롱테일 페이지다.
 * - Before/After 는 문서 구조를 설명하기 위한 예시이며 고객 데이터가 아니다. 성과 수치를 붙이지 않는다.
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
import { Card, CardBody, CardTitle } from '@/components/ui/Card'
import { RelatedArticles } from '@/components/content/RelatedArticles'
import { RelatedContent } from '@/components/content/RelatedContent'
import { ServiceSchema } from '@/components/seo/ServiceSchema'

import { getService } from '@/config/services'
import { getPricingGroup, formatKrw } from '@/config/pricing'
import { SEO_GRAPH, resolveArticles } from '@/config/seo-graph'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '콘텐츠 SEO — 검색의도에 맞게 문서를 다시 설계합니다',
  description:
    '콘텐츠 SEO는 키워드를 더 넣는 작업이 아닙니다. 검색한 사람이 원하는 답이 문서 안에 있는지, 헤딩과 커버리지가 그 답을 담을 구조인지부터 확인합니다.',
  alternates: { canonical: '/services/content-seo' },
  openGraph: {
    title: '콘텐츠 SEO — 검색의도에 맞게 문서를 다시 설계합니다',
    description:
      '글은 쌓였는데 검색 노출로 이어지지 않는다면, 문장을 다듬기 전에 문서의 구조를 먼저 봐야 합니다.',
    url: '/services/content-seo',
  },
}

const CONTENT_QUESTIONS = [
  '글은 꾸준히 쌓고 있는데 검색 노출은 늘지 않나요?',
  '상위에 있는 페이지와 내용이 비슷해서 차이를 설명하기 어렵나요?',
  '목표 키워드를 본문에 넣었는데도 순위가 잡히지 않나요?',
  '유입은 조금 있는데 방문자가 첫 화면에서 바로 빠져나가나요?',
]

const MISCONCEPTIONS = [
  {
    label: '오해 1',
    title: '키워드를 더 많이 넣으면 된다',
    body: '같은 단어가 몇 번 나오는지는 문서가 주제를 얼마나 다루는지와 별개입니다. 반복이 늘어날수록 문장이 어색해지고, 읽는 사람이 먼저 떠납니다.',
  },
  {
    label: '오해 2',
    title: '글자 수를 늘리면 된다',
    body: '분량은 주제를 제대로 다루면 따라오는 결과이지 목표가 아닙니다. 답과 무관한 문단을 붙여 길이만 채운 문서는 읽는 시간만 늘립니다.',
  },
  {
    label: '오해 3',
    title: '상위 페이지와 비슷하게 쓰면 된다',
    body: '이미 검색결과에 있는 답을 한 번 더 옮겨 적은 문서는 새로 자리를 얻을 이유가 약합니다. 같은 주제라도 남아 있는 질문을 채워야 선택될 여지가 생깁니다.',
  },
]

const ELEMENTS = [
  {
    label: '01 / INTENT',
    title: '검색의도',
    body: '이 키워드를 입력한 사람이 무엇을 끝내고 싶은지부터 정의합니다. 개념을 이해하려는 검색과 업체를 비교하려는 검색은 필요한 문서가 다릅니다.',
  },
  {
    label: '02 / STRUCTURE',
    title: '콘텐츠 구조',
    body: '답을 먼저 주는지, 배경 설명부터 시작하는지 확인합니다. 스크롤 순서가 읽는 사람이 판단하는 순서와 어긋나면 내용이 좋아도 전달되지 않습니다.',
  },
  {
    label: '03 / HEADINGS',
    title: '헤딩',
    body: '헤딩만 훑어도 문서의 논리가 보이는지 봅니다. 장식용 문구 대신 독자가 실제로 떠올리는 질문을 헤딩으로 세웁니다.',
  },
  {
    label: '04 / COVERAGE',
    title: '주제 커버리지',
    body: '하나의 주제를 다룰 때 함께 따라오는 하위 질문이 빠져 있지 않은지 점검합니다. 비용, 조건, 한계, 대안처럼 검색자가 이어서 묻는 부분입니다.',
  },
  {
    label: '05 / LINKS',
    title: '내부링크',
    body: '읽고 난 뒤 궁금해질 내용을 어디로 연결할지 설계합니다. 앵커 텍스트가 도착 페이지를 설명하면 사람도 검색엔진도 문맥을 같이 이해합니다.',
  },
  {
    label: '06 / FLOW',
    title: '전환 흐름',
    body: '문서를 다 읽은 사람이 다음에 무엇을 할 수 있는지 남깁니다. 문의 지점을 문맥이 맞는 위치에 두는 것도 문서 구조의 일부입니다.',
  },
]

const STRUCTURE_ROWS = [
  {
    header: '첫 화면',
    cells: [
      '회사 소개와 인사말로 시작해, 검색어에 대한 답이 화면 아래에 있습니다.',
      '검색어가 묻는 것에 대한 답을 첫 문단에서 먼저 밝히고, 근거를 뒤에서 풉니다.',
    ],
  },
  {
    header: '헤딩 구성',
    cells: [
      '"서비스 특징", "왜 우리인가"처럼 회사 기준의 라벨이 이어집니다.',
      '"어떤 경우에 필요한가", "무엇이 달라지는가"처럼 독자가 실제로 던지는 질문을 세웁니다.',
    ],
  },
  {
    header: '다루는 범위',
    cells: [
      '장점 나열 위주로 한 각도에서만 설명합니다.',
      '판단 기준, 비용이 달라지는 이유, 맞지 않는 경우까지 하위 질문을 함께 다룹니다.',
    ],
  },
  {
    header: '키워드 처리',
    cells: [
      '같은 표현을 문단마다 넣어 문장이 부자연스러워집니다.',
      '문맥에 맞는 표현과 관련어로 자연스럽게 풀어 씁니다.',
    ],
  },
  {
    header: '근거 제시',
    cells: [
      '"최고", "최다" 같은 형용사가 근거 없이 반복됩니다.',
      '확인할 수 있는 사실만 적고, 확인되지 않은 값은 아예 쓰지 않습니다.',
    ],
  },
  {
    header: '내부링크',
    cells: [
      '"여기를 클릭"이 문서 하단에만 몰려 있습니다.',
      '문맥이 이어지는 지점에서 도착 페이지를 설명하는 앵커로 연결합니다.',
    ],
  },
  {
    header: '마무리',
    cells: [
      '문의를 유도하는 문장만 남습니다.',
      '읽은 내용을 정리하고, 다음 판단에 필요한 선택지를 남깁니다.',
    ],
  },
]

export default function ContentSeoPage() {
  const service = getService('content-seo')
  const pricing = getPricingGroup('content-seo')
  const cluster = SEO_GRAPH.contentSeo
  const articles = resolveArticles(cluster.relatedArticles)

  return (
    <>
      {service ? <ServiceSchema service={service} /> : null}

      <Breadcrumb
        trail={[
          { href: '/services', label: '서비스' },
          { href: '/services/content-seo', label: '콘텐츠 SEO' },
        ]}
      />

      <Hero
        eyebrow="CONTENT SEO"
        title={
          <>
            <span className="bl-break">검색엔진이 아니라,</span>
            검색하는 사람이 원하는 답부터 만듭니다.
          </>
        }
        support="검색결과에 올라가는 것은 사이트가 아니라 하나의 문서입니다. 그 문서가 검색어에 대한 답을 담고 있는지, 담을 수 있는 구조인지를 먼저 확인한 다음 문장을 다듬습니다."
        actions={
          <>
            <TelegramCTA
              source="content-seo"
              position="hero"
              label="콘텐츠 방향 상담하기"
              size="lg"
            />
            <Button href="/services/onpage-seo" variant="secondary" size="lg">
              온페이지 점검과 비교하기
            </Button>
          </>
        }
        note="Telegram으로 연결됩니다 · 목표 키워드와 해당 페이지 주소만 있으면 됩니다"
      />

      <ProblemSection
        eyebrow="01 / SITUATION"
        title={
          <>
            <span className="bl-break">글은 쌓이는데,</span>
            검색에서는 잘 보이지 않나요?
          </>
        }
        questions={CONTENT_QUESTIONS}
        closing="이런 상황에서는 글을 한 편 더 쓰는 것보다, 이미 있는 문서가 어떤 질문에 답하고 있는지를 먼저 확인하는 편이 빠릅니다."
        subtle
      />

      <Section ariaLabelledBy="reframe-title">
        <SectionHead
          eyebrow="02 / REFRAME"
          id="reframe-title"
          title="콘텐츠 SEO는 키워드를 반복하는 작업이 아닙니다."
          lead="검색엔진에게 키워드를 알리는 일과, 검색한 사람에게 답을 주는 일은 오랫동안 다른 작업처럼 취급돼 왔습니다. 지금은 두 가지가 사실상 같은 방향을 봅니다. 문서가 질문에 답하고 있으면 그 사실이 신호로 남고, 답하지 못하면 표현을 아무리 바꿔도 남길 신호가 없습니다."
        />
        <div className="bl-grid bl-grid--3">
          {MISCONCEPTIONS.map(item => (
            <Card key={item.title}>
              <span className="bl-related__label">{item.label}</span>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          그래서 이 작업의 출발점은 문장 교정이 아니라 질문 정리입니다. 이 페이지가 어떤 검색어의
          답이 되어야 하는지 합의한 뒤에 구조를 손댑니다. 페이지의 기술적 상태가 원인일 수도 있으니{' '}
          <Link href="/services/onpage-seo">페이지가 평가받을 준비가 됐는지</Link> 함께 보고, 더
          넓게는 <Link href="/google-ranking">순위가 움직이지 않는 여러 이유</Link>를 나눠서
          판단합니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="elements-title">
        <SectionHead
          eyebrow="03 / SCOPE"
          id="elements-title"
          title="문서에서 실제로 다루는 여섯 가지"
          lead="맞춤법이나 문체를 고치는 작업이 아닙니다. 검색 결과에서 선택될 수 있는 문서가 되도록 아래 여섯 가지를 순서대로 정리합니다."
        />
        <div className="bl-grid bl-grid--3">
          {ELEMENTS.map(element => (
            <Card key={element.title}>
              <span className="bl-related__label">{element.label}</span>
              <CardTitle>{element.title}</CardTitle>
              <CardBody>{element.body}</CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section ariaLabelledBy="structure-title">
        <SectionHead
          eyebrow="04 / STRUCTURE"
          id="structure-title"
          title={
            <>
              <span className="bl-break">같은 주제를 다루더라도</span>
              문서의 짜임은 이렇게 달라집니다.
            </>
          }
          lead="아래 표는 하나의 주제를 두 가지 방식으로 구성했을 때 어떤 차이가 생기는지를 보여 주는 문서 구조 예시입니다."
        />
        <div className="bl-notice" style={{ marginBottom: '1.5rem' }}>
          <p>
            <strong>이 표는 고객 데이터가 아닙니다.</strong> 실제 프로젝트의 순위나 트래픽 기록이
            아니라, 문서를 어떻게 구성하느냐에 따라 읽는 경험이 어떻게 달라지는지를 설명하기 위한
            구성 예시입니다. 구조를 바꾼 결과는 키워드 경쟁도와 사이트 상태에 따라 다르므로 여기에
            성과 수치를 붙이지 않습니다.
          </p>
        </div>
        <ComparisonTable
          caption="같은 주제를 다루는 문서 구조 비교 예시"
          columns={['개선 전 구성 예시', '개선 후 구성 예시']}
          rowHeader="항목"
          rows={STRUCTURE_ROWS}
        />
        <p className="bl-closing">
          오른쪽 구성이 언제나 정답이라는 뜻은 아닙니다. 다만 왼쪽처럼 짜인 문서는 읽는 사람이 답을
          찾기 전에 화면을 닫기 쉽고, 그러면 어떤 신호도 남지 않습니다. 저희가 전달하는 수정안도 이
          표와 같은 형태로, 어느 지점을 왜 바꾸는지 항목별로 적어 드립니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="process-title">
        <SectionHead
          eyebrow="05 / PROCESS"
          id="process-title"
          title="진행 순서"
          lead="새 글을 바로 쓰지 않습니다. 지금 있는 문서가 어떤 질문에 답하고 있는지 확인한 뒤, 고칠 곳과 새로 써야 할 곳을 나눕니다."
        />
        <ProcessSteps />
      </Section>

      <Section ariaLabelledBy="pricing-title">
        <SectionHead
          eyebrow="06 / PRICING"
          id="pricing-title"
          title="비용과 포함 범위"
          lead={
            pricing
              ? `시작가는 ${formatKrw(pricing.from)}이며, 대상 페이지 수와 키워드 경쟁도에 따라 실제 구성이 달라집니다. 상담 단계에서 범위를 먼저 확정한 뒤 진행합니다.`
              : '대상 페이지 수와 키워드 경쟁도에 따라 구성이 달라집니다. 상담 단계에서 범위를 먼저 확정한 뒤 진행합니다.'
          }
        />
        {pricing ? (
          <div className="bl-grid bl-grid--2">
            <PricingCard group={pricing} />
            <Card>
              <CardTitle>먼저 확인하시면 좋은 것</CardTitle>
              <CardBody>
                콘텐츠 작업은 대상 페이지가 몇 개인지, 기존 글을 고칠지 새로 쓸지에 따라 필요한
                범위가 달라집니다. 목표 키워드와 해당 페이지 주소를 알려 주시면 어느 쪽이 맞는지
                먼저 말씀드립니다.
              </CardBody>
              <CardBody>
                콘텐츠만으로 부족한 상황이면 그 사실도 그대로 알려 드립니다. 다른 작업까지 함께 볼
                때의 예산은 <Link href="/pricing">가격이 달라지는 이유</Link>에 정리해 두었습니다.
              </CardBody>
            </Card>
          </div>
        ) : null}
      </Section>

      <Section size="sm">
        <TelegramCTABlock
          source="content-seo"
          position="mid"
          title="지금 페이지가 어떤 검색어의 답인지 애매하신가요?"
          body="목표 키워드와 페이지 주소를 보내 주시면, 검색의도와 문서 구조가 어긋나 있는지부터 확인해 드립니다."
          label="콘텐츠 구조 상담하기"
        />
      </Section>

      <Section subtle ariaLabelledBy="more-title">
        <SectionHead
          eyebrow="07 / NEXT"
          id="more-title"
          title="판단에 도움이 되는 내용"
          lead="상담 전에 먼저 읽어보셔도 됩니다. 콘텐츠와 링크 중 어느 쪽이 지금 필요한지 스스로 가늠하는 데 도움이 됩니다."
        />
        <RelatedArticles heading="이어서 읽기" posts={articles} />
        <div style={{ marginTop: '2rem' }}>
          <RelatedContent heading="함께 보면 좋은 페이지" hrefs={cluster.relatedPages} />
        </div>
      </Section>

      <FinalCTA
        source="content-seo"
        title="어떤 검색어의 답을 만들고 싶으신가요?"
        body="목표 키워드와 대상 페이지를 알려 주시면 지금 문서에서 무엇이 비어 있는지 보고 말씀드리겠습니다."
        label="콘텐츠 방향 상담하기"
      />
    </>
  )
}
