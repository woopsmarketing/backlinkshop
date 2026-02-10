/**
 * 크레딧 원장 테이블 컴포넌트
 * Server Component (data props)
 */

import { formatCredits, formatDate } from '@/lib/utils'

type LedgerItem = {
  id: number
  amount: number
  reason: string
  ref_type: string | null
  ref_id: string | null
  created_at: string
}

type Props = {
  ledger: LedgerItem[]
}

// 사유 한글 변환
const reasonMap: Record<string, string> = {
  signup_bonus: '가입 보너스',
  coupon: '쿠폰 사용',
  manual_topup: '수동 충전',
  product_purchase: '상품 구매',
  refund: '환불',
}

export default function LedgerTable({ ledger }: Props) {
  if (ledger.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        아직 내역이 없습니다
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              날짜
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              구분
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              금액
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {ledger.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                {formatDate(item.created_at)}
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {reasonMap[item.reason] || item.reason}
                  </p>
                  {item.ref_id && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.ref_type}: {item.ref_id.slice(0, 8)}...
                    </p>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <span
                  className={`text-sm font-semibold ${
                    item.amount > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {item.amount > 0 ? '+' : ''}
                  {formatCredits(item.amount)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
