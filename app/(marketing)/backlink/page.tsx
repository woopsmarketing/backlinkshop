/**
 * /backlink — 백링크 Pillar Page
 *
 * 역할
 * - 사이트 전체 정보성 콘텐츠의 허브. 판매 카피보다 개념 설명 비중이 높다.
 * - 홈(/)이 잡고 있는 `백링크 구매` 상업 키워드와 겹치지 않도록, 여기서는 개념·판단 기준만 다룬다.
 *
 * 규칙
 * - 목차 앵커와 섹션 id 는 SECTION_LIST 한 곳에서만 정의한다 (아래 helper 로 타입 검사).
 * - 가격 숫자는 config/pricing.ts 에서만 가져온다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle, BulletList } from '@/components/ui/Card'
import { TableOfContents } from '@/components/content/TableOfContents'
import { KeyTakeaways } from '@/components/content/KeyTakeaways'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedServices } from '@/components/content/RelatedServices'
import { RelatedArticles } from '@/components/content/RelatedArticles'

import { PRICING, formatKrw } from '@/config/pricing'
import { SEO_GRAPH, resolveArticles } from '@/config/seo-graph'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '백링크란? 검색순위에 작용하는 링크의 구조',
  description:
    '백링크가 무엇이고 검색엔진이 링크를 어떻게 다루는지 정리했습니다. 좋은 링크의 판단 기준, 유형별 쓰임, Dofollow와 Nofollow의 차이, PBN, 그리고 링크를 늘려도 순위가 그대로인 이유까지 순서대로 설명합니다.',
  alternates: { canonical: '/backlink' },
  openGraph: {
    title: '백링크란? 검색순위에 작용하는 링크의 구조',
    description:
      '링크 개수보다 어디에서 어떤 맥락으로 걸렸는지가 먼저입니다. 백링크의 구조와 판단 기준을 정리한 가이드입니다.',
    url: '/backlink',
  },
}

/** 목차 = 본문 섹션. 이 배열이 앵커의 단일 원본이다. */
const SECTION_LIST = [
  { id: 'what-is-backlink', heading: '백링크란 무엇인가' },
  { id: 'link-vocabulary', heading: '백링크 · 내부링크 · 외부링크의 차이' },
  { id: 'why-it-matters', heading: 'SEO에서 왜 중요한가' },
  { id: 'quality-criteria', heading: '좋은 백링크를 판단하는 기준' },
  { id: 'backlink-types', heading: '백링크 종류와 쓰임' },
  { id: 'dofollow-nofollow', heading: 'Dofollow와 Nofollow' },
  { id: 'what-is-pbn', heading: 'PBN이란 무엇인가' },
  { id: 'what-changes', heading: '백링크가 실제로 바꾸는 것' },
  { id: 'when-nothing-changes', heading: '추가해도 순위가 오르지 않는 경우' },
  { id: 'before-buying', heading: '구매 전에 확인할 사항' },
  { id: 'diy-or-outsource', heading: '직접 할 때와 맡길 때' },
  { id: 'backlink-price', heading: '백링크 가격' },
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
/** 화면에 표시하는 섹션 번호. 목차 순서에서 자동으로 계산한다. */
function eyebrowNumber(id: SectionId): string {
  return String(sectionIndex(id) + 1).padStart(2, '0')
}

const SUMMARY_POINTS = [
  '백링크는 다른 사이트가 내 페이지를 가리키는 링크이며, 검색엔진이 문서를 발견하고 참조 관계를 해석하는 경로입니다.',
  '링크의 개수보다 어디에서 어떤 맥락으로 걸렸는지가 판단 기준이 됩니다.',
  'Dofollow와 Nofollow는 링크의 성격을 표시하는 속성이고, 자연스러운 링크 프로필에는 두 유형이 함께 존재합니다.',
  '백링크만 늘리고 내부링크를 정리하지 않으면, 밖에서 받은 신호가 정작 올리려는 페이지까지 흐르지 않습니다.',
  'PBN은 링크를 목적으로 운영되는 사이트 묶음입니다. 통제가 가능한 대신 판단이 필요한 방식입니다.',
  '링크를 늘렸는데 변화가 없다면, 페이지가 순위를 받을 준비가 되어 있는지부터 확인하는 편이 낫습니다.',
]

const QUALITY_CRITERIA = [
  {
    title: '주제 관련성',
    body: '링크를 건 페이지가 내 페이지와 같은 주제를 다루고 있는지 봅니다. 문맥이 전혀 다른 자리에서 걸린 링크는 참조로 해석될 여지가 적습니다.',
  },
  {
    title: '링크가 놓인 자리',
    body: '본문 문장 안에서 근거로 걸린 링크와, 푸터나 사이드바에 일괄로 나열된 링크는 성격이 다릅니다. 같은 도메인에서 나온 링크라도 자리에 따라 무게가 달라집니다.',
  },
  {
    title: '앵커 텍스트',
    body: '가리키는 문서가 무엇에 대한 것인지 설명하는 표현인지 봅니다. 목표 키워드만 반복되면 사람이 실제로 인용할 때의 표현 분포에서 멀어집니다.',
  },
  {
    title: '링크를 준 페이지의 색인 상태',
    body: '그 페이지 자체가 검색 결과에 등장하지 않는다면, 거기 걸린 링크가 평가에 반영될 여지도 함께 줄어듭니다.',
  },
  {
    title: '그 사이트의 외부 링크 패턴',
    body: '한 페이지에서 서로 무관한 사이트로 링크가 대량으로 나가고 있다면, 링크 하나가 갖는 의미는 옅어집니다.',
  },
  {
    title: '유지 여부',
    body: '일정 기간 뒤 사라지는 링크와 문서로 남는 링크는 다릅니다. 작업이 끝난 뒤에도 링크가 살아 있는지 직접 확인할 수 있어야 합니다.',
  },
]

const TYPE_ROWS: { header: string; cells: string[] }[] = [
  {
    header: 'WEB 2.0',
    cells: [
      '무료 블로그·퍼블리싱 플랫폼에 문서를 만들고 그 안에서 링크를 거는 방식',
      '외부 참조가 거의 없는 초기 사이트에서 최소한의 기반을 만들 때',
      '문서가 비어 있으면 오래 유지되기 어렵습니다. 읽을 내용을 갖춘 페이지로 만들어야 의미가 생깁니다.',
    ],
  },
  {
    header: '프로필',
    cells: [
      '커뮤니티·서비스의 사용자 프로필 항목에 사이트 주소를 남기는 방식',
      '링크 출처가 한두 곳에 몰려 있어 구성을 넓혀야 할 때',
      '이 유형만 단독으로 쌓으면 인용으로 읽히지 않습니다. 다른 유형과 섞어 봅니다.',
    ],
  },
  {
    header: 'EDU',
    cells: [
      '교육기관 도메인에서 나오는 링크',
      '연구·교육 문맥에서 실제로 참고될 만한 자료를 갖고 있을 때',
      '도메인 확장자 자체에 별도 가중치가 있다고 공개적으로 확인된 바는 없습니다. 문맥이 맞는지가 기준입니다.',
    ],
  },
  {
    header: 'GOV',
    cells: [
      '공공기관 도메인에서 나오는 링크',
      '공고·자료 페이지에서 자연스럽게 참조되는 경우',
      '임의로 만들 수 있는 유형이 아닙니다. 수량으로 제공된다고 하면 출처를 먼저 확인해야 합니다.',
    ],
  },
  {
    header: 'Wiki',
    cells: [
      '위키 형식 문서의 출처·참고 항목에 걸리는 링크',
      '문서의 근거 자료로 쓰일 만한 콘텐츠가 준비돼 있을 때',
      '편집 정책에 따라 삭제되는 경우가 있어 유지 여부를 함께 봐야 합니다.',
    ],
  },
  {
    header: '포럼',
    cells: [
      '게시판·커뮤니티의 글이나 댓글 안에서 걸리는 링크',
      '실제 논의 맥락에서 자료로 언급될 때',
      '토론과 무관한 반복 게시는 스팸으로 처리될 수 있습니다. 글 자체가 읽힐 만한지가 먼저입니다.',
    ],
  },
  {
    header: '게스트 포스트',
    cells: [
      '다른 사이트에 기고한 글의 본문 안에서 링크가 걸리는 방식',
      '주제가 겹치는 매체에 실을 만한 원고를 만들 수 있을 때',
      '대가가 오간 기고라면 광고 표시 속성을 붙이는 것이 원칙입니다.',
    ],
  },
  {
    header: '소셜 북마크',
    cells: [
      '링크 수집·공유 서비스에 페이지를 등록하는 방식',
      '새로 만든 페이지의 발견 경로를 늘리고 싶을 때',
      '순위 신호보다는 크롤링·유입 경로 쪽에 가깝습니다. 기대치를 그쪽에 맞춥니다.',
    ],
  },
  {
    header: '디렉토리',
    cells: [
      '업종·지역별 목록 사이트에 사이트 정보를 등재하는 방식',
      '지역 검색이나 업종 목록 안에서 찾아질 필요가 있을 때',
      '등재 기준 없이 모든 사이트를 받아주는 목록은 의미가 옅습니다.',
    ],
  },
  {
    header: '프레스 릴리스',
    cells: [
      '보도자료 배포망을 통해 여러 매체에 같은 원고가 실리는 방식',
      '출시·제휴처럼 실제로 알릴 사안이 있을 때',
      '같은 원고가 복제되므로 게재 매체 수만큼 참조가 늘어난다고 보기는 어렵습니다.',
    ],
  },
  {
    header: 'PBN',
    cells: [
      '링크 제공을 목적으로 직접 운영하는 사이트 묶음에서 나오는 링크',
      '경쟁이 강한 키워드에서 링크의 문맥과 시점까지 통제해야 할 때',
      '운영 방식에 따라 편차가 큽니다. 아래 항목에서 따로 설명합니다.',
    ],
  },
]

const LINK_ATTRIBUTE_ROWS: { header: string; cells: string[] }[] = [
  {
    header: 'Dofollow',
    cells: [
      'rel 속성이 없는 기본 상태',
      '검색엔진이 링크를 따라가고 참조 관계로도 함께 해석할 수 있는 링크입니다.',
    ],
  },
  {
    header: 'Nofollow',
    cells: [
      'rel="nofollow"',
      '이 링크를 평가에 반영하지 말아 달라는 표시입니다. 구글은 이후 이 표시를 지시가 아니라 힌트로 다루겠다고 밝혔습니다.',
    ],
  },
  {
    header: 'Sponsored',
    cells: ['rel="sponsored"', '광고나 후원의 대가로 걸린 링크임을 밝히는 표시입니다.'],
  },
  {
    header: 'UGC',
    cells: ['rel="ugc"', '댓글·게시글처럼 사용자가 만든 영역에서 나온 링크임을 밝히는 표시입니다.'],
  },
]

const BACKLINK_AFFECTS = [
  '새로 만든 페이지가 크롤러에게 발견되는 경로',
  '이 사이트가 어떤 주제로 참조되는지에 대한 신호',
  '문서 품질이 비슷해진 구간에서의 상대적 위치',
  '검색이 아닌 경로로 들어오는 참조 트래픽',
]

const BACKLINK_DOES_NOT_FIX = [
  '검색한 사람이 찾던 답이 페이지 안에 없는 상태',
  '색인이 막혀 있거나 중복 문서로 처리되는 구조 문제',
  '키워드의 의도와 페이지의 목적이 어긋나 있는 경우',
  '경쟁 페이지가 이미 훨씬 두꺼운 내용을 다루고 있는 상황',
]

const STUCK_REASONS = [
  {
    title: '페이지가 다른 질문에 답하고 있다',
    body: '검색한 사람이 비교를 원하는데 페이지가 소개만 하고 있다면, 참조 신호가 늘어도 결과가 바뀌기 어렵습니다.',
  },
  {
    title: '평가 이전 단계에서 막혀 있다',
    body: '색인에서 제외되었거나 다른 주소가 대표 문서로 잡혀 있는 경우가 있습니다. 이때는 링크가 향할 자리 자체가 잘못되어 있습니다.',
  },
  {
    title: '링크가 한쪽으로 몰려 있다',
    body: '같은 유형, 같은 앵커 텍스트로만 쌓이면 특정 지점부터 추가분이 이전만큼 작용하지 않을 수 있습니다.',
  },
  {
    title: '경쟁 강도를 과소평가했다',
    body: '이미 상위에 있는 사이트들이 오래 쌓아온 참조를 갖고 있다면, 필요한 작업량 자체가 다릅니다.',
  },
  {
    title: '아직 재평가가 이뤄지지 않았다',
    body: '링크가 걸린 뒤 크롤링과 재평가가 반영되기까지는 시간이 필요합니다. 얼마나 걸릴지는 사이트마다 달라 기간을 단정하지 않습니다.',
  },
]

const BEFORE_BUYING = [
  {
    title: '지금 필요한 것이 링크가 맞는지',
    body: '노출 자체가 없는 상태와 노출은 되는데 위로 못 가는 상태는 원인이 다릅니다. 어느 쪽인지 먼저 구분합니다.',
  },
  {
    title: '어디에 무엇이 걸리는지 받아볼 수 있는지',
    body: '작업 URL과 앵커 텍스트를 확인할 수 있어야 나중에 직접 검증할 수 있습니다. 확인할 수 없는 작업은 평가할 수도 없습니다.',
  },
  {
    title: '목표 페이지와 키워드가 정해져 있는지',
    body: '홈으로 올릴지 상세 페이지로 올릴지에 따라 링크가 향해야 할 자리가 달라집니다. 이것이 정해지지 않으면 구성도 정해지지 않습니다.',
  },
  {
    title: '무엇을 결과로 볼지 합의했는지',
    body: '순위인지, 노출 키워드 수인지, 문의 수인지 미리 정해두지 않으면 작업이 끝난 뒤 판단할 기준이 남지 않습니다.',
  },
]

const LINK_DIRECTIONS = [
  {
    title: '백링크 (인바운드 링크)',
    body: '다른 사이트의 페이지에서 내 사이트로 들어오는 링크입니다. 이 페이지에서 계속 다루는 대상이 이것입니다.',
  },
  {
    title: '내부링크',
    body: '내 사이트 안의 페이지에서 같은 사이트의 다른 페이지로 거는 링크입니다. 방향이 사이트 안에서 끝납니다.',
  },
  {
    title: '아웃바운드 링크',
    body: '내 사이트에서 다른 사이트로 나가는 링크입니다. 근거나 출처를 제시하는 자리에서 주로 씁니다.',
  },
]

const DIY_ROWS: { header: string; cells: string[] }[] = [
  {
    header: '키워드 경쟁 강도',
    cells: [
      '지역명이나 세부 조건이 붙은 키워드가 목표인 경우',
      '업종 대표 키워드처럼 오래 운영된 사이트들이 이미 자리를 잡은 구간',
    ],
  },
  {
    header: '투입 가능한 시간',
    cells: [
      '매주 콘텐츠 작성과 등록에 시간을 낼 수 있는 경우',
      '운영에 시간을 쓰기 어려워 진행이 계속 밀리는 경우',
    ],
  },
  {
    header: '필요한 링크 유형',
    cells: [
      '프로필·디렉토리·커뮤니티처럼 직접 만들 수 있는 범위',
      '자체 운영 네트워크나 매체 관계가 필요한 범위',
    ],
  },
  {
    header: '측정과 관리',
    cells: [
      '순위와 유입을 스스로 기록하고 판단할 수 있는 경우',
      '작업 내역과 리포트를 받아서 관리하고 싶은 경우',
    ],
  },
]

export default function BacklinkPage() {
  const cluster = SEO_GRAPH.backlink
  const articles = resolveArticles(cluster.relatedArticles)
  const toc = SECTION_LIST.map(section => ({ id: section.id, heading: section.heading }))
  const lowestFrom = Math.min(...PRICING.map(group => group.from))

  return (
    <>
      <Breadcrumb trail={[{ href: '/backlink', label: '백링크란?' }]} />

      <Hero
        eyebrow="BACKLINK GUIDE"
        title={
          <>
            백링크란?
            <span className="bl-break">검색순위에 영향을 주는 링크의 구조부터 이해하세요.</span>
          </>
        }
        support="백링크는 다른 사이트가 내 페이지를 참조한 링크입니다. 다만 링크가 하나 늘었다고 순위가 그만큼 움직이지는 않습니다. 링크가 어떤 경로로 평가에 반영되는지, 어떤 링크가 의미를 갖는지를 순서대로 정리했습니다."
        actions={
          <>
            <TelegramCTA source="backlink" position="hero" size="lg" />
            <Button href="/services" variant="secondary" size="lg">
              어떤 작업이 있는지 보기
            </Button>
          </>
        }
        note="판매 페이지가 아니라 설명 페이지입니다. 상담하지 않고 읽고 판단하셔도 됩니다."
      />

      <Section size="sm" subtle ariaLabelledBy="summary-title">
        <SectionHead
          eyebrow="SUMMARY"
          id="summary-title"
          title="먼저 요약하면 이렇습니다."
          lead="아래 내용을 모두 읽기 어렵다면 이 다섯 문장만 기억해도 판단이 훨씬 쉬워집니다."
        />
        <KeyTakeaways items={SUMMARY_POINTS} />
        <p className="bl-closing">
          백링크는 순위를 사는 수단이 아니라 신호를 만드는 작업입니다. 신호는 사이트의 다른 조건과
          함께 해석되기 때문에, 같은 링크를 받아도 결과가 다르게 나타납니다.
        </p>
      </Section>

      <Section size="sm" narrow>
        <TableOfContents sections={toc} />
      </Section>

      <Section {...anchor('what-is-backlink')}>
        <SectionHead
          eyebrow={eyebrowNumber('what-is-backlink')}
          id={headingId('what-is-backlink')}
          title="백링크란 무엇인가"
          lead="정의는 단순합니다. 어려운 부분은 그 링크가 어떻게 해석되는지입니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            백링크는 다른 웹사이트의 페이지에서 내 사이트의 페이지로 연결되는 링크를 말합니다. 내가
            거는 링크가 아니라 밖에서 나를 가리키는 링크라는 점에서 내부링크나 외부로 나가는 링크와
            구분되며, 인바운드 링크라고 부르기도 합니다.
          </p>
          <p className="bl-body">
            검색엔진의 크롤러는 링크를 따라 이동하면서 문서를 수집합니다. 그래서 링크는 두 가지
            역할을 동시에 합니다. 하나는 통로입니다. 아직 알려지지 않은 페이지가 있을 때, 이미
            수집되고 있는 사이트에서 걸린 링크는 크롤러가 그 페이지에 도달하는 실제 경로가 됩니다.
            다른 하나는 참조입니다. 문서가 다른 문서를 인용하듯이, 링크는 특정 페이지를 언급할 만한
            대상으로 지목합니다.
          </p>
          <p className="bl-body">
            검색엔진이 링크를 평가 재료로 삼기 시작한 이유도 여기에 있습니다. 사람이 문서를 하나하나
            읽지 않아도, 웹 전체가 서로를 가리키는 방식 자체가 어떤 문서가 참고할 만한지에 대한
            힌트를 줍니다. 지금의 알고리즘은 그때보다 훨씬 복잡해졌지만, 외부에서 이 문서를 어떻게
            참조하는지가 재료 중 하나라는 전제는 남아 있습니다.
          </p>
          <p className="bl-body">
            그래서 백링크를 볼 때는 링크가 몇 개인지보다 어떤 문서가 어떤 문맥에서 나를 언급했는지를
            먼저 봅니다. 같은 개수라도 그 안에 담긴 정보가 다르기 때문입니다. 링크 외의 조건까지
            함께 놓고 보는 방법은 <Link href="/google-ranking">검색 결과가 결정되는 방식</Link>에서
            따로 다룹니다.
          </p>
        </div>
      </Section>

      <Section {...anchor('link-vocabulary')}>
        <SectionHead
          eyebrow={eyebrowNumber('link-vocabulary')}
          id={headingId('link-vocabulary')}
          title="백링크 · 내부링크 · 외부링크의 차이"
          lead="세 가지를 섞어 쓰면 견적서나 리포트를 읽을 때 링크의 방향을 반대로 이해하게 됩니다."
        />
        <div className="bl-grid bl-grid--3">
          {LINK_DIRECTIONS.map(item => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <div className="bl-stack bl-measure" style={{ marginTop: '2rem' }}>
          <p className="bl-body">
            혼동이 생기는 이유는 한국어에서 외부링크라는 말이 들어오는 링크와 나가는 링크를 모두
            가리키는 데 쓰이기 때문입니다. 제안서에서 외부링크라는 단어를 보면 방향이 어느 쪽인지 한
            번 확인하는 편이 안전합니다.
          </p>
          <p className="bl-body">
            셋 중에서 가장 자주 빠지는 것은 내부링크입니다. 내부링크는 크롤러가 사이트를 돌아다닐
            경로를 만들고, 어떤 페이지가 이 사이트에서 중요한 문서인지 표시하고, 밖에서 받은 신호를
            사이트 안에서 다시 나눕니다.
          </p>
          <p className="bl-body">
            문제는 세 번째 역할에서 생깁니다. 밖에서 들어오는 링크는 대부분 홈으로 향하는데, 정작
            올리려는 페이지는 서비스 페이지나 상세 페이지인 경우가 많습니다. 홈에서 그 페이지로 가는
            내부 경로가 약하면 밖에서 받은 신호가 목표 페이지까지 잘 흐르지 않습니다. 링크는
            늘었는데 올리려던 페이지는 그대로인 상황이 여기서 자주 나옵니다.
          </p>
          <p className="bl-body">
            반대로 나가는 링크를 전부 막아두는 경우도 있습니다. 근거를 제시해야 하는 자리에 출처를
            걸지 않으면 문서 자체의 설득력이 떨어집니다. 판단 기준은 링크의 개수가 아니라, 그 링크가
            문서를 읽는 사람에게 필요한가입니다.
          </p>
        </div>
        <p className="bl-closing">
          내부 경로를 정리하는 작업은 링크를 늘리기 전에 하는 편이 순서에 맞습니다. 어떤 항목을
          점검하는지는 <Link href="/services/onpage-seo">온페이지 SEO</Link>에서 다룹니다.
        </p>
      </Section>

      <Section {...anchor('why-it-matters')}>
        <SectionHead
          eyebrow={eyebrowNumber('why-it-matters')}
          id={headingId('why-it-matters')}
          title="SEO에서 왜 중요한가"
          lead="사이트 안에서 할 수 있는 일에는 끝이 있습니다. 백링크는 바깥쪽 조건을 다루는 거의 유일한 수단입니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            검색엔진 최적화를 크게 나누면 사이트 안에서 통제할 수 있는 일과, 바깥에서 만들어지는
            조건으로 갈립니다. 제목과 헤딩 구조를 정리하고, 검색의도에 맞는 본문을 쓰고, 색인 상태를
            관리하는 것은 모두 안쪽 작업입니다. 반면 다른 사이트가 나를 어떤 맥락으로 언급하는지는
            내가 직접 쓸 수 있는 영역이 아닙니다.
          </p>
          <p className="bl-body">
            안쪽 작업만으로 도달할 수 있는 지점이 분명히 있습니다. 경쟁이 약한 키워드라면 문서
            품질만으로 상위에 들어가기도 합니다. 문제는 오래 운영된 사이트들이 이미 자리를 잡은
            키워드입니다. 그런 검색 결과에서는 상위 문서들의 품질 차이가 크지 않아, 안쪽만
            다듬어서는 더 올라가기 어려운 구간이 옵니다. 그 구간에서 차이를 만드는 재료가 외부
            참조입니다.
          </p>
          <p className="bl-body">
            또 하나 자주 놓치는 지점은 색인입니다. 새로 만든 페이지가 검색 결과에 아예 나타나지
            않는다면 순위 문제가 아니라 발견 문제일 수 있습니다. 외부에서 걸린 링크는 크롤러가 그
            페이지를 찾아가는 경로가 되므로, 순위 경쟁 이전 단계에서도 역할을 합니다.
          </p>
          <p className="bl-body">
            정리하면 백링크는 순위를 다투는 단계와, 페이지가 평가 대상에 들어가는 단계 양쪽에 걸쳐
            있습니다. 두 가지를 구분해서 보면 지금 내 사이트에 부족한 것이 무엇인지 판단하기
            쉬워집니다.
          </p>
        </div>
      </Section>

      <Section {...anchor('quality-criteria')}>
        <SectionHead
          eyebrow={eyebrowNumber('quality-criteria')}
          id={headingId('quality-criteria')}
          title="좋은 백링크를 판단하는 기준"
          lead="품질을 하나의 점수로 요약할 수는 없습니다. 대신 확인 가능한 항목을 나눠서 봅니다."
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
          이 항목들은 링크를 직접 만들 때만 쓰는 기준이 아닙니다. 작업을 맡길 때도 같은 질문을
          그대로 던지면 됩니다. <Link href="/backlink-agency">작업을 맡길 곳을 고르는 방법</Link>에
          확인 순서를 정리해 두었습니다.
        </p>
      </Section>

      <Section {...anchor('backlink-types')}>
        <SectionHead
          eyebrow={eyebrowNumber('backlink-types')}
          id={headingId('backlink-types')}
          title="백링크 종류와 쓰임"
          lead="유형은 만들어지는 방식과 놓이는 자리로 나뉩니다. 어떤 유형이 좋고 나쁘다기보다, 지금 내 링크 구성에서 어느 자리가 비어 있는지에 따라 쓰임이 달라집니다."
        />
        <ComparisonTable
          caption="백링크 유형별 정의와 적합한 상황"
          columns={['어떤 링크인가', '언제 의미가 있는가', '같이 볼 점']}
          rowHeader="유형"
          rows={TYPE_ROWS}
        />
        <p className="bl-closing">
          표를 위에서 아래로 읽으면 만들기 쉬운 순서에 가깝습니다. 다만 쉬운 유형만 모으면 구성이
          한쪽으로 기울고, 어려운 유형만 노리면 진행이 멈춥니다. 그래서 실제 작업은 하나의 유형을
          고르는 일이 아니라 비율을 정하는 일에 가깝습니다.
        </p>
      </Section>

      <Section {...anchor('dofollow-nofollow')}>
        <SectionHead
          eyebrow={eyebrowNumber('dofollow-nofollow')}
          id={headingId('dofollow-nofollow')}
          title="Dofollow와 Nofollow"
          lead="링크에 붙는 rel 속성은 그 링크를 어떻게 다뤄야 하는지에 대한 표시입니다."
        />
        <ComparisonTable
          caption="링크 rel 속성의 종류와 의미"
          columns={['HTML 표기', '어떤 의미인가']}
          rowHeader="속성"
          rows={LINK_ATTRIBUTE_ROWS}
        />
        <div className="bl-stack bl-measure" style={{ marginTop: '2rem' }}>
          <p className="bl-body">
            먼저 짚어둘 것이 하나 있습니다. dofollow는 실제로 존재하는 속성값이 아닙니다. rel 속성에
            dofollow를 적는 문법은 표준에 없고, nofollow가 붙지 않은 평범한 링크를 가리키려고
            업계에서 만들어 쓰는 관용어입니다. 견적서에서 dofollow 링크라는 표현을 보면 아무 표시도
            붙지 않은 일반 링크라는 뜻으로 읽으면 됩니다.
          </p>
          <p className="bl-body">
            여기서 가장 많이 나오는 질문은 “nofollow 링크는 의미가 없느냐”입니다. 순위 신호만 놓고
            보면 dofollow 쪽이 더 직접적입니다. 그러나 링크 프로필 전체를 놓고 보면 이야기가
            달라집니다. 실제로 사람들이 자유롭게 언급하는 사이트에는 두 유형이 섞여 있습니다. 뉴스
            댓글, 커뮤니티 글, 광고 표시가 붙은 지면에서 나오는 링크가 자연스럽게 함께 존재하기
            때문입니다.
          </p>
          <p className="bl-body">
            반대로 한쪽 속성만 존재하는 구성은 사람이 만든 흔적을 남깁니다. 그래서 저희는 dofollow
            비율을 목표 숫자로 두지 않습니다. 지금 링크가 어느 쪽으로 치우쳐 있는지를 먼저 보고,
            비어 있는 쪽을 채우는 방식으로 구성을 잡습니다.
          </p>
          <p className="bl-body">
            그래서 견적을 볼 때는 세 가지를 확인합니다. 제안받은 링크가 어떤 속성으로 걸리는지
            명시되어 있는가. 전부 dofollow라고 적혀 있다면 그것이 어떻게 가능한 구조인지 설명할 수
            있는가. 작업 후 실제 URL을 받아 직접 확인할 수 있는가. 마지막 항목이 특히 중요합니다.
            URL을 받으면 그 페이지의 소스 보기에서 링크에 붙은 rel 값을 눈으로 확인할 수 있습니다.
          </p>
        </div>
      </Section>

      <Section {...anchor('what-is-pbn')}>
        <SectionHead
          eyebrow={eyebrowNumber('what-is-pbn')}
          id={headingId('what-is-pbn')}
          title="PBN이란 무엇인가"
          lead="장점과 부담이 같은 곳에서 나옵니다. 통제할 수 있다는 점이 그대로 판단 지점이 됩니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            PBN은 Private Blog Network의 약자로, 링크를 내보내는 것을 목적으로 운영하는 사이트들의
            묶음을 말합니다. 만료된 도메인을 확보해 사이트를 다시 세우고, 그 사이트의 문서에서 목표
            페이지로 링크를 거는 방식이 일반적입니다.
          </p>
          <p className="bl-body">
            이 방식의 장점은 통제입니다. 다른 사이트에 요청해야 하는 방법과 달리, 링크가 걸릴
            페이지와 문맥, 앵커 텍스트, 진행 시점을 직접 정할 수 있습니다. 경쟁이 강한 키워드에서
            어느 정도의 신호가 필요한지 계산하고 그만큼을 배치할 수 있다는 점이 PBN을 쓰는
            이유입니다.
          </p>
          <p className="bl-body">
            동시에 이 방식은 검색엔진 가이드라인이 말하는 “순위 조작을 목적으로 만든 링크”에 해당할
            수 있습니다. 그래서 PBN을 쓸지 말지는 선호의 문제가 아니라 위험을 어디까지 감수할지에
            대한 판단입니다. 네트워크 사이트들이 서로 얼마나 구분되는지, 각 사이트가 실제로 읽을 수
            있는 콘텐츠를 갖고 있는지, 한 목표 페이지로 링크가 몰리지 않는지에 따라 결과의 편차가
            큽니다.
          </p>
          <p className="bl-body">
            어떤 사이트에나 권할 수 있는 방법도 아닙니다. 이제 막 시작한 사이트라면 먼저 채워야 할
            다른 조건이 있는 경우가 많습니다.{' '}
            <Link href="/services/pbn-backlink">PBN을 어떻게 구성하는지</Link> 실제 진행 방식은
            서비스 페이지에 따로 정리해 두었습니다.
          </p>
        </div>
        <div className="bl-notice" style={{ marginTop: '2rem' }}>
          <p>
            <strong>판단이 필요한 지점.</strong> PBN은 강도가 있는 방식입니다. 위험이 전혀 없다고
            설명하는 쪽보다, 어떤 조건에서 쓸 만하고 어떤 경우에 피해야 하는지를 함께 말해 주는 쪽을
            확인하시는 편이 낫습니다.
          </p>
        </div>
      </Section>

      <Section {...anchor('what-changes')}>
        <SectionHead
          eyebrow={eyebrowNumber('what-changes')}
          id={headingId('what-changes')}
          title="백링크가 실제로 바꾸는 것"
          lead="작업을 시작하기 전에 기대치를 맞추는 편이 좋습니다. 링크가 관여하는 영역과 그렇지 않은 영역이 분명히 나뉘기 때문입니다."
        />
        <div className="bl-grid bl-grid--2">
          <Card feature>
            <CardTitle>백링크가 관여하는 영역</CardTitle>
            <BulletList items={BACKLINK_AFFECTS} />
          </Card>
          <Card>
            <CardTitle>백링크가 대신해 주지 못하는 것</CardTitle>
            <BulletList items={BACKLINK_DOES_NOT_FIX} plain />
          </Card>
        </div>
        <p className="bl-closing">
          왼쪽에 해당하는 문제라면 링크가 답이 될 수 있습니다. 오른쪽이라면 링크를 늘리는 순서가
          뒤에 오는 편이 낫습니다. 어느 쪽인지 구분하는 것이 첫 번째 작업입니다.
        </p>
      </Section>

      <Section {...anchor('when-nothing-changes')}>
        <SectionHead
          eyebrow={eyebrowNumber('when-nothing-changes')}
          id={headingId('when-nothing-changes')}
          title="백링크를 추가해도 순위가 오르지 않는 경우"
          lead="같은 작업을 했는데 결과가 다르게 나오는 데는 대체로 이유가 있습니다. 자주 겹치는 다섯 가지를 정리했습니다."
        />
        <div className="bl-grid bl-grid--3">
          {STUCK_REASONS.map(item => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          이 중 두 번째와 세 번째는 링크를 더 넣어도 해결되지 않습니다. 페이지가 평가받을 준비가
          되어 있는지는 <Link href="/services/onpage-seo">페이지 구조를 점검하는 작업</Link>에서
          먼저 확인하는 편이 빠릅니다.
        </p>
      </Section>

      <Section {...anchor('before-buying')}>
        <SectionHead
          eyebrow={eyebrowNumber('before-buying')}
          id={headingId('before-buying')}
          title="백링크 구매 전에 확인할 사항"
          lead="견적을 받기 전에 이 네 가지를 정리해 두면, 어떤 제안이 내 상황에 맞는지 스스로 판단할 수 있습니다."
        />
        <div className="bl-grid bl-grid--2">
          {BEFORE_BUYING.map(item => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          네 가지가 정리되면 남는 것은 예산입니다.{' '}
          <Link href="/pricing">비용이 어떻게 산정되는지</Link> 확인해 보시면, 같은 작업인데 견적이
          사이트마다 다른 이유를 이해하기 쉬워집니다.
        </p>
      </Section>

      <Section {...anchor('diy-or-outsource')}>
        <SectionHead
          eyebrow={eyebrowNumber('diy-or-outsource')}
          id={headingId('diy-or-outsource')}
          title="직접 할 때와 맡길 때"
          lead="백링크 작업은 직접 할 수도 있습니다. 어느 쪽이 맞는지는 예산보다 시간과 목표 키워드의 경쟁 강도에 달려 있습니다."
        />
        <ComparisonTable
          caption="직접 진행과 위탁을 가르는 판단 기준"
          columns={['직접 진행이 맞는 경우', '맡기는 편이 나은 경우']}
          rowHeader="판단 기준"
          rows={DIY_ROWS}
        />
        <div className="bl-stack bl-measure" style={{ marginTop: '2rem' }}>
          <p className="bl-body">
            맡기기로 했다면 확인할 것은 가격보다 설명의 구체성입니다. 어떤 유형을 몇 개, 어떤 앵커
            비율로, 어떤 기간에 걸쳐 진행하는지가 시작 전에 나오는지. 작업 후 URL이 포함된 내역을
            받을 수 있는지. 그리고 지금 링크가 필요한 상황이 맞는지에 대해 다른 의견도 말해 주는지.
          </p>
          <p className="bl-body">
            세 번째를 넣은 이유가 있습니다. 링크를 파는 쪽에서는 지금이 링크를 늘릴 때라고 답하는
            편이 언제나 유리합니다. 그래서 링크보다 페이지 구성이 먼저라고 말할 수 있는지가, 상대가
            내 사이트를 실제로 열어봤는지 확인하는 가장 빠른 질문이 됩니다.
          </p>
        </div>
        <p className="bl-closing">
          맡길 곳을 비교할 때 무엇을 물어봐야 하는지는{' '}
          <Link href="/backlink-agency">백링크 업체 판단 기준</Link>에 항목별로 정리해 두었습니다.
        </p>
      </Section>

      <Section {...anchor('backlink-price')}>
        <SectionHead
          eyebrow={eyebrowNumber('backlink-price')}
          id={headingId('backlink-price')}
          title="백링크 가격"
          lead="같은 이름의 상품이라도 무엇이 포함되는지가 다릅니다. 단가만 비교하면 판단하기 어려운 이유입니다."
        />
        <div className="bl-stack bl-measure">
          <p className="bl-body">
            저희가 공개하는 것은 각 작업의 시작가입니다. 가장 낮은 시작가는 {formatKrw(lowestFrom)}
            이며, 실제 견적은 목표 키워드의 경쟁 강도, 올리려는 페이지, 지금까지 쌓인 링크 상태에
            따라 달라집니다. 그래서 상담 없이 확정 금액을 먼저 제시하지 않습니다.
          </p>
        </div>
        <div className="bl-scroll-x" style={{ marginTop: '2rem' }}>
          <table className="bl-price-table">
            <caption className="bl-sr-only">작업별 시작가와 적합한 상황</caption>
            <thead>
              <tr>
                <th scope="col">작업</th>
                <th scope="col">이런 경우에 봅니다</th>
                <th scope="col">시작가</th>
              </tr>
            </thead>
            <tbody>
              {PRICING.map(group => (
                <tr key={group.service}>
                  <th scope="row">{group.label}</th>
                  <td>{group.bestFor}</td>
                  <td>{formatKrw(group.from)}부터</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="bl-closing">
          각 금액에 무엇이 포함되는지와 어떤 조건에서 금액이 올라가는지는{' '}
          <Link href="/pricing">무엇에 비용이 들어가는지 정리한 페이지</Link>에서 항목별로 볼 수
          있습니다.
        </p>
      </Section>

      <Section size="sm">
        <TelegramCTABlock
          source="backlink"
          position="mid"
          title="여기까지 읽고도 내 경우가 어디에 해당하는지 애매하다면"
          body="사이트 주소와 목표 키워드를 알려주시면, 지금 링크가 필요한 단계인지부터 같이 확인해 드립니다."
        />
      </Section>

      <Section subtle>
        <RelatedContent heading="이어서 볼 페이지" hrefs={cluster.relatedPages} columns={2} />
        <div style={{ marginTop: '3rem' }}>
          <RelatedServices
            heading="이 주제와 연결되는 작업"
            slugs={['pbn-backlink', 'plan-backlink', 'onpage-seo']}
          />
        </div>
      </Section>

      <Section size="sm">
        <RelatedArticles heading="더 깊게 읽기" posts={articles} />
      </Section>

      <FinalCTA
        source="backlink"
        title="지금 내 사이트에 링크가 필요한 단계인지 확인해 보세요."
        body="도메인과 목표 키워드만 알려주시면 어디가 막혀 있는지부터 같이 보겠습니다."
      />
    </>
  )
}
