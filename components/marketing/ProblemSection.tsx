import type { ReactNode } from 'react'
import { Section } from '@/components/layout/Container'
import { SectionHead } from './SectionHead'

/**
 * 공감 섹션 — 질문으로 현재 상황을 언어화한다.
 * 과장된 공포 마케팅 대신 사용자가 실제로 겪는 상황만 적는다.
 */
export function ProblemSection({
  eyebrow,
  title,
  questions,
  closing,
  subtle,
  id,
}: {
  eyebrow?: string
  title: ReactNode
  questions: readonly string[]
  closing?: ReactNode
  subtle?: boolean
  id?: string
}) {
  return (
    <Section id={id} subtle={subtle}>
      <SectionHead eyebrow={eyebrow} title={title} />
      <ul className="bl-questions">
        {questions.map(question => (
          <li key={question}>{question}</li>
        ))}
      </ul>
      {closing ? <p className="bl-closing">{closing}</p> : null}
    </Section>
  )
}
