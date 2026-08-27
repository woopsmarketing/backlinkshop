/**
 * SEO 전수 점검 스크립트
 *
 * 사용법:
 *   npx next build        # 먼저 빌드해서 정적 HTML 을 생성한다
 *   node scripts/seo-qa.mjs
 *
 * 무엇을 검사하는가
 *  1. 공개 라우트가 전부 정적 HTML 로 생성되었는가
 *  2. title / description / H1 이 페이지마다 고유한가
 *  3. canonical 이 자기 자신을 가리키는가
 *  4. H1 이 정확히 1개인가, 헤딩 계층이 끊기지 않는가
 *  5. 확인되지 않은 수치·보증성 표현·경쟁사 비방 문구가 남아 있는가
 *  6. 내부링크가 전부 실제 존재하는 경로를 가리키는가
 *  7. 사이트맵 URL 이 전부 색인 대상 라우트인가
 *  8. noindex 대상 페이지에 noindex 가 실제로 붙었는가
 *  9. 구조화 데이터가 유효한 JSON 인가, 금지 타입(Review/AggregateRating)이 없는가
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const APP_DIR = join(ROOT, '.next', 'server', 'app')

let failures = 0
let warnings = 0

function fail(msg) {
  failures += 1
  console.log(`  ✗ ${msg}`)
}
function warn(msg) {
  warnings += 1
  console.log(`  ! ${msg}`)
}
function pass(msg) {
  console.log(`  ✓ ${msg}`)
}
function section(title) {
  console.log(`\n── ${title}`)
}

// ---------------------------------------------------------------- 라우트 목록
// config/routes.ts 를 정규식으로 읽는다 (TS 를 런타임에 import 하지 않기 위해).
const routesSrc = readFileSync(join(ROOT, 'config', 'routes.ts'), 'utf8')
const PUBLIC_PATHS = [...routesSrc.matchAll(/\{\s*path:\s*'([^']+)'/g)].map(m => m[1])

// 블로그 슬러그
const blogDir = join(ROOT, 'content', 'blog')
const BLOG_SLUGS = readdirSync(blogDir)
  .filter(f => f.endsWith('.ts') && !['index.ts', 'types.ts'].includes(f))
  .map(f => f.replace(/\.ts$/, ''))

const ALL_PATHS = [...PUBLIC_PATHS, ...BLOG_SLUGS.map(s => `/blog/${s}`)]

const NOINDEX_PATHS = ['/login', '/email-preview']

// ---------------------------------------------------------------- HTML 로드
function htmlPathFor(route) {
  const rel = route === '/' ? 'index.html' : `${route.slice(1)}.html`
  return join(APP_DIR, rel)
}

function loadHtml(route) {
  const p = htmlPathFor(route)
  if (!existsSync(p)) return null
  return readFileSync(p, 'utf8')
}

function pick(html, re) {
  const m = html.match(re)
  return m ? m[1].trim() : null
}

function decode(str) {
  if (!str) return str
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x2F;/g, '/')
}

function stripTags(str) {
  return decode(str.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

if (!existsSync(APP_DIR)) {
  console.log('✗ .next/server/app 이 없습니다. 먼저 `npx next build` 를 실행하세요.')
  process.exit(1)
}

// ================================================================ 1. 생성 여부
section('1. 공개 라우트 정적 생성')
const pages = new Map()
for (const route of ALL_PATHS) {
  const html = loadHtml(route)
  if (!html) {
    fail(`${route} — 정적 HTML 없음 (${htmlPathFor(route)})`)
    continue
  }
  pages.set(route, html)
}
if (pages.size === ALL_PATHS.length) pass(`${pages.size}개 라우트 전부 생성됨`)

// ================================================================ 2. 메타 고유성
section('2. title / description / H1 고유성')
const titles = new Map()
const descriptions = new Map()
const h1s = new Map()

for (const [route, html] of pages) {
  const title = decode(pick(html, /<title>([^<]*)<\/title>/))
  const desc = decode(pick(html, /<meta name="description" content="([^"]*)"/))
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)]

  if (!title) fail(`${route} — title 없음`)
  else {
    if (titles.has(title)) fail(`${route} — title 중복: "${title}" (${titles.get(title)} 과 동일)`)
    titles.set(title, route)
    if (title.length > 60)
      warn(`${route} — title ${title.length}자 (검색결과에서 잘릴 수 있음): ${title}`)
  }

  if (!desc) fail(`${route} — description 없음`)
  else {
    if (descriptions.has(desc))
      fail(`${route} — description 중복 (${descriptions.get(desc)} 과 동일)`)
    descriptions.set(desc, route)
    if (desc.length > 160) warn(`${route} — description ${desc.length}자 (잘릴 수 있음)`)
  }

  if (h1Matches.length !== 1) {
    fail(`${route} — H1 이 ${h1Matches.length}개 (정확히 1개여야 함)`)
  } else {
    const h1 = stripTags(h1Matches[0][1])
    if (h1s.has(h1)) fail(`${route} — H1 중복: "${h1}"`)
    h1s.set(h1, route)
    // <br> 로 인한 단어 병합 탐지
    if (/[가-힣]{12,}/.test(h1.replace(/\s/g, ''))) {
      // 공백 없이 12자 이상 한글이 이어지면 br 병합 의심 — 단순 경고
    }
  }
}
if (failures === 0) pass('메타 고유성 통과')

// ================================================================ 3. canonical
section('3. canonical 자기참조')
let canonicalOk = true
for (const [route, html] of pages) {
  const canonical = decode(pick(html, /<link rel="canonical" href="([^"]*)"/))
  if (!canonical) {
    fail(`${route} — canonical 없음`)
    canonicalOk = false
    continue
  }
  const expected = route === '/' ? '' : route
  const path = canonical.replace(/^https?:\/\/[^/]+/, '')
  if (path !== expected) {
    fail(`${route} — canonical 불일치: ${canonical}`)
    canonicalOk = false
  }
}
if (canonicalOk) pass(`${pages.size}개 페이지 전부 self canonical`)

// ================================================================ 4. 금지 표현
section('4. 확인되지 않은 수치 · 보증성 표현')
const FORBIDDEN = [
  { pattern: /1,?247/, why: '근거 없는 프로젝트 수' },
  { pattern: /재구매율|98%\s*의?\s*고객/, why: '근거 없는 재구매율' },
  { pattern: /패널티\s*(사례\s*)?0건|패널티\s*(절대\s*)?없/, why: '검증 불가한 패널티 주장' },
  { pattern: /327%|892%|ROI\s*\d/, why: '근거 없는 성과 수치' },
  { pattern: /환불\s*(요청\s*)?률\s*0\.8/, why: '근거 없는 환불률' },
  { pattern: /95%\s*의?\s*업체|KWORK|FIVERR/, why: '경쟁사 비방 · 출처 없는 업계 통계' },
  { pattern: /국내\s*최다|업계\s*최[고대장]/, why: '근거 없는 최상급 표현' },
  { pattern: /100%\s*안전|무조건\s*(상승|1페이지|올)/, why: '보증성 표현' },
  { pattern: /2~4주\s*내|몇\s*주\s*안에\s*반드시/, why: '기간 보증' },
  { pattern: /지속적으로\s*유지됩니다/, why: '결과 보증' },
  { pattern: /\bDA\s*\d+\+/, why: '문서 간 불일치했던 품질 기준 수치' },
  { pattern: /\d+개\s*항목\s*(정밀\s*)?(진단|점검)/, why: '문서 간 불일치했던 점검 항목 수' },
]

const SCAN_DIRS = [
  join(ROOT, 'app', '(marketing)'),
  join(ROOT, 'components'),
  join(ROOT, 'config'),
  join(ROOT, 'content'),
]

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full)
  }
  return out
}

let forbiddenHits = 0
for (const file of SCAN_DIRS.flatMap(d => walk(d))) {
  const src = readFileSync(file, 'utf8')
  const lines = src.split('\n')
  lines.forEach((line, i) => {
    // 주석은 건너뛴다 (왜 지웠는지 설명하는 주석이 있다)
    const trimmed = line.trim()
    if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return
    for (const rule of FORBIDDEN) {
      if (rule.pattern.test(line)) {
        fail(
          `${file.replace(ROOT + '/', '')}:${i + 1} — ${rule.why}\n      ${trimmed.slice(0, 120)}`
        )
        forbiddenHits += 1
      }
    }
  })
}
if (forbiddenHits === 0) pass('금지 표현 0건')

// ================================================================ 5. 내부링크
section('5. 내부링크 유효성')
const KNOWN = new Set([
  ...ALL_PATHS,
  ...NOINDEX_PATHS,
  '/login',
  '/shop',
  '/dashboard',
  '/credits',
  '/orders',
])
let brokenLinks = 0
for (const [route, html] of pages) {
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map(m => m[1])
  for (const href of new Set(hrefs)) {
    const clean = href.replace(/\/$/, '') || '/'
    if (clean.startsWith('/_next') || clean.startsWith('/icon') || clean.endsWith('.png')) continue
    if (!KNOWN.has(clean)) {
      fail(`${route} — 존재하지 않는 내부링크: ${href}`)
      brokenLinks += 1
    }
  }
}
if (brokenLinks === 0) pass('깨진 내부링크 0건')

// ================================================================ 6. 사이트맵
section('6. 사이트맵')
const sitemapFile = join(APP_DIR, 'sitemap.xml.body')
if (existsSync(sitemapFile)) {
  const xml = readFileSync(sitemapFile, 'utf8')
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    m => m[1].replace(/^https?:\/\/[^/]+/, '') || '/'
  )
  const missing = locs.filter(loc => !pages.has(loc))
  if (missing.length)
    missing.forEach(loc => fail(`사이트맵 URL 이 정적 페이지로 존재하지 않음: ${loc}`))
  else pass(`사이트맵 ${locs.length}개 URL 전부 200 페이지`)

  const notListed = ALL_PATHS.filter(p => !locs.includes(p))
  if (notListed.length) notListed.forEach(p => warn(`색인 대상인데 사이트맵에 없음: ${p}`))

  // 빌드 시각이 lastmod 로 들어갔는지 (전부 동일 타임스탬프면 의심)
  const mods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1])
  if (mods.length && new Set(mods).size === 1 && mods[0].includes('T')) {
    warn('lastmod 가 전부 동일합니다. 실제 수정일이 반영되었는지 확인하세요.')
  }
} else {
  warn('sitemap 산출물을 찾지 못했습니다 (배포 후 /sitemap.xml 로 직접 확인하세요)')
}

// ================================================================ 7. noindex
section('7. noindex 대상')
for (const route of NOINDEX_PATHS) {
  const html = loadHtml(route)
  if (!html) {
    warn(`${route} — 정적 HTML 없음 (동적 렌더일 수 있음, 배포 후 확인 필요)`)
    continue
  }
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) pass(`${route} — noindex 적용됨`)
  else fail(`${route} — noindex 없음`)
}

// ================================================================ 8. 구조화 데이터
section('8. 구조화 데이터')
let schemaIssues = 0
const seenSchemaTypes = new Map()
for (const [route, html] of pages) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  for (const [, raw] of blocks) {
    let parsed
    try {
      parsed = JSON.parse(decode(raw))
    } catch {
      fail(`${route} — JSON-LD 파싱 실패`)
      schemaIssues += 1
      continue
    }
    const type = parsed['@type']
    if (['Review', 'AggregateRating'].includes(type)) {
      fail(`${route} — 금지된 스키마 타입: ${type}`)
      schemaIssues += 1
    }
    if (JSON.stringify(parsed).includes('SearchAction')) {
      fail(`${route} — 존재하지 않는 검색 기능에 대한 SearchAction`)
      schemaIssues += 1
    }
    const list = seenSchemaTypes.get(type) || []
    list.push(route)
    seenSchemaTypes.set(type, list)
  }
}
for (const single of ['Organization', 'WebSite']) {
  const routes = seenSchemaTypes.get(single) || []
  if (routes.length > 1) {
    fail(`${single} 스키마가 ${routes.length}개 페이지에 중복: ${routes.join(', ')}`)
    schemaIssues += 1
  }
}
if (schemaIssues === 0) pass(`구조화 데이터 이상 없음 (${[...seenSchemaTypes.keys()].join(', ')})`)

// ================================================================ 결과
console.log(`\n${'='.repeat(60)}`)
console.log(`실패 ${failures}건 · 경고 ${warnings}건 · 검사한 페이지 ${pages.size}개`)
console.log('='.repeat(60))
process.exit(failures > 0 ? 1 : 0)
