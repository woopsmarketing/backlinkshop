/**
 * Supabase 클라이언트 헬퍼
 * 서버/클라이언트 환경에 따라 적절한 클라이언트 반환
 */

import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 브라우저 환경용 Supabase 클라이언트
 * Client Component에서 사용
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * 서버 환경용 Supabase 클라이언트
 * Server Component, Server Actions, Route Handlers에서 사용
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Server Component에서 set이 호출되면 에러 발생 (무시해도 됨)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Server Component에서 remove가 호출되면 에러 발생 (무시해도 됨)
          }
        },
      },
    }
  )
}
