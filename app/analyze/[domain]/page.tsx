import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AnalyzeClient, type AnalyzeInitialState } from './AnalyzeClient'
import { createAdminSupabaseClient } from '@/server/supabase/admin'
import { extractDomain, isValidDomain } from '@/lib/domain'
import { isVisibleReport } from '@/lib/lp-metrics'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SEO 진단 결과 | 백링크샵',
  description: '요청하신 사이트의 SEO 진단 결과를 실시간으로 확인하세요.',
  robots: { index: false, follow: false, nocache: true },
}

type Props = {
  params: Promise<{ domain: string }>
}

export default async function AnalyzeDomainPage({ params }: Props) {
  const { domain: rawDomain } = await params
  const decoded = decodeURIComponent(rawDomain ?? '')
  const domain = extractDomain(decoded)

  if (!isValidDomain(domain)) {
    notFound()
  }

  const adminClient = createAdminSupabaseClient()
  const pattern = `https://${domain}%`

  const { data } = await adminClient
    .from('lp_requests')
    .select('id, url, keyword, status, seo_report_data, created_at, analyzed_at, completed_at')
    .ilike('url', pattern)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const initial: AnalyzeInitialState = data
    ? {
        status: data.status as AnalyzeInitialState['status'],
        domain,
        url: data.url,
        keyword: data.keyword,
        requestedAt: data.created_at,
        analyzedAt: data.analyzed_at,
        completedAt: data.completed_at,
        report: extractVisibleReport(data.status, data.seo_report_data),
      }
    : {
        status: 'none',
        domain,
        url: null,
        keyword: null,
        requestedAt: null,
        analyzedAt: null,
        completedAt: null,
        report: null,
      }

  return <AnalyzeClient initial={initial} />
}

function extractVisibleReport(status: string, raw: unknown) {
  if (!isVisibleReport(status, raw)) return null
  return raw as AnalyzeInitialState['report']
}
