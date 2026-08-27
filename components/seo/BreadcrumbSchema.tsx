import { absoluteUrl } from '@/config/site'
import { JsonLd } from './JsonLd'

export function BreadcrumbSchema({ items }: { items: { href: string; label: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          item: absoluteUrl(item.href),
        })),
      }}
    />
  )
}
