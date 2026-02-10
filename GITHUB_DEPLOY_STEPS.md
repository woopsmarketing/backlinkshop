# 🚀 GitHub 업로드 및 Vercel 배포 완전 가이드

## ✅ 현재 상태

- ✅ Git 초기화 완료
- ✅ 첫 커밋 완료 (116개 파일)
- ✅ `.gitignore` 설정 완료 (`.env.local` 제외됨)
- ✅ 개발 서버 정상 작동 (`localhost:3000`)

---

## 1️⃣ GitHub 레포지토리 생성 및 업로드

### Step 1: GitHub에서 새 레포지토리 생성

1. **GitHub 접속**: https://github.com
2. **우측 상단 "+" → "New repository"** 클릭
3. **레포지토리 설정**:
   - Repository name: `backlink-shop`
   - Description: `백링크샵 - 국내 최대 PBN 백링크 서비스`
   - Visibility: **Private** (추천) 또는 Public
   - ❌ **Initialize 옵션 모두 체크 해제** (이미 로컬에 코드 있음)
4. **"Create repository"** 클릭

### Step 2: PowerShell에서 GitHub에 푸시

**GitHub에서 표시되는 명령어를 그대로 사용하세요!**

일반적으로 이런 형태입니다:

```powershell
# 이미 완료: git init, git add, git commit

# GitHub 레포지토리 연결 (YOUR_USERNAME을 본인 계정으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/backlink-shop.git

# 브랜치 이름 main으로 변경
git branch -M main

# 푸시!
git push -u origin main
```

**GitHub 사용자명/비밀번호 입력 시**:
- Username: GitHub 사용자명
- Password: **Personal Access Token** (비밀번호 아님!)

**Personal Access Token 생성 방법**:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "Generate new token (classic)"
3. Note: `backlink-shop deployment`
4. Expiration: `90 days` 또는 `No expiration`
5. Scopes: ✅ **repo** (전체 체크)
6. "Generate token" → **토큰 복사 (한 번만 보임!)**

**푸시 명령 시 토큰 사용**:
```powershell
git push -u origin main
# Username: your-github-username
# Password: ghp_xxxxxxxxxxxxxxxxxxxx (토큰 붙여넣기)
```

### Step 3: GitHub 업로드 확인

https://github.com/YOUR_USERNAME/backlink-shop 접속

**확인 사항**:
- ✅ 116개 파일 업로드됨
- ✅ `.env.local` 없음 (보안 ✅)
- ✅ README.md 표시됨

---

## 2️⃣ Vercel 배포 (10분)

### Step 1: Vercel 계정 생성

1. **Vercel 접속**: https://vercel.com
2. **"Sign Up"** 클릭
3. **"Continue with GitHub"** 선택 (가장 쉬움)
4. GitHub 계정으로 로그인
5. Vercel이 GitHub 접근 권한 요청 → **"Authorize Vercel"** 클릭

### Step 2: 프로젝트 Import

1. **Vercel Dashboard** → **"Add New..." → "Project"**
2. **Import Git Repository**
   - GitHub 레포지토리 목록에서 `backlink-shop` 찾기
   - **"Import"** 클릭

3. **Configure Project**
   - **Framework Preset**: Next.js (자동 감지 ✅)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동)
   - **Output Directory**: `.next` (자동)
   - **Install Command**: `npm install` (자동)

### Step 3: 환경 변수 설정 ⚠️ **매우 중요!**

**"Environment Variables" 섹션에서**:

```
NEXT_PUBLIC_SUPABASE_URL
값: https://your-project.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
값: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SUPABASE_SERVICE_ROLE_KEY
값: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**각 환경 변수마다**:
- ✅ Production 체크
- ✅ Preview 체크  
- ✅ Development 체크

### Step 4: 배포!

**"Deploy"** 클릭!

**배포 진행**:
```
Building...
▲ Next.js 15.5.12
✓ Compiled successfully
Creating an optimized production build...
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         85.3 kB
...
Deployed to Production!
```

**소요 시간**: 2-3분

### Step 5: 배포 확인

**배포 완료 시 URL**: `https://backlink-shop.vercel.app`

**확인 사항**:
1. 랜딩 페이지 정상 표시
2. CSS 적용됨
3. 회원가입 가능 (무료 300 크레딧)
4. 로그인 가능
5. 상품 목록 조회

**에러 발생 시**:
- Vercel Dashboard → Deployments → "View Function Logs"
- 환경 변수 누락 확인

---

## 3️⃣ 커스텀 도메인 연결 (선택)

### Step 1: 도메인 구매

#### 추천 도메인

| 도메인 | 가격 | SEO | 브랜딩 |
|--------|------|-----|--------|
| **백링크프로.com** ⭐ | ₩15,000/년 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| seolinkpro.com | $12/년 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| backlinkpro.shop | $10/년 | ⭐⭐⭐ | ⭐⭐⭐ |

#### 구매처

**Cloudflare Registrar** (가장 추천) ⭐⭐⭐⭐⭐
- 도매가 그대로 (추가 마진 없음)
- 무료 DNS
- 무료 SSL
- 한글 도메인 지원

**가비아** (한글 도메인 편함)
- 한국 서비스
- 원화 결제

### Step 2: Vercel에 도메인 추가

1. **Vercel Dashboard** → 프로젝트 선택
2. **Settings → Domains**
3. **"Add Domain"** 클릭
4. 도메인 입력: `백링크프로.com` 또는 `seolinkpro.com`
5. **"Add"** 클릭

### Step 3: DNS 설정 (도메인 구매처에서)

Vercel이 알려주는 DNS 레코드를 추가:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**Cloudflare에서**:
- DNS → Add record
- Type: A, Name: @, IPv4: 76.76.21.21
- Type: CNAME, Name: www, Target: cname.vercel-dns.com

### Step 4: 확인 (5-10분 후)

`https://백링크프로.com` 또는 `https://seolinkpro.com` 접속

✅ 자동 HTTPS 적용됨!

---

## 4️⃣ 구글 애즈 준비

### Google Tag Manager 설치

**터미널에서 실행**:

```powershell
# 1. 파일이 이미 준비되어 있는지 확인
# (아래 파일을 생성해야 함)
```

저는 지금 파일을 생성하겠습니다! ⬇️

---

## 🎯 최종 답변

### Q1: 이대로 진행해도 괜찮을까?
**A:** ✅ **완벽합니다!**

현재 상태:
- Next.js 15.5.12 ✅ (최신 버전)
- 개발 서버 정상 작동 ✅
- 컴파일 성공 ✅

**경고 무시해도 됨**:
- `package-lock.json` 경로 경고 → 개발에 영향 없음
- `webpack cache` 경고 → 성능 힌트일 뿐

### Q2: GitHub 업로드하고 진행하면 돼?
**A:** ✅ **네, 바로 가능합니다!**

**준비 완료**:
- ✅ Git 초기화
- ✅ 첫 커밋 완료
- ✅ `.gitignore` 완벽 설정

**다음 단계**:
```powershell
# GitHub 레포지토리 생성 후
git remote add origin https://github.com/YOUR_USERNAME/backlink-shop.git
git push -u origin main
```

### Q3: .gitignore 정리?
**A:** ✅ **이미 완료!**

**제외된 항목** (보안/불필요):
- ✅ `.env.local` (비밀 키)
- ✅ `node_modules` (무거움)
- ✅ `.next` (빌드 결과)
- ✅ `test-results` (테스트 결과)

**포함된 항목** (필수):
- ✅ 소스 코드 전체
- ✅ 마이그레이션 파일
- ✅ README, 가이드 문서

---

## 📋 생성된 파일

1. ✅ **README.md** - 프로젝트 소개
2. ✅ **DEPLOYMENT_GUIDE.md** - 배포 완전 가이드
3. ✅ **GITHUB_DEPLOY_STEPS.md** - 단계별 가이드 (방금 생성)
4. ✅ **.gitignore** - 보안 강화
5. ✅ **next.config.mjs** - 경고 해결

---

## 🚀 지금 바로 실행하세요!

### 1단계: GitHub 레포지토리 생성 (2분)
https://github.com/new

### 2단계: 푸시 (1분)
```powershell
git remote add origin https://github.com/YOUR_USERNAME/backlink-shop.git
git push -u origin main
```

### 3단계: Vercel 배포 (10분)
https://vercel.com/new

**환경 변수 꼭 입력!** (Supabase 키)

### 4단계: 확인!
`https://backlink-shop.vercel.app` 접속!

**바로 시작하세요! 🎉**