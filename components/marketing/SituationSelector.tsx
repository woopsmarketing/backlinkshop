import Link from 'next/link'
import { SITUATIONS } from '@/config/services'

/**
 * "지금 가장 가까운 상황을 선택하세요"
 * 상황 → 해당 페이지로 보내는 내부링크 허브. 목록은 config/services.ts 에서 관리한다.
 */
export function SituationSelector({ items = SITUATIONS }: { items?: typeof SITUATIONS }) {
  return (
    <div className="bl-situation">
      {items.map(item => (
        <Link key={item.href} href={item.href} className="bl-situation__item">
          <span className="bl-situation__label">
            {item.label}
            <span className="bl-situation__hint">{item.hint}</span>
          </span>
          <span className="bl-situation__arrow" aria-hidden="true">
            &rarr;
          </span>
        </Link>
      ))}
    </div>
  )
}
