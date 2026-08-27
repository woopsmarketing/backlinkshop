import {
  BUSINESS_INFO,
  SITE_NAME,
  SITE_NAME_EN,
  SITE_URL,
  SUPPORT_EMAIL,
  absoluteUrl,
} from '@/config/site'
import { JsonLd } from './JsonLd'

/**
 * Organization — 홈에서 1회만 출력한다.
 * 사업자 정보(주소 등)는 실제 값이 있을 때만 포함한다. 없는 필드를 만들어내지 않는다.
 */
export function OrganizationSchema() {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: [SITE_NAME_EN, '백링크 샵'],
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    description:
      '사이트 상태와 목표 키워드를 먼저 확인하고 필요한 백링크·SEO 작업을 구성하는 SEO 서비스입니다.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: SUPPORT_EMAIL,
      contactType: '고객지원',
      availableLanguage: ['Korean'],
    },
  }

  if (BUSINESS_INFO.companyName.trim()) {
    data.legalName = BUSINESS_INFO.companyName
  }
  if (BUSINESS_INFO.address.trim()) {
    data.address = {
      '@type': 'PostalAddress',
      addressCountry: 'KR',
      streetAddress: BUSINESS_INFO.address,
    }
  }
  if (BUSINESS_INFO.phone.trim()) {
    ;(data.contactPoint as Record<string, unknown>).telephone = BUSINESS_INFO.phone
  }

  return <JsonLd data={data} />
}
