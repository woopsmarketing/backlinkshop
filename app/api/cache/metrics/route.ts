import { NextResponse, type NextRequest } from 'next/server'
import { createAdminSupabaseClient } from '@/server/supabase/admin'

export const dynamic = 'force-dynamic'

const CACHE_TTL_DAYS = 30

export async function GET(request: NextRequest) {
  // API key auth
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

  // Check cache
  const { data: cached } = await adminClient
    .from('domain_metrics_cache')
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

  // Cache miss - call RapidAPI
  const rapidApiKey = process.env.RAPIDAPI_KEY
  if (!rapidApiKey) {
    return NextResponse.json({ error: 'RAPIDAPI_KEY not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://domain-metrics-check.p.rapidapi.com/domain-metrics/${encodeURIComponent(domain)}/`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'domain-metrics-check.p.rapidapi.com',
        },
        signal: AbortSignal.timeout(20000),
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: `RapidAPI error ${res.status}` }, { status: 502 })
    }

    const data = await res.json()
    if (data?.status === 'error') {
      return NextResponse.json({ error: data?.message || 'API error' }, { status: 502 })
    }

    const metrics = {
      mozDA: data?.mozDA ?? null,
      mozPA: data?.mozPA ?? null,
      mozRank: data?.mozRank ?? null,
      mozLinks: data?.mozLinks ?? null,
      mozSpam: data?.mozSpam ?? null,
      ahrefsDR: data?.ahrefsDR ?? null,
      ahrefsRank: data?.ahrefsRank ?? null,
      ahrefsBacklinks: data?.ahrefsBacklinks ?? null,
      ahrefsRefDomains: data?.ahrefsRefDomains ?? null,
      ahrefsTraffic: data?.ahrefsTraffic ? Math.round(data.ahrefsTraffic) : null,
      ahrefsTrafficValue: data?.ahrefsTrafficValue ? Math.round(data.ahrefsTrafficValue) : null,
      ahrefsOrganicKeywords: data?.ahrefsOrganicKeywords ?? null,
      majesticTF: data?.majesticTF ?? null,
      majesticCF: data?.majesticCF ?? null,
      majesticLinks: data?.majesticLinks ?? null,
      majesticRefDomains: data?.majesticRefDomains ?? null,
      majesticRefEdu: data?.majesticRefEdu ?? null,
      majesticRefGov: data?.majesticRefGov ?? null,
    }

    // Save to cache
    await adminClient
      .from('domain_metrics_cache')
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

/**
 * POST: 다른 프로젝트에서 분석한 결과를 캐시에 저장
 * Body: { domain: string, metrics: object }
 */
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
      .from('domain_metrics_cache')
      .upsert(
        { domain: domain.toLowerCase().trim(), metrics, fetched_at: new Date().toISOString() },
        { onConflict: 'domain' }
      )

    return NextResponse.json({ success: true, domain: domain.toLowerCase().trim() })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
