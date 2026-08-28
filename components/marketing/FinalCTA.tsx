import { Section } from '@/components/layout/Container'
import { ctaCopy, type CtaKey } from '@/config/cta'
import { TelegramCTA } from './TelegramCTA'

/**
 * 페이지 마지막 CTA.
 * 문구는 config/cta.ts 에서 가져온다 — 모든 페이지가 같은 문장으로 끝나지 않게 하기 위해서다.
 */
export function FinalCTA({
  source,
  cta = 'final',
  title,
  body,
  label,
}: {
  source: string
  /** config/cta.ts 의 키 */
  cta?: CtaKey
  title?: string
  body?: string
  label?: string
}) {
  const copy = ctaCopy(cta)

  return (
    <Section className="bl-final-cta" size="sm" ariaLabelledBy={`final-cta-${source}`}>
      <div className="bl-center">
        <h2 id={`final-cta-${source}`} className="bl-h2">
          {title ?? copy.title ?? '사이트 주소와 목표 키워드를 보내주세요'}
        </h2>
        <p className="bl-lead bl-measure" style={{ marginTop: '1rem' }}>
          {body ?? copy.body}
        </p>
        <div className="bl-btn-row" style={{ marginTop: '2rem' }}>
          <TelegramCTA source={source} position="final" label={label ?? copy.label} size="lg" />
        </div>
      </div>
    </Section>
  )
}
