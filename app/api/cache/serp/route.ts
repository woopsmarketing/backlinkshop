import { NextResponse, type NextRequest } from 'next/server'
import { createAdminSupabaseClient } from '@/server/supabase/admin'

export const dynamic = 'force-dynamic'

const CACHE_TTL_DAYS = 14

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.CACHE_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const keyword = request.nextUrl.searchParams.get('keyword')?.toLowerCase().trim()
  if (!keyword) {
    return NextResponse.json({ error: 'keyword parameter required' }, { status: 400 })
  }

  const adminClient = createAdminSupabaseClient()
  const cacheExpiry = new Date(Date.now() - CACHE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: cached } = await adminClient
    .from('serp_cache')
    .select('results, fetched_at')
    .eq('keyword', keyword)
    .gte('fetched_at', cacheExpiry)
    .single()

  if (cached?.results) {
    return NextResponse.json({
      source: 'cache',
      keyword,
      data: cached.results,
      fetched_at: cached.fetched_at,
    })
  }

  const serperKey = process.env.SERPER_API_KEY
  if (!serperKey) {
    return NextResponse.json({ error: 'SERPER_API_KEY not configured' }, { status: 500 })
  }

  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': serperKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: keyword, gl: 'kr', hl: 'ko', num: 10 }),
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Serper error ${res.status}` }, { status: 502 })
    }

    const data = await res.json()
    const results = (data?.organic || [])
      .slice(0, 10)
      .map((item: any) => ({ url: item.link || '', title: item.title || '' }))
      .filter((item: any) => item.url)

    await adminClient
      .from('serp_cache')
      .upsert({ keyword, results, fetched_at: new Date().toISOString() }, { onConflict: 'keyword' })

    return NextResponse.json({
      source: 'api',
      keyword,
      data: results,
      fetched_at: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
