/**
 * Google OAuth 콜백 라우트
 * Supabase OAuth 인증 후 코드 교환 및 리디렉션 처리
 * LP에서 온 경우 → 온페이지 SEO 상품 페이지로 리디렉트 (URL 유지)
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/server/supabase/client'
import { ensureUserInitialized } from '@/server/actions/auth'
// createOrderAction은 Resend 의존성 때문에 동적 import 필요

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const from = searchParams.get('from')
  const site = searchParams.get('site')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 첫 로그인 처리: 프로필 생성 + 20만 크레딧 지급
      const { isNewUser } = await ensureUserInitialized()

      // LP에서 온 경우: 자동 주문 생성 후 성공 페이지로 리디렉트
      if (from === 'lp') {
        const serverSupabase = await createServerSupabaseClient()
        const { data: seoProduct } = await serverSupabase
          .from('products')
          .select('id')
          .eq('name', '온페이지 SEO 점검')
          .eq('status', 'active')
          .single()

        if (seoProduct) {
          const keyword = searchParams.get('keyword') || ''
          const siteParam = site || ''

          // 자동 주문 생성 (URL + 키워드가 있으면)
          if (siteParam && keyword) {
            const { createOrderAction } = await import('@/server/actions/orders')
            await createOrderAction(seoProduct.id, 1, undefined, siteParam, keyword)

            // 주문 성공 페이지로 리디렉트
            const successUrl = new URL('/orders/success', origin)
            successUrl.searchParams.set('product', encodeURIComponent('온페이지 SEO 점검'))
            successUrl.searchParams.set('type', 'onpage')
            if (isNewUser) {
              successUrl.searchParams.set('welcome', '1')
            }
            return NextResponse.redirect(successUrl)
          }

          // URL/키워드 없으면 상품 페이지로 fallback
          const redirectUrl = new URL(`/products/${seoProduct.id}`, origin)
          if (site) redirectUrl.searchParams.set('site', site)
          if (isNewUser) redirectUrl.searchParams.set('welcome', '1')
          return NextResponse.redirect(redirectUrl)
        }
      }

      // 기본: 대시보드로 리디렉트 (신규 가입이면 welcome 플래그 부착)
      const dashboardUrl = new URL('/dashboard', origin)
      if (isNewUser) {
        dashboardUrl.searchParams.set('welcome', '1')
      }
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // 에러 시 로그인 페이지로
  return NextResponse.redirect(new URL('/login?error=auth', origin))
}
