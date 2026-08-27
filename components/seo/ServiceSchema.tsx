import { SITE_NAME, SITE_URL, absoluteUrl } from '@/config/site'
import { getPricingGroup } from '@/config/pricing'
import type { Service } from '@/config/services'
import { JsonLd } from './JsonLd'

/**
 * Service — 개별 서비스 페이지에서 출력.
 * Offer 가격은 config/pricing.ts 의 시작가(원)를 사용한다. 페이지에 표시된 값과 동일해야 한다.
 */
export function ServiceSchema({ service }: { service: Service }) {
  const pricing = getPricingGroup(service.slug)

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url: absoluteUrl(service.href),
    areaServed: { '@type': 'Country', name: '대한민국' },
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  if (pricing) {
    data.offers = {
      '@type': 'Offer',
      priceCurrency: 'KRW',
      price: pricing.from,
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'KRW',
        minPrice: pricing.from,
        valueAddedTaxIncluded: false,
      },
      url: absoluteUrl('/pricing'),
      availability: 'https://schema.org/InStock',
    }
  }

  return <JsonLd data={data} />
}
