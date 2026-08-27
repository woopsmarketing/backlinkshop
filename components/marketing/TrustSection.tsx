import type { ReactNode } from 'react'
import { Section } from '@/components/layout/Container'
import { SectionHead } from './SectionHead'
import { Card, CardBody, CardTitle } from '@/components/ui/Card'

/**
 * 신뢰 섹션 — 숫자가 아니라 "무엇을 어떻게 하는지"로 신뢰를 만든다.
 * 확인되지 않은 성과 지표(프로젝트 수, 재구매율 등)를 여기에 넣지 않는다.
 */
export function TrustSection({
  eyebrow,
  title,
  lead,
  items,
  subtle,
  id,
}: {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  items: { title: string; body: string }[]
  subtle?: boolean
  id?: string
}) {
  return (
    <Section id={id} subtle={subtle}>
      <SectionHead eyebrow={eyebrow} title={title} lead={lead} />
      <div className="bl-grid bl-grid--2">
        {items.map(item => (
          <Card key={item.title}>
            <CardTitle>{item.title}</CardTitle>
            <CardBody>{item.body}</CardBody>
          </Card>
        ))}
      </div>
    </Section>
  )
}
