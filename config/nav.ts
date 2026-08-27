/**
 * 전역 네비게이션 정의 (Header / Footer)
 *
 * 공개 사이트에서는 로그인·회원가입·크레딧·장바구니·상품구매·대시보드를 노출하지 않는다.
 * 회원 기능은 삭제하지 않고 공개 UX에서만 숨긴다 (해당 라우트는 noindex).
 */

import { SERVICES } from './services'

export type NavLink = { href: string; label: string }

export const PRIMARY_NAV: (NavLink & { children?: NavLink[] })[] = [
  { href: '/backlink', label: '백링크' },
  {
    href: '/services',
    label: '서비스',
    children: [
      ...SERVICES.map(service => ({ href: service.href, label: service.name })),
      { href: '/backlink-agency', label: '백링크 업체' },
    ],
  },
  { href: '/pricing', label: '가격' },
  { href: '/cases', label: '성공사례' },
  { href: '/blog', label: 'SEO 가이드' },
]

export const FOOTER_NAV: { heading: string; links: NavLink[] }[] = [
  {
    heading: '서비스',
    links: SERVICES.map(service => ({ href: service.href, label: service.name })),
  },
  {
    heading: '백링크',
    links: [
      { href: '/backlink', label: '백링크 가이드' },
      { href: '/backlink-agency', label: '백링크 업체' },
      { href: '/pricing', label: '백링크 가격' },
      { href: '/google-ranking', label: '구글 상위노출' },
    ],
  },
  {
    heading: '자료',
    links: [
      { href: '/cases', label: '성공사례' },
      { href: '/blog', label: 'SEO 블로그' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    heading: '정책',
    links: [
      { href: '/terms', label: '이용약관' },
      { href: '/privacy', label: '개인정보처리방침' },
      { href: '/refund', label: '환불정책' },
    ],
  },
]
