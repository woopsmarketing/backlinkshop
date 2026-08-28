import Link from 'next/link'
import { IconSurface } from '@/components/ui/Icon'
import { CONSULT_SERVICES, type ConsultService } from '@/config/services'

/**
 * 상담으로만 진행하는 서비스.
 * 검색 수요가 확인되지 않은 키워드로 얇은 랜딩을 늘리지 않기 위해 카드로만 노출한다.
 * 카드 전체를 링크로 만들지 않는다 (연결할 전용 페이지가 없는 항목이 섞여 있다).
 */
export function ConsultServices({ items = CONSULT_SERVICES }: { items?: ConsultService[] }) {
  return (
    <div className="bl-consult">
      {items.map(item => (
        <div key={item.key} className="bl-consult__card">
          <IconSurface name={item.icon} size="sm" />
          <h3 className="bl-consult__title">{item.name}</h3>
          <p className="bl-consult__body">{item.summary}</p>
          {item.relatedHref ? (
            <Link href={item.relatedHref} className="bl-consult__link">
              {item.relatedLabel ?? '자세히 보기'}
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  )
}
