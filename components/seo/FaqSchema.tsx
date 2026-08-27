import type { FaqItem } from '@/config/faq'
import { JsonLd } from './JsonLd'

/**
 * FAQPage — 화면에 실제로 렌더링된 질문/답변만 넣는다.
 * 확인되지 않은 통계나 결과 보증성 표현은 config/faq.ts 단계에서 이미 제거되어 있다.
 */
export function FaqSchema({ items }: { items: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }}
    />
  )
}
