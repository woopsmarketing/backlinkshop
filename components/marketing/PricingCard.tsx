import Link from 'next/link'
import { formatKrw, type PricingGroup } from '@/config/pricing'
import { getService } from '@/config/services'
import { BulletList } from '@/components/ui/Card'

/**
 * 가격 카드 — 시작가 + 포함 사항 + 상세 라인업.
 * 표시되는 모든 금액은 config/pricing.ts 한 곳에서 나온다.
 */
export function PricingCard({
  group,
  showItems = true,
}: {
  group: PricingGroup
  showItems?: boolean
}) {
  const service = getService(group.service)

  return (
    <div className="bl-card bl-card--feature">
      <h3 className="bl-card__title">{group.label}</h3>
      <div className="bl-price">
        <span className="bl-price__value">{formatKrw(group.from)}</span>
        <span className="bl-price__unit">부터</span>
      </div>

      <p className="bl-card__body">
        <strong style={{ color: 'var(--text-primary)' }}>이런 경우에 적합합니다</strong>
        <br />
        {group.bestFor}
      </p>

      <div>
        <p className="bl-related__label">포함 사항</p>
        <BulletList items={group.includes} />
      </div>

      {showItems ? (
        <div className="bl-scroll-x">
          <table className="bl-price-table">
            <caption className="bl-sr-only">{group.label} 구성별 가격</caption>
            <thead>
              <tr>
                <th scope="col">구성</th>
                <th scope="col">가격</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map(item => (
                <tr key={item.name}>
                  <th
                    scope="row"
                    style={{
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      textTransform: 'none',
                      letterSpacing: 0,
                      fontSize: 'var(--fs-sm)',
                    }}
                  >
                    {item.name}
                    {item.note ? <span className="bl-stat__source"> {item.note}</span> : null}
                  </th>
                  <td>{formatKrw(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {service ? (
        <p className="bl-card__meta">
          <Link href={service.href} className="bl-btn bl-btn--ghost">
            {service.name} 자세히 보기 &rarr;
          </Link>
        </p>
      ) : null}
    </div>
  )
}
