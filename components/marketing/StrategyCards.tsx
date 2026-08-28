import Link from 'next/link'
import { IconSurface } from '@/components/ui/Icon'
import { HOME_STRATEGIES, type StrategyCard } from '@/config/services'

/**
 * 전략 선택 카드 — 상황 → 추천 전략 → 이유 → 해당 페이지.
 * 가로형 버튼 목록은 무엇을 고르는지 알 수 없어서, 판단 근거까지 카드 안에 넣는다.
 * 카드 전체가 링크이므로 안에 또 다른 링크를 넣지 않는다.
 */
export function StrategyCards({ items = HOME_STRATEGIES }: { items?: StrategyCard[] }) {
  return (
    <div className="bl-strategy">
      {items.map(item => (
        <Link key={item.href} href={item.href} className="bl-strategy__card">
          <IconSurface name={item.icon} />
          <span className="bl-strategy__situation">{item.situation}</span>
          <span className="bl-strategy__title">{item.strategy}</span>
          <span className="bl-strategy__reason">{item.reason}</span>
          <span className="bl-strategy__link">
            {item.linkLabel}
            <span aria-hidden="true"> &rarr;</span>
          </span>
        </Link>
      ))}
    </div>
  )
}
