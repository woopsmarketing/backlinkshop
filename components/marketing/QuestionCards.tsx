import { IconSurface } from '@/components/ui/Icon'
import { HOME_QUESTIONS } from '@/config/services'

/**
 * "현재 상황" 카드 — 질문 하나 + 한두 문장의 해설.
 * 단순 목록으로 나열하면 그냥 스쳐 지나가서, 각 질문이 왜 문제인지까지 같이 보여준다.
 */
export function QuestionCards({ items = HOME_QUESTIONS }: { items?: typeof HOME_QUESTIONS }) {
  return (
    <div className="bl-qgrid">
      {items.map(item => (
        <div key={item.question} className="bl-qcard">
          <IconSurface name={item.icon} />
          <p className="bl-qcard__q">{item.question}</p>
          <p className="bl-qcard__body">{item.body}</p>
        </div>
      ))}
    </div>
  )
}
