'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LPHeroForm() {
  const [url, setUrl] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // URL을 쿼리 파라미터로 전달해서 가입 후 자동 입력되도록
    const encodedUrl = encodeURIComponent(url.trim())
    router.push(url.trim() ? `/login?from=lp&site=${encodedUrl}` : '/login?from=lp')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <label htmlFor="site-url" className="block text-left text-sm text-gray-300 mb-2">
          내 사이트 URL
        </label>
        <input
          id="site-url"
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-lg mb-4"
        />
        <button
          type="submit"
          className="w-full px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          무료 SEO 진단 시작하기
        </button>
      </div>
    </form>
  )
}
