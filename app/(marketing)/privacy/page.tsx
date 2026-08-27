/**
 * /privacy — 정책 문서.
 * 내용은 config/policy.ts 에서 관리하고, 렌더링은 PolicyDocumentPage 가 공통으로 처리한다.
 */
import type { Metadata } from 'next'
import { PolicyDocumentPage } from '@/components/content/PolicyDocument'
import { getPolicy } from '@/config/policy'

export const dynamic = 'force-static'

const doc = getPolicy('privacy')

export const metadata: Metadata = {
  title: doc.metaTitle,
  description: doc.description,
  alternates: { canonical: '/privacy' },
  openGraph: { title: doc.metaTitle, description: doc.description, url: '/privacy' },
}

export default function Page() {
  return <PolicyDocumentPage doc={doc} />
}
