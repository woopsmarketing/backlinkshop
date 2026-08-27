/**
 * Next.js 미들웨어
 * 인증 체크 및 리디렉션 처리
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 환경변수 체크
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    })

    // 현재 유저 확인
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 로그인 필요한 페이지
    // 주의: '/products' 는 신규 공개 사이트에서 /services 로 301 이전했고(next.config.mjs),
    // 회원용 상품 화면은 '/shop' 으로 옮겼다. 여기에 '/products' 를 다시 넣으면
    // 리다이렉트보다 미들웨어가 먼저 걸려 크롤러가 다시 /login 으로 튕긴다.
    const protectedPaths = ['/dashboard', '/credits', '/shop', '/orders', '/admin']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    // 비로그인 상태에서 보호된 페이지 접근 시 로그인으로 리디렉션
    if (!user && isProtectedPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 로그인 상태에서 로그인 페이지 접근 시 리디렉션
    if (user && request.nextUrl.pathname === '/login') {
      // LP에서 온 경우 from/site 파라미터를 대시보드로 전달 (대시보드에서 SEO 상품으로 리디렉트)
      const from = request.nextUrl.searchParams.get('from')
      const site = request.nextUrl.searchParams.get('site')
      if (from === 'lp') {
        const dashUrl = new URL('/dashboard', request.url)
        dashUrl.searchParams.set('from', 'lp')
        if (site) dashUrl.searchParams.set('site', site)
        return NextResponse.redirect(dashUrl)
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
