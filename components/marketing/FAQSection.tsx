import Link from 'next/link'
import type { FaqItem } from '@/config/faq'
import { Accordion } from '@/components/ui/Accordion'
import { SectionHead } from './SectionHead'
import { Section } from '@/components/layout/Container'

/**
 * FAQ 섹션. 아코디언은 native <details> 라 닫혀 있어도 답변이 HTML에 포함된다.
 */
export function FAQSection({
  items,
  title = '자주 묻는 질문',
  eyebrow,
  moreHref,
  moreLabel,
  subtle,
  id = 'faq',
}: {
  items: FaqItem[]
  title?: string
  eyebrow?: string
  moreHref?: string
  moreLabel?: string
  subtle?: boolean
  id?: string
}) {
  return (
    <Section id={id} subtle={subtle} ariaLabelledBy={`${id}-title`}>
      <SectionHead eyebrow={eyebrow} title={title} id={`${id}-title`} />
      <Accordion
        items={items.map(item => ({
          id: `faq-${item.id}`,
          question: item.question,
          answer: item.answer,
          links: item.links,
        }))}
      />
      {moreHref ? (
        <p style={{ marginTop: '1.5rem' }}>
          <Link href={moreHref} className="bl-btn bl-btn--ghost">
            {moreLabel ?? '전체 질문 보기'} &rarr;
          </Link>
        </p>
      ) : null}
    </Section>
  )
}
