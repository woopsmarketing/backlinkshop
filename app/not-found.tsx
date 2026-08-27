/**
 * 404
 *
 * 실제 404 상태코드를 반환한다. 존재하지 않는 경로를 홈이나 로그인으로 리다이렉트하지 않는다.
 * 루트 not-found 는 (marketing) 그룹 레이아웃을 상속받지 않으므로 헤더·푸터를 직접 붙인다.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Section } from '@/components/layout/Container'
import { RelatedContent } from '@/components/content/RelatedContent'

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <Section size="lg">
          <span className="bl-eyebrow">404</span>
          <h1 className="bl-h2">요청하신 페이지를 찾을 수 없습니다.</h1>
          <p className="bl-lead bl-measure" style={{ marginTop: '1rem' }}>
            주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 아래에서 찾으시던 내용을 이어서 확인해
            보세요.
          </p>
          <p className="bl-btn-row" style={{ marginTop: '2rem' }}>
            <Link href="/" className="bl-btn bl-btn--primary">
              홈으로 가기
            </Link>
            <Link href="/services" className="bl-btn bl-btn--secondary">
              서비스 전체 보기
            </Link>
          </p>
        </Section>

        <Section subtle size="sm">
          <RelatedContent
            heading="많이 찾는 페이지"
            hrefs={[
              '/backlink',
              '/pricing',
              '/services/pbn-backlink',
              '/google-ranking',
              '/blog',
              '/faq',
            ]}
            columns={3}
          />
        </Section>
      </main>
      <Footer />
    </>
  )
}
