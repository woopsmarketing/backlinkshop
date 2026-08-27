/**
 * 전역 푸터
 *
 * 사업자 정보는 config/site.ts 의 BUSINESS_INFO 가 채워졌을 때만 렌더링한다.
 * 값이 비어 있으면 아무것도 표시하지 않는다 (임의 생성 금지).
 */
import Link from 'next/link'
import { FOOTER_NAV } from '@/config/nav'
import { BUSINESS_INFO, SITE_NAME, SUPPORT_EMAIL, hasBusinessInfo } from '@/config/site'
import { Container } from './Container'
import { TelegramCTA } from '@/components/marketing/TelegramCTA'

const BUSINESS_LABELS: { key: keyof typeof BUSINESS_INFO; label: string }[] = [
  { key: 'companyName', label: '상호' },
  { key: 'representative', label: '대표자' },
  { key: 'registrationNumber', label: '사업자등록번호' },
  { key: 'mailOrderNumber', label: '통신판매업 신고번호' },
  { key: 'address', label: '주소' },
  { key: 'phone', label: '고객센터' },
  { key: 'privacyOfficer', label: '개인정보보호책임자' },
]

export function Footer() {
  const businessRows = BUSINESS_LABELS.filter(row => BUSINESS_INFO[row.key].trim().length > 0)

  return (
    <footer className="bl-footer">
      <Container>
        <div className="bl-footer__grid">
          <div>
            <Link href="/" className="bl-logo">
              {SITE_NAME}
            </Link>
            <p className="bl-card__body" style={{ marginTop: '0.75rem', maxWidth: '22rem' }}>
              사이트 상황을 먼저 보고, 지금 필요한 SEO 작업이 무엇인지 판단합니다.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <TelegramCTA source="footer" position="footer" variant="button" />
            </div>
          </div>

          {FOOTER_NAV.map(group => (
            <div key={group.heading}>
              <h2 className="bl-footer__heading">{group.heading}</h2>
              <ul className="bl-footer__links">
                {group.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bl-footer__bottom">
          {hasBusinessInfo() ? (
            <div className="bl-footer__business">
              {businessRows.map(row => (
                <span key={row.key}>
                  {row.label} {BUSINESS_INFO[row.key]}
                </span>
              ))}
            </div>
          ) : null}
          <p>
            문의{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'inherit' }}>
              {SUPPORT_EMAIL}
            </a>
          </p>
          <p>&copy; {SITE_NAME}. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}
