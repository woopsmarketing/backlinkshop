# 백링크샵 - 국내 최대 PBN 백링크 서비스

플랜 백링크부터 PBN, 내부 최적화까지 맞춤형 SEO 솔루션으로 2-4주 내 순위 상승을 경험하세요.

## 🚀 주요 기능

### 사용자 기능

- ✅ 회원가입 시 무료 300 크레딧 제공
- ✅ 쿠폰 등록으로 추가 크레딧 획득
- ✅ 크레딧 기반 상품 구매 시스템
- ✅ 실시간 주문 내역 조회
- ✅ 엑셀 보고서 다운로드

### 관리자 기능

- ✅ 충전 요청 승인/거절
- ✅ 주문 상태 관리 (processing/completed/failed)
- ✅ 자동 환불 처리
- ✅ 상품 CRUD
- ✅ 쿠폰 생성 및 관리
- ✅ 보고서 업로드

## 🛠 기술 스택

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Testing**: Playwright E2E
- **Deployment**: Vercel

## 📦 설치 및 실행

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn
- Supabase 계정

### 로컬 개발

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
# .env.local 파일 생성 후 아래 내용 입력
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 3. Supabase 마이그레이션 실행
npx supabase db push

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 프로덕션 빌드

```bash
npm run build
npm run start
```

## 🗄️ 데이터베이스 스키마

### 주요 테이블

- `profiles` - 사용자 프로필 및 권한
- `credit_balances` - 크레딧 잔액 (캐시)
- `credit_ledger` - 크레딧 거래 내역 (원장)
- `products` - 상품 목록
- `orders` - 주문 내역
- `coupons` - 쿠폰 관리
- `topup_requests` - 충전 요청

### 보안

- ✅ Row Level Security (RLS) 전체 적용
- ✅ Role 기반 접근 제어 (user/admin)
- ✅ 서버 사이드 검증
- ✅ SQL Injection 방지

## 🧪 테스트

### E2E 테스트 실행

```bash
# UI 모드
npm run test:e2e:ui

# 헤드리스 모드
npm run test:e2e
```

## 📈 SEO 최적화

- ✅ SSG (Static Site Generation) - 랜딩 페이지
- ✅ 메타데이터 최적화
- ✅ JSON-LD 구조화 데이터 (FAQ, Organization, Website, Service)
- ✅ 시맨틱 HTML (h1, h2, h3)
- ✅ Open Graph 이미지
- ✅ Sitemap 자동 생성

## 📁 프로젝트 구조

```
/app
  /(auth)/login          # 로그인/회원가입
  /dashboard             # 사용자 대시보드
  /credits               # 크레딧 관리
  /products              # 상품 목록
  /products/[id]         # 상품 상세
  /orders                # 주문 내역
  /admin/topups          # 관리자: 충전 승인
  /admin/orders          # 관리자: 주문 관리
  /admin/products        # 관리자: 상품 관리
  /admin/coupons         # 관리자: 쿠폰 관리
  /components            # 공통 컴포넌트

/server
  /actions               # Server Actions
  /supabase              # Supabase 헬퍼

/supabase
  /migrations            # DB 마이그레이션

/tests
  /e2e                   # E2E 테스트
  /helpers               # 테스트 유틸
```

## 📚 문서

모든 문서는 `문서/` 폴더에 분류되어 있습니다. 폴더 구조 전체는 루트의 `파일구조안내.md` 참조.

- `문서/01-기획/prd.md` — 제품 요구사항 문서
- `문서/02-배포/DEPLOY_GUIDE.md` — 배포 가이드 (최신)
- `문서/02-배포/VERCEL_FIX_GUIDE.md` — Vercel 트러블슈팅
- `문서/03-개발/RENDERING_GUIDE.md` — Next.js 렌더링 가이드
- `문서/03-개발/PERFORMANCE_OPTIMIZATION.md` — 성능 최적화
- `문서/04-API참고자료/` — VebAPI / RapidAPI / Serper 엔드포인트 문서
- `문서/05-대화기록/` — Claude 논의 요약

## 🔐 환경 변수

### 필수 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Analytics (선택)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 🚀 배포

### Vercel (추천)

1. GitHub에 코드 업로드
2. Vercel 계정 생성 (무료)
3. GitHub 레포지토리 연결
4. 환경 변수 설정
5. Deploy 클릭!

자세한 내용은 `문서/02-배포/DEPLOY_GUIDE.md` 참조

## 📞 문의

- 이메일: support@backlink-shop.com
- GitHub Issues: [이슈 등록](https://github.com/YOUR_USERNAME/backlink-shop/issues)

## 📄 라이선스

Private Project

---

**Made with ❤️ by 백링크샵 팀**
