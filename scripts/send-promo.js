// 50% 한정 할인 캠페인 메일 발송 스크립트 (2026-06-21, rev3)
//
// 개인화 출처: lp_requests(무료 SEO 진단) — 고객이 직접 넣은 keyword + url + status.
// 변형 3종: personalized / failed / generic.
// 하단 LP 버튼: /lp/{backlink,audit,agency,rank,black} 중 랜덤 + UTM(GA4 추적).
//
// 대상: all(가입∪진단 ~321) | leads(진단만 ~244) | registered(가입만 ~84)
//
// 사용법:
//   node scripts/send-promo.js --preview
//   node scripts/send-promo.js --list [audience]
//   node scripts/send-promo.js --test-variants you@x.com   # 3종 내 메일로
//   node scripts/send-promo.js --send <all|leads|registered>

/* eslint-disable no-console */
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const CAMPAIGN = {
  brand: '백링크샵',
  discountPercent: 50,
  telegramUrl: 'https://t.me/goat82',
  telegramId: '@goat82',
  kmongUrl: 'https://kmong.com/gig/385229',
  replyEmail: 'vnfm0580@gmail.com',
  fromName: '백링크샵',
}

// LP A/B: 5종 랜덤 + GA4 UTM
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.backlinkshop.co.kr').replace(
  /\/$/,
  ''
)
const LP_PATHS = ['backlink', 'audit', 'agency', 'rank', 'black']
const LP_UTM_CAMPAIGN = 'promo-2026-06-50off'
function pickLp() {
  const p = LP_PATHS[Math.floor(Math.random() * LP_PATHS.length)]
  const url = `${SITE}/lp/${p}?utm_source=email&utm_medium=promo&utm_campaign=${LP_UTM_CAMPAIGN}&utm_content=lp-${p}`
  return { path: p, url }
}

// 발송 완료 기록(재개용) — 이미 보낸 사람은 다음 실행 때 자동 제외
const SENT_FILE = path.join(__dirname, '..', '.promo-sent.txt')
function loadSent() {
  try {
    return new Set(
      fs
        .readFileSync(SENT_FILE, 'utf8')
        .split(/\r?\n/)
        .map(s => s.trim().toLowerCase())
        .filter(Boolean)
    )
  } catch {
    return new Set()
  }
}
function markSent(email) {
  try {
    fs.appendFileSync(SENT_FILE, email.toLowerCase() + '\n')
  } catch {}
}
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

const esc = s =>
  String(s || '').replace(
    /[&<>"]/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  )
const host = u =>
  String(u || '')
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .replace(/^www\./, '')
const firstKw = kw =>
  String(kw || '')
    .split(/[,\n]/)[0]
    .trim()
    .slice(0, 30)

function subjectFor({ variant, keyword, site }) {
  const sh = host(site)
  const kw = firstKw(keyword)
  if (variant === 'failed') return `${sh} 무료진단, 제가 직접 다시 봐드릴게요`
  if (variant === 'personalized') return `${sh} '${kw}' 상위노출, 지금이라면 가능합니다`
  return `상위노출, 방법이 완전히 바뀌었습니다`
}

// 최상단 히어로(첫 화면에 핵심+CTA — 이탈 방지)
function heroHtml(variant, keyword, site) {
  const c = CAMPAIGN
  const sh = esc(host(site))
  const kw = esc(firstKw(keyword))
  const acc = '#ff4d29' // 포인트 색(빨강~주황)
  let headline
  if (variant === 'personalized')
    headline = `<span style="color:${acc};">'${kw}'</span> 같은 키워드,<br>이미 여러 번 올려봤습니다`
  else if (variant === 'failed') headline = `${sh}, 정확한 주소로<br>다시 진단해드릴게요`
  else headline = `어떤 키워드든,<br>이제 상위노출이 쉬워졌습니다`
  return `<div style="background:#ffffff;border:1px solid #ffd9cc;border-radius:12px;padding:24px 22px;margin:0 0 22px 0;">
    <span style="display:inline-block;background:${acc};color:#ffffff;font-size:12px;font-weight:700;padding:4px 11px;border-radius:999px;margin-bottom:13px;">첫 구매 ${c.discountPercent}% 할인</span>
    <p style="margin:0 0 12px 0;font-size:22px;line-height:1.4;font-weight:800;color:#1a1a1a;">${headline}</p>
    <p style="margin:0 0 18px 0;color:#555;font-size:14.5px;line-height:1.6;">막혔던 키워드도, 새로 개발한 솔루션으로 다시 올립니다.</p>
    <a href="${c.telegramUrl}" style="display:inline-block;background:${acc};color:#ffffff;padding:13px 30px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">💬 텔레그램으로 1분 상담</a>
  </div>`
}

// 사회적 증거(키워드 있을 때만) — "1페이지 고객 N명"
function socialProofHtml(kw) {
  if (!kw) return ''
  return `<p style="margin:0 0 16px 0;background:#fff4f0;border-left:3px solid #ff4d29;border-radius:6px;padding:12px 14px;font-size:14.5px;color:#333;line-height:1.6;"><strong>'${kw}'</strong> 키워드, 저희가 이미 <strong>경험이 있는 영역</strong>입니다. 현재도 <strong>계약을 유지하며 상위에 노출 중인 고객</strong>을 보유하고 있습니다 :)</p>`
}
function socialProofText(kw) {
  if (!kw) return ''
  return `\n※ '${kw}' 키워드, 저희가 이미 경험이 있는 영역입니다. 현재도 계약을 유지하며 상위에 노출 중인 고객을 보유하고 있습니다 :)\n`
}

function introHtml(variant, keyword, site) {
  const kw = esc(firstKw(keyword))
  const sh = esc(host(site))
  if (variant === 'failed') {
    return `<p style="margin:0 0 16px 0;">안녕하세요, ${esc(CAMPAIGN.brand)}입니다.</p>
    <p style="margin:0 0 16px 0;">지난번 <strong>${sh}</strong> 무료 SEO 진단이 <strong>결과를 내지 못하고 실패</strong>로 표시됐습니다. 이런 경우는 보통 둘 중 하나예요 — <strong>주소(URL)를 잘못 입력</strong>하셨거나, 그 주소로 <strong>접속이 되지 않는</strong> 상태였던 경우입니다.</p>
    <p style="margin:0 0 16px 0;">정확한 주소만 알려주시면 <strong>제가 직접</strong> 다시 진단해드리겠습니다. ${kw ? `<strong>'${kw}'</strong> 키워드` : '원하시는 키워드'}, 새 솔루션이면 충분히 상위노출 가능합니다.</p>
    ${socialProofHtml(kw)}`
  }
  if (variant === 'personalized') {
    return `<p style="margin:0 0 16px 0;">안녕하세요, ${esc(CAMPAIGN.brand)}입니다.</p>
    <p style="margin:0 0 16px 0;">지난번 <strong>${sh}</strong> 무료 SEO 진단을 신청해주셨죠.</p>
    ${socialProofHtml(kw)}`
  }
  // generic — 사용자가 마음에 든다고 한 문구 유지 + 추가
  return `<p style="margin:0 0 16px 0;">안녕하세요, ${esc(CAMPAIGN.brand)}입니다.</p>
    <p style="margin:0 0 16px 0;">여기저기 SEO 작업을 맡겨도 효과가 없으셨다면, 이 소식 꼭 보셨으면 합니다.</p>
    <p style="margin:0 0 16px 0;">더 이상 무작정 백링크만 쌓는 시대가 아닙니다. 순위가 안 오르던 사이트도, 막힌 지점만 정확히 풀면 검색만으로 문의가 들어옵니다. 그 방식을 새로 완성했습니다.</p>`
}

function introText(variant, keyword, site) {
  const kw = firstKw(keyword)
  const sh = host(site)
  if (variant === 'failed') {
    return `안녕하세요, ${CAMPAIGN.brand}입니다.\n\n지난번 ${sh} 무료 SEO 진단이 결과를 내지 못하고 실패로 표시됐습니다. 보통 주소(URL)를 잘못 입력하셨거나, 그 주소로 접속이 안 되는 상태였던 경우입니다.\n정확한 주소만 알려주시면 제가 직접 다시 진단해드리겠습니다. ${kw ? `'${kw}' 키워드` : '원하시는 키워드'}, 새 솔루션이면 충분히 가능합니다.\n${socialProofText(kw)}`
  }
  if (variant === 'personalized') {
    return `안녕하세요, ${CAMPAIGN.brand}입니다.\n\n지난번 ${sh} 무료 SEO 진단을 신청해주셨죠.\n${socialProofText(kw)}`
  }
  return `안녕하세요, ${CAMPAIGN.brand}입니다.\n\n여기저기 SEO 작업을 맡겨도 효과가 없으셨다면 이 소식 꼭 보셨으면 합니다.\n더 이상 무작정 백링크만 쌓는 시대가 아닙니다. 막힌 지점만 정확히 풀면 검색만으로 문의가 들어옵니다. 그 방식을 새로 완성했습니다.`
}

function buildHtml({ variant = 'generic', keyword = '', site = '', lpUrl = '', uid = '' } = {}) {
  const c = CAMPAIGN
  const lp = lpUrl || pickLp().url
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;">
<span style="display:none!important;max-height:0;overflow:hidden;opacity:0;color:transparent;">ref:${uid}</span>
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Apple SD Gothic Neo',Arial,sans-serif;line-height:1.75;color:#222;max-width:560px;margin:0 auto;padding:28px 22px;font-size:15px;">

  <!-- 미니멀 브랜드 헤더(텍스트 워드마크 — 배달성 안전) -->
  <div style="border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:18px;">
    <span style="font-size:18px;font-weight:800;color:#111;letter-spacing:-.3px;">백링크샵</span>
    <span style="font-size:12px;color:#888;margin-left:6px;">SEO · 백링크 전문</span>
  </div>

  ${heroHtml(variant, keyword, site)}

  ${introHtml(variant, keyword, site)}

  <!-- 새 솔루션 강조 카드 -->
  <div style="margin:6px 0 18px 0;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#111;color:#fff;padding:14px 18px;font-weight:700;font-size:16px;">🚀 새로운 솔루션을 개발했습니다</div>
    <div style="padding:16px 18px;background:#fafbfc;">
      <p style="margin:0 0 14px 0;color:#444;">어떤 키워드든 상위노출이 훨씬 쉬워졌습니다. 무엇이 다른지 보세요.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14.5px;">
        <tr><td style="padding:6px 0;vertical-align:top;width:22px;color:#16a34a;font-weight:800;">✓</td><td style="padding:6px 0;"><strong>국내 최초 PBN 자체 IP 호스팅</strong> — 모든 사이트에 독립 IP를 적용한 최고 품질</td></tr>
        <tr><td style="padding:6px 0;vertical-align:top;color:#16a34a;font-weight:800;">✓</td><td style="padding:6px 0;"><strong>풋프린트(footprint) 완전 제거</strong> — 구글이 패턴을 잡아내지 못하는 안전한 구조</td></tr>
        <tr><td style="padding:6px 0;vertical-align:top;color:#16a34a;font-weight:800;">✓</td><td style="padding:6px 0;"><strong>해외 SEO 대행사도 저희에게서 구매</strong> — 그들이 고객에게 파는 백링크를 저희가 직접 공급하는 도매 품질</td></tr>
        <tr><td style="padding:6px 0;vertical-align:top;color:#16a34a;font-weight:800;">✓</td><td style="padding:6px 0;"><strong>최신 구글 알고리즘 대응 내부 최적화</strong> — 백링크와 온페이지를 동시에</td></tr>
        <tr><td style="padding:6px 0;vertical-align:top;color:#16a34a;font-weight:800;">✓</td><td style="padding:6px 0;"><strong>고권위·실트래픽 도메인 기반</strong> — 죽은 링크가 아닌, 살아있는 링크</td></tr>
        <tr><td style="padding:6px 0;vertical-align:top;color:#16a34a;font-weight:800;">✓</td><td style="padding:6px 0;"><strong>효과는 이미 여러 사이트에서 입증</strong></td></tr>
      </table>
    </div>
  </div>

  <!-- 신청 방법 (단일 CTA 블록 — 중복 제거) -->
  <div style="border-top:1px solid #eee;padding-top:20px;margin-top:8px;">
    <p style="margin:0 0 10px 0;font-weight:700;font-size:16px;">📩 신청은 간단합니다</p>
    <p style="margin:0 0 14px 0;color:#444;">사이트 주소와 키워드만 <a href="${c.telegramUrl}" style="color:#0088cc;font-weight:700;text-decoration:none;">텔레그램 ${c.telegramId}</a> 로 보내주시면 바로 도와드립니다.</p>
    <p style="margin:0 0 8px 0;">
      <a href="${c.kmongUrl}" style="display:inline-block;background:#ff5b36;color:#fff;padding:12px 26px;border-radius:8px;text-decoration:none;font-weight:700;">🛒 크몽에서 신청하기</a>
      <span style="color:#888;font-size:13px;margin-left:8px;">텔레그램이 없으실 때</span>
    </p>
    <p style="margin:10px 0 0 0;color:#555;font-size:14px;">이 메일에 그대로 <strong>답장</strong>하셔도 됩니다.</p>
  </div>

  <!-- LP: 무료 진단 (랜덤 + GA4 UTM) -->
  <div style="margin:22px 0 6px 0;padding:18px;background:#f7f7f8;border-radius:8px;text-align:center;">
    <p style="margin:0 0 6px 0;color:#1a1a1a;font-weight:700;">업그레이드된 백링크샵에서 웹사이트 진단을 더 꼼꼼하게 받아보세요!</p>
    <p style="margin:0 0 12px 0;color:#555;font-size:14px;">내 사이트가 어디서 막혔는지 <strong>1분 무료 진단</strong>으로 확인하세요.</p>
    <a href="${lp}" style="display:inline-block;background:#111;color:#fff;padding:12px 26px;border-radius:8px;text-decoration:none;font-weight:600;">내 사이트 무료 진단 받기</a>
  </div>

  <p style="margin:22px 0 0 0;color:#888;font-size:12px;">
    ${esc(c.brand)} · <a href="mailto:${c.replyEmail}" style="color:#888;">${c.replyEmail}</a><br>
    수신을 원치 않으시면 '수신거부'라고 답장해 주세요.
  </p>
</div></body></html>`
}

function buildText({ variant = 'generic', keyword = '', site = '', lpUrl = '' } = {}) {
  const c = CAMPAIGN
  const lp = lpUrl || pickLp().url
  return `[ 어떤 키워드든 상위노출이 쉬워졌습니다 — 첫 구매 ${c.discountPercent}% 할인 ]
지금 상담: 텔레그램 ${c.telegramId} → ${c.telegramUrl}

${introText(variant, keyword, site)}

[ 새로운 솔루션을 개발했습니다 ] 어떤 키워드든 상위노출이 훨씬 쉬워졌습니다.
- 국내 최초 PBN 자체 IP 호스팅 — 모든 사이트에 독립 IP 적용, 최고 품질
- 풋프린트(footprint) 완전 제거 — 구글이 패턴을 잡아내지 못하는 안전한 구조
- 해외 SEO 대행사도 저희에게서 구매 — 그들이 고객에게 파는 백링크를 직접 공급하는 도매 품질
- 최신 구글 알고리즘 대응 내부 최적화 — 백링크와 온페이지를 동시에
- 고권위·실트래픽 도메인 기반 — 죽은 링크가 아닌 살아있는 링크
- 효과는 이미 여러 사이트에서 입증되었습니다

신청: 사이트 주소와 키워드만 텔레그램 ${c.telegramId} (${c.telegramUrl}) 로 보내주세요.
텔레그램이 없으시면 크몽: ${c.kmongUrl}
이 메일에 그대로 답장하셔도 됩니다.

업그레이드된 백링크샵에서 웹사이트 진단을 더 꼼꼼하게! 내 사이트 1분 무료 진단: ${lp}

${c.brand} · ${c.replyEmail}
수신을 원치 않으시면 '수신거부'라고 답장해 주세요.`
}

async function getRecipients(audience = 'all') {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('SUPABASE env 누락')
  const sb = createClient(url, key, { auth: { persistSession: false } })

  const reg = new Set()
  let page = 1
  for (;;) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw new Error('listUsers 실패: ' + error.message)
    const us = data.users || []
    for (const u of us) if (u.email && u.email_confirmed_at) reg.add(u.email.toLowerCase())
    if (us.length < 1000) break
    page++
  }

  const { data: lp } = await sb
    .from('lp_requests')
    .select('email,url,keyword,status,created_at')
    .order('created_at', { ascending: false })
  const lpByEmail = new Map()
  for (const r of lp || []) {
    const e = (r.email || '').toLowerCase()
    if (e && !lpByEmail.has(e)) lpByEmail.set(e, r)
  }

  let emails
  if (audience === 'registered') emails = new Set(reg)
  else if (audience === 'leads') emails = new Set(lpByEmail.keys())
  else emails = new Set([...reg, ...lpByEmail.keys()])

  const sent = loadSent()
  return [...emails]
    .filter(email => validEmail(email) && !sent.has(email))
    .map(email => {
      const r = lpByEmail.get(email)
      let variant = 'generic',
        keyword = '',
        site = ''
      if (r && r.status === 'failed') {
        variant = 'failed'
        keyword = r.keyword
        site = r.url
      } else if (r) {
        variant = 'personalized'
        keyword = r.keyword
        site = r.url
      }
      return { email, variant, keyword, site }
    })
}

function resendReady() {
  const k = process.env.RESEND_API_KEY || ''
  const from = process.env.RESEND_FROM_EMAIL || ''
  if (!k || k.includes('xxx') || k.includes('your') || k === 're_dummy_build_check_only')
    return { ok: false, why: 'RESEND_API_KEY가 비었거나 플레이스홀더입니다.' }
  if (!from || from.includes('yourdomain') || from.includes('example'))
    return { ok: false, why: 'RESEND_FROM_EMAIL이 인증된 발신 도메인이 아닙니다.' }
  return { ok: true, from }
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 1))

async function sendBatch(
  recipients,
  {
    tagVariantInSubject = false,
    minDelayMs = 600,
    maxDelayMs = 600,
    batchSize = 0,
    batchPauseMs = 0,
    recordSent = false,
  } = {}
) {
  const ready = resendReady()
  if (!ready.ok) {
    console.error('\n🚫 발송 불가:', ready.why)
    process.exit(1)
  }
  const { Resend } = require('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  let ok = 0,
    fail = 0
  const lpDist = {}
  console.log(`\n📤 발송: ${recipients.length}명 (from: ${ready.from})`)
  for (let i = 0; i < recipients.length; i++) {
    const r = recipients[i]
    const lp = pickLp() // 수신자마다 랜덤 LP
    lpDist[lp.path] = (lpDist[lp.path] || 0) + 1
    const uid = `${i}-${Math.random().toString(36).slice(2, 10)}` // 메일마다 고유 → Gmail 중복접힘 방지
    let subject = subjectFor(r)
    if (tagVariantInSubject) subject = `[${r.variant}] ${subject}`
    try {
      const { error } = await resend.emails.send({
        from: `${CAMPAIGN.fromName} <${ready.from}>`,
        to: [r.email],
        subject,
        html: buildHtml({ ...r, lpUrl: lp.url, uid }),
        text: buildText({ ...r, lpUrl: lp.url }),
        replyTo: CAMPAIGN.replyEmail,
      })
      if (error) {
        fail++
        console.error(`  ✗ ${r.email} — ${error.message}`)
      } else {
        ok++
        if (recordSent) markSent(r.email)
        console.log(`  ✓ ${r.email} [${r.variant}→lp/${lp.path}] (${i + 1}/${recipients.length})`)
      }
    } catch (e) {
      fail++
      console.error(`  ✗ ${r.email} — ${e.message}`)
    }
    // 텀 두기(스팸성 대량발송 방지): 메일마다 랜덤 간격 + 일정 묶음마다 휴식
    if (i < recipients.length - 1) {
      if (batchSize && (i + 1) % batchSize === 0 && batchPauseMs) {
        console.log(`  ⏸  ${Math.round(batchPauseMs / 1000)}초 휴식 (${i + 1}명 발송 완료)`)
        await sleep(batchPauseMs)
      } else {
        await sleep(rand(minDelayMs, maxDelayMs))
      }
    }
  }
  console.log(`\n완료: 성공 ${ok} / 실패 ${fail}`)
  console.log('LP 분포:', lpDist)
}

const SAMPLES = {
  personalized: { variant: 'personalized', keyword: '유흥알바', site: 'https://vipalba.co.kr' },
  failed: { variant: 'failed', keyword: 'eft 투자', site: 'https://todayecon.kr' },
  generic: { variant: 'generic' },
}

;(async () => {
  const arg = process.argv[2]
  const param = process.argv[3]

  if (arg === '--preview') {
    const dir = process.env.CLAUDE_JOB_DIR || '.'
    for (const [name, opts] of Object.entries(SAMPLES)) {
      const out = path.join(dir, `promo-preview-${name}.html`)
      const sampleLp = `${SITE}/lp/${LP_PATHS[0]}?utm_source=email&utm_medium=promo&utm_campaign=${LP_UTM_CAMPAIGN}&utm_content=lp-${LP_PATHS[0]}`
      fs.writeFileSync(out, buildHtml({ ...opts, lpUrl: sampleLp }), 'utf8')
      console.log(`📄 ${name}: open "${out}"`)
    }
    return
  }

  if (arg === '--list') {
    const aud = param || 'all'
    const r = await getRecipients(aud)
    const dist = r.reduce((a, x) => ((a[x.variant] = (a[x.variant] || 0) + 1), a), {})
    console.log(`[audience=${aud}] 대상 ${r.length}명 — 변형:`, dist)
    return
  }

  if (arg === '--test-variants') {
    if (!param || !param.includes('@')) {
      console.error('사용법: --test-variants you@example.com')
      process.exit(1)
    }
    const recips = Object.values(SAMPLES).map(s => ({ email: param.toLowerCase(), ...s }))
    await sendBatch(recips, { tagVariantInSubject: true })
    return
  }

  if (arg === '--test') {
    if (!param || !param.includes('@')) {
      console.error('사용법: --test you@example.com')
      process.exit(1)
    }
    await sendBatch([{ email: param.toLowerCase(), variant: 'generic' }])
    return
  }

  if (arg === '--send') {
    const aud = param
    if (!['all', 'leads', 'registered'].includes(aud)) {
      console.error(
        '⚠️  audience 명시 필수: --send all | --send leads | --send registered [최대건수]'
      )
      process.exit(1)
    }
    const limit = parseInt(process.argv[4], 10) || 0 // 무료 한도(하루 100통) 대비 1회 발송 상한
    let r = await getRecipients(aud) // 이미 보낸 사람은 자동 제외됨
    if (limit && r.length > limit) r = r.slice(0, limit)
    const dist = r.reduce((a, x) => ((a[x.variant] = (a[x.variant] || 0) + 1), a), {})
    console.log(
      `⚠️  실제 발송 [audience=${aud}]: ${r.length}명${limit ? ` (상한 ${limit})` : ''}`,
      dist,
      '— 7초 후 시작 (중단: Ctrl+C)'
    )
    await sleep(7000)
    // 텀: 메일당 7~16초 랜덤 + 25명마다 45초 휴식
    await sendBatch(r, {
      minDelayMs: 7000,
      maxDelayMs: 16000,
      batchSize: 25,
      batchPauseMs: 45000,
      recordSent: true,
    })
    return
  }

  console.log(
    '사용법: --preview | --list [audience] | --test-variants you@x | --test you@x | --send <all|leads|registered>'
  )
})().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
