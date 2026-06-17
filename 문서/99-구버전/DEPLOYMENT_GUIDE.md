# 🚀 백링크샵 배포 가이드 (Vercel + 구글 애즈)

## ✅ 사전 준비 체크리스트

### 1. 프로젝트 건강도 확인

- [x] TypeScript 에러 0개
- [x] ESLint 에러 0개
- [x] CSS 정상 로드
- [x] 개발 서버 정상 작동
- [ ] 의존성 업데이트 (아래 참조)

### 2. Supabase 프로덕션 설정

- [ ] 프로덕션 Supabase 프로젝트 생성
- [ ] 마이그레이션 실행
- [ ] 관리자 계정 생성
- [ ] 초기 데이터 입력 (쿠폰, 상품)

---

## 1️⃣ 의존성 업데이트 (보안 취약점 해결)

### 현재 취약점

- Next.js 14.2.0 → **15.1.6** (보안 패치)
- React 18 → **19** (성능 개선)
- ESLint Config Next 14 → **15**

### 업데이트 방법

```bash
# 1. 개발 서버 종료 (Ctrl+C)

# 2. package.json이 이미 업데이트되어 있으므로
npm install

# 3. 캐시 삭제
Remove-Item -Recurse -Force .next

# 4. 개발 서버 재시작
npm run dev
```

**예상 소요 시간**: 5-10분

---

## 2️⃣ Vercel 배포 (무료)

### Vercel이 최적인 이유

- ✅ **무료** (Hobby 플랜)
- ✅ Next.js 완벽 지원
- ✅ 자동 빌드 (Windows 권한 문제 해결)
- ✅ 자동 HTTPS
- ✅ 글로벌 CDN
- ✅ 환경 변수 관리 쉬움
- ✅ Git 연동 (자동 배포)

### 단계별 배포 가이드

#### Step 1: GitHub에 코드 업로드

```bash
# 1. Git 초기화 (아직 안 했다면)
git init

# 2. .gitignore 확인 (자동 생성되어 있음)
# .env.local은 커밋되지 않음 (안전)

# 3. 커밋
git add .
git commit -m "Initial commit - 백링크샵 MVP"

# 4. GitHub 레포지토리 생성 후 연결
# GitHub에서 새 레포지토리 생성: backlink-shop
git remote add origin https://github.com/YOUR_USERNAME/backlink-shop.git
git branch -M main
git push -u origin main
```

#### Step 2: Vercel 계정 생성 및 프로젝트 연결

1. **Vercel 가입**
   - https://vercel.com 접속
   - "Sign Up" → GitHub 계정으로 로그인
   - 무료 (Hobby 플랜)

2. **프로젝트 Import**
   - "New Project" 클릭
   - GitHub 레포지토리 선택: `backlink-shop`
   - "Import" 클릭

3. **프로젝트 설정**
   - Framework Preset: **Next.js** (자동 감지)
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build` (자동)
   - Output Directory: `.next` (자동)

4. **환경 변수 설정** ⚠️ **중요!**

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

   - Settings → Environment Variables
   - Production, Preview, Development 모두 체크

5. **Deploy 클릭!** 🚀

#### Step 3: 배포 확인

**배포 시간**: 2-3분

**완료 시 URL**: `https://backlink-shop.vercel.app`

**확인 사항**:

- [ ] 랜딩 페이지 정상 표시
- [ ] CSS 적용됨
- [ ] 회원가입 가능
- [ ] 로그인 가능

---

## 3️⃣ 커스텀 도메인 연결

### 추천 도메인 (가격: $10-20/년)

#### 옵션 1: 한글 도메인 (SEO 유리)

- `백링크프로.com` ($15/년)
- `seo백링크.com` ($15/년)

#### 옵션 2: 영문 도메인

- `seolinkpro.com` ($12/년)
- `backlinkpro.shop` ($10/년)
- `linkbuilder.shop` ($10/년)
- `pbnlinks.pro` ($12/년)

#### 옵션 3: 한글 + 영문 조합

- `백링크.shop` ($15/년)

### 도메인 구매 (추천: Cloudflare)

1. **Cloudflare Registrar** (가장 저렴) ⭐
   - https://www.cloudflare.com/products/registrar/
   - 도매가 그대로 (추가 마진 없음)
   - 무료 DNS, 무료 SSL
   - 한글 도메인 지원

2. **Namecheap** (대안)
   - https://www.namecheap.com
   - 첫 해 할인 많음

3. **가비아** (한글 도메인 편함)
   - https://www.gabia.com
   - 한국 서비스, 원화 결제

### Vercel에 도메인 연결

1. **Vercel Dashboard**
   - Project → Settings → Domains
   - "Add Domain" 클릭
   - 도메인 입력: `yourdomain.com`

2. **DNS 설정** (도메인 구매처에서)

   **A 레코드**:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **CNAME 레코드**:

   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **확인**
   - 5-10분 후 `https://yourdomain.com` 접속
   - 자동 HTTPS 적용됨!

---

## 4️⃣ 구글 애즈 설정

### 사전 준비

1. **Google Ads 계정**
   - https://ads.google.com
   - 가입 무료
   - 첫 광고는 최소 ₩10,000부터

2. **전환 추적 설정** (중요!)

#### Google Tag Manager 설치

**파일 생성**: `app/components/GoogleTag.tsx`

```tsx
// Google Tag Manager (구글 애즈 전환 추적)
'use client'

import Script from 'next/script'

export function GoogleTag() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

  if (!GA_TRACKING_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
    </>
  )
}
```

**`app/layout.tsx`에 추가**:

```tsx
import { GoogleTag } from './components/GoogleTag'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GoogleTag />
        {children}
      </body>
    </html>
  )
}
```

**Vercel 환경 변수 추가**:

```
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### 캠페인 생성

#### 1. 검색 광고 캠페인

**목표**: 웹사이트 트래픽

**타겟 키워드** (추천):

- `백링크 구매`
- `PBN 백링크`
- `SEO 백링크`
- `구글 상위 노출`
- `백링크 서비스`

**예산**: 일 ₩10,000 - ₩30,000

**광고 문구 예시**:

```
제목 1: 2-4주 내 순위 상승 보장
제목 2: 백링크샵 무료 300 크레딧
제목 3: 직접 구축 PBN 네트워크

설명 1: 95% 업체와 다른 자체 PBN. 3년간 패널티 0건. 무료 체험 후 결제.
설명 2: 의류 쇼핑몰 3주 만에 47위→3위. 치과 클리닉 5주 만에 검색 안됨→7위.
```

**랜딩 페이지**: `https://yourdomain.com`

#### 2. 전환 추적 설정

**전환 액션**:

1. 회원가입 (무료 300 크레딧 받기)
2. 쿠폰 등록
3. 상품 구매

**전환 코드 설치**:

- Google Ads → 도구 → 전환
- 웹사이트 전환 추가
- 회원가입 완료 페이지에 코드 삽입

### 예산 계획

| 항목           | 월 예산                 | 비고                 |
| -------------- | ----------------------- | -------------------- |
| **Google Ads** | ₩300,000 - ₩500,000     | 일 ₩10,000 - ₩15,000 |
| **Vercel**     | $0                      | 무료 (Hobby)         |
| **Supabase**   | $25 (₩33,000)           | Pro 플랜             |
| **도메인**     | ₩15,000/년              | 월 ₩1,250            |
| **합계**       | **₩334,250 - ₩534,250** | 초기 테스트          |

**ROI 목표**:

- 광고비 ₩300,000
- 전환율 2% (100명 클릭 → 2명 구매)
- 객단가 ₩200,000 (평균)
- 월 매출 ₩400,000+
- **순이익 ₩100,000+**

---

## 5️⃣ SEO 최적화 (Google 검색 등록)

### Google Search Console 등록

1. **Search Console 가입**
   - https://search.google.com/search-console
   - "속성 추가" → `https://yourdomain.com`

2. **소유권 확인**
   - HTML 파일 업로드 또는
   - DNS TXT 레코드 추가

3. **사이트맵 제출**

   **파일 생성**: `app/sitemap.ts`

   ```typescript
   import { MetadataRoute } from 'next'

   export default function sitemap(): MetadataRoute.Sitemap {
     return [
       {
         url: 'https://yourdomain.com',
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: 1,
       },
       {
         url: 'https://yourdomain.com/products',
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: 0.8,
       },
       {
         url: 'https://yourdomain.com/login',
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.5,
       },
     ]
   }
   ```

   - Search Console → 사이트맵 → `https://yourdomain.com/sitemap.xml`

4. **URL 검사 및 색인 요청**
   - Search Console → URL 검사
   - 메인 페이지 URL 입력
   - "색인 생성 요청" 클릭

---

## 6️⃣ 모니터링 및 분석

### Google Analytics 4 (무료)

1. **GA4 계정 생성**
   - https://analytics.google.com
   - 속성 만들기

2. **추적 코드 설치** (이미 위에서 완료)

3. **주요 지표 모니터링**
   - 일 방문자 수
   - 전환율
   - 이탈률
   - 평균 세션 시간

### Vercel Analytics (무료)

- Vercel Dashboard → Analytics
- 실시간 트래픽
- Core Web Vitals
- 페이지 성능

---

## 📋 배포 체크리스트

### 배포 전

- [ ] 의존성 업데이트 (`npm install`)
- [ ] Supabase 프로덕션 프로젝트 생성
- [ ] 관리자 계정 생성
- [ ] 초기 상품 등록 (3-5개)
- [ ] 쿠폰 생성 (무료 체험용)
- [ ] GitHub에 코드 푸시
- [ ] `.env.local`이 `.gitignore`에 있는지 확인

### Vercel 배포

- [ ] Vercel 계정 생성
- [ ] GitHub 레포지토리 연결
- [ ] 환경 변수 설정 (Supabase)
- [ ] 배포 실행
- [ ] 배포 확인 (회원가입, 로그인)

### 도메인 설정

- [ ] 도메인 구매 (Cloudflare/Namecheap)
- [ ] Vercel에 도메인 연결
- [ ] DNS 설정
- [ ] HTTPS 확인

### 구글 애즈

- [ ] Google Ads 계정 생성
- [ ] Google Tag Manager 설치
- [ ] 전환 추적 설정
- [ ] 검색 캠페인 생성
- [ ] 키워드 설정
- [ ] 광고 문구 작성
- [ ] 예산 설정

### SEO

- [ ] Google Search Console 등록
- [ ] 사이트맵 제출
- [ ] URL 색인 요청
- [ ] Google Analytics 4 설치

### 모니터링

- [ ] Google Analytics 확인
- [ ] Vercel Analytics 확인
- [ ] Supabase 로그 확인
- [ ] 첫 주문 테스트

---

## 🚀 예상 타임라인

| 단계                   | 소요 시간    | 누적 시간  |
| ---------------------- | ------------ | ---------- |
| 의존성 업데이트        | 10분         | 10분       |
| Supabase 프로덕션 설정 | 20분         | 30분       |
| GitHub 푸시            | 5분          | 35분       |
| Vercel 배포            | 10분         | 45분       |
| 도메인 구매            | 10분         | 55분       |
| 도메인 연결            | 15분         | 1시간 10분 |
| Google Tag 설치        | 10분         | 1시간 20분 |
| Google Ads 설정        | 30분         | 1시간 50분 |
| SEO 설정               | 20분         | 2시간 10분 |
| **총 소요 시간**       | **약 2시간** |            |

---

## 💰 월간 운영 비용

| 항목           | 비용          | 비고             |
| -------------- | ------------- | ---------------- |
| **Vercel**     | $0            | Hobby 플랜 무료  |
| **Supabase**   | $25 (₩33,000) | Pro 플랜 (필수)  |
| **도메인**     | ₩1,250        | 연간 ₩15,000     |
| **Google Ads** | ₩300,000+     | 초기 테스트 예산 |
| **합계**       | **₩334,250+** |                  |

**손익분기점**: 월 2-3건 주문 (객단가 ₩200,000 기준)

---

## 🎯 다음 단계

1. ✅ **지금**: 의존성 업데이트
2. 🚀 **오늘**: Vercel 배포
3. 🌐 **내일**: 도메인 구매 및 연결
4. 📊 **모레**: Google Ads 캠페인 시작

**목표**: 7일 내 첫 유료 고객 확보! 🎉
