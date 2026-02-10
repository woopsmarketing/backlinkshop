/**
 * 구조화 데이터 (JSON-LD) 컴포넌트
 * Google 리치 스니펫을 위한 Schema.org 마크업
 */

export function FAQStructuredData() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '일반 백링크 업체와 백링크샵의 차이는 무엇인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '95%의 업체는 KWORK/FIVERR에서 저렴한 스팸 SEO를 구매해 재판매하지만, 백링크샵은 직접 구축·운영하는 PBN과 10가지 이상 백링크 유형을 보유했습니다.'
        }
      },
      {
        '@type': 'Question',
        name: 'PBN이 안전한가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '저품질 PBN이 위험한 것입니다. 백링크샵은 직접 구축·운영하는 고품질 PBN만 사용하고, 자연스러운 분산 링킹으로 패널티 위험을 제로로 만듭니다.'
        }
      },
      {
        '@type': 'Question',
        name: '백링크 효과는 언제부터 나타나나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '평균 2-4주 내에 초기 순위 변화가 나타나며, 3-6개월에 걸쳐 안정적으로 상승합니다.'
        }
      },
      {
        '@type': 'Question',
        name: '소량으로 테스트할 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네, 가입 시 무료 300 크레딧을 제공하며, 리스크 없이 테스트 가능합니다.'
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
  )
}

export function OrganizationStructuredData() {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '백링크샵',
    description: '국내 최대 PBN 네트워크로 진짜 SEO 효과를 만드는 백링크 전문 서비스',
    url: 'https://backlink-shop.com',
    logo: 'https://backlink-shop.com/logo.png',
    sameAs: [
      // 소셜 미디어 URL 추가 시 사용
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@backlink-shop.com',
      contactType: '고객지원',
      availableLanguage: ['Korean']
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
    />
  )
}

export function WebsiteStructuredData() {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '백링크샵',
    url: 'https://backlink-shop.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://backlink-shop.com/products?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
    />
  )
}

export function ServiceStructuredData() {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'SEO 백링크 서비스',
    provider: {
      '@type': 'Organization',
      name: '백링크샵'
    },
    areaServed: {
      '@type': 'Country',
      name: '대한민국'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '백링크 서비스',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '플랜 백링크',
            description: '10가지 이상 백링크 유형으로 자연스러운 링크 프로필 구축'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'PBN 백링크',
            description: '직접 구축한 고품질 PBN 네트워크로 강력한 순위 상승'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '내부 최적화 작업',
            description: '사이트 기술적 SEO와 온페이지 최적화'
          }
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
    />
  )
}
