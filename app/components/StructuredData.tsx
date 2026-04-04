/**
 * 구조화 데이터 (JSON-LD) 컴포넌트
 * Google 리치 스니펫을 위한 Schema.org 마크업
 * 주의: FAQ 내용은 FAQList.tsx와 반드시 일치해야 함
 */

const SITE_URL = 'https://www.backlinkshop.co.kr'

export function FAQStructuredData() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '고품질 백링크란 무엇이며 SEO에 왜 중요한가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '고품질 백링크는 신뢰도 높은 웹사이트에서 자연스럽게 연결되는 링크입니다. 구글은 백링크를 사이트 신뢰도의 핵심 지표로 평가하며, 고품질 백링크가 많을수록 검색엔진최적화(SEO) 효과가 높아집니다. 백링크샵은 직접 구축한 PBN 네트워크와 WEB2.0, EDU, GOV, Wiki 등 10가지 이상 백링크 유형을 운영하여 자연스러운 링크 프로필을 구축합니다. 95%의 업체가 KWORK/FIVERR 스팸 링크를 재판매하지만, 백링크샵은 100% 자체 인프라로 검증된 SEO 백링크를 제공합니다.',
        },
      },
      {
        '@type': 'Question',
        name: 'PBN 백링크가 안전한가요? 구글 패널티 위험은 없나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '고품질 PBN 백링크는 안전합니다. 위험한 것은 같은 IP, 같은 호스팅, 스팸 콘텐츠를 사용하는 저품질 PBN입니다. 백링크샵의 PBN은 각 사이트를 서로 다른 호스팅, 다양한 IP, 고유 콘텐츠로 운영하며 자연스러운 분산 링킹 전략을 적용합니다. 3년간 1,247개 프로젝트에서 구글 패널티 사례 0건을 기록하고 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '백링크로 구글 상위노출까지 얼마나 걸리나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '평균 2~4주 내에 초기 순위 변화가 나타납니다. 의류 쇼핑몰 A사는 3주 만에 47위에서 3위로 구글 상위노출에 성공했고, 치과 클리닉 B는 5주 만에 미검색 상태에서 7위로 진입했습니다. 경쟁 강도에 따라 3~6개월에 걸쳐 안정적으로 상승하며, 한 번 오른 순위는 지속적으로 유지됩니다.',
        },
      },
      {
        '@type': 'Question',
        name: '소량으로 백링크 효과를 테스트할 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네, 회원가입 시 무료 30만 크레딧을 제공합니다. 30만 크레딧으로 플랜 백링크 1건 또는 사이트 SEO 진단과 맞춤 검색엔진최적화 전략 제안을 받을 수 있습니다. 리스크 없이 백링크 품질을 먼저 경험해보세요. 98%의 고객이 테스트 후 재구매합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '주문 후 백링크 작업은 얼마나 빨리 시작되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '주문 즉시 10분 내 자동으로 백링크 작업이 시작됩니다. 자동화 시스템으로 운영되어 결제 완료 후 바로 SEO 백링크가 생성됩니다. 대시보드에서 실시간 진행 상황을 확인할 수 있으며, 작업 완료 시 백링크 URL, 앵커 텍스트 등이 포함된 상세 엑셀 리포트를 제공합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '환불이 가능한가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '작업 미진행 시 100% 환불, 작업 완료 후 90일 내 구글 순위 변화가 전혀 없으면 50% 환불합니다. 사이트 수정 권장사항 미이행이나 구글 가이드라인 위반 사이트는 환불 대상에서 제외됩니다. 3년간 환불 요청률 0.8%로 고품질 백링크 서비스에 대한 고객 만족도가 매우 높습니다.',
        },
      },
    ],
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
    description:
      '국내 최대 PBN 네트워크 기반 고품질 백링크 서비스. 검색엔진최적화(SEO)와 구글 상위노출을 위한 전문 백링크 솔루션.',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@backlink-shop.com',
      contactType: '고객지원',
      availableLanguage: ['Korean'],
    },
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
    alternateName: ['BacklinkShop', '백링크 샵'],
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
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
    serviceType: '구글SEO 백링크 서비스',
    provider: {
      '@type': 'Organization',
      name: '백링크샵',
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: '대한민국',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '고품질 백링크 서비스',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '플랜 백링크 - 검색엔진최적화 패키지',
            description:
              '10가지 이상 백링크 유형으로 자연스러운 링크 프로필을 구축하는 SEO 백링크 서비스',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'PBN 백링크 - 구글 상위노출 솔루션',
            description:
              '직접 구축한 고품질 PBN 네트워크로 강력한 구글 상위노출 효과를 제공하는 프리미엄 백링크',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '온페이지 SEO 최적화',
            description:
              '사이트 기술적 SEO 점검과 온페이지 최적화로 검색엔진최적화 기반을 강화하는 서비스',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '무료 도메인 분석',
            description:
              '100% 무료로 내 도메인과 경쟁사 도메인의 DA, DR, 백링크 프로필을 정밀 분석하여 구글SEO 전략을 수립하는 서비스',
            url: 'https://domainchecker.co.kr',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
    />
  )
}
