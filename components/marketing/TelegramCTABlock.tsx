import type { ReactNode } from 'react'
import { TelegramCTA } from './TelegramCTA'

/**
 * 본문 중간에 넣는 상담 블록. 페이지 문맥에 맞는 문구를 label 로 넘긴다.
 */
export function TelegramCTABlock({
  source,
  position = 'mid',
  title,
  body,
  label,
}: {
  source: string
  position?: string
  title: ReactNode
  body?: ReactNode
  label?: string
}) {
  return (
    <div className="bl-cta bl-cta--row">
      <div>
        <p className="bl-cta__title">{title}</p>
        {body ? <p className="bl-cta__body">{body}</p> : null}
      </div>
      <div>
        <TelegramCTA source={source} position={position} label={label} size="lg" showNote />
      </div>
    </div>
  )
}
