// v1.2 - 미처리 알림 배지 추가 (2026-03-01)
/**
 * 관리자 페이지 공통 탭 메뉴
 * 미처리 주문/충전 요청 개수 배지 표시
 * 사용 예시: <AdminNav current="topups" stats={stats} />
 */

import Link from 'next/link'

type AdminNavProps = {
  current: 'topups' | 'orders' | 'products' | 'coupons' | 'users'
  stats?: {
    pendingOrders?: number
    processingOrders?: number
    pendingTopups?: number
  }
}

export default function AdminNav({ current, stats }: AdminNavProps) {
  const items: Array<{
    key: string
    label: string
    href: string
    badge?: number
  }> = [
    { key: 'users', label: '회원 관리', href: '/admin/users' },
    {
      key: 'topups',
      label: '충전 승인',
      href: '/admin/topups',
      badge: stats?.pendingTopups || 0,
    },
    {
      key: 'orders',
      label: '주문 관리',
      href: '/admin/orders',
      badge: (stats?.pendingOrders || 0) + (stats?.processingOrders || 0),
    },
    { key: 'products', label: '상품 관리', href: '/admin/products' },
    { key: 'coupons', label: '쿠폰 관리', href: '/admin/coupons' },
  ]

  return (
    <div className="flex gap-2 mb-6">
      {items.map(item => (
        <Link
          key={item.key}
          href={item.href}
          className={`relative px-4 py-2 rounded-lg text-sm font-medium ${
            current === item.key
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {item.label}
          {/* 미처리 알림 배지 */}
          {item.badge !== undefined && item.badge > 0 && (
            <span
              className={`absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
                current === item.key ? 'bg-red-500 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
