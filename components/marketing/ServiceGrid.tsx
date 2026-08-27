import Link from 'next/link'
import { SERVICES, type Service } from '@/config/services'
import { getPricingGroup, formatKrw } from '@/config/pricing'
import { BulletList } from '@/components/ui/Card'

/** 개별 서비스 카드. primary 서비스(PBN)는 조금 더 크게 다룬다. */
export function ServiceCard({ service }: { service: Service }) {
  const pricing = getPricingGroup(service.slug)

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

export function ServiceGrid({ services = SERVICES }: { services?: Service[] }) {
  return (
    <div className="bl-services">
      {services.map(service => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </div>
  )
}
