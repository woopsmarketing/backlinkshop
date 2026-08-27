'use client'

import { useState } from 'react'

export default function WelcomePopup() {
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* 상단 그라데이션 */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-8 text-center text-white">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold mb-1">회원가입을 축하합니다!</h2>
          <p className="text-white/80 text-sm">백링크샵에 오신 것을 환영합니다</p>
        </div>

        {/* 내용 */}
        <div className="px-6 py-6">
          {/* 크레딧 지급 안내 */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">무료 지급 크레딧</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">200,000 크레딧</p>
            </div>
          </div>

          {/* 안내 메시지 */}
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
            홈페이지의 <strong>내부 최적화 상태</strong>를 무료로 점검받아보세요!
            <br />
            아래 키워드를 입력하고 제출하면, <strong>10~20분 내</strong>로 상세 보고서를 이메일로
            보내드립니다.
          </p>

          {/* 닫기 버튼 */}
          <button
            onClick={() => setOpen(false)}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all shadow-lg"
          >
            무료 SEO 점검 시작하기
          </button>
        </div>
      </div>
    </div>
  )
}
