/** @type {import('next').NextConfig} */

/**
 * 기존 상품 URL → 신규 공개 서비스 URL 301 이전.
 *
 * - 체인 없이 최종 URL 로 직접 보낸다.
 * - 회원용 상품 시스템은 삭제하지 않고 /shop 으로 옮겨 로그인 뒤에서 그대로 동작한다.
 *   (/products 를 조건부 리다이렉트하면 브라우저가 301 을 캐시해 로그인 후에도 접근이 막힌다)
 * - 순서 주의: 구체적인 경로가 와일드카드보다 먼저 와야 한다.
 */
const productRedirects = [
  { source: '/products/category/plan', destination: '/services/plan-backlink' },
  { source: '/products/category/pbn', destination: '/services/pbn-backlink' },
  { source: '/products/category/seo', destination: '/services/onpage-seo' },
  { source: '/products/category/content', destination: '/services/content-seo' },
  // 도메인 분석·호스팅은 신규 사이트에 대응 페이지가 없어 가장 가까운 상위 페이지로 보낸다.
  { source: '/products/category/:slug', destination: '/services' },
  // 상품 상세는 URL 만으로 상품 유형을 알 수 없어 서비스 허브로 보낸다.
  { source: '/products/:id', destination: '/services' },
  { source: '/products', destination: '/services' },
]

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      ...productRedirects.map(rule => ({ ...rule, statusCode: 301 })),
      // 공개 사이트의 전환은 Telegram 상담이고 회원가입 경로가 아니다.
      // 과거 Google Ads 사이트링크·프로모션이 /signup 으로 송출되던 것에 대한 fallback 이므로
      // 로그인 화면이 아니라 홈으로 보낸다. (신규 UI 어디에서도 /signup 으로 링크하지 않는다)
      { source: '/signup', destination: '/', statusCode: 301 },
      // /backlink 필러 페이지와 검색 의도가 같아 글을 합쳤다. 체인 없이 최종 URL 로 직접 보낸다.
      { source: '/blog/what-is-backlink', destination: '/backlink', statusCode: 301 },
    ]
  },
}

export default nextConfig
