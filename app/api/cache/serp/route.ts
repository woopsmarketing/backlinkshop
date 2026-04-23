import { NextResponse, type NextRequest } from 'next/server'
import { createAdminSupabaseClient } from '@/server/supabase/admin'

export const dynamic = 'force-dynamic'

const CACHE_TTL_DAYS = 14

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.CACHE_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rawKeyword = request.nextUrl.searchParams.get('keyword')
  const keyword = rawKeyword?.toLowerCase().trim()
  if (!keyword) {
    return NextResponse.json({ error: 'keyword parameter required' }, { status: 400 })
  }

  console.log(`[Cache/SERP] GET keyword: "${keyword}" (raw: "${rawKeyword}")`)

  const adminClient = createAdminSupabaseClient()
  const cacheExpiry = new Date(Date.now() - CACHE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: cached, error: cacheError } = await adminClient
    .from('serp_cache')
    .select('results, fetched_at')
    .eq('keyword', keyword)
    .gte('fetched_at', cacheExpiry)
    .single()

  if (cacheError && cacheError.code !== 'PGRST116') {
    console.log(`[Cache/SERP] 캐시 조회 실패 (${keyword}):`, cacheError.message)
  }

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

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.CACHE_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { keyword, results } = body

    if (!keyword || !Array.isArray(results)) {
      return NextResponse.json({ error: 'keyword and results[] required' }, { status: 400 })
    }

    const normalizedKeyword = keyword.toLowerCase().trim()
    console.log(
      `[Cache/SERP] POST keyword: "${normalizedKeyword}" (original: "${keyword}"), results: ${results.length}건`
    )

    const adminClient = createAdminSupabaseClient()
    const { error: upsertError } = await adminClient
      .from('serp_cache')
      .upsert(
        { keyword: normalizedKeyword, results, fetched_at: new Date().toISOString() },
        { onConflict: 'keyword' }
      )

    if (upsertError) {
      console.error(`[Cache/SERP] POST 저장 실패:`, upsertError.message)
      return NextResponse.json(
        { error: 'Cache save failed: ' + upsertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, keyword: normalizedKeyword })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
