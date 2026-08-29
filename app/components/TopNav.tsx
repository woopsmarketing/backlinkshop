// v1.0 - 공통 상단 네비게이션 추가 (2026-02-05)
/**
 * 공통 상단 네비게이션
 * 사용 예시: <TopNav userEmail="test@test.com" isAdmin />
 */

// v1.1 - 로그아웃 버튼 추가 (2026-02-05)
import Link from 'next/link'
import { signOut } from '@/server/actions/auth'
import { TELEGRAM_URL } from '@/config/site'

type TopNavProps = {
  userEmail?: string | null
  isAdmin?: boolean
  title?: string
  balance?: number | null
}

export default function TopNav({ userEmail, isAdmin, title, balance }: TopNavProps) {
  const links = [
    { href: '/dashboard', label: '대시보드' },
    { href: '/shop', label: '상품' },
    { href: '/credits', label: '크레딧' },
    { href: '/orders', label: '주문' },
  ]

  if (isAdmin) {
    links.push({ href: '/admin/topups', label: '관리자' })
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
            백링크샵
          </Link>
          {title && <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>}
          <nav className="hidden md:flex items-center gap-4">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          {balance !== undefined && balance !== null && (
            <Link
              href="/credits"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <span className="text-xs">C</span>
              {balance.toLocaleString()}
            </Link>
          )}
          <span className="hidden sm:inline">{userEmail}</span>
          {/* 문의하기 버튼 */}
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            문의하기
          </a>
          <form action={signOut}>
            <button
              type="submit"
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <nav className="flex items-center gap-4 px-4 py-2 overflow-x-auto">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pb-3 flex flex-col gap-2">
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="w-full py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
          >
            문의하기
          </a>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
