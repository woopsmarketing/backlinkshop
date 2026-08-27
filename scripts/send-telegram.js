// 텔레그램 봇으로 특정 사용자(chat_id)에게 직접 메시지 발송 스크립트
//
// 용도: 봇으로 상담 진입한 고객에게 "먼저 연락"하기.
//   - 유저네임(@아이디)이 없어도, 봇은 chat_id로 메시지를 보낼 수 있다.
//   - 단, 사용자가 봇을 차단/삭제했으면 403 Forbidden 이 뜬다 → 이메일 백업.
//
// 토큰 주의: 로컬 .env 의 TELEGRAM_BOT_TOKEN 은 플레이스홀더('your-...')다.
//   진짜 토큰은 Vercel 환경변수 또는 BotFather(/mybots → API Token)에서 얻어,
//   실행 시 환경변수로 잠깐 넘긴다 (디스크/깃에 남기지 말 것).
//
// 사용법:
//   # 미리보기(발송 안 함)
//   TELEGRAM_BOT_TOKEN=<진짜토큰> node scripts/send-telegram.js 1010514727 "메시지" --preview
//
//   # 실제 발송
//   TELEGRAM_BOT_TOKEN=<진짜토큰> node scripts/send-telegram.js 1010514727 "메시지" --send

/* eslint-disable no-console */
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

const TELEGRAM_API_BASE = 'https://api.telegram.org'

function parseArgs(argv) {
  const flags = new Set()
  const rest = []
  for (const a of argv) {
    if (a.startsWith('--')) flags.add(a.slice(2))
    else rest.push(a)
  }
  return { chatId: rest[0], text: rest[1], flags }
}

async function main() {
  const { chatId, text, flags } = parseArgs(process.argv.slice(2))
  const token = process.env.TELEGRAM_BOT_TOKEN

  if (!chatId || !text) {
    console.error('사용법: node scripts/send-telegram.js <chat_id> "<메시지>" [--preview|--send]')
    process.exit(1)
  }

  console.log('────────────────────────')
  console.log('수신 chat_id :', chatId)
  console.log('메시지       :')
  console.log(text)
  console.log('────────────────────────')

  if (!flags.has('send')) {
    console.log('🟡 미리보기 모드 (실제 발송 안 함). 보내려면 --send 를 붙이세요.')
    return
  }

  if (!token || token.startsWith('your-')) {
    console.error(
      '❌ TELEGRAM_BOT_TOKEN 이 없거나 플레이스홀더입니다.\n' +
        '   진짜 토큰을 환경변수로 넘겨 실행하세요:\n' +
        '   TELEGRAM_BOT_TOKEN=<진짜토큰> node scripts/send-telegram.js ' +
        `${chatId} "..." --send`
    )
    process.exit(1)
  }

  const res = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
  const data = await res.json().catch(() => ({}))

  if (res.ok && data.ok) {
    console.log('✅ 발송 완료. message_id:', data.result?.message_id)
  } else {
    console.error('❌ 발송 실패:', res.status, JSON.stringify(data))
    if (res.status === 403) {
      console.error('   → 사용자가 봇을 차단/삭제했을 수 있습니다. 이메일로 연락하세요.')
    }
    process.exit(1)
  }
}

main().catch(e => {
  console.error('❌ 예외:', e?.message || e)
  process.exit(1)
})
