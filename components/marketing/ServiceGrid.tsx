import Link from 'next/link'
import { SERVICES, type Service } from '@/config/services'
import { getPricingGroup, formatKrw } from '@/config/pricing'
import { BulletList } from '@/components/ui/Card'
import { IconSurface } from '@/components/ui/Icon'

/**
 * 서비스 카드.
 *
 * showPrice
 * - 홈에서는 끈다. 탐색 단계에서 금액이 먼저 보이면 "얼마짜리인가"로 판단이 좁아진다.
 * - /services · /pricing 처럼 가격을 보러 온 화면에서는 켠다.
 */
export function ServiceCard({ service, showPrice }: { service: Service; showPrice?: boolean }) {
  const pricing = showPrice ? getPricingGroup(service.slug) : undefined

  return (
    <Link
      href={service.href}
      className={[
        'bl-card',
        'bl-card--link',
        service.primary ? 'bl-card--feature bl-service--primary' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        <IconSurface name={service.icon} />
        <h3 className="bl-card__title">{service.name}</h3>
        <p className="bl-card__body" style={{ marginTop: '0.5rem' }}>
          {service.summary}
        </p>
      </div>
      <div>
        <BulletList items={service.points} />
        <p className="bl-card__meta">
          {pricing ? `${formatKrw(pricing.from)}부터 · ` : ''}
          자세히 보기 &rarr;
        </p>
      </div>
    </Link>
  )
}

export function ServiceGrid({
  services = SERVICES,
  showPrice,
}: {
  services?: Service[]
  showPrice?: boolean
}) {
  return (
    <div className="bl-services">
      {services.map(service => (
        <ServiceCard key={service.slug} service={service} showPrice={showPrice} />
      ))}
    </div>
  )
}
