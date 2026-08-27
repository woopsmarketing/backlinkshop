/**
 * SEO 가이드 상세 /blog/<slug>
 *
 * 이 파일은 렌더링 인프라만 담당한다. 본문(sections)·요약·Key Takeaways 는 content/blog/<slug>.ts 에 있다.
 *
 * 규칙
 * - 내부링크는 config/seo-graph.ts 의 articleLinkSet() 이 정하는 관계만 따른다 (Pillar 1 + Money 1 + 관련 글 2).
 * - section.html 은 저자가 작성한 신뢰 가능한 문자열이다. 사용자 입력이 들어오는 경로가 없으므로
 *   dangerouslySetInnerHTML 로 그대로 렌더링한다. 외부 입력을 이 필드에 넣지 말 것.
 * - 날짜는 'YYYY-MM-DD' 문자열을 그대로 잘라 쓴다. new Date() 를 쓰면 타임존에 따라 하루가 밀린다.
 * - sections 가 비어 있어도(집필 중) 에러 없이 렌더링된다. TableOfContents 는 3개 미만이면 스스로 숨는다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { KeyTakeaways } from '@/components/content/KeyTakeaways'
import { TableOfContents } from '@/components/content/TableOfContents'
import { RelatedContent } from '@/components/content/RelatedContent'
import { RelatedServices } from '@/components/content/RelatedServices'
import { RelatedArticles } from '@/components/content/RelatedArticles'
import { ArticleCTA } from '@/components/content/ArticleCTA'
import { ArticleSchema } from '@/components/seo/ArticleSchema'

import { BLOG_POSTS, getPost } from '@/content/blog'
import { articleLinkSet, pageLabel } from '@/config/seo-graph'
import { SERVICES } from '@/config/services'

export const dynamic = 'force-static'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    return { title: '요청하신 글을 찾을 수 없습니다' }
  }

  const path = `/blog/${post.slug}`

  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: post.metaTitle,
      description: post.description,
      url: path,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  }
}

/**
 * 문맥 링크용 짧은 앵커 텍스트.
 * PAGE_REGISTRY 라벨에서 앞부분만 쓴다 (카드형 링크와 앵커 텍스트가 똑같아지지 않게).
 */
function shortLabel(href: string): string {
  return pageLabel(href).split(' · ')[0]
}

/** 'YYYY-MM-DD' → '2026년 8월 27일'. 문자열만 다뤄 서버·클라이언트 렌더 결과를 일치시킨다. */
function formatKoreanDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) return iso
  return `${Number(year)}년 ${Number(month)}월 ${Number(day)}일`
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) notFound()

  const links = articleLinkSet(post.slug)
  const source = `blog-${post.slug}`

  const supportHrefs = links
    ? Array.from(
        new Set(
          [links.pillar, links.moneyPage, links.supportingPage].filter((href): href is string =>
            Boolean(href)
          )
        )
      )
    : []

  const matchedServices = links
    ? SERVICES.filter(
        service => service.href === links.moneyPage || service.href === links.supportingPage
      ).map(service => service.slug)
    : []

  const relatedArticles = links?.relatedArticles ?? []
  const revised = post.updatedAt !== post.publishedAt

  return (
    <>
      <ArticleSchema post={post} />

      <Breadcrumb
        narrow
        trail={[
          { href: '/blog', label: 'SEO 가이드' },
          { href: `/blog/${post.slug}`, label: post.title },
        ]}
      />

      <Section narrow size="sm">
        <article>
          <span className="bl-related__label">{post.category}</span>
          <h1 className="bl-h2" style={{ marginTop: '0.5rem' }}>
            {post.title}
          </h1>
          <p className="bl-lead" style={{ marginTop: '1.25rem' }}>
            {post.summary}
          </p>
          <p className="bl-muted" style={{ marginTop: '1.25rem' }}>
            {formatKoreanDate(post.publishedAt)} 발행
            {revised ? ` · ${formatKoreanDate(post.updatedAt)} 수정` : ''}
          </p>

          {post.keyTakeaways.length ? (
            <div style={{ marginTop: '2.5rem' }}>
              <KeyTakeaways items={post.keyTakeaways} />
            </div>
          ) : null}

          {post.sections.length >= 3 ? (
            <div style={{ marginTop: '2rem' }}>
              <TableOfContents sections={post.sections} />
            </div>
          ) : null}

          {post.sections.length ? (
            post.sections.map(section => (
              <section
                key={section.id}
                id={section.id}
                className="bl-anchor"
                style={{ marginTop: '3.5rem' }}
              >
                <h2 className="bl-h3">{section.heading}</h2>
                <div
                  className="blog-content"
                  style={{ marginTop: '1.25rem' }}
                  dangerouslySetInnerHTML={{ __html: section.html }}
                />
              </section>
            ))
          ) : (
            <div className="bl-notice" style={{ marginTop: '3rem' }}>
              <p>
                <strong>이 글은 지금 정리하고 있습니다.</strong> 본문이 준비되는 대로 이 자리에
                채워집니다. 먼저 확인이 필요한 내용이 있으시면 아래에서 바로 물어보셔도 됩니다.
              </p>
            </div>
          )}

          <p className="bl-muted" style={{ marginTop: '3.5rem' }}>
            이 글은 검색 환경이 바뀌거나 저희가 확인한 내용이 달라지면 수정합니다. 상단의 수정일이
            마지막으로 손본 시점입니다. 특정 결과를 약속하기보다, 판단할 때 무엇을 확인해야 하는지를
            남기는 방향으로 씁니다.
          </p>

          {links ? (
            <p className="bl-closing">
              배경부터 잡고 싶다면 <Link href={links.pillar}>{shortLabel(links.pillar)}</Link> 쪽을
              먼저 읽어 보세요. 실제로 어떤 조건에서 어디까지 진행되는지는{' '}
              <Link href={links.moneyPage}>{shortLabel(links.moneyPage)}</Link> 페이지에 나눠서 적어
              두었습니다.
            </p>
          ) : null}
        </article>
      </Section>

      <Section subtle size="sm">
        {supportHrefs.length ? (
          <RelatedContent
            heading="함께 보면 좋은 페이지"
            hrefs={supportHrefs}
            columns={supportHrefs.length >= 3 ? 3 : 2}
          />
        ) : null}

        <div style={{ marginTop: supportHrefs.length ? '3rem' : '0' }}>
          <RelatedServices
            heading="이 글의 기준이 적용되는 작업"
            slugs={matchedServices.length ? matchedServices : undefined}
          />
        </div>

        {relatedArticles.length ? (
          <div style={{ marginTop: '3rem' }}>
            <RelatedArticles heading="이어서 읽을 글" posts={relatedArticles} />
          </div>
        ) : null}
      </Section>

      <Section size="sm">
        <ArticleCTA
          source={source}
          title="이 글의 기준으로 지금 사이트를 한번 볼까요?"
          body="사이트 주소와 목표 키워드만 알려 주시면, 지금 상태에서 무엇이 먼저인지 정리해 드립니다."
          label="현재 SEO 상황 상담하기"
        />
      </Section>
    </>
  )
}
