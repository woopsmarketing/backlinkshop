# 🚀 Vercel 배포 - 지금 바로 실행!

## ✅ 현재 상태

- ✅ GitHub 업로드 완료
- ✅ 레포지토리: https://github.com/woopsmarketing/backlinkshop
- ✅ 120개 파일 업로드됨
- ✅ `.env.local` 제외됨 (보안 ✅)

---

## 🚀 Vercel 배포 (10분 완성)

### Step 1: Vercel 계정 생성 (2분)

1. **Vercel 접속**: https://vercel.com
2. **"Sign Up" 클릭**
3. **"Continue with GitHub"** 선택
4. GitHub 계정으로 로그인
5. Vercel 권한 승인

### Step 2: 프로젝트 Import (1분)

1. **Vercel Dashboard 자동 열림**
2. **"Add New..." → "Project"** 클릭
3. **Import Git Repository**
   - `woopsmarketing/backlinkshop` 찾기
   - **"Import"** 클릭

### Step 3: 프로젝트 설정 (5분)

#### Configure Project 화면

**Project Name**: `backlink-shop` (기본값 OK)

**Framework Preset**: Next.js (자동 감지 ✅)

**Root Directory**: `./` (기본값)

**Build and Output Settings**: (모두 기본값)

- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

#### Environment Variables ⚠️ **매우 중요!**

**"Environment Variables" 펼치기**

아래 3개 변수 입력:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: (Supabase 프로젝트 URL - 아래 참조)

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: (Supabase Anon Key - 아래 참조)

Name: SUPABASE_SERVICE_ROLE_KEY
Value: (Supabase Service Role Key - 아래 참조)
```

**Supabase 키 찾는 방법**:

1. Supabase 프로젝트 Dashboard
2. Settings → API
3. Project URL 복사
4. `anon` `public` Key 복사
5. `service_role` `secret` Key 복사

**Environment 선택**:

- ✅ Production 체크
- ✅ Preview 체크
- ✅ Development 체크

### Step 4: Deploy! (2분)

**"Deploy" 버튼 클릭!**

**배포 진행**:

```
Queued...
Building...
▲ Next.js 15.5.12
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (10/10)
✓ Collecting build traces
✓ Finalizing page optimization

Deploying...
✓ Deployed to Production!
```

**소요 시간**: 2-3분

### Step 5: 배포 완료! 🎉

**배포된 URL**: `https://backlink-shop-xxxx.vercel.app`

**확인 사항**:

1. ✅ 랜딩 페이지 정상 표시
2. ✅ CSS 완벽 적용
3. ✅ 회원가입 테스트
4. ✅ 로그인 테스트
5. ✅ 무료 300 크레딧 지급 확인

**에러 발생 시**:

- Vercel Dashboard → Deployments → "View Function Logs"
- 환경 변수 누락 확인 (가장 흔한 원인)

---

## 🌐 커스텀 도메인 연결 (선택)

### 도메인 추천

| 도메인             | 가격       | SEO        | 브랜딩     | 추천도     |
| ------------------ | ---------- | ---------- | ---------- | ---------- |
| **백링크프로.com** | ₩15,000/년 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| seolinkpro.com     | $12/년     | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   |
| backlinkpro.shop   | $10/년     | ⭐⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐     |

### Vercel 도메인 연결

1. **Vercel Dashboard** → 프로젝트 선택
2. **Settings → Domains**
3. **"Add Domain"** 클릭
4. 도메인 입력 → "Add"

### DNS 설정 (도메인 구매처)

**A 레코드**:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto
```

**CNAME 레코드**:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

**5-10분 후 확인**: `https://백링크프로.com`

---

## 📊 Google Ads 준비

### Google Analytics 설정 (무료)

1. **Google Analytics 가입**: https://analytics.google.com
2. **계정 생성** → 속성 만들기
3. **Tracking ID 발급**: `G-XXXXXXXXXX`

### Vercel 환경 변수 추가

1. **Vercel Dashboard** → Settings → Environment Variables
2. **"Add New"** 클릭
   ```
   Name: NEXT_PUBLIC_GA_TRACKING_ID
   Value: G-XXXXXXXXXX
   ```
3. Production, Preview, Development 체크
4. **"Save"** → **"Redeploy"** (재배포 필요)

### Google Ads 캠페인

**이제 준비 완료!** 🎯

1. **Google Ads 가입**: https://ads.google.com
2. **검색 캠페인 생성**
   - 목표: 웹사이트 트래픽
   - 예산: 일 ₩10,000-30,000
3. **키워드 설정**:
   - `백링크 구매`
   - `PBN 백링크`
   - `SEO 백링크`
   - `구글 상위 노출`
4. **광고 문구**:

   ```
   제목 1: 2-4주 내 순위 상승 보장
   제목 2: 백링크샵 무료 300 크레딧
   제목 3: 직접 구축 PBN 네트워크

   설명: 95% 업체와 다른 자체 PBN. 3년간 패널티 0건.
   ```

5. **랜딩 페이지**: `https://백링크프로.com` (또는 Vercel URL)

---

## 🎯 배포 완료 체크리스트

### 필수 작업

- [x] GitHub 업로드 ✅
- [ ] Vercel 배포
- [ ] 환경 변수 설정
- [ ] 배포 확인

### 선택 작업

- [ ] 도메인 구매
- [ ] 도메인 연결
- [ ] Google Analytics 설정
- [ ] Google Ads 캠페인

---

## 📞 다음 단계

### 지금 바로 (10분)

1. **Vercel 접속**: https://vercel.com/new
2. **backlinkshop 선택**
3. **환경 변수 입력** (Supabase 키)
4. **Deploy 클릭!**

### 배포 후 (30분)

1. URL 확인: `https://backlink-shop-xxxx.vercel.app`
2. 회원가입 테스트
3. 관리자 계정 설정 (Supabase)
4. 초기 상품 등록

### 내일 (2시간)

1. 도메인 구매 및 연결
2. Google Analytics 설정
3. Google Ads 캠페인 시작

**7일 내 첫 유료 고객 확보 목표! 🎯**
