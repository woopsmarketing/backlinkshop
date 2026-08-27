import { PROCESS_STEPS } from '@/config/services'

/** 진행 프로세스 — 홈·/services·서비스 상세가 같은 원본을 쓴다. */
export function ProcessSteps({ steps = PROCESS_STEPS }: { steps?: typeof PROCESS_STEPS }) {
  return (
    <ol className="bl-process">
      {steps.map(step => (
        <li key={step.step} className="bl-process__item">
          <span className="bl-process__step">{step.step}</span>
          <h3 className="bl-process__title">{step.title}</h3>
          <p className="bl-process__body">{step.body}</p>
        </li>
      ))}
    </ol>
  )
}
