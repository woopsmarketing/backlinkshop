import { Section } from '@/components/layout/Container'
import { TelegramCTA } from './TelegramCTA'

/**
 * 페이지 마지막 CTA. 문맥별로 label 을 바꿔 쓴다.
 */
export function FinalCTA({
  source,
  title = '사이트 주소와 목표 키워드만 알려주세요.',
  body = '현재 상황을 보고 어떤 방향이 적합한지 이야기하겠습니다.',
  label,
}: {
  source: string
  title?: string
  body?: string
  label?: string
}) {
  return (
    <Section className="bl-final-cta" size="sm" ariaLabelledBy={`final-cta-${source}`}>
      <div className="bl-center">
        <h2 id={`final-cta-${source}`} className="bl-h2">
          {title}
        </h2>
        <p className="bl-lead bl-measure" style={{ marginTop: '1rem' }}>
          {body}
        </p>
        <div className="bl-btn-row" style={{ marginTop: '2rem' }}>
          <TelegramCTA source={source} position="final" label={label} size="lg" showNote />
        </div>
      </div>
    </Section>
  )
}
