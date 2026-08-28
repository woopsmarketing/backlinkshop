/**
 * SEO 가이드 목록 /blog
 *
 * 성격
 * - 서비스 랜딩이 아니라 읽는 페이지다. 설득보다 판단 기준을 먼저 준다.
 * - 글 데이터는 전부 content/blog 에서 온다. 이 파일에 글 제목·요약을 하드코딩하지 않는다.
 * - 카테고리별 색인 페이지는 만들지 않는다. 라벨은 읽는 순서를 잡는 표시로만 쓴다.
 *
 * 카드
 * - 목록은 ArticleCard 하나로 통일한다. 카테고리·제목·요약만 쌓아 두면 문서 링크처럼 보여서
 *   목록 전체가 스캔되지 않는다. 대표 다이어그램이 그 글이 무엇을 설명하는 글인지 먼저 알린다.
 * - 날짜 표기도 ArticleCard 안에서 처리한다. updatedAt 은 'YYYY-MM-DD' 문자열이고,
 *   new Date() 로 파싱하면 서버/클라이언트 타임존 차이로 하루가 밀린다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Hero } from '@/components/marketing/Hero'
import { SectionHead } from '@/components/marketing/SectionHead'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'
import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ArticleCard } from '@/components/content/ArticleCard'
import { RelatedServices } from '@/components/content/RelatedServices'

import { ctaLabel } from '@/config/cta'
import { BLOG_POSTS, getFeaturedPost, type BlogCategory } from '@/content/blog'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'SEO 가이드 · 백링크와 검색순위 판단 기준',
  description:
    'SEO를 이해하면 지금 사이트에 필요한 작업과 아직 필요하지 않은 작업이 구분됩니다. 백링크·PBN·구글 상위노출을 판단 기준 중심으로 정리한 글 모음입니다.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'SEO 가이드 · 백링크와 검색순위 판단 기준',
    description:
      '상담하지 않아도 스스로 판단할 수 있도록, 검색순위가 정해지는 방식과 링크를 고르는 기준을 글로 정리했습니다.',
    url: '/blog',
  },
}

const TOPIC_GUIDE: { category: BlogCategory; title: string; body: string }[] = [
  {
    category: 'BACKLINK',
    title: '링크가 신호로 읽히는 방식',
    body: '링크가 왜 순위에 영향을 주는지, 어떤 링크가 의미 있는 신호로 읽히고 어떤 링크는 무시되는지 다룹니다. 가격·업체·품질처럼 판단이 필요한 지점을 각각 따로 봅니다.',
  },
  {
    category: 'SEO',
    title: '사이트 안에서 먼저 정리할 것',
    body: '검색엔진이 페이지를 수집하고 이해하는 과정, 그리고 외부 작업을 시작하기 전에 사이트 안에서 정리해 두어야 하는 항목을 다룹니다.',
  },
  {
    category: 'GOOGLE RANKING',
    title: '순위가 멈췄을 때 보는 순서',
    body: '순위가 움직이지 않는 이유를 하나로 단정하지 않고, 색인·콘텐츠·링크·경쟁 상황으로 나눠서 확인하는 방법을 다룹니다.',
  },
  {
    category: 'PBN',
    title: '구조를 알고 나서 판단하기',
    body: 'PBN이 어떤 구조로 만들어지는지, 어떤 조건에서 위험이 커지는지를 있는 그대로 설명합니다. 권하기 전에 구조부터 공개하는 쪽을 택했습니다.',
  },
]

export default function BlogIndexPage() {
  const featured = getFeaturedPost()
  const posts = BLOG_POSTS.filter(post => post.slug !== featured.slug)

  return (
    <>
      <Breadcrumb trail={[{ href: '/blog', label: 'SEO 가이드' }]} />

      <Hero
        eyebrow="SEO 가이드"
        title={
          <>
            <span className="bl-break">SEO를 이해하면</span>
            무엇을 해야 할지가 더 명확해집니다.
          </>
        }
        support="검색 결과가 어떤 순서로 정해지는지 알면, 지금 내 사이트에 필요한 작업과 아직 필요하지 않은 작업이 구분됩니다. 상담하지 않아도 스스로 판단할 수 있도록 기준을 글로 정리해 두었습니다."
        actions={
          <>
            <TelegramCTA source="blog" position="hero" label={ctaLabel('blog')} size="lg" />
            <Button href="/services" variant="secondary" size="lg">
              SEO 서비스 살펴보기
            </Button>
          </>
        }
      />

      <Section size="sm" ariaLabelledBy="featured-title">
        <SectionHead
          eyebrow="01 / 시작점"
          id="featured-title"
          title="처음이라면 이 글부터 읽어보세요."
          lead={
            <>
              글의 순서는 조회수가 아니라 이해에 필요한 순서로 정했습니다. 용어와 구조부터 정리하고
              싶다면 <Link href="/backlink">백링크 가이드</Link>를 먼저 보시고, 판단 기준이 필요한
              단계라면 아래 글부터 읽으시면 됩니다.
            </>
          }
        />
        <ArticleCard post={featured} size="lg" />
      </Section>

      <Section subtle ariaLabelledBy="topics-title">
        <SectionHead
          eyebrow="02 / 주제 구분"
          id="topics-title"
          title="글은 네 가지 라벨로 구분합니다."
          lead="라벨은 검색용 분류가 아니라 읽는 순서를 잡기 위한 표시입니다. 어떤 주제부터 봐야 할지 감이 오지 않을 때 참고하세요."
        />
        <div className="bl-grid bl-grid--4">
          {TOPIC_GUIDE.map(topic => (
            <Card key={topic.category}>
              <Badge>{topic.category}</Badge>
              <CardTitle>{topic.title}</CardTitle>
              <CardBody>{topic.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="bl-closing">
          네 라벨은 서로 이어져 있습니다. 링크를 이해하면 절반은 풀리지만, 페이지 자체가 검색엔진에
          읽힐 준비가 되어 있지 않으면 링크가 만들어내는 차이도 잘 드러나지 않습니다. 그래서 한
          글에서 모든 결론을 내리는 대신, 판단이 갈리는 지점마다 다른 글과{' '}
          <Link href="/services">실제 작업 페이지</Link>로 연결해 두었습니다.
        </p>
      </Section>

      <Section ariaLabelledBy="articles-title">
        <SectionHead
          eyebrow="03 / 글 목록"
          id="articles-title"
          title="최근에 정리한 글"
          lead="마지막으로 고친 날짜가 최근인 순서로 보여 드립니다. 검색 환경이 바뀌면 글도 고칩니다. 쓴 날짜만이 아니라 수정한 날짜를 함께 남겨 두는 이유입니다."
        />
        {posts.length ? (
          <div className="bl-post-grid bl-post-grid--3">
            {posts.map(post => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="bl-notice">
            <p>
              <strong>지금은 위의 글 한 편만 공개되어 있습니다.</strong> 새 글이 준비되면 이 목록에
              바로 올라옵니다.
            </p>
          </div>
        )}
        <div className="bl-notice" style={{ marginTop: '2.5rem' }}>
          <p>
            <strong>글에는 확인한 범위까지만 씁니다.</strong> 수치가 필요한 대목에서 근거를 댈 수
            없으면 숫자를 넣지 않고 판단 기준만 남깁니다. 같은 작업이라도 사이트 상태와 키워드
            경쟁도에 따라 결과가 달라지기 때문에, 특정한 결과를 약속하는 문장 대신 무엇을 확인해야
            하는지를 적어 두는 편이 실제로 도움이 된다고 보고 있습니다.
          </p>
        </div>
      </Section>

      <Section subtle size="sm" ariaLabelledBy="next-step-title">
        <SectionHead
          eyebrow="04 / 다음 단계"
          id="next-step-title"
          title="읽은 기준을 실제 작업으로 옮길 때"
          lead="글은 판단 기준까지만 다룹니다. 어떤 작업을 어떤 순서로 진행할지는 사이트마다 다르기 때문에, 조건을 나눠서 서비스 페이지에 정리해 두었습니다."
        />
        <RelatedServices heading="글에서 다루는 작업들" />
        <div style={{ marginTop: '2.5rem' }}>
          <TelegramCTABlock
            source="blog"
            position="mid"
            title="읽다가 내 사이트에는 어떻게 적용할지 막히셨나요?"
            body="글에 없는 상황이라면 사이트 주소와 목표 키워드를 알려 주세요. 지금 상태에서 무엇부터 봐야 하는지 함께 정리해 드립니다."
            label={ctaLabel('blog')}
          />
        </div>
      </Section>

      <FinalCTA source="blog" cta="blog" />
    </>
  )
}
