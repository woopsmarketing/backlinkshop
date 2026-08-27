import { SITE_NAME, SITE_NAME_EN, SITE_URL } from '@/config/site'
import { JsonLd } from './JsonLd'

/**
 * WebSite — 홈에서 1회만 출력.
 * potentialAction(SearchAction)은 넣지 않는다. 사이트 내 검색 기능이 없기 때문이다.
 */
export function WebsiteSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        alternateName: [SITE_NAME_EN],
        url: SITE_URL,
        inLanguage: 'ko-KR',
      }}
    />
  )
}
