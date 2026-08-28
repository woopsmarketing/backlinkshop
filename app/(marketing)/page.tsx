/**
 * 홈 / — 상업 / 서비스 / 신뢰 / 전환
 *
 * 이 페이지의 역할
 * 홈은 설명 페이지가 아니다. 백링크가 무엇인지 가르치는 정보성 허브는 `/backlink` 가 맡는다.
 * 홈은 "지금 이 사이트에 무엇이 필요한지 판단해 주는 곳"이라는 것을 보여주고 상담으로 잇는다.
 * 흐름: 현재 상황 → 문제 진단 → 전략 선택 → 서비스 → 경험 → 사례 → 예산 → 인사이트 → FAQ → 전환.
 *
 * ⚠️ SEO 보존 규칙
 * 이 URL 은 `백링크 구매`·`고품질 백링크`·`PBN 백링크`·`백링크 판매` 를 잡고 있는 유일한 자산이다.
 * - URL 을 바꾸지 않는다.
 * - title 과 본문에서 위 표현을 제거하지 않는다.
 * - 하위 페이지에는 롱테일(가격·업체·구성)로 분화시키고, 대표 표현은 홈에 남긴다.
 * - 출현 횟수는 목표가 아니다. 자연스러운 자리에서만 쓰고, 숫자를 맞추려고 반복하지 않는다.
 *
 * ⚠️ 가격을 이 페이지에 쓰지 않는다.
 * 탐색 단계에서 금액이 먼저 보이면 "얼마짜리인가"로 판단이 좁아진다. 금액은 `/pricing` 이 맡는다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/layout/Container'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { InsightBlock } from '@/components/marketing/InsightBlock'
import { QuestionCards } from '@/components/marketing/QuestionCards'
import { StrategyCards } from '@/components/marketing/StrategyCards'
import { ServiceGrid } from '@/components/marketing/ServiceGrid'
import { ConsultServices } from '@/components/marketing/ConsultServices'
import { ExperienceTimeline } from '@/components/marketing/ExperienceTimeline'
import { CaseStudyCard } from '@/components/marketing/CaseStudyCard'
import { FAQSection } from '@/components/marketing/FAQSection'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { ArticleCard } from '@/components/content/ArticleCard'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle } from '@/components/ui/Card'
import { IconSurface } from '@/components/ui/Icon'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import { WebsiteSchema } from '@/components/seo/WebsiteSchema'

import { RANKING_FACTORS } from '@/config/services'
import { EXPERIENCE_HEADLINE, EXPERIENCE_CONCLUSION, B2B_TRUST } from '@/config/experience'
import { getFeaturedCases, CASE_SOURCE_NOTE } from '@/config/cases'
import { ctaLabel } from '@/config/cta'
import { getPreviewFaq } from '@/config/faq'
import { SEO_GRAPH, resolveArticles } from '@/config/seo-graph'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: { absolute: '백링크 전문 업체 | 백링크 구매·판매·PBN SEO | 백링크샵' },
  description:
    '백링크 구매를 고민 중이라면 개수보다 현재 사이트 상태가 먼저입니다. 목표 키워드를 보고 고품질 백링크와 PBN이 지금 필요한지, 구글 상위노출을 위해 무엇부터 해야 하는지 판단해 드립니다.',
  alternates: { canonical: '/' },
  openGraph: {
    title: '백링크 전문 업체 | 백링크 구매·판매·PBN SEO | 백링크샵',
    description:
      '모든 사이트에 같은 백링크가 필요한 것은 아닙니다. 현재 상황을 먼저 보고 필요한 방향을 이야기합니다.',
    url: '/',
  },
}

/**
 * 타임라인 결론(config/experience.ts)을 인사이트 블록의 제목/본문으로 나눈다.
 * 문장을 페이지에 다시 적지 않기 위해 원본 문자열에서 첫 문장만 분리한다.
 */
function splitConclusion(text: string): { title: string; body: string } {
  const cut = text.indexOf('. ')
  if (cut === -1) return { title: text, body: '' }
  return { title: text.slice(0, cut + 1), body: text.slice(cut + 2) }
}

export default function HomePage() {
  const articles = resolveArticles(SEO_GRAPH.home.relatedArticles)
  const faq = getPreviewFaq()
  const cases = getFeaturedCases()
  const conclusion = splitConclusion(EXPERIENCE_CONCLUSION)

  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />

      <Hero
        center
        eyebrow="백링크 전문 SEO"
        title={
          <>
            <span className="bl-break">구글 상위노출을 위한 백링크,</span>
            이제는 개수보다 전략입니다.
          </>
        }
        support="백링크 구매를 고민하고 있거나 믿을 수 있는 백링크 업체를 찾고 있다면, 링크 개수부터 결정할 필요는 없습니다. 사이트 상태와 목표 키워드, 기존 콘텐츠와 링크 구조를 먼저 보고 필요한 SEO 전략을 판단합니다."
        actions={
          <TelegramCTA source="home" position="hero" size="lg" label={ctaLabel('home-hero')} />
        }
      />

      <Section subtle ariaLabelledBy="home-situation-title">
        <SectionHead
          eyebrow="01 / 현재 상황"
          id="home-situation-title"
          title={
            <>
              <span className="bl-break">백링크를 했는데도,</span>생각만큼 올라가지 않나요?
            </>
          }
          lead="상담에서 가장 자주 듣는 네 가지 상황입니다. 하나라도 해당한다면 링크를 더 늘리기 전에 확인할 것이 있습니다."
        />
        <QuestionCards />
        <InsightBlock
          title="링크가 부족해서가 아니라, 링크를 받을 준비가 안 된 페이지일 수 있습니다."
          actions={
            <Button href="/google-ranking" variant="ghost">
              구글 상위노출이 막히는 지점 보기 &rarr;
            </Button>
          }
        >
          검색 노출이 막히는 이유는 하나가 아닙니다. 페이지가 검색한 사람이 찾던 답을 담고 있지 않은
          것인지, 사이트 구조가 신호를 목표 페이지까지 흘려보내지 못하는 것인지, 아니면 외부 권위가
          아직 부족한 것인지를 먼저 구분해야 다음에 할 일이 정해집니다.
        </InsightBlock>
      </Section>

      <Section ariaLabelledBy="home-diagnosis-title">
        <SectionHead
          eyebrow="02 / 문제 진단"
          id="home-diagnosis-title"
          title="검색순위는 백링크 하나로만 움직이지 않습니다."
          lead="같은 링크를 받아도 결과가 다른 이유는 네 가지 조건이 함께 작용하기 때문입니다. 어디가 막혀 있는지에 따라 해야 할 일이 달라집니다."
        />
        <div className="bl-grid bl-grid--4">
          {RANKING_FACTORS.map(factor => (
            <Card key={factor.key}>
              <IconSurface name={factor.icon} />
              <CardTitle>{factor.title}</CardTitle>
              <CardBody>{factor.body}</CardBody>
            </Card>
          ))}
        </div>
        <InsightBlock
          tone="accent"
          title="백링크가 정답이 아닌 상황도 있습니다."
          actions={
            <TelegramCTA source="home" position="problem" label={ctaLabel('home-problem')} />
          }
        >
          백링크샵은 링크를 판매하기 전에 지금 이 사이트에서 가장 큰 병목이 무엇인지부터 판단합니다.
          콘텐츠와 페이지 구조가 준비되지 않았다면 링크보다 먼저 해야 할 작업이 있습니다. 백링크
          판매를 목적으로 개수를 채우는 방식과, 필요한 작업을 판단한 뒤 링크를 구성하는 방식은
          결과가 다릅니다. <Link href="/google-ranking">순위가 오르지 않는 이유</Link>를 먼저 정리해
          두었습니다.
        </InsightBlock>
      </Section>

      <Section subtle ariaLabelledBy="home-strategy-title">
        <SectionHead
          eyebrow="03 / 전략 선택"
          id="home-strategy-title"
          title="현재 상황에 맞는 전략은 따로 있습니다."
          lead="지금 상황과 가장 가까운 카드를 보세요. 왜 그 전략인지까지 함께 적어 두었습니다. 상담 전에 읽어보고 판단하셔도 됩니다."
        />
        <StrategyCards />
      </Section>

      <Section ariaLabelledBy="home-services-title">
        <SectionHead
          eyebrow="04 / 서비스"
          id="home-services-title"
          title="문제에 맞는 작업만 구성합니다."
          lead="고품질 백링크가 필요한 사이트도 있고, 링크보다 페이지 구조나 콘텐츠를 먼저 고쳐야 하는 사이트도 있습니다. 전부 해야 하는 경우는 많지 않습니다."
        />
        <ServiceGrid />

        <SectionHead
          as="h3"
          id="home-consult-title"
          title="상담으로 진행하는 작업 3가지"
          lead="아래 세 가지는 별도의 상품 페이지를 두지 않습니다. 사이트 상황을 먼저 듣고 필요하다고 판단될 때만 상담에서 구성합니다."
        />
        <ConsultServices />

        <TelegramCTABlock source="home" cta="home-service" position="services" />
      </Section>

      <Section subtle ariaLabelledBy="home-experience-title">
        <SectionHead
          eyebrow="05 / 경험과 변화"
          id="home-experience-title"
          title={EXPERIENCE_HEADLINE}
          lead="SEO에서 통하던 방법은 계속 바뀌어 왔습니다. 그 변화를 직접 겪었기 때문에 한 가지 방식만 정답이라고 말하지 않습니다."
        />
        <ExperienceTimeline />
        <InsightBlock
          title={conclusion.title}
          actions={
            <Button href="/about" variant="ghost">
              전체 이야기 보기 &rarr;
            </Button>
          }
        >
          {conclusion.body}
        </InsightBlock>
      </Section>

      <Section ariaLabelledBy="home-cases-title">
        <SectionHead
          eyebrow="06 / 성공 사례"
          id="home-cases-title"
          title="검색 결과는 말보다 기록으로 보여드립니다."
          lead="업종과 목표 키워드의 성격, 시작 시점의 상태와 걸린 기간을 함께 공개합니다. 다시 확인할 수 없는 중간 순위나 트래픽 수치는 적지 않습니다."
        />
        <div className="bl-grid bl-grid--3">
          {cases.map(study => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
        <p className="bl-note">{CASE_SOURCE_NOTE}</p>
        <div className="bl-btn-row" style={{ marginTop: '1.5rem' }}>
          <Button href="/cases" variant="ghost">
            전체 사례 보기 &rarr;
          </Button>
        </div>

        <InsightBlock tone="accent" title={B2B_TRUST.title}>
          <p>{B2B_TRUST.body}</p>
          <p className="bl-note">{B2B_TRUST.note}</p>
        </InsightBlock>
      </Section>

      <Section subtle ariaLabelledBy="home-budget-title">
        <SectionHead
          eyebrow="07 / 예산과 전략"
          id="home-budget-title"
          title="정해진 가격표보다 현재 사이트에 필요한 작업이 먼저입니다."
          lead="구글 상위노출은 정해진 금액을 지불하고 정해진 기간을 기다리면 자동으로 달성되는 상품이 아닙니다. 사이트 상태와 목표 키워드, 경쟁 환경, 필요한 작업의 범위에 따라 전략도 예산도 달라집니다."
        />
        <p className="bl-body bl-measure">
          그래서 상담에서는 상품부터 고르지 않습니다. 월 예산과 목표를 알려주시면 그 범위 안에서
          우선순위가 높은 작업부터 구성해 드립니다.
        </p>

        <InsightBlock tone="accent" title="여러 사이트를 운영하시나요?">
          사이트마다 목표 키워드는 달라도 분석과 인프라, 운영과 리포팅에서는 겹치는 작업이 생깁니다.
          그 부분을 병렬로 묶으면 같은 작업을 사이트마다 반복하지 않아도 됩니다. 사이트 수가
          많아질수록 개별로 진행할 때보다 효율적인 비용 구조를 설계할 수 있습니다.
        </InsightBlock>

        <TelegramCTABlock source="home" cta="home-budget" position="budget" />

        <div className="bl-btn-row" style={{ marginTop: '1.5rem' }}>
          <Button href="/pricing" variant="ghost">
            백링크 가격이 달라지는 이유 보기 &rarr;
          </Button>
        </div>
      </Section>

      <Section ariaLabelledBy="home-insight-title">
        <SectionHead
          eyebrow="08 / SEO 인사이트"
          id="home-insight-title"
          title="판단 기준을 먼저 가져가세요."
          lead="상담하지 않아도 스스로 판단할 수 있도록 기준을 정리해 두었습니다."
        />
        <div className="bl-post-grid bl-post-grid--3">
          {articles.map(post => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="bl-btn-row" style={{ marginTop: '1.5rem' }}>
          <Button href="/blog" variant="ghost">
            SEO 가이드 전체 보기 &rarr;
          </Button>
        </div>
      </Section>

      <FAQSection items={faq} eyebrow="09 / 자주 묻는 질문" moreHref="/faq" subtle />

      <FinalCTA source="home" />
    </>
  )
}
