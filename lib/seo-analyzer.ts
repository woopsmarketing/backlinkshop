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
  textContentSample: string
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
    textContentSample: textContent.replace(/\s+/g, ' ').trim().slice(0, 800),
  }
}

export async function analyzeSeo(
  apiKey: string,
  p: ParsedSeo,
  targetKeywords?: string
): Promise<string> {
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

  // 키워드 관련 분석 정보
  const keywordList = targetKeywords
    ? targetKeywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean)
    : []
  const keywordInfo =
    keywordList.length > 0
      ? `
## 고객 타겟 키워드: "${keywordList.join(', ')}"
- Title에 키워드 포함 여부: ${keywordList.some(k => (p.title || '').includes(k)) ? '포함됨' : '미포함'}
- Description에 키워드 포함 여부: ${keywordList.some(k => (p.metaDescription || '').includes(k)) ? '포함됨' : '미포함'}
- H1에 키워드 포함 여부: ${keywordList.some(k => p.h1.some(h => h.includes(k))) ? '포함됨' : '미포함'}
- 본문 콘텐츠에 키워드 포함 여부: ${keywordList.some(k => p.textContentSample.includes(k)) ? '포함됨' : '미포함'}
→ 이 키워드가 Title, Description, H1, 본문에 얼마나 잘 반영되어 있는지를 반드시 평가하세요.`
      : ''

  const systemPrompt = `당신은 백링크샵의 시니어 SEO 컨설턴트입니다. 고객의 사이트를 직접 들여다본 뒤, 전문가가 손수 작성한 것처럼 친근하면서도 전문적인 진단 리포트를 작성합니다.

## 톤 & 스타일
- "~네요", "~보입니다", "~한 상태입니다" 등 사람이 대화하듯 자연스러운 존댓말을 사용하세요.
- "결론적으로", "따라서" 같은 딱딱한 접속사 대신 자연스러운 문장 전환을 사용하세요.
- 마치 옆에 앉아서 화면을 같이 보면서 설명해주는 느낌으로 작성하세요.
- 구체적인 숫자를 반드시 언급하되, 전문 용어는 괄호 안에 쉬운 설명을 덧붙이세요.

## 절대 금지
1. HTML/CSS/JavaScript 코드 블록(백틱 코드)을 절대 쓰지 마세요. 고객은 개발자가 아닙니다.
2. "AI", "자동 분석", "알고리즘", "GPT", "LLM" 등 기계적 표현을 절대 쓰지 마세요.
3. "~하세요", "~해주세요" 같은 직접적인 지시/해결법은 쓰지 마세요. 대신 "~한 상태입니다. 이 부분이 개선되면 ~효과를 기대할 수 있습니다" 형식으로 현황+기대효과만 전달하세요.
4. 파싱 데이터에 없는 내용을 추측하지 마세요.
5. "SEO 모니터링 도구 활용", "정기적 검토" 같은 일반론은 쓰지 마세요.
6. 단일 언어 사이트(lang="${p.lang || 'ko'}")에 hreflang 추가를 언급하지 마세요. ${isSingleLang ? '이 사이트는 단일 언어입니다.' : ''}
7. 프레임워크 특성을 문제로 지적하지 마세요:
   - 텍스트/HTML 비율 < 10% + 단어 수 ≥ 300 → SSR 프레임워크 (정상)
   - 인라인 JS > 50KB → 프레임워크 데이터 (정상)
   - Cache-Control: no-cache → 동적 페이지 (정상)

## 채점 규칙
- 기본 점수: ${autoScore}점 (${passCount}/${totalChecks} 항목 통과). ±10점 범위 내 조정.
- "양호" 판정된 항목은 "개선이 필요한 부분"에 넣지 마세요.

## 판정 기준 (${isKorean ? '한글' : '영문'} 사이트)
HTTPS:${checks.https ? '양호' : '개선'} | 상태코드:${checks.status ? '양호' : '개선'} | 속도:${checks.speed ? '양호' : '개선'} | Title:${checks.title ? '양호' : '개선'} | Desc:${checks.desc ? '양호' : '개선'} | Canonical:${checks.canonical ? '양호' : '개선'} | H1:${checks.h1 ? '양호' : '개선'} | OG:${checks.ogTags ? '양호' : '개선'} | JSON-LD:${checks.jsonLd ? '양호' : '개선'} | Gzip:${checks.gzip ? '양호' : '개선'}
${keywordInfo}

## 응답 구조 규칙

### "잘 되어있는 부분"
- 양호 항목 중 SEO 영향이 큰 3~5개를 선별
- 각 항목 2~3문장: 현재 상태 → 왜 좋은지 → 유지하면 좋은 이유
${keywordList.length > 0 ? '- 타겟 키워드가 Title/H1에 잘 포함되어 있다면 이 점도 언급하세요' : ''}

### "개선이 필요한 부분"
- 각 항목 3~5문장:
  1. 현재 상태를 수치와 함께 설명
  2. 이로 인해 검색 결과에서 어떤 불이익이 있는지
  3. 개선되면 어떤 효과를 기대할 수 있는지
- 코드 예시나 해결 방법은 쓰지 마세요. 문제가 무엇인지만 명확하게 전달하세요.
${keywordList.length > 0 ? '- 타겟 키워드가 Title/Description/H1/본문에 부족하다면 구체적으로 어느 곳에 부족한지 언급하세요' : ''}
${!hasExternalLinks ? '- 외부 링크가 0개인 점도 언급하세요. 검색 엔진은 관련 권위 사이트로의 자연스러운 링크가 있는 페이지를 더 신뢰합니다.' : ''}
${!hasImages ? '- 이미지가 0개인 점도 언급하세요. Google Image 검색을 통한 유입 기회가 없는 상태입니다.' : ''}

### "종합 의견"
- 3~4문장으로 전체를 아우르는 평가
- "귀하의 사이트는~" 으로 시작
- 현재 잘 되어있는 점을 인정하고, 핵심 개선 포인트 1~2개를 요약
- 마지막에 "이러한 부분이 개선되면 구글 검색 결과에서 더 좋은 성과를 기대할 수 있습니다" 같은 긍정적 마무리

한국어로 응답하세요.`

  const userPrompt = `아래 사이트를 점검했습니다. 진단 리포트를 작성해주세요.

**사이트:** ${p.url}
${keywordList.length > 0 ? `**고객 타겟 키워드:** ${keywordList.join(', ')}` : ''}

**기본:** 상태코드 ${p.statusCode} | 로딩 ${p.loadTimeMs}ms | HTML ${(p.htmlSize / 1024).toFixed(1)}KB | 단어 ${p.wordCount}개 | HTTPS ${p.isHttps ? '적용' : '미적용'} | 텍스트비율 ${p.textToHtmlRatio}% | URL깊이 ${p.urlDepth}단계

**메타:** Title="${p.title || ''}"(${p.titleLength}자) | Desc="${(p.metaDescription || '').slice(0, 80)}"(${p.metaDescriptionLength}자) | Canonical=${p.canonical ? '있음' : '없음'} | Lang=${p.lang || '없음'}

**구조:** H1=${p.h1.length}개${p.h1[0] ? '("' + p.h1[0].slice(0, 50) + '")' : ''} | H2=${p.h2.length}개 | H3=${p.h3Count}개

**링크:** 내부=${p.internalLinks} 외부=${p.externalLinks} nofollow=${p.nofollowLinks} | 이미지=${p.imgTotal}(alt없음=${p.imgWithoutAlt})

**기술:** Viewport=${p.hasViewport ? 'O' : 'X'} Charset=${p.hasCharset ? 'O' : 'X'} Favicon=${p.hasFavicon ? 'O' : 'X'} Gzip=${p.hasGzip ? 'O' : 'X'} HSTS=${p.hasHsts ? 'O' : 'X'}

**소셜:** OG(t=${p.hasOgTitle ? 'O' : 'X'} d=${p.hasOgDescription ? 'O' : 'X'} i=${p.hasOgImage ? 'O' : 'X'}) Twitter=${p.hasTwitterCard ? 'O' : 'X'} JSON-LD=${p.hasStructuredData ? p.structuredDataTypes.join(',') : '없음'}

**본문 내용 일부:**
${p.textContentSample.slice(0, 500)}

아래 형식으로 작성해주세요.

## SEO 점수: [${autoScore}점 기준 ±10 조정]점

### 잘 되어있는 부분
- **[항목명]**: 현재 상태 → 왜 좋은지 → 유지 이유 (각 2~3문장, 자연스러운 톤)

### 개선이 필요한 부분
- **[항목명]**: 현재 상태(수치) → 검색 결과에서의 불이익 → 개선 시 기대 효과 (각 3~5문장, 코드 없이)

### 종합 의견
전반적 평가와 핵심 개선 포인트 요약 (3~4문장)`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 6000,
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
export async function fetchAndAnalyze(
  url: string,
  keywords?: string
): Promise<{
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

  const analysis = await analyzeSeo(apiKey, parsed, keywords)

  // Extract score
  let score: number | null = null
  const scoreMatch = analysis.match(/##\s*SEO\s*점수[:\s]*(\d{1,3})\s*점/)
  if (scoreMatch) {
    const n = parseInt(scoreMatch[1], 10)
    if (n >= 0 && n <= 100) score = n
  }

  return { parsed, analysis, score }
}
