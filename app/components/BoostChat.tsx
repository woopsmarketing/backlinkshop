/**
 * BoostChat 상담 위젯 로더
 *
 * - 원본 설치 코드는 </body> 직전 <script async> 였다. Next.js App Router 에서는
 *   next/script 의 afterInteractive 전략이 같은 위치·타이밍(하이드레이션 직후 body 끝)을 대신한다.
 * - data-boost-chat-key 는 브라우저에 그대로 노출되는 공개 위젯 키라 env 로 숨길 필요가 없다.
 *   키가 바뀌면 이 파일만 고치면 된다.
 * - 위젯 UI 는 widget.js 가 <body> 끝에 iframe 하나(우측 하단 68x68, z-index 2147483000)를
 *   직접 붙여서 만든다. 우리 DOM·CSS 와는 격리돼 있다.
 * - 위젯이 실제로 뜨는 도메인은 BoostChat 관리자의 허용 도메인 목록이 정한다.
 *   등록되지 않은 호스트(localhost 등)에서는 서버가 teardown 을 보내 iframe 을 스스로 걷어낸다.
 *   따라서 로컬에서 버튼이 안 보이는 것은 설치 오류가 아니다.
 *
 * 경로 제외:
 * 광고 LP(/lp/*)와 분석 결과(/analyze/*)에는 자체 AiChatWidget 이 fixed bottom-4 right-4 로
 * 이미 떠 있다. 같은 자리에 BoostChat 버튼이 겹쳐 기존 상담 버튼을 덮으므로 그 경로에서는 띄우지 않는다.
 */
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

const BOOST_CHAT_KEY = 'wgt_lUsT0f012eRBkYpphU0VBmQei6WP_vZn'
const BOOST_CHAT_ORIGIN = 'https://boostchat.co.kr'

/** AiChatWidget 이 이미 우측 하단을 쓰는 경로 */
const EXCLUDED_PREFIXES = ['/lp', '/analyze']

export function BoostChat() {
  const pathname = usePathname()
  const excluded = EXCLUDED_PREFIXES.some(prefix => pathname?.startsWith(prefix))

  // <Script> 를 언마운트해도 widget.js 가 이미 붙여 놓은 iframe 은 남는다.
  // (중복 설치 가드 때문에 다시 붙지도 않는다) 클라이언트 라우팅으로 제외 경로에 들어온
  // 경우까지 겹침을 막으려면 남아 있는 iframe 을 직접 숨겨야 한다.
  useEffect(() => {
    const frame = document.querySelector<HTMLIFrameElement>(`iframe[src^="${BOOST_CHAT_ORIGIN}/"]`)
    if (frame) frame.style.display = excluded ? 'none' : ''
  }, [excluded])

  if (excluded) return null

  return (
    <Script
      id="boost-chat-widget"
      src={`${BOOST_CHAT_ORIGIN}/widget.js`}
      data-boost-chat-key={BOOST_CHAT_KEY}
      strategy="afterInteractive"
    />
  )
}
