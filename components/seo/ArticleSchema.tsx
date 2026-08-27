import { SITE_NAME, absoluteUrl } from '@/config/site'
import type { BlogPost } from '@/content/blog'
import { JsonLd } from './JsonLd'

export function ArticleSchema({ post }: { post: BlogPost }) {
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
