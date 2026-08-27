/**
 * 정책 문서 렌더러 (이용약관 · 개인정보처리방침 · 환불정책 공용)
 *
 * 마케팅 랜딩이 아니라 문서 UI 다. 장식을 넣지 않고 읽기와 찾기에만 집중한다.
 * 구성: Breadcrumb / Title / Updated Date / TOC / Content / 관련 정책 링크
 */
import Link from 'next/link'
import { Container, Section } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { TableOfContents } from '@/components/content/TableOfContents'
import {
  BUSINESS_INFO,
  POLICY_UPDATED_AT,
  SUPPORT_EMAIL,
  TELEGRAM_URL,
  hasBusinessInfo,
} from '@/config/site'
import {
  otherPolicies,
  type PolicyDocument as PolicyDoc,
  type PolicySection,
} from '@/config/policy'

/** '2026-08-27' -> '2026년 8월 27일' (서버·클라이언트 불일치가 없도록 문자열만 다룬다) */
export function formatKoreanDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}

function SectionBody({ section }: { section: PolicySection }) {
  return (
    <>
      {section.body?.map(paragraph => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      {section.list ? (
        <ul>
          {section.list.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {section.table ? (
        <div className="blog-table">
          <table>
            <caption className="bl-sr-only">{section.heading}</caption>
            <thead>
              <tr>
                {section.table.columns.map(column => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map(row => (
                <tr key={row.join('|')}>
                  {row.map((cell, index) =>
                    index === 0 ? (
                      <th key={cell} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={cell}>{cell}</td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {section.note ? <div className="blog-note">{section.note}</div> : null}
    </>
  )
}

export function PolicyDocumentPage({ doc }: { doc: PolicyDoc }) {
  const related = otherPolicies(doc.slug)
  const showContact = doc.slug === 'privacy' || doc.slug === 'refund'

  return (
    <>
      <Breadcrumb trail={[{ href: `/${doc.slug}`, label: doc.title }]} narrow />

      <Section size="sm" narrow>
        <h1 className="bl-h2">{doc.title}</h1>
        <p className="bl-muted" style={{ marginTop: '0.75rem' }}>
          최종 개정일{' '}
          <time dateTime={POLICY_UPDATED_AT}>{formatKoreanDate(POLICY_UPDATED_AT)}</time>
        </p>
        <p className="bl-lead" style={{ marginTop: '1.5rem' }}>
          {doc.intro}
        </p>
      </Section>

      <section className="bl-section bl-section--sm">
        <Container>
          <div className="bl-doc">
            <div className="blog-content">
              {doc.sections.map(section => (
                <section key={section.id} id={section.id} className="bl-anchor">
                  <h2 className="bl-h4" style={{ marginTop: '2.5rem' }}>
                    {section.heading}
                  </h2>
                  <SectionBody section={section} />
                </section>
              ))}

              {showContact ? (
                <section id="contact" className="bl-anchor">
                  <h2 className="bl-h4" style={{ marginTop: '2.5rem' }}>
                    문의처
                  </h2>
                  <ul>
                    <li>
                      이메일 <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                    </li>
                    <li>
                      1:1 상담{' '}
                      <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                        Telegram
                      </a>
                    </li>
                    {hasBusinessInfo() && BUSINESS_INFO.privacyOfficer.trim() ? (
                      <li>개인정보 보호책임자 {BUSINESS_INFO.privacyOfficer}</li>
                    ) : null}
                  </ul>
                </section>
              ) : null}
            </div>

            <aside className="bl-doc__aside">
              <TableOfContents
                sections={doc.sections.map(section => ({
                  id: section.id,
                  heading: section.heading,
                }))}
              />
              <div className="bl-toc" style={{ marginTop: '1rem' }}>
                <p className="bl-toc__heading">다른 정책</p>
                <ul className="bl-footer__links">
                  {related.map(item => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}
