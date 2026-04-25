'use client'

import { useEffect } from 'react'
import { trackAnalyzePageView } from '@/lib/gtag'

/**
 * /analyze/[domain] 진입 시 analyze_page_view 이벤트를 1회 발화한다.
 * 관찰 전용 — Google Ads 전환으로 등록하지 않는다.
 *
 * 도메인별로 sessionStorage 키를 분리해 같은 탭에서 새로고침해도 중복 발화를 막는다.
 */
export function AnalyzePageView({ domain }: { domain: string }) {
  useEffect(() => {
    if (!domain || typeof window === 'undefined') return
    const key = `bls_apv_${domain}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      /* storage 차단 — 그대로 발화 */
    }
    trackAnalyzePageView({ domain })
  }, [domain])

  return null
}
