// v1.0 - 관리자 회원 목록 테이블 (2026-02-13)
/**
 * 관리자 회원 목록 테이블
 * - 이메일, 역할, 크레딧 잔액, 가입일, 마지막 로그인 표시
 * - 검색 필터 지원
 */

'use client'

import { useState, useMemo } from 'react'
import { formatCredits, formatDate } from '@/lib/utils'
import type { AdminUserRow } from '@/server/queries/admin-users'

type Props = {
  users: AdminUserRow[]
}

/** 역할 라벨 매핑 */
const roleLabel: Record<string, { text: string; className: string }> = {
  admin: {
    text: '관리자',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  user: {
    text: '일반',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
}

export default function AdminUsersTable({ users }: Props) {
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('')

  // 검색 필터링된 회원 목록
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users

    const query = searchQuery.toLowerCase().trim()
    return users.filter(
      user => user.email.toLowerCase().includes(query) || user.id.toLowerCase().includes(query)
    )
  }, [users, searchQuery])

  return (
    <div className="space-y-4">
      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">총 회원</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCredits(users.length)}명
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">관리자</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {users.filter(u => u.role === 'admin').length}명
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">오늘 가입</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {
              users.filter(u => {
                const today = new Date()
                const created = new Date(u.createdAt)
                return (
                  created.getFullYear() === today.getFullYear() &&
                  created.getMonth() === today.getMonth() &&
                  created.getDate() === today.getDate()
                )
              }).length
            }
            명
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">총 보유 크레딧</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCredits(users.reduce((sum, u) => sum + u.creditBalance, 0))}
          </p>
        </div>
      </div>

      {/* 검색 바 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="이메일 또는 유저 ID로 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              검색 결과: {filteredUsers.length}명
            </p>
          )}
        </div>

        {/* 테이블 */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {searchQuery ? '검색 결과가 없습니다' : '등록된 회원이 없습니다'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                    이메일
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                    역할
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                    크레딧 잔액
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                    가입일
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                    마지막 로그인
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map(user => {
                  const role = roleLabel[user.role] || roleLabel.user
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      {/* 이메일 */}
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </td>

                      {/* 역할 */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${role.className}`}
                        >
                          {role.text}
                        </span>
                      </td>

                      {/* 크레딧 잔액 */}
                      <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCredits(user.creditBalance)}
                      </td>

                      {/* 가입일 */}
                      <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* 마지막 로그인 */}
                      <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {user.lastSignInAt ? formatDate(user.lastSignInAt) : '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
