/**
 * 구글 상위노출 /google-ranking
 *
 * 역할
 * - Primary: `구글 상위노출` (보조: 구글 상단노출, 구글 1페이지)
 * - 사이트의 두 번째 Pillar Page. /backlink 가 "링크"를 설명한다면 이 페이지는
 *   "검색 결과가 결정되는 조건 전체"를 다루고, 증상 → 확인할 지점 → 해당 작업 페이지로 분기시킨다.
 *
 * ⚠️ 콘텐츠 규칙
 * - 결과 기간 약속·순위 보증성 표현·확인되지 않은 성과 수치를 쓰지 않는다.
 * - 과거 기법을 "지금도 통하는 우회 방법"처럼 서술하지 않는다. 탐지 회피 방법을 설명하지 않는다.
 * - 목차 앵커와 섹션 id 는 SECTION_LIST 한 곳에서만 정의한다 (아래 helper 로 타입 검사).
 * - 내부링크 목록은 config/seo-graph.ts 의 googleRanking 클러스터에서 가져온다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Section } from '@/components/layout/Container'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { ExperienceTimeline } from '@/components/marketing/ExperienceTimeline'
import { ProcessSteps } from '@/components/marketing/ProcessSteps'
import { ServiceGrid } from '@/components/marketing/ServiceGrid'
import { InsightBlock } from '@/components/marketing/InsightBlock'
import { CaseStudyCard } from '@/components/marketing/CaseStudyCard'
import { FAQSection } from '@/components/marketing/FAQSection'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle, BulletList } from '@/components/ui/Card'
import { IconSurface } from '@/components/ui/Icon'
import { TableOfContents } from '@/components/content/TableOfContents'
import { KeyTakeaways } from '@/components/content/KeyTakeaways'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedArticles } from '@/components/content/RelatedArticles'

import { RANKING_FACTORS } from '@/config/services'
import { EXPERIENCE_CONCLUSION } from '@/config/experience'
import { FAQ_ITEMS } from '@/config/faq'
import { SEO_GRAPH, resolveArticles } from '@/config/seo-graph'
import { getFeaturedCases, CASE_SOURCE_NOTE, CASE_DISCLOSURE_RULES } from '@/config/cases'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '구글 상위노출 · 구글 상단노출 SEO 전략 | 백링크샵',
  description:
    '구글 상위노출이 막히는 지점은 사이트마다 다릅니다. 콘텐츠와 검색 의도, 온페이지와 사이트 구조, 크롤링과 색인, 외부 권위, 경쟁 환경 중 어디가 비어 있는지 순서대로 좁히고, 증상별로 무엇을 먼저 확인해야 하는지 정리했습니다.',
  alternates: { canonical: '/google-ranking' },
  openGraph: {
    title: '구글 상위노출 · 구글 상단노출 SEO 전략',
    description:
      '순위 문제를 하나의 원인으로 설명하면 해결도 틀어집니다. 구글 1페이지까지 가는 길에서 지금 무엇이 병목인지 좁히는 기준을 정리했습니다.',
    url: '/google-ranking',
  },
}

/** 목차 = 본문 섹션. 이 배열이 앵커·번호·목차의 단일 원본이다. */
const SECTION_LIST = [
  { id: 'symptoms', heading: '현재 이런 문제를 겪고 있나요?', label: '현재 상황' },
  { id: 'why-hard', heading: '구글 상위노출이 어려운 이유', label: '문제 정의' },
  { id: 'ranking-structure', heading: '검색 결과가 결정되는 큰 구조', label: '평가 구조' },
  { id: 'experience', heading: '8년간 경험한 Google SEO의 변화', label: '경험과 변화' },
  { id: 'content-intent', heading: '콘텐츠와 검색 의도', label: '콘텐츠' },
  { id: 'onpage', heading: '온페이지 SEO · 사이트 구조 · 내부링크', label: '온페이지' },
  { id: 'crawl-index', heading: '크롤링과 인덱싱', label: '색인' },
  { id: 'technical-seo', heading: 'Technical SEO', label: '기술 점검' },
  { id: 'backlink-stalls', heading: '백링크를 해도 순위가 오르지 않는 이유', label: '링크 진단' },
  { id: 'rank-drop', heading: '순위가 갑자기 떨어지는 이유', label: '순위 하락' },
  { id: 'site-age', heading: '신규 사이트와 기존 사이트의 차이', label: '시작점' },
  { id: 'keyword-strategy', heading: '경쟁 키워드와 롱테일 전략', label: '키워드 전략' },
  { id: 'diagnosis', heading: '백링크샵이 실제로 진단하는 순서', label: '진단 순서' },
  { id: 'symptom-map', heading: '증상이 다르면 먼저 볼 곳도 다릅니다', label: '증상별 지도' },
  { id: 'services', heading: '증상에 맞는 작업 고르기', label: '관련 서비스' },
  { id: 'cases', heading: '실제 사례', label: '사례' },
  { id: 'faq', heading: '자주 묻는 질문', label: '자주 묻는 질문' },
] as const

type SectionId = (typeof SECTION_LIST)[number]['id']

function sectionIndex(id: SectionId): number {
  return SECTION_LIST.findIndex(section => section.id === id)
}

/**
 * Section 에 넘길 앵커 속성. 목차 id 와 어긋날 수 없다.
 * 배경 교차(subtle)를 목차 순서에서 계산하므로 섹션을 끼워 넣어도 리듬이 깨지지 않는다.
 */
function anchor(id: SectionId) {
  return {
    id,
    className: 'bl-anchor',
    ariaLabelledBy: `${id}-title`,
    subtle: sectionIndex(id) % 2 === 1,
  }
}
/** SectionHead 의 heading id. anchor() 와 같은 문자열을 쓴다. */
function headingId(id: SectionId): string {
  return `${id}-title`
}
/** 화면에 표시하는 섹션 라벨. 번호는 목차 순서에서 자동으로 계산한다. */
function eyebrow(id: SectionId): string {
  const index = sectionIndex(id)
  return `${String(index + 1).padStart(2, '0')} / ${SECTION_LIST[index].label}`
}

const SUMMARY_POINTS = [
  '구글 상위노출은 한 가지 작업의 결과가 아니라 여러 조건이 함께 충족될 때 나타나는 결과입니다.',
  '콘텐츠·온페이지·색인·외부 권위·경쟁 환경 중 한 축이 크게 비어 있으면, 나머지를 채워도 총합이 잘 움직이지 않습니다.',
  '색인되지 않은 페이지에는 순위가 낮은 것이 아니라 순위 자체가 없습니다. 순위 이야기는 그다음 순서입니다.',
  '링크를 늘려도 변화가 없다면, 링크가 병목이 아닐 가능성부터 확인하는 편이 비용이 적게 듭니다.',
  '신규 사이트와 운영 이력이 있는 사이트는 시작점이 달라서 필요한 작업도 기간도 다릅니다.',
  '특정 기간 안에 특정 순위를 약속하지 않습니다. 대신 무엇을 확인했고 무엇을 했는지는 남깁니다.',
]

/** 상담에서 실제로 자주 듣는 상황. 질문만 나열하지 않고 왜 문제인지까지 적는다. */
const SYMPTOMS = [
  {
    icon: 'activity',
    question: '순위가 계속 흔들립니다',
    body: '어제 5위, 오늘 15위처럼 폭이 큰 변동은 평가 근거가 얇을 때 자주 나타납니다. 신호가 한쪽으로 몰려 있으면 작은 변화에도 결과가 크게 움직입니다.',
  },
  {
    icon: 'file',
    question: '콘텐츠를 추가해도 변화가 없습니다',
    body: '문서 수가 늘어도 검색한 사람의 질문에 답하지 않으면 평가 대상만 늘어납니다. 같은 주제를 여러 문서가 나눠 갖고 서로 경쟁하는 경우도 적지 않습니다.',
  },
  {
    icon: 'link',
    question: '백링크를 추가해도 변화가 없습니다',
    body: '링크는 신호를 보내는 작업입니다. 신호를 받는 페이지가 아직 평가받을 준비가 되어 있지 않으면, 보낸 만큼 반영되지 않습니다.',
  },
  {
    icon: 'trending',
    question: '경쟁 사이트만 계속 올라갑니다',
    body: '내 사이트가 그대로여도 상대가 움직이면 상대적 위치는 내려갑니다. 순위는 내 사이트 혼자 받는 점수가 아니라 같은 자리를 두고 벌어지는 비교입니다.',
  },
] as const

/** RANKING_FACTORS(핵심 4가지) 뒤에 이어 붙는 나머지 조건. */
const EXTENDED_FACTORS = [
  {
    key: 'intent',
    icon: 'compass',
    title: '검색 의도',
    body: '같은 키워드라도 찾는 사람이 기대하는 답의 형태가 다릅니다. 비교를 원하는 검색에 소개 페이지를 올리면 문서 자체가 좋아도 자리가 맞지 않습니다.',
  },
  {
    key: 'quality',
    icon: 'gauge',
    title: '페이지 품질',
    body: '원하는 정보에 도달하기까지의 경험입니다. 속도, 모바일에서의 조작, 본문과 광고의 비율처럼 문서 밖의 조건도 여기에 포함됩니다.',
  },
  {
    key: 'internal-links',
    icon: 'share',
    title: '내부링크',
    body: '밖에서 받은 신호가 정작 올리려는 페이지까지 흐르는지를 결정합니다. 내부 경로가 끊겨 있으면 신호는 첫 페이지에서 멈춥니다.',
  },
  {
    key: 'domain-history',
    icon: 'clock',
    title: '도메인의 역사',
    body: '도메인이 지나온 시간과 그동안 쌓인 참조는 새 도메인이 하루아침에 만들 수 없습니다. 반대로 과거 이력이 부담으로 남는 경우도 있습니다.',
  },
  {
    key: 'technical',
    icon: 'wrench',
    title: 'Technical SEO',
    body: 'canonical, 리다이렉트, 사이트맵, robots, 구조화 데이터처럼 화면에 보이지 않는 설정입니다. 잘 되어 있다고 순위가 오르지는 않지만, 잘못되어 있으면 다른 작업의 효과를 깎습니다.',
  },
] as const

/** 온페이지 점검 범위. SERVICES 의 onpage-seo summary 와 같은 범위를 유지한다. */
const ONPAGE_CHECKS = [
  {
    icon: 'gauge',
    title: '속도와 Core Web Vitals',
    body: '느린 페이지가 곧바로 순위를 잃지는 않습니다. 다만 로딩 중에 화면이 밀리거나 눌러야 할 요소가 움직이면 이탈이 늘고, 그 결과가 다시 지표로 돌아옵니다. 절대 점수보다 상위 페이지와의 체감 차이를 봅니다.',
  },
  {
    icon: 'sitemap',
    title: '페이지와 사이트 구조',
    body: '중요한 페이지가 첫 화면에서 몇 번 만에 도달되는지 셉니다. 깊이 들어가야 나오는 페이지는 검색엔진에게도 사용자에게도 중요도가 낮은 것으로 읽힙니다.',
  },
  {
    icon: 'share',
    title: '내부링크 설계',
    body: '어떤 페이지를 올리고 싶은지 정한 다음, 그 페이지로 향하는 내부 링크가 실제로 있는지 확인합니다. 앵커 텍스트가 전부 “자세히 보기”라면 링크는 있어도 문맥은 전달되지 않습니다.',
  },
  {
    icon: 'wrench',
    title: 'canonical · 리다이렉트 · 사이트맵 · robots',
    body: '같은 내용이 여러 주소로 열리는지, canonical이 엉뚱한 주소를 가리키는지, 리다이렉트가 여러 번 이어지는지를 봅니다. 사이트맵과 robots는 서로 모순되지 않아야 합니다.',
  },
  {
    icon: 'file',
    title: '헤딩 · 메타데이터 · 구조화 데이터',
    body: 'H1이 하나인지, 헤딩 계층이 건너뛰지 않는지, 제목과 설명이 문서의 내용과 같은 약속을 하는지 확인합니다. 구조화 데이터는 화면에 없는 내용을 넣는 자리가 아닙니다.',
  },
  {
    icon: 'users',
    title: '모바일 사용성',
    body: '대부분의 검색이 모바일에서 일어납니다. 데스크톱에서만 확인하고 넘어간 페이지에서 문제가 발견되는 경우가 많아, 좁은 화면 기준으로 다시 봅니다.',
  },
] as const

/** 링크가 병목이 아닌 경우들. */
const LINK_NOT_BOTTLENECK = [
  {
    title: '목표 페이지가 색인되어 있지 않다',
    body: '색인되지 않은 페이지로 링크를 보내면 신호가 도착할 대상이 없습니다. 링크를 늘리기 전에 그 페이지가 검색 결과에 존재하는지부터 확인합니다.',
  },
  {
    title: '문서가 검색 의도에 답하지 않는다',
    body: '평가 대상이 되었더라도 다른 질문에 답하고 있으면 자리를 받기 어렵습니다. 이 경우 링크는 잘못된 답을 더 많은 곳에 알리는 역할만 합니다.',
  },
  {
    title: '신호가 목표 페이지까지 흐르지 않는다',
    body: '링크가 첫 페이지에 걸려 있고 내부 경로가 끊겨 있으면, 밖에서 받은 신호가 올리려는 문서까지 도달하지 않습니다.',
  },
  {
    title: '받은 링크가 한쪽에 몰려 있다',
    body: '같은 유형, 같은 앵커로만 쌓여 있으면 사람이 실제로 인용할 때의 분포에서 멀어집니다. 같은 방향으로 더 쌓는 선택이 도움이 되지 않을 수 있습니다.',
  },
  {
    title: '차이가 링크가 아닌 곳에서 벌어진다',
    body: '상위 문서가 다루는 항목이 내 문서에 통째로 빠져 있다면, 참조의 양을 늘려도 그 항목이 채워지지는 않습니다.',
  },
] as const

/** 순위 하락의 가능성들. 한 가지로 단정하지 않는다. */
const DROP_CAUSES = [
  {
    icon: 'activity',
    title: '검색 알고리즘 업데이트',
    body: '특정 시점을 기준으로 여러 키워드가 함께 움직였다면 검색 결과 전반의 변화일 수 있습니다. 확인할 것은 내 사이트만 내려갔는지, 같은 검색 결과의 다른 문서들도 자리를 바꿨는지입니다.',
  },
  {
    icon: 'target',
    title: '경쟁 페이지의 변화',
    body: '내 문서가 그대로여도 상대가 문서를 보강하거나 새 경쟁자가 들어오면 자리는 내려갑니다. 지금 그 자리를 차지한 문서가 예전과 같은 문서인지부터 봅니다.',
  },
  {
    icon: 'wrench',
    title: '사이트 내부의 변경',
    body: '리뉴얼, 주소 변경, 템플릿 교체, 태그 수정처럼 순위와 무관해 보이는 변경이 원인인 경우가 있습니다. 순위가 움직인 날짜와 배포 이력을 나란히 놓고 봅니다.',
  },
  {
    icon: 'link',
    title: '링크 프로필의 변화',
    body: '받고 있던 링크가 사라지거나, 짧은 기간에 성격이 다른 링크가 몰려 들어오면 프로필이 달라집니다. 늘어난 것뿐 아니라 없어진 것도 함께 확인합니다.',
  },
] as const

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
] as const

/** 이 페이지 문맥에 맞는 FAQ만 추린다. 전체 목록은 /faq 가 담당한다. */
const RANKING_FAQ_IDS = [
  'what-is-backlink',
  'which-service',
  'existing-backlinks',
  'process',
  'timeline',
  'guarantee',
]

export default function GoogleRankingPage() {
  const cluster = SEO_GRAPH.googleRanking
  const articles = resolveArticles(cluster.relatedArticles)
  const faq = FAQ_ITEMS.filter(item => RANKING_FAQ_IDS.includes(item.id))
  const readingPages = [cluster.pillar, ...cluster.relatedPages].filter(
    href => !href.startsWith('/services/')
  )
  const cases = getFeaturedCases()
  const toc = SECTION_LIST.map(section => ({ id: section.id, heading: section.heading }))

  return (
    <>
      <Breadcrumb trail={[{ href: '/google-ranking', label: '구글 상위노출' }]} />

      <Hero
        eyebrow="검색 순위 가이드"
        title={
          <>
            구글 상위노출은
            <span className="bl-break">한 가지 SEO 작업으로 만들어지지 않습니다.</span>
          </>
        }
        support="같은 작업을 해도 어떤 사이트는 자리를 잡고 어떤 사이트는 그대로입니다. 막혀 있는 지점이 문서 안에 있는지, 페이지 구조에 있는지, 색인 단계에 있는지, 외부에서 오는 신호에 있는지에 따라 해야 할 일이 완전히 달라지기 때문입니다. 구글 1페이지까지 가는 길에서 지금 무엇이 병목인지 순서대로 좁혀 나가는 방법을 정리했습니다."
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
      />

      <Section size="sm" subtle ariaLabelledBy="summary-title">
        <SectionHead
          id="summary-title"
          title="먼저 요약하면 이렇습니다."
          lead="아래 내용을 전부 읽기 어렵다면 이 여섯 문장만 기억해도 다음 판단이 훨씬 쉬워집니다."
        />
        <KeyTakeaways items={SUMMARY_POINTS} />
      </Section>

      <Section size="sm" narrow>
        <TableOfContents sections={toc} />
      </Section>

      <Section {...anchor('symptoms')}>
        <SectionHead
          eyebrow={eyebrow('symptoms')}
          id={headingId('symptoms')}
          title="현재 이런 문제를 겪고 있나요?"
          lead="상담에서 가장 자주 듣는 네 가지입니다. 비슷해 보이지만 서로 다른 원인을 가리킵니다."
        />
        <div className="bl-qgrid">
          {SYMPTOMS.map(item => (
            <div key={item.question} className="bl-qcard">
              <IconSurface name={item.icon} />
              <p className="bl-qcard__q">{item.question}</p>
              <p className="bl-qcard__body">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="bl-closing">
          흔들리는 것과 아예 움직이지 않는 것은 다른 문제이고, 전체 키워드가 함께 내려간 것과 특정
          키워드 하나만 멈춘 것도 다른 문제입니다. 어느 쪽인지 구분하는 것이 첫 작업입니다.
        </p>
      </Section>

      <Section {...anchor('why-hard')}>
        <SectionHead
          eyebrow={eyebrow('why-hard')}
          id={headingId('why-hard')}
          title="구글 상위노출이 어려운 이유"
          lead="자리는 그대로인데 조건은 계속 늘었습니다. 예전보다 어려워진 이유는 대체로 이 두 가지가 겹치기 때문입니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            첫째, 자리가 줄었습니다. 검색 결과 한 페이지에 들어가는 자리는 늘지 않았는데 그 자리를
            두고 겨루는 문서는 계속 늘었습니다. 게다가 1페이지 안에서도 일반 검색 결과가 차지하는
            면적이 예전과 같지 않습니다. 광고, 이미지, 동영상, 지도, 질문에 바로 답하는 형태의
            블록이 위쪽을 차지하면서 같은 순위라도 실제로 눈에 들어오는 비중이 달라졌습니다.
          </p>
          <p className="bl-body">
            둘째, 조건이 늘었습니다. 한때는 링크의 양처럼 하나의 축이 결과를 크게 흔들었습니다.
            지금은 문서가 질문에 답하는지, 그 문서를 읽어낼 수 있는 구조인지, 색인에 들어가 있는지,
            밖에서 참조되고 있는지, 같은 자리를 노리는 상대가 얼마나 두꺼운지가 함께 작용합니다.
          </p>
          <p className="bl-body">
            조건이 여러 개일 때 총합을 올리는 방법은 잘하고 있는 항목을 더 잘하는 것이 아니라, 크게
            비어 있는 항목을 채우는 것입니다. 그래서 구글 상단노출이 막혀 있을 때 &ldquo;무엇을 더
            하면 되나요&rdquo;라는 질문은 잘 통하지 않습니다. 지금 어느 항목이 비어 있는지를 먼저
            정해야 다음 작업이 정해집니다.
          </p>
        </div>
        <InsightBlock
          tone="accent"
          eyebrow="판단 기준"
          title="작업량을 늘리는 것과 병목을 푸는 것은 다릅니다."
        >
          <p>
            원인을 잘못 짚으면 작업량이 늘어날수록 결과가 아니라 비용만 늘어납니다. 반대로 원인이
            좁혀지면 실제로 손댈 곳은 생각보다 적은 경우가 많고, 그때부터는 예산을 어디에 쓸지도
            명확해집니다.
          </p>
        </InsightBlock>
      </Section>

      <Section {...anchor('ranking-structure')}>
        <SectionHead
          eyebrow={eyebrow('ranking-structure')}
          id={headingId('ranking-structure')}
          title="검색 결과가 결정되는 큰 구조"
          lead="검색엔진이 쓰는 정확한 계산식은 공개되어 있지 않습니다. 다만 실무에서 결과를 가르는 항목은 반복해서 같은 자리에 모입니다. 아래는 그 항목들을 크게 묶은 것입니다."
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
        <h3 className="bl-h3" style={{ marginTop: '2.5rem' }}>
          여기에 이어지는 다섯 가지
        </h3>
        <div className="bl-grid bl-grid--3" style={{ marginTop: '1.5rem' }}>
          {EXTENDED_FACTORS.map(factor => (
            <Card key={factor.key}>
              <IconSurface name={factor.icon} />
              <CardTitle>{factor.title}</CardTitle>
              <CardBody>{factor.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          아홉 가지에 고정된 순서는 없습니다. 콘텐츠는 충분한데 색인 단계에서 막혀 있는 사이트가
          있고, 구조는 깔끔한데 참조가 없어 멈춰 있는 사이트도 있습니다. 아래 섹션은 이 항목들을
          하나씩 열어, 어디를 어떤 기준으로 확인하는지 설명합니다.
        </p>
      </Section>

      <Section {...anchor('experience')}>
        <SectionHead
          eyebrow={eyebrow('experience')}
          id={headingId('experience')}
          title="8년간 경험한 Google SEO의 변화"
          lead="방법이 바뀌는 과정을 기사로 읽은 것이 아니라, 각 시기를 직접 운영하며 지나왔습니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            아래 타임라인은 지금도 통하는 우회 방법의 목록이 아닙니다. 오히려 반대입니다. 한때
            결과를 만들던 방식이 어떻게 힘을 잃었는지를 직접 겪었기 때문에, 새로운 방법을 들었을 때
            그것이 얼마나 오래갈 조건인지 가늠할 수 있습니다.
          </p>
          <p className="bl-body">
            그래서 이 페이지 어디에서도 지난 방식 중 무엇이 지금도 안전하다고 말하지 않습니다.
            검색엔진 정책의 영향에서 완전히 자유로운 외부 링크 작업은 없습니다. 저희가 말할 수 있는
            것은 어떤 선택에 어떤 위험이 따르는지, 그리고 지금 사이트 상태에서 그 위험을 감수할
            이유가 있는지까지 입니다.
          </p>
        </div>
        <div style={{ marginTop: '2.5rem' }}>
          <ExperienceTimeline />
        </div>
        <div style={{ marginTop: '2.5rem' }}>
          <InsightBlock
            title={EXPERIENCE_CONCLUSION}
            actions={
              <Button href="/about" variant="ghost">
                판단 기준이 만들어진 과정 보기 &rarr;
              </Button>
            }
          >
            <p>
              여러 시대와 여러 방법을 직접 지나왔기 때문에, 지금 상황을 하나의 관점이 아니라 넓은
              범위에서 비교할 수 있습니다. 무엇을 해야 하는지만큼 무엇을 하지 말아야 하는지도 같은
              경험에서 나옵니다.
            </p>
          </InsightBlock>
        </div>
      </Section>

      <Section {...anchor('content-intent')}>
        <SectionHead
          eyebrow={eyebrow('content-intent')}
          id={headingId('content-intent')}
          title="콘텐츠와 검색 의도"
          lead="문서를 몇 개 썼는지는 기준이 되지 않습니다. 검색한 사람이 기대한 답의 형태에 맞는 구조인지가 기준입니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            같은 키워드를 쓰더라도 찾는 사람이 원하는 것은 다릅니다. 무엇인지 알고 싶은 검색, 어디가
            나은지 비교하고 싶은 검색, 지금 바로 맡길 곳을 찾는 검색은 원하는 문서의 형태가 각각
            다릅니다. 어떤 의도인지 확인하는 가장 빠른 방법은 검색 결과 1페이지를 직접 열어보는
            것입니다. 지금 그 자리를 차지한 문서들의 형태가 그 키워드의 의도에 대한 현재의 답입니다.
          </p>
          <p className="bl-body">
            그다음 확인할 것은 내 문서가 그 형태를 갖췄는지입니다. 아래 네 가지는 콘텐츠를 더 쓰기
            전에 먼저 대조하는 항목입니다.
          </p>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <BulletList
            items={[
              '상위 문서들이 공통으로 다루는 항목 중 내 문서에 빠져 있는 것이 무엇인지 목록으로 적었는가.',
              '문서가 답하는 질문과 올리려는 키워드가 같은 질문인가, 아니면 비슷해 보이는 다른 질문인가.',
              '같은 주제를 여러 문서가 나눠 갖고 사이트 안에서 서로 경쟁하고 있지는 않은가.',
              '결론이 문서 위쪽에 있는가. 답을 찾으러 온 사람은 스크롤을 내리며 검증하지 않습니다.',
            ]}
          />
        </div>
        <p className="bl-closing">
          네 가지 중 걸리는 항목이 있다면 문서를 새로 쓰는 것보다 기존 문서를 고치는 쪽이 빠른
          경우가 많습니다. 이미 색인되어 있고 노출 이력이 있는 문서는 처음부터 시작하지 않아도 되기
          때문입니다. 구조를 다시 잡는 작업은 <Link href="/services/content-seo">콘텐츠 SEO</Link>
          에서 다룹니다.
        </p>
      </Section>

      <Section size="sm">
        <TelegramCTABlock source="google-ranking" cta="content" position="mid-content" />
      </Section>

      <Section {...anchor('onpage')}>
        <SectionHead
          eyebrow={eyebrow('onpage')}
          id={headingId('onpage')}
          title="온페이지 SEO · 사이트 구조 · 내부링크"
          lead="페이지가 순위를 받을 준비가 되어 있는지를 보는 영역입니다. 여기가 비어 있으면 밖에서 아무리 신호를 보내도 도착할 곳이 정리되어 있지 않습니다."
        />
        <div className="bl-grid bl-grid--3">
          {ONPAGE_CHECKS.map(check => (
            <Card key={check.title}>
              <IconSurface name={check.icon} />
              <CardTitle>{check.title}</CardTitle>
              <CardBody>{check.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          여섯 항목은 순위를 올리는 작업이라기보다 순위를 받지 못하게 막는 요인을 걷어내는 작업에
          가깝습니다. 그래서 눈에 띄는 변화가 바로 보이지 않을 수 있지만, 이후에 하는 모든 작업의
          효율이 달라집니다. 항목별로 무엇을 어떻게 점검하는지는{' '}
          <Link href="/services/onpage-seo">온페이지 SEO</Link>에 정리되어 있습니다.
        </p>
      </Section>

      <Section {...anchor('crawl-index')}>
        <SectionHead
          eyebrow={eyebrow('crawl-index')}
          id={headingId('crawl-index')}
          title="크롤링과 인덱싱"
          lead="색인되지 않은 페이지에는 순위가 낮은 것이 아니라 순위 자체가 없습니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            검색 결과에 나오려면 두 단계를 통과해야 합니다. 검색엔진이 그 페이지에 도달해야 하고,
            도달한 문서가 색인에 들어가야 합니다. 두 단계는 별개입니다. 도달했지만 색인되지 않는
            문서도, 색인되었지만 어떤 쿼리에서도 노출되지 않는 문서도 있습니다.
          </p>
          <p className="bl-body">
            도달은 경로의 문제입니다. 크롤러는 링크를 따라 이동하기 때문에, 어떤 페이지에서도
            링크되어 있지 않고 사이트맵에도 없는 문서는 존재하지만 발견되지 않습니다. 반대로
            파라미터로 갈라진 주소나 끝없이 이어지는 목록 페이지가 크롤을 과하게 소비하면, 정작
            중요한 페이지의 순번이 뒤로 밀립니다.
          </p>
          <p className="bl-body">
            색인은 자격의 문제입니다. noindex가 남아 있는 페이지, 로그인 뒤에 있는 콘텐츠,
            canonical이 다른 주소를 가리키는 페이지, 그리고 사실상 같은 내용을 담은 문서들은
            도달해도 색인에 남지 않을 수 있습니다.
          </p>
          <p className="bl-body">
            그래서 진단의 첫 항목이 항상 같습니다. 목표 페이지가 색인되어 있는지, 색인되어 있다면
            어떤 쿼리에서 노출되고 있는지. 노출이 전혀 잡히지 않는 상태에서 링크부터 늘리는 것은
            순서가 뒤바뀐 작업입니다.
          </p>
        </div>
      </Section>

      <Section {...anchor('technical-seo')}>
        <SectionHead
          eyebrow={eyebrow('technical-seo')}
          id={headingId('technical-seo')}
          title="Technical SEO"
          lead="화면에 보이지 않는 조건입니다. 잘 되어 있다고 순위가 오르지는 않지만, 잘못되어 있으면 다른 작업의 결과를 깎습니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            앞에서 다룬 canonical, 리다이렉트, 사이트맵, robots, 구조화 데이터가 여기에 해당합니다.
            이 항목들의 공통점은 하나입니다. 문제가 없을 때는 아무도 신경 쓰지 않지만, 문제가 있으면
            콘텐츠와 링크에 들인 비용이 그만큼 새어 나갑니다.
          </p>
          <p className="bl-body">
            여러 사이트를 함께 운영한다면 한 가지가 더 붙습니다. 같은 호스팅, 같은 템플릿, 같은
            연락처, 같은 문장 구조가 여러 사이트에 그대로 반복되면 서로 구분되지 않는 묶음이 됩니다.
            이것을 점검하는 이유는 무엇을 감추기 위해서가 아닙니다. 서로 구분되지 않는 사이트들은
            개별 사이트로 봐도 대체로 품질이 낮기 때문입니다.
          </p>
          <p className="bl-body">
            그래서 이 항목의 기준은 &ldquo;흔적을 지웠는가&rdquo;가 아니라 &ldquo;각 사이트가 스스로
            설명되는가&rdquo;입니다. 사람이 열어봐도 같은 사이트로 보이는 묶음은 어떤 방법을 써도
            각각의 가치를 만들지 못합니다.
          </p>
        </div>
      </Section>

      <Section size="sm">
        <TelegramCTABlock source="google-ranking" cta="onpage" position="mid-onpage" />
      </Section>

      <Section {...anchor('backlink-stalls')}>
        <SectionHead
          eyebrow={eyebrow('backlink-stalls')}
          id={headingId('backlink-stalls')}
          title="백링크를 해도 순위가 오르지 않는 이유"
          lead="링크가 효과가 없다는 뜻이 아닙니다. 링크가 지금 이 사이트의 병목이 아닐 때 나타나는 결과입니다."
        />
        <div className="bl-grid bl-grid--2">
          {LINK_NOT_BOTTLENECK.map(item => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          다섯 가지 중 어디에도 해당하지 않는데 상위 페이지와의 차이가 참조의 양과 질에서 벌어지고
          있다면, 그때는 외부 신호가 병목이 맞습니다. 링크가 무엇을 바꾸고 무엇을 바꾸지 못하는지는{' '}
          <Link href="/backlink">백링크 가이드</Link>에, 링크를 받기 전에 페이지를 정리하는 작업은{' '}
          <Link href="/services/onpage-seo">온페이지 SEO</Link>에 정리되어 있습니다.
        </p>
      </Section>

      <Section {...anchor('rank-drop')}>
        <SectionHead
          eyebrow={eyebrow('rank-drop')}
          id={headingId('rank-drop')}
          title="순위가 갑자기 떨어지는 이유"
          lead="원인은 대개 아래 네 가지 중 하나이거나 둘 이상이 겹친 결과입니다. 다만 밖에서 볼 수 있는 정보만으로 하나를 확정할 수는 없습니다."
        />
        <div className="bl-grid bl-grid--2">
          {DROP_CAUSES.map(cause => (
            <Card key={cause.title}>
              <IconSurface name={cause.icon} />
              <CardTitle>{cause.title}</CardTitle>
              <CardBody>{cause.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          하락 직후에 가장 흔한 실수는 원인을 하나로 단정하고 곧바로 대응을 시작하는 것입니다.
          날짜를 겹쳐 보기 전에 손을 대면 원인이 아닌 곳을 고치게 되고, 그 사이 실제 원인은 그대로
          남습니다. 되돌릴 수 있는 변경이 있었다면 먼저 되돌려 보고, 그런 변경이 없다면 며칠
          관찰하면서 검색 결과 전체가 어떻게 움직였는지를 함께 봅니다.
        </p>
      </Section>

      <Section {...anchor('site-age')}>
        <SectionHead
          eyebrow={eyebrow('site-age')}
          id={headingId('site-age')}
          title="신규 사이트와 기존 사이트의 차이"
          lead="시작점이 다르면 필요한 작업도, 결과를 확인하기까지 걸리는 시간도 달라집니다. 같은 처방을 두 사이트에 똑같이 쓰지 않는 이유입니다."
        />
        <div className="bl-grid bl-grid--2">
          <Card feature>
            <CardTitle>신규 사이트</CardTitle>
            <CardBody>
              처음 할 일은 순위가 아니라 색인입니다. 검색엔진이 사이트를 발견하고, 어떤 주제를
              다루는 곳인지 파악할 재료가 쌓여야 합니다. 대신 구조와 내부링크를 처음부터 원하는 대로
              설계할 수 있다는 이점이 있습니다. 참조가 0에서 시작하기 때문에 경쟁 키워드로 바로
              들어가는 것보다는 노출이 잡히는 쿼리를 먼저 만드는 편이 대체로 빠릅니다.
            </CardBody>
          </Card>
          <Card feature>
            <CardTitle>운영 이력이 있는 사이트</CardTitle>
            <CardBody>
              이미 색인, 링크, 구조가 있습니다. 문제는 그 안에 정리되지 않은 것이 섞여 있다는
              점입니다. 같은 주제의 문서가 여러 개로 갈라져 있거나, 과거에 받은 링크가 한쪽에 몰려
              있거나, 리뉴얼 과정에서 남은 리다이렉트가 겹쳐 있는 경우가 많습니다. 새로 더하기 전에
              정리부터 하면 손대는 범위가 줄어듭니다.
            </CardBody>
          </Card>
        </div>
        <p className="bl-closing">
          어느 쪽이든 기간을 미리 확정해서 말씀드리지 않습니다. 도메인 상태와 키워드 경쟁 강도에
          따라 며칠 안에 확인되는 변화도 있고 몇 달에 걸쳐 움직이는 변화도 있어서, 정직하게 말할 수
          있는 것은 어떤 지표를 언제 확인할지 정도입니다.
        </p>
      </Section>

      <Section {...anchor('keyword-strategy')}>
        <SectionHead
          eyebrow={eyebrow('keyword-strategy')}
          id={headingId('keyword-strategy')}
          title="경쟁 키워드와 롱테일 전략"
          lead="어떤 키워드부터 잡을지는 취향이 아니라 지금 사이트 상태에서 결정됩니다. 세 가지 접근을 조건과 함께 비교했습니다."
        />
        <ComparisonTable
          caption="키워드 접근 방식별로 맞는 상황과 기대할 수 있는 것, 주의할 점"
          columns={['어떤 상황에 맞는가', '기대할 수 있는 것', '주의할 점']}
          rowHeader="접근"
          rows={[
            {
              header: '경쟁 키워드 정면 공략',
              cells: [
                '색인·구조·콘텐츠가 이미 정리되어 있고, 상위 페이지와의 차이가 참조의 양과 질에서만 벌어질 때.',
                '검색량이 큰 자리에서의 노출. 자리를 잡으면 유입의 폭 자체가 달라집니다.',
                '준비가 안 된 상태에서 시작하면 비용이 먼저 커집니다. 기간이 길고 중간 지표가 잘 보이지 않아 판단이 어려워집니다.',
              ],
            },
            {
              header: '롱테일부터 쌓기',
              cells: [
                '사이트가 새로 시작했거나, 아직 어떤 쿼리에서도 노출이 잡히지 않을 때.',
                '노출이 잡히는 쿼리가 생기면 무엇이 통하는지 확인할 데이터가 생깁니다. 구글 1페이지에 먼저 들어가 보는 것 자체가 다음 판단의 근거가 됩니다.',
                '검색량이 작아 문의로 이어지는 양은 제한적입니다. 롱테일만 늘린다고 큰 키워드가 저절로 따라오지는 않습니다.',
              ],
            },
            {
              header: '주제 묶음으로 넓히기',
              cells: [
                '개별 문서는 있는데 서로 연결되지 않아, 사이트가 무엇을 다루는 곳인지 드러나지 않을 때.',
                '관련 문서가 서로를 참조하면서 주제 전체에 대한 신호가 생깁니다. 문서 하나를 손보는 것보다 범위가 넓습니다.',
                '문서 수를 늘리는 것과 다릅니다. 겹치는 문서를 늘리면 같은 주제를 두고 사이트 안에서 경쟁하게 됩니다.',
              ],
            },
          ]}
        />
        <p className="bl-closing">
          세 가지 중 하나만 골라야 하는 것은 아닙니다. 다만 지금 사이트 상태에서 어느 쪽이
          먼저인지는 정해야 합니다. 순서를 정하지 않은 채 세 가지를 동시에 진행하면, 결과가 나와도
          무엇이 작용했는지 알 수 없어 다음 판단의 근거가 남지 않습니다.
        </p>
      </Section>

      <Section size="sm">
        <TelegramCTABlock source="google-ranking" cta="google-ranking" position="mid-strategy" />
      </Section>

      <Section {...anchor('diagnosis')}>
        <SectionHead
          eyebrow={eyebrow('diagnosis')}
          id={headingId('diagnosis')}
          title="백링크샵이 실제로 진단하는 순서"
          lead="원인은 추측하지 않고 하나씩 좁혀 나갑니다. 아래 다섯 단계는 상담에서 실제로 밟는 순서이고, 위에서부터 확인하면 대부분 두세 번째 단계에서 걸리는 지점이 드러납니다."
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
        <div style={{ marginTop: '3rem' }}>
          <SectionHead as="h3" title="진단이 끝난 다음 순서" />
          <ProcessSteps />
        </div>
      </Section>

      <Section {...anchor('symptom-map')}>
        <SectionHead
          eyebrow={eyebrow('symptom-map')}
          id={headingId('symptom-map')}
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

      <Section {...anchor('services')}>
        <SectionHead
          eyebrow={eyebrow('services')}
          id={headingId('services')}
          title="증상에 맞는 작업 고르기"
          lead="원인이 좁혀졌다면 다음은 실행입니다. 네 가지를 전부 진행해야 하는 경우는 많지 않습니다. 지금 비어 있는 축에 해당하는 작업만 고르시면 됩니다."
        />
        <ServiceGrid />
        <p className="bl-closing">
          어떤 것을 골라야 할지 애매하다면 고르지 않으셔도 됩니다. 사이트 주소와 목표 키워드를
          알려주시면 지금 필요한 것이 무엇인지부터 판단해 드리고, 필요한 작업이 없다고 보이면 그렇게
          말씀드립니다. 각 작업의 시작가는 <Link href="/pricing">가격 페이지</Link>에서 확인하실 수
          있습니다.
        </p>
      </Section>

      <Section {...anchor('cases')}>
        <SectionHead
          eyebrow={eyebrow('cases')}
          id={headingId('cases')}
          title="실제 사례"
          lead="몇 위에서 몇 위가 되었는지만 적힌 숫자는 판단에 도움이 되지 않습니다. 어떤 상태에서 시작해 무엇을 했고 어떤 조건이었는지가 함께 있어야 내 사이트에 적용할 수 있는지 가늠할 수 있습니다."
        />
        {cases.length ? (
          <>
            <div className="bl-grid bl-grid--3">
              {cases.map(study => (
                <CaseStudyCard key={study.id} study={study} />
              ))}
            </div>
            <p className="bl-note">{CASE_SOURCE_NOTE}</p>
          </>
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
        <div className="bl-btn-row" style={{ marginTop: '1.5rem' }}>
          <Button href="/cases" variant="ghost">
            사례 공개 기준과 전체 목록 보기 &rarr;
          </Button>
        </div>
      </Section>

      <FAQSection
        items={faq}
        id="faq"
        eyebrow={eyebrow('faq')}
        title="자주 묻는 질문"
        moreHref="/faq"
        moreLabel="전체 질문 보기"
        subtle={sectionIndex('faq') % 2 === 1}
      />

      <Section subtle size="sm">
        <RelatedContent heading="함께 보면 좋은 페이지" hrefs={readingPages} columns={2} />
        <div style={{ marginTop: '2.5rem' }}>
          <RelatedArticles heading="관련 SEO 가이드" posts={articles} />
        </div>
      </Section>

      <FinalCTA source="google-ranking" cta="google-ranking" />
    </>
  )
}
