/**
 * Tabs — 콘텐츠를 숨기지 않는 앵커 이동형 탭.
 *
 * 일반적인 탭은 선택되지 않은 패널을 감춘다. 이 사이트에서는 모든 본문이 HTML에 남아 있어야 하므로
 * 패널을 감추는 대신 해당 섹션으로 이동시키는 방식을 쓴다. JS 없이 동작한다.
 */
import Link from 'next/link'

export function Tabs({
  items,
  label,
}: {
  items: { href: string; label: string }[]
  /** 스크린리더용 목적 설명 */
  label: string
}) {
  return (
    <nav className="bl-tabs" aria-label={label}>
      {items.map(item => (
        <Link key={item.href} href={item.href} className="bl-tab">
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
