# 🔧 Vercel 배포 문제 해결 가이드

## 문제 상황
- GitHub 레포: `woopsmarketing/backlinkshop` (최신 코드)
- Vercel 프로젝트: 2개 중복 생성됨
- Vercel이 `backlinkshop` 레포를 찾지 못함

---

## ✅ 해결 방법

### 1단계: 중복 프로젝트 삭제 (2분)

#### A. backlinkshop-vercel-c8uv 삭제
1. Vercel Dashboard → 프로젝트 목록
2. **backlinkshop-vercel-c8uv** 클릭
3. **Settings** (톱니바퀴) 클릭
4. 맨 아래로 스크롤 → **Delete Project** 섹션
5. 프로젝트 이름 입력: `backlinkshop-vercel-c8uv`
6. **Delete** 버튼 클릭

#### B. backlinkshop-vercel 삭제 (선택)
- 같은 방법으로 삭제
- 또는 이 프로젝트를 재사용해도 됨 (아래 3단계 참조)

---

### 2단계: GitHub 연동 권한 확인 및 재설정 (3분)

#### A. Vercel의 GitHub 권한 확인

1. **Vercel Dashboard** 접속: https://vercel.com/dashboard
2. 우측 상단 **프로필 아이콘** 클릭
3. **Settings** 클릭
4. 좌측 메뉴 **Git** 클릭
5. **GitHub** 섹션 확인:
   - "Connected" 상태 확인
   - 연결된 계정: `woopsmarketing`

#### B. GitHub에서 Vercel 권한 재설정

1. **GitHub 접속**: https://github.com/settings/installations
2. **Vercel** 찾기
3. **Configure** 클릭
4. **Repository access** 섹션:
   - 현재: "Only select repositories" (일부만 선택됨)
   - 변경: **"All repositories"** 선택 ← 중요!
   - 또는: **"Only select repositories"** → `backlinkshop` 체크박스 켜기

5. **Save** 버튼 클릭

#### C. 권한 재설정 (필요 시)

만약 `backlinkshop` 레포가 여전히 안 보이면:

1. **GitHub Settings** → **Applications** → **Authorized OAuth Apps**
2. **Vercel** 찾기
3. **Revoke** 클릭 (권한 해제)
4. **Vercel Dashboard**로 돌아가기
5. **Add New...** → **Project** 클릭
6. **Add GitHub Account** 다시 클릭
7. GitHub 권한 재승인
8. **"All repositories"** 선택 ← 이번엔 꼭!

---

### 3단계: 새 프로젝트 생성 또는 기존 재연결 (5분)

#### 옵션 A: 완전히 새로 만들기 (추천)

1. **Vercel Dashboard** → **Add New...** → **Project**
2. **Import Git Repository** 섹션
3. 이제 `woopsmarketing/backlinkshop` 보일 것임
4. **Import** 클릭

5. **Configure Project** 화면:
   - **Project Name**: `backlinkshop` (간단하게)
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)

6. **Environment Variables** 펼치기 ⚠️ 필수!
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://xxxxxxxxxx.supabase.co
   
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - ✅ Production 체크
   - ✅ Preview 체크
   - ✅ Development 체크

7. **Deploy** 버튼 클릭!

---

#### 옵션 B: 기존 프로젝트 재연결

기존 `backlinkshop-vercel` 프로젝트 유지하려면:

1. **backlinkshop-vercel** 프로젝트 클릭
2. **Settings** → **Git** 클릭
3. **Connected Git Repository** 섹션
4. **Disconnect** 클릭
5. **Connect Git Repository** 클릭
6. `woopsmarketing/backlinkshop` 선택 (이제 보일 것)
7. **Connect** 클릭
8. **Deployments** → **Redeploy** (최신 커밋으로)

---

### 4단계: 환경변수 확인 (1분)

배포 후 에러 발생 시:

1. **Settings** → **Environment Variables**
2. 3개 변수 모두 있는지 확인:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. 없으면 추가 후 **Redeploy**

---

## 📍 Supabase 키 찾는 방법

### Supabase Dashboard 접속
1. https://supabase.com/dashboard
2. 프로젝트 선택
3. **Settings** (톱니바퀴) → **API**

### 필요한 키 3개

#### 1. Project URL
```
Section: Configuration
Label: Project URL
Value: https://xxxxxxxxxx.supabase.co
```

#### 2. Anon Key (Public)
```
Section: Project API keys
Label: anon public
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
⚠️ **Public** 키 - 클라이언트에서 사용

#### 3. Service Role Key (Secret)
```
Section: Project API keys
Label: service_role secret
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
⚠️ **Secret** 키 - 서버에서만 사용, 절대 공개 금지!

---

## 🎯 최종 확인 체크리스트

### GitHub 연동
- [ ] GitHub에서 Vercel 권한 "All repositories" 또는 `backlinkshop` 선택
- [ ] Vercel에서 `backlinkshop` 레포 목록에 보임

### Vercel 프로젝트
- [ ] 중복 프로젝트 삭제 완료
- [ ] 새 프로젝트 생성 또는 기존 재연결
- [ ] 프로젝트 이름: `backlinkshop` (또는 원하는 이름)

### 환경변수
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정됨
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정됨
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 설정됨
- [ ] Production / Preview / Development 모두 체크됨

### 배포
- [ ] 첫 배포 시작됨 (자동)
- [ ] 빌드 상태: Building... → Ready
- [ ] 배포 URL 접속 가능

---

## 🚀 배포 성공 확인

### 1. 빌드 로그 확인
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (10/10)
✓ Finalizing page optimization
Deployed to Production! 🎉
```

### 2. 배포 URL 접속
```
https://backlinkshop-xxxx.vercel.app
```

### 3. 기능 테스트
- [ ] 랜딩 페이지 로딩
- [ ] CSS 정상 적용
- [ ] 회원가입 작동
- [ ] 로그인 작동
- [ ] 대시보드 접근

---

## ❌ 여전히 안 될 때

### 문제 1: backlinkshop 레포가 여전히 안 보임

**해결**:
1. GitHub → Settings → Applications → Authorized OAuth Apps
2. Vercel 찾아서 **Revoke** (권한 해제)
3. Vercel에서 다시 GitHub 연동
4. 이번엔 **"All repositories"** 선택

### 문제 2: 빌드 실패 (ESLint 에러)

**해결**:
- 로컬에서 이미 수정 완료됨
- 최신 커밋(`da8dc28`)이 배포되는지 확인
- Vercel Deployments에서 커밋 해시 확인

### 문제 3: 런타임 에러 (Supabase 연결 실패)

**해결**:
1. 환경변수 3개 모두 확인
2. 값이 정확한지 확인 (끝에 공백 없이)
3. Redeploy 실행

---

## 💡 Git Remote 정리 (선택)

### 현재 상태
```
origin      → backlinkshop (메인)
vercel-repo → backlinkshop-vercel (불필요해짐)
```

### vercel-repo 제거 (Vercel이 backlinkshop 직접 보게 되면)

```powershell
git remote remove vercel-repo
```

### 향후 배포
```powershell
git add .
git commit -m "변경 내용"
git push origin main
```

Vercel이 `backlinkshop`를 직접 보기 때문에 자동 배포됨!

---

## 🎊 최종 구조

### 올바른 구조
```
GitHub: woopsmarketing/backlinkshop
   ↓ (자동 배포)
Vercel: backlinkshop 프로젝트
   ↓ (빌드 & 배포)
배포 URL: https://backlinkshop-xxxx.vercel.app
```

### 작동 방식
1. 로컬에서 코드 수정
2. `git push origin main`
3. Vercel이 자동 감지
4. 자동 빌드 & 배포
5. 완료! 🎉

---

## 📞 단계별 요약

1. ✅ GitHub에서 Vercel 권한 "All repositories" 설정
2. ✅ Vercel에서 중복 프로젝트 삭제
3. ✅ 새 프로젝트 생성: `backlinkshop` 레포 Import
4. ✅ 환경변수 3개 입력
5. ✅ Deploy 클릭
6. ✅ 2-3분 후 배포 완료!
7. ✅ URL 접속해서 테스트

**이제 `git push`만 하면 자동 배포됩니다!** 🚀
