'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** 현재 경로일 때 aria-current 를 붙인다. 색상만이 아니라 밑줄로도 상태를 표시한다. */
export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive =
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link href={href} className="bl-nav__link" aria-current={isActive ? 'page' : undefined}>
      {label}
    </Link>
  )
}
