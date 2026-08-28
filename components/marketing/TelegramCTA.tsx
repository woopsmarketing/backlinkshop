'use client'

/**
 * TelegramCTA — 사이트의 Primary Conversion.
 *
 * - t.me URL 은 config/site.ts 한 곳에서만 관리한다. 버튼 문구에는 채널 이름을 노출하지 않는다
 *   (상담 채널이 바뀌어도 사이트 전체 문구를 고칠 필요가 없어야 한다).
 * - 클릭 시 GA4 이벤트를 발화한다. 이벤트 이름은 기존 'telegram_click' 을 유지해
 *   이미 연결된 Google Ads 전환이 끊기지 않게 한다 (lib/gtag.ts 참고).
 */

import { usePathname } from 'next/navigation'
import { TELEGRAM_URL } from '@/config/site'
import { trackTelegramCtaClick } from '@/lib/gtag'
import { buttonClass } from '@/components/ui/Button'

export const DEFAULT_CTA_LABEL = '내 사이트 상황 상담하기'

type Props = {
  /** 문맥 (pbn-backlink, pricing, google-ranking ...) */
  source: string
  /** 위치 (hero, mid, final, header, footer ...) */
  position: string
  /** 버튼 문구. 생략하면 전역 기본 문구를 쓴다. */
  label?: string
  variant?: 'button' | 'secondary' | 'link'
  size?: 'md' | 'lg'
  block?: boolean
}

export function TelegramCTA({
  source,
  position,
  label = DEFAULT_CTA_LABEL,
  variant = 'button',
  size = 'md',
  block,
}: Props) {
  const pathname = usePathname()

  const className =
    variant === 'link'
      ? buttonClass({ variant: 'ghost' })
      : buttonClass({ variant: variant === 'secondary' ? 'secondary' : 'primary', size, block })

  const handleClick = () => {
    trackTelegramCtaClick({ page: pathname || '/', source, position, label })
  }

  return (
    <span className={block ? 'bl-stack' : undefined}>
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
        data-cta-source={source}
        data-cta-position={position}
      >
        {label}
      </a>
    </span>
  )
}
