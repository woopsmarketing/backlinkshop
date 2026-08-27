/**
 * Accordion — native <details>/<summary> 기반.
 * JS 없이 동작하고 키보드로 열고 닫을 수 있으며, 닫혀 있어도 본문이 HTML에 포함된다.
 */
import Link from 'next/link'
import type { ReactNode } from 'react'

export type AccordionItem = {
  id: string
  question: string
  answer: string
  links?: { href: string; label: string }[]
}

export function Accordion({ items, children }: { items?: AccordionItem[]; children?: ReactNode }) {
  return (
    <div className="bl-accordion">
      {items?.map(item => (
        <details key={item.id} id={item.id} className="bl-accordion__item bl-anchor">
          <summary className="bl-accordion__summary">
            <span>{item.question}</span>
            <span className="bl-accordion__icon" aria-hidden="true" />
          </summary>
          <div className="bl-accordion__panel">
            <p>{item.answer}</p>
            {item.links?.length ? (
              <p className="bl-inline-links">
                {item.links.map(link => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </p>
            ) : null}
          </div>
        </details>
      ))}
      {children}
    </div>
  )
}
