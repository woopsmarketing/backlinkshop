# Next.js 렌더링 방식 완전 가이드

## 📊 렌더링 방식 비교

### 1. SSG (Static Site Generation) - 정적 사이트 생성

**언제 렌더링:** 빌드 시 (1회)  
**SEO:** ⭐⭐⭐⭐⭐ 완벽  
**속도:** ⭐⭐⭐⭐⭐ 최고속  
**비용:** ⭐⭐⭐⭐⭐ 최저 (CDN 캐싱)

```tsx
// app/page.tsx
export const dynamic = 'force-static' // SSG 강제

export default function Home() {
  // 빌드 시 1회만 실행
  return <div>Hello World</div>
}
```

**장점:**
- HTML이 빌드 시 생성 → CDN 캐싱 → 전 세계 초고속 로딩
- 서버 부하 0 (정적 파일만 제공)
- SEO 완벽 (크롤러가 즉시 모든 콘텐츠 확인)

**단점:**
- 데이터 변경 시 재배포 필요
- 사용자별 개인화 불가

**사용 사례:**
- 랜딩 페이지 ✅ (우리 프로젝트)
- 블로그, 문서, 마케팅 페이지
- 자주 변하지 않는 콘텐츠

---

### 2. ISR (Incremental Static Regeneration) - 증분 정적 재생성

**언제 렌더링:** 빌드 시 + 주기적 재생성  
**SEO:** ⭐⭐⭐⭐⭐ 완벽  
**속도:** ⭐⭐⭐⭐ 매우 빠름  
**비용:** ⭐⭐⭐⭐ 낮음

```tsx
// app/page.tsx
export const revalidate = 3600 // 1시간마다 재생성

export default async function Home() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>
}
```

**장점:**
- SSG의 속도 + 주기적 데이터 업데이트
- 재배포 없이 콘텐츠 갱신
- SEO 완벽 유지

**단점:**
- 실시간 데이터는 불가 (최대 revalidate 시간만큼 지연)

**사용 사례:**
- 뉴스 사이트 (10분마다 갱신)
- 상품 목록 (1시간마다 갱신)
- 블로그 (1일 1회 갱신)

---

### 3. SSR (Server-Side Rendering) - 서버 사이드 렌더링

**언제 렌더링:** 매 요청마다  
**SEO:** ⭐⭐⭐⭐⭐ 완벽  
**속도:** ⭐⭐⭐ 보통 (서버 처리 시간)  
**비용:** ⭐⭐ 높음 (서버 리소스)

```tsx
// app/dashboard/page.tsx
// dynamic route나 cookies/headers 사용 시 자동 SSR

import { cookies } from 'next/headers'

export default async function Dashboard() {
  const cookieStore = await cookies()
  const user = await getUser(cookieStore)
  
  return <div>Welcome, {user.name}</div>
}
```

**장점:**
- 실시간 데이터 제공
- 사용자별 개인화 가능
- SEO 완벽 (HTML에 모든 콘텐츠 포함)

**단점:**
- 매 요청마다 서버 렌더링 → 느림
- 서버 부하 높음
- CDN 캐싱 불가

**사용 사례:**
- 대시보드 (사용자별 데이터)
- 마이페이지 (개인 정보)
- 실시간 데이터 (주식, 날씨)

---

### 4. CSR (Client-Side Rendering) - 클라이언트 사이드 렌더링

**언제 렌더링:** 브라우저에서 (JavaScript 실행 후)  
**SEO:** ⭐ 나쁨 (초기 HTML 비어있음)  
**속도:** ⭐⭐ 느림 (JS 다운로드 + 실행)  
**비용:** ⭐⭐⭐⭐ 낮음 (서버 부하 없음)

```tsx
// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'

export default function Admin() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data').then(res => setData(res))
  }, [])
  
  return <div>{data}</div>
}
```

**장점:**
- 서버 부하 0
- 인터랙티브한 UI 구현 쉬움

**단점:**
- SEO 매우 나쁨 (크롤러가 빈 HTML만 봄)
- 초기 로딩 느림 (JS 다운로드 필요)
- JavaScript 비활성화 시 작동 안 함

**사용 사례:**
- 관리자 페이지 (SEO 불필요)
- 로그인 후 페이지
- 내부 툴, 대시보드

---

## 🎯 우리 프로젝트 렌더링 전략

### 랜딩 페이지 (`app/page.tsx`)
**방식:** SSG  
**이유:**
- SEO 최우선 (구글 광고 랜딩)
- 콘텐츠 거의 변하지 않음
- 초고속 로딩 필요

```tsx
export const dynamic = 'force-static'

export default function Home() {
  return (
    <main>
      {/* 모든 콘텐츠 정적 생성 */}
      <FAQList /> {/* 서버 컴포넌트 - HTML에 포함 ✅ */}
    </main>
  )
}
```

### 대시보드 (`app/dashboard/page.tsx`)
**방식:** SSR  
**이유:**
- 사용자별 데이터 (크레딧, 주문 내역)
- 실시간 정보 필요

```tsx
// 자동 SSR (cookies 사용)
export default async function Dashboard() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return <div>Welcome, {user.email}</div>
}
```

### 상품 목록 (`app/products/page.tsx`)
**방식:** ISR (추천)  
**이유:**
- 상품 정보는 자주 변하지 않음
- 1시간마다 갱신으로 충분

```tsx
export const revalidate = 3600 // 1시간

export default async function Products() {
  const products = await getProducts()
  return <ProductList products={products} />
}
```

---

## 🔍 렌더링 방식 확인 방법

### 1. 빌드 로그 확인 (가장 정확)

```bash
npm run build
```

**출력 예시:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         85.3 kB  ← SSG
├ ƒ /dashboard                           3.1 kB         83.2 kB  ← SSR
├ ○ /products                            4.5 kB         84.6 kB  ← ISR
└ ● /blog/[slug]                         2.8 kB         82.9 kB  ← Dynamic

○  (Static)   정적 생성 (SSG/ISR)
ƒ  (Dynamic)  서버 렌더링 (SSR)
●  (SSG)      정적 생성 with dynamic params
```

### 2. 페이지 소스 보기

**브라우저에서 `Ctrl+U` (Windows) / `Cmd+Option+U` (Mac)**

**SSG/SSR (좋음):**
```html
<html>
  <body>
    <main>
      <h1>백링크샵</h1>
      <p>플랜 백링크부터 PBN까지...</p>
      <!-- 모든 콘텐츠가 HTML에 포함 ✅ -->
    </main>
  </body>
</html>
```

**CSR (나쁨):**
```html
<html>
  <body>
    <div id="root"></div>
    <!-- 콘텐츠 없음, JavaScript로 채움 ❌ -->
    <script src="/app.js"></script>
  </body>
</html>
```

### 3. Network 탭 확인

**개발자 도구 (F12) → Network → 새로고침**

- **SSG/SSR:** 첫 요청에서 완전한 HTML (크기 큼)
- **CSR:** 첫 요청에서 빈 HTML (크기 작음) + 여러 API 요청

### 4. Google Lighthouse

**개발자 도구 (F12) → Lighthouse → Generate report**

- **SSG:** Performance 95+, SEO 100
- **CSR:** Performance 60-70, SEO 70-80

---

## 📈 SEO 최적화 체크리스트

### ✅ SSG/SSR 사용 (랜딩, 블로그, 상품)
- HTML에 모든 콘텐츠 포함
- 크롤러가 즉시 인덱싱

### ✅ 메타데이터 최적화
```tsx
// app/layout.tsx
export const metadata = {
  title: '백링크샵 - 국내 최대 PBN 백링크 서비스',
  description: '2-4주 내 순위 상승, 무료 300 크레딧...',
  openGraph: {
    title: '백링크샵',
    description: '...',
    images: ['/og-image.jpg']
  }
}
```

### ✅ 구조화 데이터 (JSON-LD)
```tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
</script>
```

### ✅ 시맨틱 HTML
```tsx
<main>
  <section>
    <h1>메인 제목</h1>
    <h2>서브 제목</h2>
    <article>콘텐츠</article>
  </section>
</main>
```

### ✅ 이미지 최적화
```tsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="백링크샵 히어로 이미지"
  width={1200}
  height={630}
  priority // LCP 개선
/>
```

### ✅ Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

---

## 🚀 성능 최적화 팁

### 1. 코드 분할
```tsx
// 무거운 컴포넌트 lazy load
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
})
```

### 2. 폰트 최적화
```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### 3. 불필요한 JavaScript 제거
```tsx
// 서버 컴포넌트 사용 (기본값)
// 'use client' 최소화
```

---

## 📝 FAQ vs 아코디언 (SEO 관점)

### ❌ 아코디언 (JavaScript 필요)
```tsx
'use client'
const [open, setOpen] = useState(false)

// 문제: 초기 HTML에 답변이 숨겨짐
<div className={open ? 'block' : 'hidden'}>
  {answer}
</div>
```

**SEO 영향:**
- Google은 숨겨진 콘텐츠도 크롤링하지만 낮은 가중치
- JavaScript 비활성화 시 콘텐츠 안 보임

### ✅ 일반 리스트 (서버 컴포넌트)
```tsx
// 서버 컴포넌트 (기본값)
export function FAQList() {
  return (
    <div>
      {faqs.map(faq => (
        <div>
          <h3>{faq.question}</h3>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  )
}
```

**SEO 영향:**
- HTML에 모든 콘텐츠 포함 ✅
- 크롤러가 즉시 인덱싱 ✅
- JavaScript 없이도 작동 ✅

---

## 🎯 결론

**랜딩 페이지 = SSG + 서버 컴포넌트 + 구조화 데이터**

이 조합이 SEO 최적화의 황금 공식입니다! 🏆
