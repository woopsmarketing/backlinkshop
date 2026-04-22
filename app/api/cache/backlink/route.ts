import { NextResponse, type NextRequest } from 'next/server'
import { createAdminSupabaseClient } from '@/server/supabase/admin'

export const dynamic = 'force-dynamic'

const CACHE_TTL_DAYS = 30

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.CACHE_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const domain = request.nextUrl.searchParams.get('domain')?.toLowerCase().trim()
  if (!domain) {
    return NextResponse.json({ error: 'domain parameter required' }, { status: 400 })
  }

  const adminClient = createAdminSupabaseClient()
  const cacheExpiry = new Date(Date.now() - CACHE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: cached } = await adminClient
    .from('backlink_cache')
    .select('metrics, fetched_at')
    .eq('domain', domain)
    .gte('fetched_at', cacheExpiry)
    .single()

  if (cached?.metrics) {
    return NextResponse.json({
      source: 'cache',
      domain,
      data: cached.metrics,
      fetched_at: cached.fetched_at,
    })
  }

  const vebApiKey = process.env.VEBAPI_KEY
  if (!vebApiKey) {
    return NextResponse.json({ error: 'VEBAPI_KEY not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://vebapi.com/api/seo/backlinkdata?website=${encodeURIComponent(domain)}`,
      {
        headers: { 'X-API-KEY': vebApiKey, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20000),
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: `VebAPI error ${res.status}` }, { status: 502 })
    }

    const data = await res.json()
    const counts = data?.counts
    const metrics = {
      backlinkTotal: counts?.backlinks?.total || 0,
      backlinkDoFollow: counts?.backlinks?.doFollow || 0,
      referringDomains: counts?.domains?.total || 0,
      referringDoFollow: counts?.domains?.doFollow || 0,
    }

    await adminClient
      .from('backlink_cache')
      .upsert({ domain, metrics, fetched_at: new Date().toISOString() }, { onConflict: 'domain' })

    return NextResponse.json({
      source: 'api',
      domain,
      data: metrics,
      fetched_at: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.CACHE_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { domain, metrics } = body

    if (!domain || !metrics || typeof metrics !== 'object') {
      return NextResponse.json({ error: 'domain and metrics required' }, { status: 400 })
    }

    const adminClient = createAdminSupabaseClient()
    await adminClient
      .from('backlink_cache')
      .upsert(
        { domain: domain.toLowerCase().trim(), metrics, fetched_at: new Date().toISOString() },
        { onConflict: 'domain' }
      )

    return NextResponse.json({ success: true, domain: domain.toLowerCase().trim() })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
