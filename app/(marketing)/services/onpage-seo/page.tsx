/**
 * 온페이지 SEO /services/onpage-seo
 *
 * Primary keyword: 온페이지 SEO
 * 포지션: "링크를 늘렸는데도 순위가 그대로일 때 먼저 보는 영역".
 *
 * ⚠️ 작성 규칙
 * - 점검 항목의 개수를 숫자로 단정하지 않는다. 이전 사이트는 같은 서비스를 47개 / 50개 항목으로
 *   서로 다르게 표기했다. 개수 대신 "어떤 영역을 보는지"로만 서술한다.
 * - 가격은 config/pricing.ts 에서만 가져온다. 내부링크 묶음은 config/seo-graph.ts 에서 가져온다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { ProblemSection } from '@/components/marketing/ProblemSection'
import { PricingCard } from '@/components/marketing/PricingCard'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardMeta, CardTitle, BulletList } from '@/components/ui/Card'
import { IconSurface } from '@/components/ui/Icon'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedServices } from '@/components/content/RelatedServices'
import { ServiceSchema } from '@/components/seo/ServiceSchema'

import { getService, ONPAGE_SCOPE } from '@/config/services'
import { getPricingGroup, formatKrw } from '@/config/pricing'
import { ctaLabel } from '@/config/cta'
import { SEO_GRAPH } from '@/config/seo-graph'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '온페이지 SEO 점검 · 링크 전 페이지 진단',
  description:
    '링크를 늘렸는데도 순위가 그대로라면 페이지 쪽이 막혀 있을 수 있습니다. 검색의도·타이틀·헤딩·내부링크·색인 상태를 영역별로 살펴보고, 무엇부터 고쳐야 하는지 순서를 정리해 드립니다.',
  alternates: { canonical: '/services/onpage-seo' },
  openGraph: {
    title: '온페이지 SEO 점검 · 링크 전 페이지 진단',
    description: '백링크를 추가하기 전에, 페이지가 순위를 받을 준비가 되어 있는지 먼저 확인합니다.',
    url: '/services/onpage-seo',
  },
}

const ONPAGE_QUESTIONS = [
  '링크 작업을 마쳤는데 목표 키워드 순위가 몇 주째 같은 자리인가요?',
  '검색 결과에 노출은 되는데 클릭으로 이어지지 않나요?',
  '올리고 싶은 상세 페이지 대신 엉뚱한 페이지가 대신 노출되나요?',
  '사이트를 새로 단장한 뒤로 검색 유입이 줄어들었나요?',
  '무엇을 고쳐야 하는지 알려주는 사람 없이 링크만 계속 추가하고 계신가요?',
]

/**
 * 점검 영역의 목록·설명은 config/services.ts 의 ONPAGE_SCOPE 가 원본이다.
 * 이 페이지는 거기에 아이콘과 "어긋나면" 증상만 얹는다.
 * 키를 ONPAGE_SCOPE 의 title 로 좁혀 두었기 때문에, config 가 바뀌면 타입 에러로 드러난다.
 */
type ScopeTitle = (typeof ONPAGE_SCOPE)[number]['title']

const SCOPE_DETAIL: Record<ScopeTitle, { icon: string; symptom: string }> = {
  '사이트 속도 · Core Web Vitals': {
    icon: 'gauge',
    symptom: '어긋나면: 모바일 유입에서 특히 이탈이 크고, 내용이 비슷한 경쟁 페이지에 밀립니다.',
  },
  '페이지 구조 · 헤딩': {
    icon: 'file',
    symptom:
      '어긋나면: 분량은 긴데 검색엔진이 문서를 요약하지 못해, 본문 일부가 발췌되어 노출되는 기회를 놓칩니다.',
  },
  '사이트 구조 · IA': {
    icon: 'sitemap',
    symptom:
      '어긋나면: 새로 올린 페이지가 늦게 수집되고, 정작 중요하지 않은 주소들이 대신 수집됩니다.',
  },
  '내부링크 설계 · 크롤 경로': {
    icon: 'link',
    symptom:
      '어긋나면: 외부에서 들어온 신호가 홈에만 고이고 정작 순위를 올리려는 상세 페이지까지 흐르지 않습니다.',
  },
  '색인 상태 (Indexability)': {
    icon: 'globe',
    symptom:
      '어긋나면: 아무리 링크를 붙여도 검색 결과에 페이지 자체가 등장하지 않습니다. 여기가 막혀 있으면 다른 작업의 효과를 확인할 수조차 없습니다.',
  },
  'Canonical · 리다이렉트': {
    icon: 'share',
    symptom: '어긋나면: 같은 내용이 여러 주소로 나뉘어, 어느 쪽도 평가를 온전히 받지 못합니다.',
  },
  'Sitemap · robots': {
    icon: 'map',
    symptom:
      '어긋나면: 새로 올린 페이지가 수집되지 않거나, 반대로 막아 두려던 주소가 검색 결과에 남습니다.',
  },
  '메타데이터 · 구조화 데이터': {
    icon: 'pen',
    symptom: '어긋나면: 노출 수는 늘어나는데 클릭률이 따라 오르지 않습니다.',
  },
  '콘텐츠 구조': {
    icon: 'layers',
    symptom: '어긋나면: 비슷한 페이지들이 번갈아 노출되면서 어느 쪽도 자리를 잡지 못합니다.',
  },
  '기술적 중복 · 품질 위험': {
    icon: 'alert',
    symptom: '어긋나면: 올리려던 페이지 대신 중복된 다른 주소가 검색 결과에 잡힙니다.',
  },
  '모바일 사용성': {
    icon: 'users',
    symptom: '어긋나면: 잠깐 올라갔던 순위가 유지되지 않고 다시 내려앉는 패턴이 반복됩니다.',
  },
}

const DELIVERABLES = [
  {
    icon: 'search',
    title: '지금 어디가 막혀 있는지',
    body: '위 영역 중 실제로 문제가 되는 곳과, 확인해 보니 이미 괜찮았던 곳을 나눠서 적습니다. 문제가 없는 영역을 굳이 손대라고 하지 않습니다.',
  },
  {
    icon: 'trending',
    title: '고칠 순서',
    body: '먼저 손대야 효과를 확인할 수 있는 것과, 여유가 생기면 정리해도 되는 것을 나눠 둡니다. 순서 없이 나열된 목록은 실행으로 이어지기 어렵습니다.',
  },
  {
    icon: 'wrench',
    title: '누가 고칠 수 있는지',
    body: '관리자 화면에서 바로 바꿀 수 있는 것과 개발 작업이 필요한 것을 구분해 적습니다. 담당자에게 그대로 전달할 수 있는 형태로 정리합니다.',
  },
  {
    icon: 'clock',
    title: '링크 작업으로 넘어갈 시점',
    body: '페이지 쪽 정리가 끝난 뒤에 어떤 링크 작업이 어울릴지, 아니면 지금 상태로도 링크를 병행할 수 있을지에 대한 판단을 함께 남깁니다.',
  },
]

const GOOD_FIT = [
  '백링크를 이미 진행했지만 목표 키워드가 오랫동안 제자리인 사이트',
  '검색 결과에 노출은 되는데 클릭이 거의 없는 사이트',
  '페이지가 계속 늘어나면서 어떤 페이지를 대표로 밀어야 할지 정리되지 않은 사이트',
  '리뉴얼이나 주소 변경 직후 검색 유입이 눈에 띄게 줄어든 사이트',
  '외주로 만든 뒤 SEO 관점에서 한 번도 점검받지 않은 사이트',
]

const OTHER_FIT = [
  '아직 페이지 수가 매우 적고 본문이 거의 없는 상태라면, 고칠 대상 자체가 부족합니다.',
  '이미 구조가 정리되어 있고 경쟁 사이트 대비 외부 참조만 부족한 상태라면, 점검보다 링크 작업이 먼저입니다.',
]

export default function OnpageSeoPage() {
  const service = getService('onpage-seo')
  const pricing = getPricingGroup('onpage-seo')
  const cluster = SEO_GRAPH.onpageSeo
  const relatedPages = [cluster.pillar, ...cluster.relatedPages, cluster.moneyPage]

  return (
    <>
      {service ? <ServiceSchema service={service} /> : null}

      <Breadcrumb
        trail={[
          { href: '/services', label: '서비스' },
          { href: '/services/onpage-seo', label: '온페이지 SEO' },
        ]}
      />

      <Hero
        eyebrow="온페이지 SEO"
        title={
          <>
            <span className="bl-break">백링크를 추가하기 전에,</span>
            페이지가 순위를 받을 준비가 되어 있는지 확인하세요.
          </>
        }
        support="외부에서 아무리 신호를 보내도, 그 신호를 받을 쪽이 정리되어 있지 않으면 결과로 이어지기 어렵습니다. 온페이지 SEO 점검은 링크를 더 붙이기 전에 페이지 자체가 평가받을 상태인지부터 확인하는 작업입니다."
        actions={
          <>
            <TelegramCTA source="onpage-seo" position="hero" size="lg" label={ctaLabel('onpage')} />
            <Button href="/google-ranking" variant="secondary" size="lg">
              순위가 오르지 않는 이유 보기
            </Button>
          </>
        }
      />

      <ProblemSection
        eyebrow="01 / 현재 상황"
        title={
          <>
            <span className="bl-break">링크를 늘렸는데도</span>순위가 그대로인가요?
          </>
        }
        questions={ONPAGE_QUESTIONS}
        closing="이 중 하나라도 해당된다면, 링크의 양이 아니라 링크를 받는 쪽에 원인이 있을 가능성을 먼저 지워야 합니다."
        subtle
      />

      <Section ariaLabelledBy="why-first-title">
        <SectionHead
          eyebrow="02 / 순서의 이유"
          id="why-first-title"
          title="왜 링크보다 페이지를 먼저 보나요?"
          lead="백링크는 이 페이지를 참고할 만하다는 외부의 의견입니다. 그 의견이 도착했을 때 검색엔진이 페이지를 읽고, 무엇에 대한 문서인지 판단하고, 검색 결과에 담을 수 있어야 의견이 값을 갖습니다."
        />
        <div className="bl-grid bl-grid--3">
          <Card>
            <IconSurface name="target" />
            <CardTitle>받을 쪽이 준비되어야 합니다</CardTitle>
            <CardBody>
              수집이 막혀 있거나 대표 주소가 다른 곳을 가리키고 있으면, 링크가 향한 페이지는 애초에
              평가 대상에 들어가지 못합니다. 이 상태에서는 작업량을 늘려도 변화를 관찰할 수
              없습니다.
            </CardBody>
          </Card>
          <Card>
            <IconSurface name="compass" />
            <CardTitle>무엇에 대한 문서인지 분명해야 합니다</CardTitle>
            <CardBody>
              제목과 소제목, 본문의 순서가 흐릿하면 어떤 검색어에 이 문서를 놓을지 판단하기
              어렵습니다. 외부 신호가 어느 키워드로 쌓여야 하는지도 함께 흐려집니다.
            </CardBody>
          </Card>
          <Card>
            <IconSurface name="shield" />
            <CardTitle>고친 효과가 오래 남습니다</CardTitle>
            <CardBody>
              구조를 정리해 두면 이후에 추가하는 콘텐츠와 링크가 같은 기반 위에 쌓입니다. 반대로
              기반이 어긋난 채 작업을 늘리면 같은 문제를 페이지 수만큼 반복하게 됩니다.
            </CardBody>
          </Card>
        </div>
        <p className="bl-closing">
          그래서 저희는 상담에서 링크 수량부터 묻지 않습니다. 어떤 조건이 함께 움직이는지는{' '}
          <Link href="/google-ranking">구글에서 순위가 결정되는 방식</Link>에 정리해 두었고, 링크
          자체의 역할은 <Link href="/backlink">백링크가 무엇을 바꾸는지</Link>에서 따로 설명합니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="check-areas-title">
        <SectionHead
          eyebrow="03 / 점검 영역"
          id="check-areas-title"
          title="어떤 영역을 보는지 먼저 밝힙니다."
          lead="점검을 몇 개 항목으로 했다고 말하는 대신, 어떤 영역을 어떤 기준으로 보는지를 공개합니다. 사이트마다 문제가 몰려 있는 영역이 다르기 때문에 실제로 들여다보는 깊이도 달라집니다."
        />
        <div className="bl-grid bl-grid--3">
          {ONPAGE_SCOPE.map(area => (
            <Card key={area.title}>
              <IconSurface name={SCOPE_DETAIL[area.title].icon} />
              <CardTitle>{area.title}</CardTitle>
              <CardBody>{area.body}</CardBody>
              <CardMeta>{SCOPE_DETAIL[area.title].symptom}</CardMeta>
            </Card>
          ))}
        </div>
        <div className="bl-notice" style={{ marginTop: '2rem' }}>
          <p>
            <strong>위 영역을 전부 손대야 하는 경우는 드뭅니다.</strong> 결과를 막고 있는 원인은
            보통 특정 영역에 몰려 있고, 나머지는 이미 괜찮은 상태일 수 있습니다. 점검의 목적은 고칠
            거리를 늘리는 것이 아니라 지금 손대야 할 곳을 좁히는 데 있습니다.
          </p>
        </div>
      </Section>

      <Section ariaLabelledBy="deliverables-title">
        <SectionHead
          eyebrow="04 / 전달 내역"
          id="deliverables-title"
          title="점검이 끝나면 무엇을 받게 되나요?"
          lead="화면 캡처를 모아 놓은 문서가 아니라, 순서대로 실행할 수 있는 형태로 전달합니다."
        />
        <div className="bl-grid bl-grid--2">
          {DELIVERABLES.map(item => (
            <Card key={item.title}>
              <IconSurface name={item.icon} />
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          수정 자체를 저희가 대신 진행할지, 리포트만 받아 내부에서 처리할지는 상황에 따라 정합니다.
          본문을 다시 써야 하는 범위까지 필요하다면{' '}
          <Link href="/services/content-seo">문서를 다시 설계하는 작업</Link>으로 이어집니다.
        </p>
      </Section>

      <Section subtle ariaLabelledBy="fit-title">
        <SectionHead
          eyebrow="05 / 적합한 상황"
          id="fit-title"
          title="이런 사이트에 적합합니다."
          lead="아래에 가까울수록 점검으로 얻는 것이 많습니다."
        />
        <div className="bl-grid bl-grid--2">
          <Card feature>
            <IconSurface name="check" />
            <CardTitle>적합한 경우</CardTitle>
            <BulletList items={GOOD_FIT} />
          </Card>
          <Card>
            <IconSurface name="alert" />
            <CardTitle>먼저 다른 작업이 필요한 경우</CardTitle>
            <BulletList items={OTHER_FIT} />
            <CardMeta>
              어느 쪽인지 애매하다면 사이트 주소만 알려주셔도 대략적인 방향은 말씀드릴 수 있습니다.
            </CardMeta>
          </Card>
        </div>
      </Section>

      <Section ariaLabelledBy="pricing-title">
        <SectionHead
          eyebrow="06 / 가격"
          id="pricing-title"
          title="점검 비용과 범위를 미리 확인하세요."
          lead="점검은 단일 구성으로 진행합니다. 사이트 규모가 크거나 여러 목표 키워드를 함께 봐야 하는 경우에는 범위를 먼저 합의한 뒤 시작합니다."
        />
        {pricing ? (
          <>
            <div className="bl-grid bl-grid--2">
              <PricingCard group={pricing} />
              <Card>
                <CardTitle>비용을 판단하는 기준</CardTitle>
                <CardBody>
                  링크 작업을 한 차례 더 진행하는 비용과 비교해 보시는 편이 실제 판단에 가깝습니다.
                  원인이 페이지 쪽에 있다면 링크를 추가로 넣어도 같은 자리에 머무는 시간이 길어질
                  뿐입니다.
                </CardBody>
                <CardMeta>
                  전체 서비스의 가격 구조와 가격이 달라지는 이유는{' '}
                  <Link href="/pricing">가격 안내</Link>에서 함께 볼 수 있습니다.
                </CardMeta>
              </Card>
            </div>
            <p className="bl-closing">
              시작가는 {formatKrw(pricing.from)}입니다. 봐야 할 페이지가 많거나 목표 키워드가 여러
              개라 범위가 달라지는 경우에는 작업을 시작하기 전에 다시 안내드립니다.
            </p>
          </>
        ) : (
          <div className="bl-notice">
            <p>가격 정보를 준비 중입니다. 상담으로 범위와 비용을 먼저 안내해 드립니다.</p>
          </div>
        )}
      </Section>

      <Section size="sm" subtle>
        <TelegramCTABlock source="onpage-seo" cta="onpage" position="mid" />
      </Section>

      <Section ariaLabelledBy="related-title">
        <SectionHead
          eyebrow="07 / 다음 단계"
          id="related-title"
          title="점검 다음에 이어지는 것들."
          lead="페이지 쪽을 정리하고 나면 대개 콘텐츠를 보강하거나 외부 신호를 쌓는 단계로 넘어갑니다."
        />
        <RelatedContent heading="함께 보면 좋은 페이지" hrefs={relatedPages} />
        <div style={{ marginTop: '2.5rem' }}>
          <RelatedServices
            heading="이어서 검토할 작업"
            slugs={['content-seo', 'plan-backlink', 'pbn-backlink']}
          />
        </div>
      </Section>

      <FinalCTA
        source="onpage-seo"
        cta="onpage"
        title="사이트 주소만 알려주셔도 됩니다."
        body="현재 페이지가 어떤 상태인지 먼저 보고, 점검이 필요한지 아니면 다른 작업이 먼저인지 말씀드리겠습니다."
        label="현재 페이지 상태 상담하기"
      />
    </>
  )
}
