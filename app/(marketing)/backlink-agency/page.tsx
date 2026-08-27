/**
 * /backlink-agency — 백링크 업체 판단 기준
 *
 * 타깃: `백링크 업체` (보조: `백링크 대행`, `백링크 작업`)
 * 이 페이지의 역할은 판매가 아니라 판단 기준을 넘겨주는 것이다.
 * - 경쟁사를 겨냥한 문장을 쓰지 않는다. "기준이 없으면 무엇이 곤란해지는가"라는 구조적 설명만 쓴다.
 * - 자사 소개도 확인 가능한 것(가격표·리포트 형식·정책 문서)만 근거로 삼는다.
 */
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'

import { Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { ProblemSection } from '@/components/marketing/ProblemSection'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardMeta, CardTitle, BulletList } from '@/components/ui/Card'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedServices } from '@/components/content/RelatedServices'
import { RelatedArticles } from '@/components/content/RelatedArticles'

import { PRICING, formatKrw } from '@/config/pricing'
import { SEO_GRAPH, resolveArticles } from '@/config/seo-graph'
import { PUBLISHED_CASES, CASE_DISCLOSURE_RULES } from '@/config/cases'

export const dynamic = 'force-static'

const CTA_LABEL = '현재 SEO 상황 상담하기'
const CTA_SOURCE = 'backlink-agency'

export const metadata: Metadata = {
  title: '백링크 업체 고르는 기준 8가지',
  description:
    '백링크 업체를 금액만으로 비교하기 어렵다면, 먼저 맞춰야 할 기준이 있습니다. 관련성·페이지 품질·앵커 구성·유지 방식·작업 과정·리포팅·가격·정책 여덟 가지를 상담 자리에서 그대로 물어볼 수 있게 정리했습니다.',
  alternates: { canonical: '/backlink-agency' },
  openGraph: {
    title: '백링크 업체 고르는 기준 8가지 | 백링크샵',
    description:
      '견적서를 나란히 놓기 전에 무엇을 사는지부터 정해야 합니다. 백링크 대행을 맡기기 전 확인할 여덟 가지 기준입니다.',
    url: '/backlink-agency',
  },
}

const AGENCY_QUESTIONS = [
  '링크 수는 늘었는데 검색 순위는 그대로였나요?',
  '작업이 끝난 뒤 확인해 보니 링크가 걸려 있던 URL이 사라져 있었나요?',
  '어디에 링크가 생성되는지 끝까지 알 수 없었나요?',
  '리포트를 받았는데 무엇을 했는지 읽어내기 어려웠나요?',
]

type Criterion = {
  no: string
  name: string
  /** 무엇을 보는지 */
  watch: string
  /** 어떻게 확인하는지 */
  how: string
  /** 이 기준이 없으면 무엇이 문제인지 (구조적 설명만) */
  gap: string
}

const CRITERIA: Criterion[] = [
  {
    no: '기준 01',
    name: '관련성',
    watch:
      '링크가 걸리는 자리의 주제가 내 사이트가 다루는 주제와 이어지는지를 봅니다. 업종이 똑같아야 한다는 뜻은 아니고, 그 글을 읽던 사람이 내 페이지로 넘어오는 흐름이 설명되는지가 기준입니다.',
    how: '진행할 링크가 어떤 성격의 사이트에 실리는지 상담 단계에서 말로 설명받아 보세요. 설명이 "다양한 분야"에서 멈춘다면 어떤 분야인지, 내 업종과 어디서 만나는지 한 번 더 물어보면 됩니다.',
    gap: '주제가 이어지지 않으면 검색엔진이 그 링크를 추천으로 해석할 맥락이 얇아집니다. 개수는 늘어도 목표 키워드 쪽으로 신호가 모이지 않고, 나중에 링크를 정리하려 할 때 무엇부터 손봐야 할지 고를 기준도 남지 않습니다.',
  },
  {
    no: '기준 02',
    name: '페이지 품질',
    watch:
      '링크가 실리는 페이지 자체가 사람이 읽을 수 있는 문서인지를 봅니다. 도메인 지표 하나보다, 그 한 페이지가 어떤 모습인지가 실제로 전달되는 신호에 가깝습니다.',
    how: '이미 게시된 URL을 한두 개만 열어보면 대부분 판단됩니다. 본문이 있는지, 문장이 사람이 쓴 것처럼 읽히는지, 같은 페이지에 외부 링크가 몇 개나 함께 걸려 있는지를 보세요.',
    gap: '한 페이지에 외부 링크만 빽빽하게 모여 있으면 그중 하나인 내 링크가 가지는 비중은 옅어집니다. 또 문서로서 읽히지 않는 페이지는 색인에서 빠질 가능성이 있고, 색인되지 않은 페이지의 링크는 애초에 평가 대상이 되지 못합니다.',
  },
  {
    no: '기준 03',
    name: '앵커 구성',
    watch:
      '어떤 문구로 링크를 걸지, 그 비율을 누가 어떤 근거로 정하는지를 봅니다. 목표 키워드, 브랜드명, 사이트 주소, 일반 문구가 섞이는 방식이 링크 프로필의 인상을 만듭니다.',
    how: '작업 전에 앵커 텍스트 구성안을 문장으로 받아볼 수 있는지 확인하세요. 완료 후 리포트에 실제 사용된 문구가 그대로 적히는지도 함께 물어보면 계획과 결과를 대조할 수 있습니다.',
    gap: '올리고 싶은 키워드만 반복해서 걸면 링크 프로필이 한쪽으로 쏠려 자연스러운 인용과 멀어집니다. 반대로 아무 기준 없이 섞으면 정작 목표 키워드에는 신호가 거의 모이지 않습니다. 어느 쪽이든 기준이 없으면 조정할 방법도 없습니다.',
  },
  {
    no: '기준 04',
    name: '유지 방식',
    watch:
      '만들어진 링크가 얼마 동안, 어떤 조건으로 남아 있는지를 봅니다. 백링크 작업의 값은 게시되는 순간이 아니라 남아 있는 기간 동안 발생합니다.',
    how: '유지 기간이 정해져 있는지, 링크가 내려갔을 때 어떻게 처리하는지, 그 확인을 누가 하는지를 결제 전에 문장으로 확인하세요. 구두 설명보다 상담 기록이나 안내 문서에 남는 형태가 낫습니다.',
    gap: '유지에 대한 약속이 없으면 링크가 사라져도 알아차릴 방법이 없습니다. 비용은 이미 집행되었는데 남은 자산은 확인되지 않는 상태가 되고, 다음 작업을 설계할 때 현재 링크 프로필이 어떤 상태인지부터 다시 조사해야 합니다.',
  },
  {
    no: '기준 05',
    name: '작업 과정',
    watch:
      '착수부터 완료까지 어떤 순서로 무엇을 하는지가 미리 설명되는지를 봅니다. 순서가 있다는 것은 중간에 방향을 바꿀 지점이 있다는 뜻입니다.',
    how: '사이트 상태 확인, 구성 제안, 작업, 리포트로 이어지는 단계와 각 단계에 걸리는 기간을 물어보세요. 시작 전에 무엇을 알려주어야 하는지까지 안내된다면 과정이 실제로 정리되어 있다는 신호입니다.',
    gap: '과정이 공유되지 않으면 결과를 받는 시점까지 개입할 여지가 없습니다. 기대와 다른 결과가 나왔을 때 어느 단계에서 어긋났는지 되짚을 기록도 없어서, 다음 시도 역시 같은 자리에서 다시 시작하게 됩니다.',
  },
  {
    no: '기준 06',
    name: '리포팅',
    watch:
      '작업이 끝난 뒤 무엇을 손에 남기는지를 봅니다. 순위 그래프는 결과의 요약일 뿐이고, 백링크 대행에서 검증해야 할 대상은 실제로 무엇이 만들어졌는가입니다.',
    how: '리포트 형식을 미리 요청해 작업 URL, 앵커 텍스트, 게시 시점이 각각 적혀 있는지 확인하세요. 받은 뒤에는 목록의 주소를 몇 개 열어 실제 게시 상태와 대조해 보면 됩니다.',
    gap: '확인 가능한 목록이 없으면 작업의 사실 여부와 품질을 모두 검증할 수 없습니다. 담당자가 바뀌거나 업체를 옮길 때도 지금까지 쌓인 링크가 무엇인지 처음부터 조사해야 하고, 그동안 쓴 비용이 자료로 이어지지 않습니다.',
  },
  {
    no: '기준 07',
    name: '가격',
    watch:
      '금액이 무엇의 대가인지 설명되는지를 봅니다. 견적을 비교하려면 먼저 두 견적이 같은 것을 가리키고 있어야 합니다.',
    how: '같은 금액 안에 링크 수, 작업 기간, 리포트 범위가 각각 적혀 있는지 확인하세요. 공개된 시작가와 실제 견적이 달라지는 조건이 무엇인지도 함께 물어보면 금액의 구조가 보입니다.',
    gap: '무엇에 대한 값인지 모르면 숫자만 남고 비교는 불가능해집니다. 낮아 보이는 견적이 더 좁은 범위일 수도, 높은 견적이 실제로 더 많은 작업을 포함할 수도 있는데 어느 쪽인지 판단할 근거가 없습니다.',
  },
  {
    no: '기준 08',
    name: '정책',
    watch:
      '환불, 재작업, 중단에 대한 기준이 문서로 존재하는지를 봅니다. 잘 진행될 때가 아니라 어긋났을 때 무엇을 근거로 이야기할지의 문제입니다.',
    how: '결제 전에 환불 규정과 취소 기준이 페이지나 문서로 공개되어 있는지 확인하세요. 언제 개정되었는지까지 적혀 있다면 실제로 관리되는 문서라고 볼 수 있습니다.',
    gap: '기준이 없으면 문제가 생긴 다음에야 협의를 시작하게 됩니다. 서로 기억하는 약속이 다를 때 참조할 문장이 없으면, 옳고 그름을 떠나 해결에 걸리는 시간과 감정 소모가 커집니다.',
  },
]

const OUR_APPROACH: { criterion: string; how: string; verify: ReactNode }[] = [
  {
    criterion: '관련성',
    how: '업종과 목표 키워드를 먼저 듣고, 주제가 이어지는 자리만 후보로 올립니다. 접점이 약하면 그 자리는 빼고 다시 찾습니다.',
    verify:
      '제안 단계에서 어떤 성격의 사이트에 링크가 실리는지 설명을 들으신 뒤 진행 여부를 정하시면 됩니다.',
  },
  {
    criterion: '페이지 품질',
    how: '링크만 나열된 자리가 아니라 본문이 있는 문서에 싣는 것을 원칙으로 합니다.',
    verify: '완료 후 리포트에 적힌 주소를 직접 열어 페이지 상태를 확인하실 수 있습니다.',
  },
  {
    criterion: '앵커 구성',
    how: '목표 키워드 한 문구에 몰지 않고 브랜드·주소·일반 문구를 섞어 비율을 설계합니다.',
    verify: '작업 내역에 실제 사용된 앵커 텍스트가 함께 기록됩니다.',
  },
  {
    criterion: '유지 방식',
    how: '구성별로 어떤 조건에서 링크가 유지되는지 상담 단계에서 말씀드리고, 확언할 수 없는 부분은 확언하지 않습니다.',
    verify: '상담에서 안내드린 조건은 기록으로 남습니다. 다시 물어보셔도 같은 내용을 드립니다.',
  },
  {
    criterion: '작업 과정',
    how: '상황 확인 → 구성 제안 → 작업 → 리포트 순서로 진행하고, 각 구성의 작업 기간을 미리 안내합니다.',
    verify: (
      <>
        구성별 작업 기간은 <Link href="/pricing">가격 안내</Link>에 그대로 적혀 있습니다.
      </>
    ),
  },
  {
    criterion: '리포팅',
    how: '작업한 URL과 앵커 텍스트가 포함된 작업 내역을 전달합니다.',
    verify: '목록의 주소를 열어 게시 상태와 하나씩 대조하실 수 있습니다.',
  },
  {
    criterion: '가격',
    how: '서비스별 시작가를 공개하고, 견적이 달라지는 조건도 함께 공개합니다.',
    verify: (
      <>
        가장 낮은 시작가는 {formatKrw(Math.min(...PRICING.map(group => group.from)))}이며, 구성별
        금액은 문의 전에 먼저 확인하실 수 있습니다.
      </>
    ),
  },
  {
    criterion: '정책',
    how: '환불과 취소에 대한 기준을 문서로 공개하고, 개정일을 함께 표기합니다.',
    verify: (
      <>
        <Link href="/refund">환불 정책</Link>과 <Link href="/terms">이용약관</Link>을 결제 전에
        읽어보실 수 있습니다.
      </>
    ),
  },
]

export default function BacklinkAgencyPage() {
  const cluster = SEO_GRAPH.agency
  const articles = resolveArticles(cluster.relatedArticles)
  const hasCases = PUBLISHED_CASES.length > 0

  return (
    <>
      <Breadcrumb trail={[{ href: '/backlink-agency', label: '백링크 업체 판단 기준' }]} />

      <Hero
        eyebrow="HOW TO EVALUATE"
        title={
          <>
            <span className="bl-break">백링크 업체,</span>
            가격보다 먼저 확인해야 할 기준이 있습니다.
          </>
        }
        support="견적서를 나란히 놓고 금액만 비교하면 무엇을 사는 것인지 알기 어렵습니다. 링크가 어디에 생기고, 어떤 문구로 걸리고, 끝난 뒤 무엇이 손에 남는지가 정해져야 그때부터 가격이 비교 가능한 숫자가 됩니다."
        actions={
          <>
            <TelegramCTA source={CTA_SOURCE} position="hero" size="lg" label={CTA_LABEL} />
            <Button href="/pricing" variant="secondary" size="lg">
              가격이 달라지는 조건 보기
            </Button>
          </>
        }
        note="Telegram으로 연결됩니다 · 사이트 주소와 목표 키워드만 알려주시면 됩니다"
      />

      <ProblemSection
        eyebrow="01 / SITUATION"
        title={
          <>
            <span className="bl-break">백링크 작업을 맡겨본 뒤,</span>
            이런 상황이 남지 않으셨나요?
          </>
        }
        questions={AGENCY_QUESTIONS}
        closing="네 가지 모두 결과가 나빴다는 이야기가 아니라, 무엇이 잘되고 무엇이 안 됐는지 판단할 근거가 남지 않았다는 이야기입니다. 그리고 그 근거를 남길지 말지는 대부분 계약 전에 정해집니다."
        subtle
      />

      <Section size="lg" ariaLabelledBy="criteria-title">
        <SectionHead
          eyebrow="02 / CRITERIA"
          id="criteria-title"
          title="백링크 대행을 맡기기 전에 맞춰야 할 여덟 가지"
          lead="업체를 평가하는 기준이 아니라, 작업의 조건을 확정하는 질문 목록으로 읽어 주세요. 여덟 가지 모두에 답이 정해지면 견적은 그다음에 비교하면 됩니다. 어느 항목도 상대를 시험하기 위한 것이 아니라, 끝난 뒤 서로 다른 이야기를 하지 않기 위한 것입니다."
        />
        <div className="bl-grid bl-grid--2">
          {CRITERIA.map(item => (
            <Card key={item.name}>
              <span className="bl-related__label">{item.no}</span>
              <CardTitle>{item.name}</CardTitle>
              <CardBody>
                <strong>무엇을 보는지</strong>
                <br />
                {item.watch}
              </CardBody>
              <CardBody>
                <strong>어떻게 확인하는지</strong>
                <br />
                {item.how}
              </CardBody>
              <CardMeta>
                <strong>이 기준이 없으면</strong>
                <br />
                {item.gap}
              </CardMeta>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          여덟 가지를 한 번에 다 물어볼 필요는 없습니다. 지금 가장 답답한 항목 두세 개만 정리해서
          물어보셔도 대화의 성격이 달라집니다. 기준 자체가 궁금하시다면{' '}
          <Link href="/backlink">백링크가 어떻게 작동하는지</Link> 먼저 읽어보셔도 좋습니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="approach-title">
        <SectionHead
          eyebrow="03 / OUR APPROACH"
          id="approach-title"
          title="백링크샵은 이렇게 판단합니다"
          lead="같은 여덟 가지 기준을 저희에게도 그대로 적용합니다. 자랑할 만한 숫자를 앞세우는 대신, 확인하실 수 있는 것만 적었습니다. 사이트 상태를 보고 지금 링크 작업이 맞지 않는다고 판단되면 그렇게 말씀드리고 권하지 않습니다."
        />
        <ComparisonTable
          caption="여덟 가지 기준에 대한 백링크샵의 작업 방식과 확인 방법"
          columns={['백링크샵의 방식', '고객이 확인할 수 있는 것']}
          rowHeader="기준"
          rows={OUR_APPROACH.map(row => ({
            header: row.criterion,
            cells: [row.how, row.verify],
          }))}
        />
        <p className="bl-closing">
          여기 적힌 것 외에 더 보장하는 표현을 쓰지 않는 이유는 단순합니다. 검색 결과는 저희가
          단독으로 통제할 수 있는 영역이 아니고, 통제할 수 없는 것을 약속하면 그 순간부터 대화의
          기준이 사라지기 때문입니다.
        </p>
      </Section>

      <Section size="sm">
        <TelegramCTABlock
          source={CTA_SOURCE}
          position="mid"
          title="지금 상태에서 어떤 항목부터 확인해야 할지 함께 정리해 드립니다."
          body="도메인 주소와 올리고 싶은 키워드만 알려주시면 됩니다. 상담이 곧 결제로 이어지지 않아도 괜찮습니다."
          label={CTA_LABEL}
        />
      </Section>

      <Section ariaLabelledBy="cases-title">
        <SectionHead
          eyebrow="04 / CASES"
          id="cases-title"
          title="사례를 어떻게 공개하는지도 판단 재료입니다"
          lead="성과 사례는 업체를 고를 때 가장 먼저 보게 되는 자료이면서, 검증하기 가장 어려운 자료이기도 합니다. 그래서 저희는 무엇을 공개할지보다 어떤 조건을 갖춘 사례만 공개할지를 먼저 정했습니다."
        />
        <div className="bl-grid bl-grid--2">
          {CASE_DISCLOSURE_RULES.map(rule => (
            <Card key={rule.title}>
              <CardTitle>{rule.title}</CardTitle>
              <CardBody>{rule.body}</CardBody>
            </Card>
          ))}
        </div>
        {hasCases ? null : (
          <div className="bl-notice" style={{ marginTop: '1.5rem' }}>
            <p>
              <strong>현재 공개된 사례는 없습니다.</strong> 이전 사이트에는 같은 사례가 위치마다
              다른 수치로 실려 있었고, 어느 값이 맞는지 확인할 수 있는 원본이 남아 있지 않았습니다.
              확인되지 않은 숫자를 성과처럼 보여주지 않기 위해 위 기준을 충족하는 사례가 정리될
              때까지 게시하지 않습니다.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              사례 대신 지금 사이트 상태를 직접 보고 이야기하는 편이 정확합니다. 상담에서는 다른
              고객의 결과가 아니라 지금 도메인에서 확인되는 것부터 말씀드립니다.
            </p>
          </div>
        )}
        <p style={{ marginTop: '1.5rem' }}>
          <Link href="/cases" className="bl-btn bl-btn--ghost">
            사례 공개 기준 자세히 보기 &rarr;
          </Link>
        </p>
      </Section>

      <Section subtle ariaLabelledBy="pricing-title">
        <SectionHead
          eyebrow="05 / PRICING"
          id="pricing-title"
          title="시작가는 먼저 공개합니다"
          lead="상담을 해야만 금액을 알 수 있는 구조를 만들지 않았습니다. 아래는 각 작업의 시작가와 그 금액에 포함되는 항목입니다. 실제 견적은 키워드 경쟁도와 사이트 상태에 따라 달라지며, 무엇 때문에 달라지는지도 가격 안내에 함께 적어 두었습니다."
        />
        <div className="bl-grid bl-grid--2">
          {PRICING.map(group => (
            <Card key={group.service}>
              <CardTitle>{group.label}</CardTitle>
              <div className="bl-price">
                <span className="bl-price__value">{formatKrw(group.from)}</span>
                <span className="bl-price__unit">부터</span>
              </div>
              <CardBody>{group.bestFor}</CardBody>
              <BulletList items={group.includes} />
            </Card>
          ))}
        </div>
        <p style={{ marginTop: '1.5rem' }}>
          <Link href="/pricing" className="bl-btn bl-btn--ghost">
            금액이 달라지는 조건까지 보기 &rarr;
          </Link>
        </p>
      </Section>

      <Section ariaLabelledBy="next-title">
        <SectionHead
          eyebrow="06 / NEXT"
          id="next-title"
          title="기준을 정했다면, 다음은 무엇이 필요한지 고르는 일입니다"
          lead="여덟 가지 기준은 어떤 작업을 맡기든 똑같이 적용됩니다. 다만 지금 필요한 작업이 무엇인지는 사이트마다 다릅니다."
        />
        <div className="bl-stack">
          <RelatedServices heading="기준을 적용해 볼 수 있는 작업" />
          <RelatedContent
            heading="함께 보면 좋은 페이지"
            hrefs={cluster.relatedPages}
            columns={3}
          />
          <RelatedArticles heading="판단 기준을 더 넓히는 글" posts={articles} />
        </div>
      </Section>

      <FinalCTA
        source={CTA_SOURCE}
        title="지금 맡기려는 백링크 작업이 적절한지부터 봐 드립니다."
        body="사이트 주소와 목표 키워드를 알려주시면 현재 상태에서 어떤 기준이 특히 중요한지 정리해 드립니다. 맞지 않는 작업이라면 권하지 않습니다."
        label={CTA_LABEL}
      />
    </>
  )
}
