/**
 * Google OAuth 콜백 라우트
 * Supabase OAuth 인증 후 코드 교환 및 리디렉션 처리
 * LP에서 온 경우 → 온페이지 SEO 상품 페이지로 리디렉트 (URL 유지)
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/server/supabase/client'

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
      // LP에서 온 경우: 온페이지 SEO 상품 페이지로 리디렉트
      if (from === 'lp') {
        // 온페이지 SEO 점검 상품 ID 조회
        const serverSupabase = await createServerSupabaseClient()
        const { data: seoProduct } = await serverSupabase
          .from('products')
          .select('id')
          .eq('name', '온페이지 SEO 점검')
          .eq('status', 'active')
          .single()

        if (seoProduct) {
          const redirectUrl = new URL(`/products/${seoProduct.id}`, origin)
          if (site) {
            redirectUrl.searchParams.set('site', site)
          }
          return NextResponse.redirect(redirectUrl)
        }
      }

      // 기본: 대시보드로 리디렉트
      return NextResponse.redirect(new URL('/dashboard', origin))
    }
  }

  // 에러 시 로그인 페이지로
  return NextResponse.redirect(new URL('/login?error=auth', origin))
}
