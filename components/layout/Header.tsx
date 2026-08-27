/**
 * 전역 헤더
 *
 * - 공개 네비게이션에서 로그인·회원가입·크레딧·장바구니·대시보드를 노출하지 않는다.
 * - 서비스 드롭다운과 모바일 메뉴 모두 JS 없이 동작한다 (CSS :focus-within / native <details>).
 *   덕분에 하위 서비스 링크가 항상 HTML에 포함되어 크롤러가 따라갈 수 있다.
 */
import Link from 'next/link'
import { PRIMARY_NAV, FOOTER_NAV } from '@/config/nav'
import { SITE_NAME } from '@/config/site'
import { Container } from './Container'
import { NavLink } from './NavLink'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'

export function Header() {
  return (
    <header className="bl-header">
      <Container>
        <div className="bl-header__inner">
          <Link href="/" className="bl-logo">
            {SITE_NAME}
          </Link>

          <nav className="bl-nav" aria-label="주요 메뉴">
            {PRIMARY_NAV.map(item =>
              item.children ? (
                <div key={item.href} className="bl-dropdown">
                  <NavLink href={item.href} label={item.label} />
                  <div className="bl-dropdown__panel">
                    {item.children.map(child => (
                      <Link key={child.href} href={child.href} className="bl-dropdown__item">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={item.href} href={item.href} label={item.label} />
              )
            )}
          </nav>

          <div className="bl-header__actions">
            <TelegramCTA source="header" position="header" variant="button" size="md" />
          </div>

          <details className="bl-mobile">
            <summary className="bl-mobile__toggle" aria-label="메뉴 열기">
              메뉴
            </summary>
            <div className="bl-mobile__panel">
              <div className="bl-mobile__group">
                {PRIMARY_NAV.map(item => (
                  <Link key={item.href} href={item.href} className="bl-mobile__link">
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="bl-mobile__group">
                <p className="bl-mobile__heading">서비스</p>
                {FOOTER_NAV[0].links.map(link => (
                  <Link key={link.href} href={link.href} className="bl-mobile__link">
                    {link.label}
                  </Link>
                ))}
                <Link href="/backlink-agency" className="bl-mobile__link">
                  백링크 업체
                </Link>
                <Link href="/google-ranking" className="bl-mobile__link">
                  구글 상위노출
                </Link>
                <Link href="/faq" className="bl-mobile__link">
                  자주 묻는 질문
                </Link>
              </div>

              <div className="bl-mobile__group">
                <TelegramCTA source="header" position="mobile-menu" variant="button" block />
              </div>
            </div>
          </details>
        </div>
      </Container>
    </header>
  )
}
