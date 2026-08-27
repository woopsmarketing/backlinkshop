/**
 * 구글 상위노출 /google-ranking
 *
 * 역할
 * - Primary: `구글 상위노출` (보조: 구글상위노출, 구글 1페이지)
 * - 이 페이지는 "왜 안 오르는가"를 원인별로 나누는 진단 허브다.
 *   상품 판매 페이지가 아니라, 증상 → 확인할 지점 → 해당 작업 페이지로 보내는 분기점 역할을 한다.
 *
 * ⚠️ 콘텐츠 규칙
 * - 결과 기간 약속·순위 보증성 표현·확인되지 않은 성과 수치를 쓰지 않는다.
 * - 내부링크 목록은 config/seo-graph.ts 의 googleRanking 클러스터에서 가져온다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Section } from '@/components/layout/Container'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { ProblemSection } from '@/components/marketing/ProblemSection'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { CaseStudyCard } from '@/components/marketing/CaseStudyCard'
import { FAQSection } from '@/components/marketing/FAQSection'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle, BulletList } from '@/components/ui/Card'
import { KeyTakeaways } from '@/components/content/KeyTakeaways'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedServices } from '@/components/content/RelatedServices'
import { RelatedArticles } from '@/components/content/RelatedArticles'

import { RANKING_FACTORS, type ServiceSlug } from '@/config/services'
import { FAQ_ITEMS } from '@/config/faq'
import { SEO_GRAPH, resolveArticles } from '@/config/seo-graph'
import { PUBLISHED_CASES, CASE_DISCLOSURE_RULES } from '@/config/cases'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '구글 상위노출 — 순위가 오르지 않는 이유부터 좁힙니다',
  description:
    '구글 상위노출이 막히는 지점은 사이트마다 다릅니다. 콘텐츠·온페이지·권위·경쟁 강도 중 어디가 비어 있는지 원인을 좁히고, 증상별로 무엇을 먼저 확인해야 하는지 정리했습니다.',
  alternates: { canonical: '/google-ranking' },
  openGraph: {
    title: '구글 상위노출 — 순위가 오르지 않는 이유부터 좁힙니다',
    description:
      '순위 문제를 하나의 원인으로 설명하면 해결도 틀어집니다. 증상별로 가장 먼저 확인할 지점을 정리했습니다.',
    url: '/google-ranking',
  },
}

const RANKING_QUESTIONS = [
  '어제는 5위였는데 오늘은 15위인가요?',
  '업데이트마다 순위가 크게 흔들리나요?',
  '경쟁 사이트는 계속 올라가는데 내 사이트만 멈춰 있나요?',
  '콘텐츠와 백링크를 추가해도 변화가 없나요?',
]

const TAKEAWAYS = [
  '순위가 멈추는 이유는 콘텐츠·온페이지·권위·경쟁 강도 중 어디가 비어 있는지에 따라 달라집니다.',
  '증상이 다르면 가장 먼저 열어봐야 할 지점도 다릅니다. 같은 처방을 모든 사이트에 쓰지 않습니다.',
  '특정 기간 안에 특정 순위를 약속하지 않습니다. 대신 무엇을 확인했고 무엇을 했는지는 남깁니다.',
]

/** 원인을 좁히는 순서. 이 페이지에서만 쓰는 진단 절차다. */
const DIAGNOSIS_STEPS = [
  {
    no: '01',
    title: '검색에 어떻게 잡혀 있는지 본다',
    body: '목표 페이지가 색인되어 있는지, 실제로 어떤 쿼리에서 노출되고 있는지를 먼저 확인합니다. 노출 자체가 잡히지 않는다면 순위 이야기는 그다음 순서입니다.',
  },
  {
    no: '02',
    title: '키워드와 페이지가 서로 맞는지 대조한다',
    body: '올리고 싶은 키워드에 엉뚱한 페이지가 걸려 있거나, 사이트 안의 여러 문서가 같은 주제를 나눠 갖고 서로 경쟁하는 경우가 적지 않습니다.',
  },
  {
    no: '03',
    title: '지금 상위에 있는 문서와 비교한다',
    body: '현재 1페이지를 차지한 문서들이 어떤 질문에 답하고 있는지 항목으로 적어보고, 내 문서에서 빠져 있는 항목을 나열합니다. 감각이 아니라 목록으로 확인합니다.',
  },
  {
    no: '04',
    title: '이미 받은 링크가 어디에 몰려 있는지 본다',
    body: '어떤 유형의 링크를 어떤 앵커로 받아왔는지 확인합니다. 한쪽으로 치우쳐 있다면 같은 방향으로 더 쌓는 선택이 도움이 되지 않을 수 있습니다.',
  },
  {
    no: '05',
    title: '흔들린 시점과 사이트 변경 시점을 겹쳐 본다',
    body: '순위가 움직인 날짜를 사이트 수정 이력, 그리고 검색 결과 전반의 변화와 나란히 놓고 봅니다. 원인을 나누기 전에는 대응 방향을 정하지 않습니다.',
  },
]

/** 이 페이지 문맥에 맞는 FAQ만 추린다. 전체 목록은 /faq 가 담당한다. */
const RANKING_FAQ_IDS = ['what-is-backlink', 'which-service', 'timeline', 'guarantee']

export default function GoogleRankingPage() {
  const cluster = SEO_GRAPH.googleRanking
  const articles = resolveArticles(cluster.relatedArticles)
  const faq = FAQ_ITEMS.filter(item => RANKING_FAQ_IDS.includes(item.id))
  const serviceSlugs = [cluster.moneyPage, ...cluster.relatedPages]
    .filter(href => href.startsWith('/services/'))
    .map(href => href.replace('/services/', '') as ServiceSlug)
  const readingPages = [cluster.pillar, ...cluster.relatedPages].filter(
    href => !href.startsWith('/services/')
  )
  const cases = PUBLISHED_CASES.slice(0, 2)

  return (
    <>
      <Breadcrumb trail={[{ href: '/google-ranking', label: '구글 상위노출' }]} />

      <Hero
        eyebrow="GOOGLE SEARCH RANKING"
        title={
          <>
            <span className="bl-break">구글 순위가 오르지 않는 이유는</span>하나가 아닙니다.
          </>
        }
        support="같은 작업을 해도 어떤 사이트는 자리를 잡고 어떤 사이트는 그대로입니다. 막혀 있는 지점이 문서 안에 있는지, 페이지 구조에 있는지, 외부에서 오는 신호에 있는지에 따라 해야 할 일이 완전히 달라지기 때문입니다. 무엇을 더 할지 정하기 전에 지금 어디가 비어 있는지부터 좁히는 편이 빠릅니다."
        actions={
          <>
            <TelegramCTA
              source="google-ranking"
              position="hero"
              label="목표 키워드 상담하기"
              size="lg"
            />
            <Button href="/services" variant="secondary" size="lg">
              증상별 작업 살펴보기
            </Button>
          </>
        }
        note="Telegram으로 연결됩니다 · 도메인과 올리고 싶은 키워드만 있으면 됩니다"
      />

      <ProblemSection
        eyebrow="01 / SITUATION"
        title={
          <>
            <span className="bl-break">순위표를 볼 때마다</span>같은 질문을 반복하고 계신가요?
          </>
        }
        questions={RANKING_QUESTIONS}
        closing="네 가지 질문은 비슷해 보이지만 서로 다른 원인을 가리킵니다. 흔들리는 폭이 큰 것과 아예 움직이지 않는 것은 다른 문제이고, 전체 키워드가 내려간 것과 특정 키워드만 멈춘 것도 다른 문제입니다."
        subtle
      />

      <Section ariaLabelledBy="perspective-title">
        <SectionHead
          eyebrow="02 / PERSPECTIVE"
          id="perspective-title"
          title="순위 문제를 하나의 원인으로 설명하면 해결도 틀어집니다."
          lead="원인을 잘못 짚으면 작업량이 많아질수록 결과가 아니라 비용만 늘어납니다."
        />
        <div className="bl-measure">
          <p className="bl-body">
            순위가 멈추면 대부분 링크가 부족하다는 결론으로 먼저 갑니다. 링크는 검색엔진이 참고하는
            신호 중 하나이니 그 판단이 늘 틀린 것은 아닙니다. 다만 막혀 있는 곳이 다른 자리일 때
            링크만 늘리면, 들인 비용과 상관없이 화면에 보이는 변화가 생기지 않습니다.
          </p>
          <p className="bl-body" style={{ marginTop: '1rem' }}>
            검색엔진은 사이트에 점수 하나를 매겨 두고 그것만 보지 않습니다. 이 문서가 질문에 답하고
            있는지, 그 문서를 읽어낼 수 있는 구조인지, 다른 곳에서 참조되고 있는지, 같은 자리를 놓고
            겨루는 상대가 얼마나 두꺼운지를 함께 봅니다. 네 축 가운데 하나가 크게 비어 있으면
            나머지를 채워도 총합이 잘 움직이지 않습니다.
          </p>
          <p className="bl-body" style={{ marginTop: '1rem' }}>
            그래서 상담을 시작할 때 &ldquo;무엇을 더 하면 되나요&rdquo;라는 질문을 &ldquo;지금
            어디가 막혀 있나요&rdquo;로 바꿔서 봅니다. 원인이 좁혀지면 실제로 손대야 할 곳은
            생각보다 적은 경우가 많고, 그때부터는 예산을 어디에 쓸지도 명확해집니다.
          </p>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <KeyTakeaways items={TAKEAWAYS} />
        </div>
      </Section>

      <Section subtle ariaLabelledBy="factors-title">
        <SectionHead
          eyebrow="03 / FOUR FACTORS"
          id="factors-title"
          title="구글 1페이지는 네 가지 조건이 함께 만들어냅니다."
          lead="같은 링크를 받아도 결과가 갈리는 이유입니다. 어느 축이 비어 있는지에 따라 필요한 작업이 달라집니다."
        />
        <div className="bl-grid bl-grid--4">
          {RANKING_FACTORS.map(factor => (
            <Card key={factor.key}>
              <span className="bl-related__label">{factor.label}</span>
              <CardTitle>{factor.title}</CardTitle>
              <CardBody>{factor.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          네 가지에는 정해진 순서가 없습니다. 콘텐츠는 충분한데 색인 단계에서 막혀 있는 사이트가
          있고, 구조는 깔끔한데 참조가 없어 멈춰 있는 사이트도 있습니다. 그래서 진단 없이 시작하는
          작업은 대체로 비싸집니다.
        </p>
      </Section>

      <Section ariaLabelledBy="diagnosis-title">
        <SectionHead
          eyebrow="04 / HOW WE NARROW IT DOWN"
          id="diagnosis-title"
          title="원인은 추측하지 않고 하나씩 좁혀 나갑니다."
          lead="아래 다섯 단계는 상담에서 실제로 밟는 순서입니다. 위에서부터 확인하면 대부분 두세 번째 단계에서 걸리는 지점이 드러납니다."
        />
        <div className="bl-grid bl-grid--2">
          {DIAGNOSIS_STEPS.map(step => (
            <Card key={step.no}>
              <span className="bl-related__label">{step.no}</span>
              <CardTitle>{step.title}</CardTitle>
              <CardBody>{step.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          이 과정에서 나오는 결론은 대개 &ldquo;전부 다시 해야 한다&rdquo;가 아닙니다. 다섯 단계를
          다 훑어도 실제로 손댈 곳은 한두 군데인 경우가 많고, 그 판단이 서기 전까지는 작업을 권하지
          않습니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="symptom-title">
        <SectionHead
          eyebrow="05 / SYMPTOM MAP"
          id="symptom-title"
          title="증상이 다르면 먼저 볼 곳도 다릅니다."
          lead="상담에서 자주 나오는 다섯 가지 증상을, 어떤 항목부터 확인하는지와 함께 정리했습니다. 이 표가 진단을 대신하지는 않지만 어디를 먼저 열어봐야 할지는 좁혀집니다."
        />
        <ComparisonTable
          caption="증상별로 가장 먼저 확인하는 항목과 이어서 볼 페이지"
          columns={['가장 먼저 확인할 것', '이어서 볼 페이지']}
          rowHeader="증상"
          rows={[
            {
              header: '색인은 되는데 순위가 없다',
              cells: [
                '문서가 답하고 있는 질문과 검색한 사람의 질문이 같은지. 색인은 평가 대상이 되었다는 뜻일 뿐, 답이 맞았다는 뜻은 아닙니다.',
                <Link key="content" href="/services/content-seo">
                  검색의도부터 다시 보기
                </Link>,
              ],
            },
            {
              header: '특정 키워드만 안 오른다',
              cells: [
                '그 키워드에 어떤 페이지가 걸려 있는지, 사이트 안에서 같은 주제를 여러 문서가 나눠 갖고 있지는 않은지.',
                <Link key="onpage" href="/services/onpage-seo">
                  온페이지 점검 항목 보기
                </Link>,
              ],
            },
            {
              header: '순위가 크게 흔들린다',
              cells: [
                '받아온 링크가 한 유형·한 앵커에 몰려 있지는 않은지. 신호가 한쪽으로 치우쳐 있으면 작은 변화에도 폭이 커집니다.',
                <Link key="plan" href="/services/plan-backlink">
                  링크 조합을 먼저 설계하는 방식
                </Link>,
              ],
            },
            {
              header: '링크를 늘려도 변화가 없다',
              cells: [
                '링크를 받는 페이지가 평가받을 준비가 되어 있는지. 준비가 안 된 페이지로 신호를 보내면 신호가 갈 곳을 잃습니다.',
                <Link key="backlink" href="/backlink">
                  백링크가 실제로 바꾸는 것
                </Link>,
              ],
            },
            {
              header: '노출은 느는데 클릭이 없다',
              cells: [
                '검색 결과에 보이는 제목과 설명이 무엇을 약속하고 있는지. 순위보다 먼저 손볼 수 있는 영역입니다.',
                <Link key="onpage-meta" href="/services/onpage-seo">
                  제목·설명 구조 손보기
                </Link>,
              ],
            },
          ]}
        />
        <p className="bl-closing">
          오른쪽 열은 다음에 읽어볼 페이지일 뿐, 바로 주문해야 할 상품이 아닙니다. 증상이 두 줄
          이상에 걸쳐 있다면 어느 쪽이 먼저인지가 중요해지므로, 그때는 상담에서 함께 순서를 정리해
          드립니다.
        </p>
      </Section>

      <Section size="sm">
        <TelegramCTABlock
          source="google-ranking"
          position="mid"
          title="목표 키워드를 알려주시면 어디가 막혀 있는지부터 봅니다."
          body="도메인과 올리고 싶은 키워드 하나면 첫 판단은 가능합니다. 지금 필요한 것이 링크가 아니라고 판단되면 그렇게 말씀드립니다."
          label="목표 키워드 상담하기"
        />
      </Section>

      <Section ariaLabelledBy="evidence-title">
        <SectionHead
          eyebrow="06 / EVIDENCE"
          id="evidence-title"
          title={
            <>
              <span className="bl-break">순위 사례는</span>조건까지 확인할 수 있을 때만 싣습니다.
            </>
          }
          lead="몇 위에서 몇 위가 되었는지만 적힌 숫자는 판단에 도움이 되지 않습니다. 어떤 상태에서 시작해 무엇을 했고 어떤 한계가 있었는지가 함께 있어야 내 사이트에 적용할 수 있는지 가늠할 수 있습니다."
        />
        {cases.length ? (
          <div className="bl-grid bl-grid--2">
            {cases.map(study => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
        ) : (
          <>
            <div className="bl-notice">
              <p>
                <strong>검증이 끝난 사례만 게시합니다.</strong> 확인 가능한 원본이 없는 순위 변화
                수치는 이 페이지에도 싣지 않습니다.
              </p>
              <p style={{ marginTop: '0.75rem' }}>
                대신 사례를 어떤 기준으로 공개하는지를 먼저 공개해 두었습니다.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <BulletList items={CASE_DISCLOSURE_RULES.map(rule => rule.title)} />
            </div>
          </>
        )}
        <p style={{ marginTop: '1.5rem' }}>
          <Link href="/cases" className="bl-btn bl-btn--ghost">
            사례 공개 기준 자세히 보기 &rarr;
          </Link>
        </p>
      </Section>

      <FAQSection
        items={faq}
        eyebrow="07 / FAQ"
        title="구글 상위노출에 대해 자주 받는 질문"
        moreHref="/faq"
        moreLabel="전체 질문 보기"
        subtle
      />

      <Section ariaLabelledBy="next-title">
        <SectionHead
          eyebrow="08 / NEXT STEP"
          id="next-title"
          title="원인이 좁혀졌다면 다음은 실행입니다."
          lead="진단 결과에 따라 필요한 작업만 고르시면 됩니다. 세 가지를 전부 진행해야 하는 경우는 많지 않습니다."
        />
        <RelatedServices heading="증상에 맞는 작업" slugs={serviceSlugs} />
      </Section>

      <Section subtle size="sm">
        <RelatedContent heading="함께 보면 좋은 페이지" hrefs={readingPages} columns={2} />
        <div style={{ marginTop: '2.5rem' }}>
          <RelatedArticles heading="판단 기준을 먼저 읽어보기" posts={articles} />
        </div>
      </Section>

      <FinalCTA
        source="google-ranking"
        title="어떤 키워드에서 멈춰 있는지 알려주세요."
        body="사이트 주소와 목표 키워드를 보내주시면 네 가지 조건 중 어디가 비어 있는지부터 정리해 드립니다. 순위나 기간을 약속하지는 않습니다."
        label="목표 키워드 상담하기"
      />
    </>
  )
}
