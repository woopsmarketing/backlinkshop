// v1.1 - 회원 관리 탭 추가 (2026-02-13)
/**
 * 관리자 페이지 공통 탭 메뉴
 * 사용 예시: <AdminNav current="topups" />
 */

import Link from 'next/link'

type AdminNavProps = {
  current: 'topups' | 'orders' | 'products' | 'coupons' | 'users'
}

export default function AdminNav({ current }: AdminNavProps) {
  const items = [
    { key: 'users', label: '회원 관리', href: '/admin/users' },
    { key: 'topups', label: '충전 승인', href: '/admin/topups' },
    { key: 'orders', label: '주문 관리', href: '/admin/orders' },
    { key: 'products', label: '상품 관리', href: '/admin/products' },
    { key: 'coupons', label: '쿠폰 관리', href: '/admin/coupons' },
  ] as const

  return (
    <div className="flex gap-2 mb-6">
      {items.map(item => (
        <Link
          key={item.key}
          href={item.href}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            current === item.key
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
