/**
 * 성공사례 /cases
 *
 * ⚠️ 보존 규칙
 * - 이 URL 은 Google Ads 사이트링크가 연결되어 있다. 경로를 바꾸지 않는다.
 * - `PUBLISHED_CASES` (config/cases.ts) 는 운영자가 사실로 확인해 준 프로젝트 기록이다.
 *   이 페이지에서 사례 수치를 만들어 넣지 않는다. 값을 늘리려면 config/cases.ts 를 고쳐야 한다.
 * - 여기 실린 다섯 건 외의 값(중간 정확한 순위·날짜·트래픽·매출·전환)은 절대 추가하지 않는다.
 */
import type { Metadata } from 'next'

import { Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { CaseStudyCard } from '@/components/marketing/CaseStudyCard'
import { RankJourney } from '@/components/marketing/RankJourney'
import { InsightBlock } from '@/components/marketing/InsightBlock'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle } from '@/components/ui/Card'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedServices } from '@/components/content/RelatedServices'
import { RelatedArticles } from '@/components/content/RelatedArticles'

import {
  getAllCases,
  CASE_SOURCE_NOTE,
  CASE_DISCLOSURE_RULES,
  type CaseStage,
} from '@/config/cases'
import { SEO_GRAPH, resolveArticles } from '@/config/seo-graph'
import { ctaLabel } from '@/config/cta'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '성공사례 5건 — 확인된 프로젝트 기록',
  description:
    '백링크샵이 공개하는 성공사례는 운영자가 사실로 확인한 프로젝트 기록 5건입니다. 업종·시작 상태·기간·최종 결과를 함께 적고, 기록에 없는 중간 순위·트래픽·매출은 쓰지 않습니다.',
  alternates: { canonical: '/cases' },
  openGraph: {
    title: '성공사례 5건 — 확인된 프로젝트 기록',
    description:
      '몇 위에서 몇 위가 되었는지만으로는 판단할 수 없습니다. 업종·시작 상태·기간까지 함께 확인된 5건의 기록을 공개합니다.',
    url: '/cases',
  },
}

/** "이 기록을 어떻게 읽어야 하는가" 섹션에서 쓰는 공통 여정 형태. 특정 사례 데이터가 아니라 구조 설명용이다. */
const READING_STAGES: CaseStage[] = [
  { label: '시작 상태', note: '신규 사이트인지, 이미 있지만 밀려나 있는 사이트인지' },
  { label: '4~8페이지권', note: '색인과 초기 평가가 잡히기 시작하는 구간' },
  { label: '1~2페이지권', note: '경쟁 페이지와 같은 무대에 올라온 구간' },
  { label: '최종 결과', note: '기록에 남아 있는 마지막 확인 값' },
]

export default function CasesPage() {
  const cluster = SEO_GRAPH.cases
  const cases = getAllCases()
  const relatedArticles = resolveArticles(cluster.relatedArticles)

  return (
    <>
      <Breadcrumb trail={[{ href: '/cases', label: '성공사례' }]} />

      <Hero
        eyebrow="성공사례 공개"
        title={
          <>
            <span className="bl-break">결과만 적지 않고,</span>
            어떤 조건에서 나온 결과인지 함께 적습니다.
          </>
        }
        support="지금까지 확인된 5건의 실제 진행 기록입니다. 시작 상태와 최종 결과는 남기되, 기록에 남아 있지 않은 중간 순위는 지어내지 않습니다."
        actions={<TelegramCTA source="cases" position="hero" size="lg" label={ctaLabel('cases')} />}
      />

      <Section id="published" ariaLabelledBy="published-title">
        <SectionHead
          eyebrow="01 / 게시된 사례"
          id="published-title"
          title="운영자가 사실로 확인한 프로젝트 기록 5건입니다."
          lead="운영자가 사실로 확인해 준 값만 표시합니다. 진행 작업이 확인되지 않은 사례는 그 항목을 비워 둡니다."
        />
        <div className="bl-stack">
          {cases.map(study => (
            <CaseStudyCard key={study.id} study={study} wide />
          ))}
        </div>
        <p className="bl-note">{CASE_SOURCE_NOTE}</p>
      </Section>

      <Section subtle ariaLabelledBy="reading-title">
        <SectionHead
          eyebrow="02 / 기록을 읽는 법"
          id="reading-title"
          title="이 기록을 어떻게 읽어야 하는가"
          lead="다섯 건 모두 같은 모양의 여정을 지나왔습니다. 그 모양이 왜 이렇게 생겼는지를 먼저 설명합니다."
        />
        <RankJourney stages={READING_STAGES} wide />
        <div className="bl-grid bl-grid--2" style={{ marginTop: '2rem' }}>
          <Card>
            <CardTitle>가운데 두 단계는 정확한 순위가 아니라 구간입니다</CardTitle>
            <CardBody>
              4~8페이지권, 1~2페이지권은 그 사이 특정 시점에 정확히 몇 위였는지를 뜻하지 않습니다.
              진행 기록에 정확한 중간 순위가 남아 있지 않기 때문에, 있는 것처럼 적으면 기록이 아니라
              연출이 됩니다. 그래서 확인 가능한 구간까지만 표시합니다.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>같은 &quot;1페이지&quot;도 시작 상태에 따라 다른 이야기입니다</CardTitle>
            <CardBody>
              신규 사이트가 1페이지 진입을 목표로 삼았을 때는 약 3개월이 걸렸고, 같은 신규 사이트가
              특정 순위까지를 목표로 삼았을 때는 약 8개월이 걸렸습니다. 이미 있지만 10페이지 밖으로
              밀려나 있던 사이트가 1페이지로 돌아오기까지는 약 5~6개월이 걸린 기록도 있습니다.
              출발점과 목표가 다르면 같은 결과라도 걸리는 시간이 달라집니다.
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section ariaLabelledBy="rules-title">
        <SectionHead
          eyebrow="03 / 공개 기준"
          id="rules-title"
          title={
            <>
              <span className="bl-break">사례를 공개할 때</span>
              지키는 {CASE_DISCLOSURE_RULES.length}가지 기준입니다.
            </>
          }
          lead="사례가 늘어나도 이 기준은 그대로 유지합니다. 기준을 먼저 공개해 두면, 새로 올라오는 사례도 같은 잣대로 읽으실 수 있습니다."
        />
        <div className="bl-grid bl-grid--2">
          {CASE_DISCLOSURE_RULES.map(rule => (
            <Card key={rule.title}>
              <CardTitle>{rule.title}</CardTitle>
              <CardBody>{rule.body}</CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtle ariaLabelledBy="limits-title">
        <SectionHead
          eyebrow="04 / 주의할 점"
          id="limits-title"
          title="사례만으로 판단할 수 없는 것도 있습니다."
        />
        <InsightBlock
          title="같은 업종이라도 결과가 같으라는 보장은 아닙니다"
          tone="accent"
          actions={
            <Button href="/backlink-agency" variant="secondary">
              맡기기 전에 확인할 기준 보기
            </Button>
          }
        >
          <p>
            같은 업종의 사례가 있다고 해서 같은 결과가 보장되지는 않습니다. 경쟁 페이지의 수와 종류,
            도메인이 쌓아온 이력, 같은 시기에 함께 진행한 다른 작업까지 다르면 같은 방식을 적용해도
            걸리는 시간과 도달하는 지점이 달라집니다. 여기 실린 다섯 건은 실제로 있었던 기록이지,
            앞으로도 같은 결과가 나온다는 약속이 아닙니다.
          </p>
        </InsightBlock>
      </Section>

      <Section subtle size="sm">
        <RelatedContent heading="함께 보면 좋은 페이지" hrefs={cluster.relatedPages} />
        <div style={{ marginTop: '2.5rem' }}>
          <RelatedServices heading="사례 기준을 그대로 적용하는 작업" />
        </div>
        {relatedArticles.length ? (
          <div style={{ marginTop: '2.5rem' }}>
            <RelatedArticles heading="판단 기준을 더 읽어보기" posts={relatedArticles} />
          </div>
        ) : null}
      </Section>

      <FinalCTA source="cases" cta="cases" />
    </>
  )
}
