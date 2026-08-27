import Link from 'next/link'
import { SERVICES, type ServiceSlug } from '@/config/services'
import { formatKrw, getPricingGroup } from '@/config/pricing'

/**
 * 관련 서비스 — 문맥에 맞는 서비스만 골라 연결한다.
 * slugs 를 넘기지 않으면 전체를 보여준다.
 */
export function RelatedServices({
  heading = '관련 서비스',
  slugs,
}: {
  heading?: string
  slugs?: ServiceSlug[]
}) {
  const services = slugs ? SERVICES.filter(service => slugs.includes(service.slug)) : SERVICES
  if (!services.length) return null

  return (
    <section className="bl-related" aria-label={heading}>
      <h2 className="bl-related__heading">{heading}</h2>
      <div className={`bl-related__list bl-related__list--${services.length >= 3 ? 3 : 2}`}>
        {services.map(service => {
          const pricing = getPricingGroup(service.slug)
          return (
            <Link key={service.slug} href={service.href} className="bl-related__item">
              <span className="bl-related__label">
                {pricing ? `${formatKrw(pricing.from)}부터` : '서비스'}
              </span>
              <span className="bl-related__title">{service.name}</span>
              <span className="bl-related__desc">{service.summary}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
