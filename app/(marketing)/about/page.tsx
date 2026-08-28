/**
 * /about — 백링크샵 소개 (브랜드 신뢰 페이지)
 *
 * 이 페이지는 키워드 페이지가 아니다. 목적은 8년 이상의 실행 경험과 그로부터 나온 판단 기준을
 * 읽을 수 있게 만드는 것이다.
 * - 본문 내용은 전부 config/experience.ts 를 원본으로 쓴다. 여기서 연차·영역·원칙을 따로 적지 않는다.
 * - 확인되지 않은 사실(프로젝트 수, 고객사 수, 설립일, 사업자 정보, 수상 이력)은 쓰지 않는다.
 * - 구조화 데이터는 Breadcrumb 이 내보내는 BreadcrumbList 하나뿐이다.
 *   Organization / WebSite 는 홈에서 이미 내보내므로 여기서 중복 생성하지 않는다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { ExperienceTimeline } from '@/components/marketing/ExperienceTimeline'
import { InsightBlock } from '@/components/marketing/InsightBlock'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { ProcessSteps } from '@/components/marketing/ProcessSteps'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Card, CardBody, CardTitle } from '@/components/ui/Card'
import { IconSurface } from '@/components/ui/Icon'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedServices } from '@/components/content/RelatedServices'
import { RelatedArticles } from '@/components/content/RelatedArticles'

import {
  B2B_TRUST,
  EXPERIENCE_CONCLUSION,
  EXPERIENCE_HEADLINE,
  EXPERTISE_AREAS,
  OPERATING_PRINCIPLES,
} from '@/config/experience'
import { RANKING_FACTORS } from '@/config/services'
import { ctaLabel } from '@/config/cta'
import { SEO_GRAPH, resolveArticles } from '@/config/seo-graph'

export const dynamic = 'force-static'

const CTA_SOURCE = 'about'

export const metadata: Metadata = {
  title: { absolute: '백링크샵 소개 | 8년+ 구글 SEO 실행 경험' },
  description:
    '8년 넘게 직접 겪은 검색 환경의 변화와, 그 과정에서 남은 판단 기준을 정리했습니다. 무엇을 해야 하는지만큼 무엇을 하지 말아야 하는지를 함께 봅니다.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: '백링크샵 소개 | 8년+ 구글 SEO 실행 경험',
    description:
      '방법은 계속 바뀌었습니다. 8년 넘게 검색 결과가 변하는 과정을 직접 겪으며 만든 판단 기준을 공개합니다.',
    url: '/about',
  },
}

/**
 * 네 가지 판단 영역이 막혀 있을 때 실제로 보이는 모습.
 * 수치가 아니라 증상 서술만 쓴다. 홈은 같은 RANKING_FACTORS 를 카드로 보여주므로
 * 여기서는 표로, 다른 관점(증상 → 확인 순서)에서 제시한다.
 */
const FACTOR_SYMPTOMS: Record<string, string> = {
  content:
    '검색으로 들어오기는 하는데 원하는 키워드가 아니거나, 페이지가 질문에 끝까지 답하지 않고 끝납니다. 이 상태에서 링크를 늘리면 비용만 먼저 나갑니다.',
  structure:
    '색인은 되어 있는데 올리려는 페이지 대신 다른 페이지가 노출됩니다. 밖에서 받은 신호가 목표 페이지까지 흐르지 못하고 중간에서 흩어집니다.',
  authority:
    '콘텐츠와 구조는 경쟁 페이지와 크게 다르지 않은데 계속 아래에 머뭅니다. 외부에서 이 사이트를 언급하는 신호 자체가 부족한 경우입니다.',
  competition:
    '같은 작업을 했는데 키워드마다 결과가 다릅니다. 필요한 작업의 양이 키워드마다 다르기 때문이지, 방법이 틀려서가 아닌 경우가 많습니다.',
}

export default function AboutPage() {
  const cluster = SEO_GRAPH.about
  const articles = resolveArticles(cluster.relatedArticles)

  return (
    <>
      <Breadcrumb trail={[{ href: '/about', label: '백링크샵 소개' }]} />

      <Hero
        eyebrow="백링크샵 소개"
        title={
          <>
            <span className="bl-break">검색 결과가 변하는 과정을,</span>8년 넘게 직접 겪었습니다.
          </>
        }
        support="통하던 방법은 계속 바뀌었습니다. 링크의 양이 결과를 바꾸던 시기도 있었고, 같은 방식이 더는 같은 결과를 내지 않는 시기도 지나왔습니다. 그래서 하나의 방법을 정답이라고 말하지 않고, 지금 이 사이트에 무엇이 필요한지부터 판단합니다."
        actions={
          <TelegramCTA source={CTA_SOURCE} position="hero" size="lg" label={ctaLabel('about')} />
        }
      />

      <Section ariaLabelledBy="what-we-do-title">
        <SectionHead
          eyebrow="01 / 하는 일"
          id="what-we-do-title"
          title="링크를 파는 곳이 아니라, 무엇이 필요한지 판단하는 곳입니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            백링크샵은 상품 목록을 먼저 보여주고 그중 하나를 고르게 하는 방식으로 일하지 않습니다.
            사이트 주소와 목표 키워드를 받으면 지금 순위가 막혀 있는 지점이 어디인지부터 확인합니다.
            링크가 병목이 아닌 사이트에 링크를 더하는 것은 단기 매출은 되지만 결과는 만들지 못하기
            때문입니다.
          </p>
          <p className="bl-body">
            그래서 상담은 견적서가 아니라 진단에서 시작합니다. 콘텐츠가 부족한지, 사이트 구조가 막혀
            있는지, 외부 신호가 모자란지에 따라 해야 할 일이 완전히 달라집니다. 어떤 경우에는
            아무것도 사지 않는 편이 낫다고 말씀드리기도 합니다.{' '}
            <Link href="/google-ranking">순위가 오르지 않는 이유</Link>를 하나로 설명하지 않는 것도
            같은 이유입니다.
          </p>
          <p className="bl-body">
            물론 외부 신호가 실제로 병목인 사이트도 많습니다. 그때는 어떤 성격의 링크가 왜 필요한지
            설명하고 진행합니다. 링크가 어떻게 작동하는지 먼저 이해하고 판단하고 싶다면{' '}
            <Link href="/backlink">백링크 구조 설명</Link>을 읽어보셔도 됩니다. 상담 없이 읽고
            판단하셔도 괜찮습니다.
          </p>
        </div>
      </Section>

      <Section subtle size="lg" ariaLabelledBy="experience-title">
        <SectionHead
          eyebrow="02 / 경험과 변화"
          id="experience-title"
          title={EXPERIENCE_HEADLINE}
          lead="각 시기에 무엇이 통했는지가 아니라, 무엇을 직접 겪었는지를 적었습니다. 지난 방식을 지금도 보장되는 기법처럼 설명하지 않기 위해서입니다."
        />
        <ExperienceTimeline />
        <InsightBlock
          eyebrow="경험이 남긴 결론"
          title="하나의 방법만 정답이라고 말하지 않는 이유"
          tone="accent"
        >
          {EXPERIENCE_CONCLUSION}
        </InsightBlock>
      </Section>

      <Section ariaLabelledBy="expertise-title">
        <SectionHead
          eyebrow="03 / 다뤄온 영역"
          id="expertise-title"
          title="직접 다뤄온 SEO 영역"
          lead="읽어서 아는 영역이 아니라 직접 구축하고 운영해 본 영역만 적었습니다. 어떤 방식이 어떤 사이트에 맞지 않는지도 같은 경험에서 나온 판단입니다."
        />
        <div className="bl-grid bl-grid--3">
          {EXPERTISE_AREAS.map(area => (
            <Card key={area.title}>
              <IconSurface name={area.icon} />
              <CardTitle>{area.title}</CardTitle>
              <CardBody>{area.body}</CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtle ariaLabelledBy="b2b-title">
        <SectionHead
          eyebrow="04 / B2B 협업"
          id="b2b-title"
          title={B2B_TRUST.title}
          lead={B2B_TRUST.body}
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            SEO를 업으로 하는 쪽은 결과가 나오지 않으면 그대로 자기 프로젝트의 손실이 됩니다. 그래서
            무엇을 어떻게 만드는지, 남는 것이 무엇인지를 가장 까다롭게 봅니다. 그 기준을 통과하는
            실행력을 국내 최고 수준으로 유지하는 것이 백링크샵이 잡고 있는 목표입니다.
          </p>
          <p className="bl-body">
            대신 여기서도 보장할 수 없는 것은 보장하지 않습니다. 누가 쓰고 있는지를 근거로 결과를
            약속하는 대신, 어떤 조건에서 무엇을 하는지를 먼저 설명합니다.
          </p>
          <p className="bl-note">{B2B_TRUST.note}</p>
        </div>
      </Section>

      <Section ariaLabelledBy="criteria-title">
        <SectionHead
          eyebrow="05 / 판단 기준"
          id="criteria-title"
          title="지표 하나로, 기법 하나로 판단하지 않습니다."
          lead="도메인 지표가 높은 링크를 붙였는데도 움직이지 않는 사이트가 있고, 지표가 평범한 링크로 올라가는 사이트도 있습니다. 하나의 숫자나 하나의 기법이 결과를 결정하지 않기 때문입니다. 네 가지 조건을 함께 보고, 지금 막혀 있는 쪽부터 손을 댑니다."
        />
        <ComparisonTable
          caption="검색순위를 판단할 때 함께 보는 네 가지 조건과, 각 조건이 막혀 있을 때 나타나는 모습"
          columns={['무엇을 보는가', '막혀 있을 때 나타나는 모습']}
          rowHeader="판단 영역"
          rows={RANKING_FACTORS.map(factor => ({
            header: factor.title,
            cells: [factor.body, FACTOR_SYMPTOMS[factor.key] ?? ''],
          }))}
        />
        <p className="bl-closing">
          네 가지를 모두 손봐야 하는 경우는 많지 않습니다. 어디가 병목인지에 따라 필요한 작업과
          순서가 달라지고, 그 순서를 정하는 것이 실제로는 가장 큰 차이를 만듭니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="principles-title">
        <SectionHead
          eyebrow="06 / 운영 원칙"
          id="principles-title"
          title="서비스 운영 원칙"
          lead="지키기 좋은 말이 아니라, 실제로 상담과 작업에서 적용하고 있는 기준입니다."
        />
        <div className="bl-grid bl-grid--2">
          {OPERATING_PRINCIPLES.map((principle, index) => (
            <Card key={principle.title}>
              <span className="bl-related__label">원칙 {String(index + 1).padStart(2, '0')}</span>
              <CardTitle>{principle.title}</CardTitle>
              <CardBody>{principle.body}</CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section ariaLabelledBy="approach-title">
        <SectionHead
          eyebrow="07 / 지금의 접근"
          id="approach-title"
          title="지금은 조건의 조합을 보고 판단합니다."
          lead="사이트 상태, 검색 의도, 경쟁 환경을 함께 본 다음에 작업을 정합니다. 그래서 상담의 순서가 상품 선택이 아니라 상태 확인에서 시작합니다."
        />
        <ProcessSteps />
        <p className="bl-closing">
          말보다 기록으로 확인하고 싶다면 <Link href="/cases">공개된 성공사례</Link>에서 어떤
          조건에서 시작해 어떤 결과가 나왔는지, 어디까지 공개할 수 있는지를 함께 보실 수 있습니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="related-title">
        <SectionHead
          eyebrow="08 / 관련 페이지"
          id="related-title"
          title="이어서 볼 페이지"
          lead="소개보다 판단에 필요한 내용이 더 급하다면 아래에서 바로 시작하셔도 됩니다."
        />
        <div className="bl-stack">
          <RelatedContent
            heading="함께 보면 좋은 페이지"
            hrefs={cluster.relatedPages}
            columns={3}
          />
          <RelatedServices
            heading="판단 기준을 적용해 볼 수 있는 작업"
            slugs={['pbn-backlink', 'onpage-seo', 'content-seo']}
          />
          <RelatedArticles heading="기준을 더 넓히는 글" posts={articles} />
        </div>
      </Section>

      <FinalCTA source={CTA_SOURCE} cta="about" />
    </>
  )
}
