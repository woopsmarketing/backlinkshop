/**
 * 온페이지 SEO 분석 모듈
 * URL의 HTML을 가져와 47개 항목을 파싱하고 OpenAI로 분석
 * Next.js/Supabase 의존성 없는 순수 함수
 */

export interface ParsedSeo {
  url: string
  statusCode: number
  loadTimeMs: number
  title: string | null
  titleLength: number
  metaDescription: string | null
  metaDescriptionLength: number
  metaKeywords: string | null
  canonical: string | null
  h1: string[]
  h2: string[]
  h3Count: number
  imgTotal: number
  imgWithoutAlt: number
  internalLinks: number
  externalLinks: number
  nofollowLinks: number
  hasViewport: boolean
  hasCharset: boolean
  hasOgTitle: boolean
  hasOgDescription: boolean
  hasOgImage: boolean
  hasTwitterCard: boolean
  hasRobotsMeta: string | null
  hasHreflang: boolean
  hasStructuredData: boolean
  structuredDataTypes: string[]
  wordCount: number
  htmlSize: number
  headings: string
  xRobotsTag: string | null
  contentType: string | null
  isHttps: boolean
  lang: string | null
  hasFavicon: boolean
  textToHtmlRatio: number
  urlDepth: number
  urlLength: number
  hasDeprecatedTags: string[]
  hasIframes: number
  inlineCssSize: number
  inlineJsSize: number
  hasGzip: boolean
  hasCacheControl: string | null
  hasHsts: boolean
  redirectCount: number
  redirectIsWww: boolean
  duplicateH1: boolean
  duplicateDescription: boolean
  ogImageUrl: string | null
}

// --- Helper functions ---

function extractMeta(html: string, regex: RegExp): string | null {
  const match = html.match(regex)
  return match ? match[1].trim() : null
}

function getAttr(tag: string, attr: string): string | null {
  const r1 = new RegExp(`${attr}\\s*=\\s*"([^"]*)"`, 'i')
  const m1 = tag.match(r1)
  if (m1) return m1[1]
  const r2 = new RegExp(`${attr}\\s*=\\s*'([^']*)'`, 'i')
  const m2 = tag.match(r2)
  if (m2) return m2[1]
  return null
}

function extractMetaAttr(html: string, name: string): string | null {
  const metaTags = html.match(/<meta[^>]*>/gi) || []
  for (const tag of metaTags) {
    const nameVal = getAttr(tag, 'name')
    if (nameVal && nameVal.toLowerCase() === name.toLowerCase()) {
      const content = getAttr(tag, 'content')
      return content?.trim() || null
    }
  }
  return null
}

function extractProperty(html: string, prop: string): string | null {
  const metaTags = html.match(/<meta[^>]*>/gi) || []
  for (const tag of metaTags) {
    const propVal = getAttr(tag, 'property')
    if (propVal && propVal.toLowerCase() === prop.toLowerCase()) {
      const content = getAttr(tag, 'content')
      return content?.trim() || null
    }
  }
  return null
}

function extractMetaLink(html: string, rel: string): string | null {
  const r = new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']+)["']`, 'i')
  const m = html.match(r)
  return m ? m[1].trim() : null
}

function extractAll(html: string, regex: RegExp): string[] {
  const results: string[] = []
  let match
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim()
    if (text) results.push(text)
  }
  return results
}

function extractLdTypes(data: Record<string, unknown>, types: string[]) {
  if (!data || typeof data !== 'object') return
  if (data['@type']) {
    const t = data['@type']
    if (Array.isArray(t))
      t.forEach((v: string) => {
        if (!types.includes(v)) types.push(v)
      })
    else if (typeof t === 'string' && !types.includes(t)) types.push(t)
  }
  if (Array.isArray(data['@graph'])) {
    for (const item of data['@graph']) extractLdTypes(item as Record<string, unknown>, types)
  }
  if (Array.isArray(data)) {
    for (const item of data) extractLdTypes(item as Record<string, unknown>, types)
  }
}

// --- Main functions ---

export function parseHtml(
  html: string,
  requestUrl: string,
  finalUrl: string,
  statusCode: number,
  loadTime: number,
  headers: Record<string, string>
): ParsedSeo {
  const title = extractMeta(html, /<title[^>]*>([^<]+)<\/title>/i)
  const metaDescription = extractMetaAttr(html, 'description')
  const metaKeywords = extractMetaAttr(html, 'keywords')
  const canonical = extractMetaLink(html, 'canonical')

  const h1s = extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi)
  const h2s = extractAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi)
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length

  const imgs = html.match(/<img[^>]*>/gi) || []
  const imgWithoutAlt = imgs.filter(img => !img.match(/alt=["'][^"']+["']/i)).length

  const allLinkTags = html.match(/<a[^>]*href=["'][^"']+["'][^>]*>/gi) || []
  let internalLinks = 0
  let externalLinks = 0
  let nofollowLinks = 0
  const origin = new URL(finalUrl).origin

  for (const tag of allLinkTags) {
    const href = getAttr(tag, 'href')
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('javascript:') ||
      href.startsWith('mailto:')
    )
      continue
    try {
      const resolved = new URL(href, finalUrl)
      if (resolved.origin === origin) internalLinks++
      else externalLinks++
    } catch {
      continue
    }
    const rel = getAttr(tag, 'rel')
    if (rel && rel.toLowerCase().includes('nofollow')) nofollowLinks++
  }

  const textContent = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
  const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length
  const textLength = textContent.replace(/\s+/g, '').length
  const textToHtmlRatio = html.length > 0 ? Math.round((textLength / html.length) * 100) : 0

  const headings = [...h1s.map(h => `H1: ${h}`), ...h2s.map(h => `H2: ${h}`)]
    .slice(0, 15)
    .join('\n')

  const isHttps = finalUrl.startsWith('https://')
  const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["']/i)
  const lang = langMatch ? langMatch[1] : null
  const hasFavicon = /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["']/i.test(html)

  let urlDepth = 0
  let urlLength = 0
  try {
    const u = new URL(finalUrl)
    urlDepth = u.pathname.split('/').filter(Boolean).length
    urlLength = finalUrl.length
  } catch {}

  const deprecatedTags = ['font', 'center', 'marquee', 'blink', 'strike', 'big', 'tt']
  const hasDeprecatedTags: string[] = []
  for (const tag of deprecatedTags) {
    if (new RegExp(`<${tag}[\\s>]`, 'i').test(html)) {
      hasDeprecatedTags.push(`<${tag}>`)
    }
  }

  const hasIframes = (html.match(/<iframe[^>]*>/gi) || []).length
  const inlineStyles = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []
  const inlineCssSize = inlineStyles.reduce((sum, s) => sum + s.length, 0)
  const inlineScripts = html.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi) || []
  const inlineJsSize = inlineScripts.reduce((sum, s) => sum + s.length, 0)

  const encoding = headers['content-encoding'] || ''
  const hasGzip = /gzip|br|deflate/i.test(encoding)
  const hasCacheControl = headers['cache-control'] || null
  const hasHsts = !!headers['strict-transport-security']

  const redirectCount = requestUrl !== finalUrl ? 1 : 0
  let redirectIsWww = false
  if (redirectCount > 0) {
    try {
      const reqHost = new URL(requestUrl).hostname
      const finalHost = new URL(finalUrl).hostname
      redirectIsWww =
        reqHost === 'www.' + finalHost ||
        finalHost === 'www.' + reqHost ||
        reqHost.replace(/^www\./, '') === finalHost.replace(/^www\./, '')
    } catch {}
  }

  const duplicateH1 = h1s.length > 1
  const descMetas = html.match(/<meta[^>]*name=["']description["'][^>]*>/gi) || []
  const duplicateDescription = descMetas.length > 1
  const ogImageUrl = extractProperty(html, 'og:image')

  const ldJsonMatches =
    html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || []
  const structuredDataTypes: string[] = []
  for (const match of ldJsonMatches) {
    try {
      const json = match.replace(/<script[^>]*>|<\/script>/gi, '')
      const data = JSON.parse(json)
      extractLdTypes(data, structuredDataTypes)
    } catch {}
  }

  return {
    url: finalUrl,
    statusCode,
    loadTimeMs: loadTime,
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    metaKeywords,
    canonical,
    h1: h1s,
    h2: h2s,
    h3Count,
    imgTotal: imgs.length,
    imgWithoutAlt,
    internalLinks,
    externalLinks,
    nofollowLinks,
    hasViewport: /name=["']viewport["']/i.test(html),
    hasCharset: /charset/i.test(html),
    hasOgTitle: !!extractProperty(html, 'og:title'),
    hasOgDescription: !!extractProperty(html, 'og:description'),
    hasOgImage: !!ogImageUrl,
    hasTwitterCard:
      !!extractMetaAttr(html, 'twitter:card') || !!extractProperty(html, 'twitter:card'),
    hasRobotsMeta: extractMetaAttr(html, 'robots'),
    hasHreflang: /hreflang/i.test(html),
    hasStructuredData: ldJsonMatches.length > 0,
    structuredDataTypes,
    wordCount,
    htmlSize: html.length,
    headings,
    xRobotsTag: headers['x-robots-tag'] || null,
    contentType: headers['content-type'] || null,
    isHttps,
    lang,
    hasFavicon,
    textToHtmlRatio,
    urlDepth,
    urlLength,
    hasDeprecatedTags,
    hasIframes,
    inlineCssSize,
    inlineJsSize,
    hasGzip,
    hasCacheControl,
    hasHsts,
    redirectCount,
    redirectIsWww,
    duplicateH1,
    duplicateDescription,
    ogImageUrl,
  }
}

export async function analyzeSeo(apiKey: string, p: ParsedSeo): Promise<string> {
  const textSample = p.title || p.metaDescription || ''
  const koreanChars = textSample.match(/[\uac00-\ud7af]/g) || []
  const isKorean = koreanChars.length / (textSample.length || 1) > 0.3
  const titleMax = isKorean ? 40 : 60
  const descMax = isKorean ? 80 : 160

  const checks = {
    https: p.isHttps,
    status: p.statusCode === 200,
    speed: p.loadTimeMs < 3000,
    title: !!p.title && p.titleLength >= 15 && p.titleLength <= titleMax,
    desc:
      !!p.metaDescription && p.metaDescriptionLength >= 40 && p.metaDescriptionLength <= descMax,
    canonical: !!p.canonical,
    viewport: p.hasViewport,
    charset: p.hasCharset,
    lang: !!p.lang,
    favicon: p.hasFavicon,
    h1: p.h1.length === 1,
    h2: p.h2.length > 0,
    ogTags: p.hasOgTitle && p.hasOgDescription && p.hasOgImage,
    twitter: p.hasTwitterCard,
    jsonLd: p.hasStructuredData,
    gzip: p.hasGzip,
    hsts: p.hasHsts,
    imgAlt: p.imgTotal === 0 || p.imgWithoutAlt === 0,
    urlDepth: p.urlDepth <= 3,
  }
  const passCount = Object.values(checks).filter(Boolean).length
  const totalChecks = Object.keys(checks).length
  const autoScore = Math.round((passCount / totalChecks) * 100)

  const hasExternalLinks = p.externalLinks > 0
  const hasImages = p.imgTotal > 0
  const isSingleLang = !p.hasHreflang && p.lang && !p.lang.includes(',')
  const keywordsCount = p.metaKeywords ? p.metaKeywords.split(',').length : 0

  const systemPrompt = `당신은 10년 경력의 온페이지 SEO 전문 감사관입니다. Google Search Central 공식 문서를 기준으로 분석합니다.

## 채점 규칙
- 기본 점수: ${autoScore}점 (${passCount}/${totalChecks} 항목 통과). 이 점수 기준 ±10점 범위 내 조정.
- "양호" 판정된 항목은 절대 "개선 필요"에 넣지 마세요.

## 판정 테이블 (${isKorean ? '한글' : '영문'} 사이트)
| 항목 | 기준 | 현재 | 판정 |
|------|------|------|------|
| HTTPS | https | ${p.isHttps ? 'O' : 'X'} | ${checks.https ? '양호' : '개선'} |
| 상태코드 | 200 | ${p.statusCode} | ${checks.status ? '양호' : '개선'} |
| 로딩시간 | <3000ms | ${p.loadTimeMs}ms | ${checks.speed ? '양호' : '개선'} |
| Title | 15~${titleMax}자 | ${p.titleLength}자 | ${checks.title ? '양호' : '개선'} |
| Description | 40~${descMax}자 | ${p.metaDescriptionLength}자 | ${checks.desc ? '양호' : '개선'} |
| Canonical | 있음 | ${p.canonical ? 'O' : 'X'} | ${checks.canonical ? '양호' : '개선'} |
| H1 | 1개 | ${p.h1.length}개 | ${checks.h1 ? '양호' : '개선'} |
| OG 태그 | 3개 모두 | t=${p.hasOgTitle ? 'O' : 'X'} d=${p.hasOgDescription ? 'O' : 'X'} i=${p.hasOgImage ? 'O' : 'X'} | ${checks.ogTags ? '양호' : '개선'} |
| JSON-LD | 있음 | ${p.hasStructuredData ? p.structuredDataTypes.join(',') : 'X'} | ${checks.jsonLd ? '양호' : '개선'} |
| Gzip | 있음 | ${p.hasGzip ? 'O' : 'X'} | ${checks.gzip ? '양호' : '개선'} |

## 금지 규칙
1. 파싱 데이터에 없는 내용을 추측하지 마세요.
2. "SEO 모니터링 도구 활용", "콘텐츠 품질 개선", "정기적 검토" 같은 일반론은 쓰지 마세요.
3. 단일 언어 사이트(lang="${p.lang || 'ko'}")에 hreflang 추가를 권장하지 마세요. ${isSingleLang ? '이 사이트는 단일 언어입니다.' : ''}
4. Description이 ${descMax}자를 초과하면 "${descMax}자 이내로 줄이세요"라고 하세요.
5. 프레임워크 특성을 문제로 지적하지 마세요:
   - 텍스트/HTML 비율 < 10% + 단어 수 ≥ 300 → SSR 하이드레이션 (정상)
   - 인라인 JS > 50KB → __NEXT_DATA__ 프레임워크 데이터 (정상)
   - Cache-Control: no-cache → dynamic SSR 페이지 (정상)

## 응답 품질 규칙
1. "잘된 점"은 양호 항목 중 SEO 영향이 큰 핵심 항목을 설명하세요.
2. "개선 필요"는 각 항목마다 왜 문제인지 + 구체적으로 어떻게 수정하는지를 2~3문장으로 작성.
3. "핵심 권장사항"은 우선순위 높은 순으로 구체적 코드/설정 예시 포함.
4. ${!hasExternalLinks ? '외부 링크가 0개입니다. 권위 있는 외부 사이트로의 링크를 1~2개 추가하면 자연스러운 링크 프로필에 도움이 된다는 점을 언급하세요.' : ''}
5. ${!hasImages ? '이미지가 0개입니다. Google Image 검색 노출 기회가 없다는 점과, 히어로 영역에 대표 이미지 추가를 제안하세요.' : ''}
6. ${keywordsCount > 15 ? `키워드가 ${keywordsCount}개로 많습니다. 5~10개로 줄이고 핵심 키워드에 집중하라고 안내하세요.` : ''}

한국어로 응답하세요.`

  const userPrompt = `아래 사이트를 분석해주세요.

**URL:** ${p.url}

**파싱 데이터:**
- 상태코드: ${p.statusCode} | 로딩: ${p.loadTimeMs}ms | HTML: ${(p.htmlSize / 1024).toFixed(1)}KB | 단어: ${p.wordCount}
- HTTPS: ${p.isHttps ? 'O' : 'X'} | 리다이렉트: ${p.redirectCount > 0 ? (p.redirectIsWww ? 'www정규화' : p.redirectCount + '회') : '없음'}
- 텍스트/HTML: ${p.textToHtmlRatio}% | URL깊이: ${p.urlDepth}단계

**메타:** Title="${p.title || ''}"(${p.titleLength}자) | Desc="${(p.metaDescription || '').slice(0, 60)}"(${p.metaDescriptionLength}자)
Keywords: ${p.metaKeywords ? p.metaKeywords.split(',').length + '개' : '없음'} | Canonical: ${p.canonical ? 'O' : 'X'} | Robots: ${p.hasRobotsMeta || '없음'} | Lang: ${p.lang || 'X'}

**구조:** H1=${p.h1.length}개 H2=${p.h2.length}개 H3=${p.h3Count}개 | 중복H1: ${p.duplicateH1 ? 'O' : 'X'}

**링크:** 내부=${p.internalLinks} 외부=${p.externalLinks} nofollow=${p.nofollowLinks} | 이미지=${p.imgTotal} alt미설정=${p.imgWithoutAlt} | iframe=${p.hasIframes}

**기술:** Viewport=${p.hasViewport ? 'O' : 'X'} Charset=${p.hasCharset ? 'O' : 'X'} Favicon=${p.hasFavicon ? 'O' : 'X'} Gzip=${p.hasGzip ? 'O' : 'X'} HSTS=${p.hasHsts ? 'O' : 'X'}
인라인CSS=${(p.inlineCssSize / 1024).toFixed(1)}KB 인라인JS=${(p.inlineJsSize / 1024).toFixed(1)}KB | Deprecated: ${p.hasDeprecatedTags.length > 0 ? p.hasDeprecatedTags.join(',') : '없음'}

**소셜:** OG(title=${p.hasOgTitle ? 'O' : 'X'} desc=${p.hasOgDescription ? 'O' : 'X'} img=${p.hasOgImage ? 'O' : 'X'}) Twitter=${p.hasTwitterCard ? 'O' : 'X'}
JSON-LD: ${p.hasStructuredData ? p.structuredDataTypes.join(', ') : '없음'} | Hreflang: ${p.hasHreflang ? 'O' : 'X'}

아래 형식으로 응답하세요.

## SEO 점수: [${autoScore}점 기준 ±10 조정]

### 잘된 점
- **[항목명]**: 구체적 수치와 함께 왜 좋은지 설명 (각 2~3문장)

### 개선 필요
- **[항목명]**: 현재 문제점(수치 포함) → 구체적 수정 방법 → 수정 시 기대 효과 (각 3~4문장)

### 핵심 권장사항
1. **[제목]**: 구체적 액션과 코드/설정 예시 포함.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 4000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || '분석 결과를 생성하지 못했습니다.'
}

/**
 * URL을 받아 HTML 가져오기 + 파싱 + AI 분석까지 한번에 수행
 */
export async function fetchAndAnalyze(url: string): Promise<{
  parsed: ParsedSeo
  analysis: string
  score: number | null
}> {
  // Normalize URL
  let targetUrl = url.trim()
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl
  }

  // Fetch HTML
  const start = Date.now()
  const res = await fetch(targetUrl, {
    signal: AbortSignal.timeout(10000),
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; BacklinkShopBot/1.0; +https://www.backlinkshop.co.kr)',
      Accept: 'text/html',
    },
    redirect: 'follow',
  })
  const loadTime = Date.now() - start
  const headers = Object.fromEntries(res.headers.entries())
  const html = await res.text()

  // Parse
  const parsed = parseHtml(html, targetUrl, res.url, res.status, loadTime, headers)

  // Analyze with OpenAI
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY 환경변수가 설정되지 않았습니다')
  }

  const analysis = await analyzeSeo(apiKey, parsed)

  // Extract score
  let score: number | null = null
  const scoreMatch = analysis.match(/##\s*SEO\s*점수[:\s]*(\d{1,3})\s*점/)
  if (scoreMatch) {
    const n = parseInt(scoreMatch[1], 10)
    if (n >= 0 && n <= 100) score = n
  }

  return { parsed, analysis, score }
}
