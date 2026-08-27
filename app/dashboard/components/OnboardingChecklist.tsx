/**
 * 신규 사용자 온보딩 체크리스트
 * 주문이 없는 사용자에게 단계별 가이드를 제공
 */

import Link from 'next/link'
import { formatCredits } from '@/lib/utils'

interface OnboardingChecklistProps {
  hasSeoOrder: boolean
  hasTopup: boolean
  balance: number
}

export default function OnboardingChecklist({
  hasSeoOrder,
  hasTopup,
  balance,
}: OnboardingChecklistProps) {
  const steps = [
    {
      step: 1,
      title: '무료 온페이지 SEO 점검 받기',
      description: '가입 보너스 20만 크레딧으로 내 사이트의 SEO 상태를 무료로 진단받으세요.',
      done: hasSeoOrder,
      cta: '무료 SEO 점검 신청하기',
      href: '/shop/category/seo',
      color: 'blue',
    },
    {
      step: 2,
      title: '무료 도메인 분석으로 경쟁사 파악',
      description: '경쟁사 대비 내 사이트의 DA, 백링크 수, 키워드 순위를 비교해보세요.',
      done: false, // 외부 링크라 추적 불가, 항상 표시
      cta: '무료 도메인 분석하기',
      href: 'https://domainchecker.co.kr',
      external: true,
      color: 'cyan',
    },
    {
      step: 3,
      title: '5만원 첫 충전하고 PBN 백링크 시작',
      description: `첫 충전 시 100% 보너스! 5만원 충전 → 10만 크레딧 지급. 보유 ${formatCredits(balance)} + 10만 = ${formatCredits(balance + 100000)} 크레딧으로 PBN 백링크를 시작하세요.`,
      done: hasTopup,
      cta: '크레딧 충전하기',
      href: '/credits',
      color: 'green',
    },
  ]

  const completedCount = steps.filter(s => s.done).length

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">&#127891;</span>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          구글 상위노출, 3단계로 시작하세요
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
        {completedCount}/{steps.length} 완료 &#183; 아래 단계를 따라하면 구글SEO 효과를 바로 체험할
        수 있습니다
      </p>

      {/* 진행 바 */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
        <div
          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / steps.length) * 100}%` }}
        />
      </div>

      <div className="space-y-4">
        {steps.map(item => (
          <div
            key={item.step}
            className={`flex items-start gap-4 p-5 rounded-xl transition-all ${
              item.done
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
            }`}
          >
            {/* 스텝 번호 / 체크 */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                item.done
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
              }`}
            >
              {item.done ? '\u2713' : item.step}
            </div>

            {/* 내용 */}
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold mb-1 ${
                  item.done
                    ? 'text-green-800 dark:text-green-200 line-through'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-sm ${
                  item.done
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.done ? '완료!' : item.description}
              </p>
            </div>

            {/* CTA 버튼 */}
            {!item.done &&
              (item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  {item.cta} &#8599;
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  {item.cta}
                </Link>
              ))}
          </div>
        ))}
      </div>

      {/* 첫 충전 보너스 강조 배너 */}
      {!hasTopup && (
        <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            &#127873; 첫 충전 100% 보너스 &#183;{' '}
            <span className="text-orange-600 dark:text-orange-400">
              5만원 충전하면 10만 크레딧!
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            첫 충전 한정 혜택입니다. 보유 크레딧과 합치면 PBN 백링크를 바로 시작할 수 있어요.
          </p>
        </div>
      )}
    </div>
  )
}
