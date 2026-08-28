import type { ReactNode } from 'react'
import { ctaCopy, type CtaKey } from '@/config/cta'
import { TelegramCTA } from './TelegramCTA'

/**
 * 본문 중간에 넣는 상담 블록.
 *
 * 문구는 config/cta.ts 에서 가져온다. 긴 문장을 버튼에 넣지 않고
 * "질문(제목) + 행동(버튼)" 으로 나눈다.
 */
export function TelegramCTABlock({
  source,
  cta,
  position = 'mid',
  title,
  body,
  label,
}: {
  source: string
  /** config/cta.ts 의 키. 넘기면 title/body/label 기본값이 채워진다. */
  cta?: CtaKey
  position?: string
  title?: ReactNode
  body?: ReactNode
  label?: string
}) {
  const copy = cta ? ctaCopy(cta) : undefined

  return (
    <div className="bl-cta bl-cta--row">
      <div>
        <p className="bl-cta__title">{title ?? copy?.title}</p>
        {(body ?? copy?.body) ? <p className="bl-cta__body">{body ?? copy?.body}</p> : null}
      </div>
      <div>
        <TelegramCTA source={source} position={position} label={label ?? copy?.label} size="lg" />
      </div>
    </div>
  )
}
