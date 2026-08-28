import { SITE_NAME, absoluteUrl } from '@/config/site'
import type { BlogPost } from '@/content/blog'
import { JsonLd } from './JsonLd'

/**
 * Article 구조화 데이터.
 * image 는 실제 페이지에 렌더링된 대표 이미지가 있을 때만 넣는다.
 * 화면에 없는 이미지를 구조화 데이터에만 적으면 페이지와 내용이 어긋난다.
 */
export function ArticleSchema({ post }: { post: BlogPost }) {
  const image = post.heroImage ?? post.thumbnail

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        inLanguage: 'ko-KR',
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        ...(image ? { image: [absoluteUrl(image)] } : {}),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': absoluteUrl(`/blog/${post.slug}`),
        },
        author: { '@type': 'Organization', name: SITE_NAME },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
        },
      }}
    />
  )
}
