/**
 * 성공사례 /cases
 *
 * ⚠️ 보존 규칙
 * - 이 URL 은 Google Ads 사이트링크가 연결되어 있다. 경로를 바꾸지 않는다.
 * - `PUBLISHED_CASES` 는 의도적으로 비어 있다(config/cases.ts 주석 참고).
 *   이 페이지에서 사례 수치를 만들어 넣지 않는다. 배열이 채워지면 카드가 자동으로 렌더링된다.
 * - 이 페이지의 콘텐츠는 사례 자체가 아니라 "사례를 어떤 기준으로 공개하는가" 다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { CaseStudyCard } from '@/components/marketing/CaseStudyCard'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle } from '@/components/ui/Card'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedServices } from '@/components/content/RelatedServices'

import { PUBLISHED_CASES, CASE_DISCLOSURE_RULES } from '@/config/cases'
import { PRICING, formatKrw } from '@/config/pricing'
import { SEO_GRAPH } from '@/config/seo-graph'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '성공사례 공개 기준 — 결과와 조건을 함께 적습니다',
  description:
    '결과만 적힌 사례는 검증할 수 없습니다. 백링크샵은 업종·초기 상태·판단 근거·기간·측정 기준·한계까지 확인된 사례만 공개합니다. 그 기준을 그대로 공개합니다.',
  alternates: { canonical: '/cases' },
  openGraph: {
    title: '성공사례 공개 기준 — 결과와 조건을 함께 적습니다',
    description:
      '몇 위에서 몇 위가 되었는지만으로는 그 결과가 내 사이트에서도 가능한지 알 수 없습니다. 사례를 어떤 기준으로 공개하는지 먼저 밝힙니다.',
    url: '/cases',
  },
}

const DISCLOSURE_FIELDS: { header: string; cells: string[] }[] = [
  {
    header: '업종과 목표',
    cells: [
      '어떤 업종의 사이트가 어떤 키워드, 또는 어떤 페이지를 목표로 삼았는지 적습니다.',
      '업종이 다르면 검색 결과의 경쟁 구조 자체가 다릅니다. 목표가 빠지면 결과를 옮겨 읽을 수 없습니다.',
    ],
  },
  {
    header: '시작 시점의 상태',
    cells: [
      '작업을 시작할 때 사이트가 어떤 상태였는지, 무엇이 이미 되어 있었고 무엇이 비어 있었는지 적습니다.',
      '출발점을 모르면 변화의 크기를 해석할 수 없습니다. 같은 폭의 상승도 출발점에 따라 의미가 달라집니다.',
    ],
  },
  {
    header: '판단 근거',
    cells: [
      '왜 그 작업이 필요하다고 봤는지, 무엇을 보고 그렇게 판단했는지 적습니다.',
      '근거가 없으면 결과가 판단 덕분인지 다른 요인 때문인지 구분되지 않습니다.',
    ],
  },
  {
    header: '실행한 작업',
    cells: [
      '어떤 작업을 어떤 순서로 진행했는지 적습니다. 링크 외에 함께 손본 부분도 빠뜨리지 않습니다.',
      '링크만 적고 콘텐츠·구조 수정을 빼면, 링크가 기여한 몫이 실제보다 크게 보입니다.',
    ],
  },
  {
    header: '기간',
    cells: [
      '작업을 시작한 시점부터 결과를 확인한 시점까지를 적습니다.',
      '기간이 없으면 언제쯤 판단할 수 있는지 가늠할 수 없고, 기대 시점이 어긋납니다.',
    ],
  },
  {
    header: '결과',
    cells: [
      '작업 기록과 순위 추적 스냅샷에 남아 있는 값만 적습니다. 기록이 없으면 비워 둡니다.',
      '기억에 의존해 적은 값은 시간이 지날수록 유리한 쪽으로 정리되기 쉽습니다.',
    ],
  },
  {
    header: '측정 기준',
    cells: [
      '어떤 도구로, 어떤 지역·기기 설정에서, 어느 기간을 기준으로 확인한 값인지 적습니다.',
      '검색 결과는 측정 조건에 따라 다르게 보입니다. 조건이 없으면 같은 값을 다시 확인할 수 없습니다.',
    ],
  },
  {
    header: '결과 해석',
    cells: [
      '그 값을 어떻게 읽어야 하는지, 무엇이 기여했다고 보는지를 문장으로 적습니다.',
      '해석이 없으면 숫자만 남고, 다음 작업에 쓸 수 있는 것이 남지 않습니다.',
    ],
  },
  {
    header: '한계',
    cells: [
      '이 사례를 그대로 적용하기 어려운 조건, 결과가 달라졌을 수 있는 지점을 적습니다.',
      '한계가 없는 사례는 없습니다. 적지 않으면 결국 감춘 것이 됩니다.',
    ],
  },
]

const CONSULT_POINTS = [
  {
    title: '비슷한 조건인지부터 확인합니다',
    body: '목표 키워드의 검색 결과를 함께 열어 지금 위에 있는 페이지들이 어떤 유형인지 봅니다. 같은 업종이라도 상위가 커뮤니티 글인지 브랜드 사이트인지에 따라 필요한 작업이 달라집니다.',
  },
  {
    title: '무엇을 먼저 볼지 순서를 잡습니다',
    body: '링크가 부족해서 멈춰 있는 상황인지, 페이지가 아직 순위를 받을 준비가 되지 않은 상황인지를 나눠서 봅니다. 순서가 바뀌면 같은 예산을 써도 확인까지 더 오래 걸립니다.',
  },
  {
    title: '결과를 무엇으로 확인할지 미리 정합니다',
    body: '무엇을, 언제, 어떤 조건에서 확인할지 시작 전에 정해 둡니다. 끝난 뒤에 유리한 지표를 골라 결과라고 부르지 않기 위해서입니다.',
  },
]

export default function CasesPage() {
  const cluster = SEO_GRAPH.cases
  const lowestFrom = Math.min(...PRICING.map(group => group.from))

  return (
    <>
      <Breadcrumb trail={[{ href: '/cases', label: '성공사례' }]} />

      <Hero
        eyebrow="CASE DISCLOSURE"
        title={
          <>
            <span className="bl-break">좋은 결과만 보여주지 않고,</span>
            어떤 조건에서 나온 결과인지 같이 공개합니다.
          </>
        }
        support="사례에서 실제로 쓸모 있는 부분은 몇 위가 되었다는 문장이 아니라, 어떤 상태에서 무엇을 왜 했고 무엇이 남았는가입니다. 그래서 이 페이지에는 사례를 어떤 기준으로 공개하는지부터 적어 두었습니다."
        actions={
          <>
            <TelegramCTA
              source="cases"
              position="hero"
              label="내 사이트 상황부터 확인하기"
              size="lg"
            />
            <Button href="/services" variant="secondary" size="lg">
              어떤 작업이 있는지 보기
            </Button>
          </>
        }
        note="Telegram으로 연결됩니다 · 사이트 주소와 목표 키워드만 있으면 됩니다"
      />

      <Section ariaLabelledBy="why-title">
        <SectionHead
          eyebrow="01 / WHY"
          id="why-title"
          title="성과 수치는 가장 눈에 잘 띄지만, 가장 확인하기 어려운 정보입니다."
          lead="사례를 읽는 쪽에서 검증할 수 없는 숫자는 판단에 도움이 되지 않습니다. 저희가 기준을 다시 세운 이유를 먼저 적습니다."
        />
        <div className="bl-grid bl-grid--3">
          <Card>
            <CardTitle>평균은 표본을 밝혀야 의미가 생깁니다</CardTitle>
            <CardBody>
              평균 몇 퍼센트가 올랐다는 문장은, 어떤 사이트 몇 곳을 대상으로 어느 기간의 무엇을
              기준으로 계산한 값인지 함께 적히지 않으면 확인할 방법이 없습니다. 잘 풀린 건만 골라
              계산해도 문장은 똑같이 쓰입니다. 읽는 쪽에서 그 차이를 구분할 수 없다면 그 값은 판단
              근거가 되지 못합니다.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>같은 사례가 문서마다 다르면 전부 흔들립니다</CardTitle>
            <CardBody>
              홈에 적힌 값과 사례 페이지의 값, 광고 문구의 값이 서로 다르면 그중 하나가 맞더라도
              읽는 사람은 셋 다 신뢰하기 어려워집니다. 리뉴얼 전 사이트에도 같은 건이 위치마다 다른
              숫자로 실려 있었고, 어느 쪽이 원본인지 확인할 기록을 찾지 못했습니다.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>조건이 빠진 결과는 옮겨 쓸 수 없습니다</CardTitle>
            <CardBody>
              몇 위에서 몇 위가 되었다는 문장만으로는 그 결과가 내 사이트에서도 가능한 이야기인지 알
              수 없습니다. 도메인이 운영된 기간, 이미 쌓여 있던 링크, 상위 경쟁 페이지의 성격, 같은
              시기에 함께 진행한 수정까지 달라지면 동일한 작업도 다른 결과로 이어집니다.
            </CardBody>
          </Card>
        </div>
        <p className="bl-closing">
          그래서 저희는 사례를 늦게 올리더라도, 앞의 조건을 함께 적을 수 있는 것만 올리기로
          했습니다. 순위가 움직이는 조건 자체를 먼저 보고 싶다면{' '}
          <Link href="/google-ranking">무엇이 순위를 붙잡고 있는지 정리한 페이지</Link>가 더 도움이
          될 수 있습니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="rules-title">
        <SectionHead
          eyebrow="02 / RULES"
          id="rules-title"
          title={
            <>
              <span className="bl-break">사례를 공개할 때</span>
              지키는 {CASE_DISCLOSURE_RULES.length}가지 기준입니다.
            </>
          }
          lead="게시할 사례가 한 건도 없는 지금도 이 기준은 그대로 적용됩니다. 기준을 먼저 공개해 두면, 나중에 올라오는 사례를 같은 잣대로 읽으실 수 있습니다."
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

      <Section ariaLabelledBy="fields-title">
        <SectionHead
          eyebrow="03 / WHAT WE RECORD"
          id="fields-title"
          title="사례 한 건에는 결과 말고도 여덟 가지가 더 들어갑니다."
          lead="아래 항목을 모두 채울 수 있을 때 한 건의 사례가 됩니다. 하나라도 비면 그 사례는 게시 대상에서 빠집니다."
        />
        <ComparisonTable
          caption="사례를 공개할 때 기록하는 항목과 그 항목이 필요한 이유"
          columns={['무엇을 적는가', '빠지면 생기는 일']}
          rowHeader="기록 항목"
          rows={DISCLOSURE_FIELDS}
        />
        <p className="bl-closing">
          측정 기준을 적을 수 없는 값은 사례 카드에서 아예 표시되지 않도록 화면을 만들어 두었습니다.
          기준 없이 숫자만 남는 상황을 사람이 매번 조심하는 대신, 구조로 막아 두는 편이 안전하다고
          판단했습니다.
        </p>
      </Section>

      <Section id="published" subtle ariaLabelledBy="published-title">
        <SectionHead
          eyebrow="04 / PUBLISHED"
          id="published-title"
          title="지금 게시된 사례"
          lead="위 기준을 모두 통과한 사례만 이 자리에 올라옵니다."
        />
        {PUBLISHED_CASES.length ? (
          <div className="bl-grid bl-grid--2">
            {PUBLISHED_CASES.map(study => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
        ) : (
          <div className="bl-notice">
            <p>
              <strong>현재 기준을 모두 통과한 사례는 게시되어 있지 않습니다.</strong> 이전 사이트에
              실려 있던 사례들은 같은 건이 페이지마다 다른 숫자로 적혀 있었고, 어느 값이 원본인지
              확인할 기록이 남아 있지 않았습니다. 하나를 골라 남기거나 적당히 합치면 확인되지 않은
              값을 사실처럼 표시하게 되므로, 그대로 내렸습니다.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              작업 기록과 순위 추적 스냅샷으로 앞의 항목을 전부 채울 수 있는 건부터 순서대로
              올립니다. 숫자를 맞추기 위해 기록을 나중에 정리하지는 않습니다. 준비되는 대로 이
              자리에 카드 형태로 나타납니다.
            </p>
          </div>
        )}
      </Section>

      <Section ariaLabelledBy="now-title">
        <SectionHead
          eyebrow="05 / AVAILABLE NOW"
          id="now-title"
          title="사례가 올라오기 전에도 확인할 수 있는 것이 있습니다."
          lead="상담에서는 완성된 사례 대신, 사례를 만들 때 쓰는 판단 과정을 지금 사이트에 그대로 적용해 보여드립니다."
        />
        <div className="bl-grid bl-grid--3">
          {CONSULT_POINTS.map(point => (
            <Card key={point.title}>
              <CardTitle>{point.title}</CardTitle>
              <CardBody>{point.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          어떤 작업이 필요한지 윤곽이 잡히면 예산도 미리 가늠할 수 있습니다. 공개된 시작가 중 가장
          낮은 금액은 {formatKrw(lowestFrom)}이며, 실제 구성은 키워드 경쟁도와 사이트 상태에 따라
          달라집니다. <Link href="/pricing">무엇에 돈이 들어가는지 정리한 쪽</Link>과{' '}
          <Link href="/backlink-agency">맡기기 전에 확인할 항목</Link>을 함께 보시면 비교가
          쉬워집니다.
        </p>
      </Section>

      <Section size="sm">
        <TelegramCTABlock
          source="cases"
          position="mid"
          title="지금 상황이 어느 쪽에 가까운지 먼저 확인해 보세요."
          body="사이트 주소와 목표 키워드를 알려주시면, 사례에 적용하는 것과 같은 기준으로 지금 무엇부터 보는 것이 맞는지 설명해 드립니다. 결과를 약속하는 대신 판단 과정을 보여드립니다."
          label="내 사이트 상황부터 확인하기"
        />
      </Section>

      <Section subtle size="sm">
        <RelatedContent heading="함께 보면 좋은 페이지" hrefs={cluster.relatedPages} />
        <div style={{ marginTop: '2.5rem' }}>
          <RelatedServices heading="사례 기준을 그대로 적용하는 작업" />
        </div>
      </Section>

      <FinalCTA
        source="cases"
        title="비슷한 조건이었던 적이 있는지 물어보셔도 됩니다."
        body="게시할 수 있는 사례와 별개로, 지금 사이트와 목표 키워드를 보고 어떤 순서로 접근하는 것이 맞는지 이야기해 드립니다."
        label="내 사이트 상황부터 확인하기"
      />
    </>
  )
}
