# 🚀 배포 가이드

## 문제 발생 및 해결

### 문제 상황
Vercel이 **2개의 다른 GitHub 레포지토리**를 보고 있었습니다:
- ❌ Vercel 연결: `woopsmarketing/backlinkshop-vercel` (오래된 코드)
- ✅ 실제 개발: `woopsmarketing/backlinkshop` (최신 코드)

### 해결 완료
- ✅ 두 레포지토리 동기화 완료
- ✅ 최신 코드(커밋 `39a8344`) 푸시 완료
- ✅ ESLint 에러 수정 완료
- ✅ 자동 배포 스크립트 생성

---

## 배포 방법

### 방법 1: 자동 스크립트 (추천)

```powershell
.\deploy.ps1 "커밋 메시지"
```

**예시**:
```powershell
.\deploy.ps1 "랜딩페이지 버튼 색상 변경"
.\deploy.ps1 "상품 가격 업데이트"
.\deploy.ps1 "FAQ 섹션 추가"
```

**동작**:
1. 모든 변경사항 추가 (`git add .`)
2. 커밋 생성
3. `origin` (backlinkshop) 푸시
4. `vercel-repo` (backlinkshop-vercel) 푸시 ← Vercel이 보는 레포
5. Vercel 자동 배포 트리거

---

### 방법 2: 수동 푸시

```powershell
git add .
git commit -m "변경 내용"
git push origin main
git push vercel-repo main
```

---

## Vercel 배포 확인

### 1단계: Vercel Dashboard 접속
**URL**: https://vercel.com/dashboard

### 2단계: Deployments 확인
- 프로젝트 선택
- "Deployments" 탭 클릭
- 최신 배포 상태 확인:
  - 🟡 **Building** → 빌드 중 (2분)
  - 🟢 **Ready** → 배포 완료!
  - 🔴 **Failed** → 에러 발생 (로그 확인)

### 3단계: 배포 URL 확인
```
https://backlinkshop-vercel-xxxx.vercel.app
```

---

## 현재 Git Remote 구조

```
d:\Documents\Backlink-shop
├── origin (메인 개발 레포)
│   └── https://github.com/woopsmarketing/backlinkshop
│
└── vercel-repo (Vercel 배포용)
    └── https://github.com/woopsmarketing/backlinkshop-vercel
```

**동기화 전략**:
- 모든 변경사항을 **두 레포에 동시 푸시**
- `deploy.ps1` 스크립트가 자동으로 처리

---

## 최신 배포 상태

### 커밋 히스토리
```
39a8344 - Vercel 배포 에러 자동 수정 시스템 추가 ✅
98d0978 - ESLint 에러 수정 (따옴표 이스케이프) ✅
abbfc2f - 불필요한 파일 제거 (.cursor, 개발 문서) ✅
```

### 수정된 내용
**`app/page.tsx`**:
- ✅ 라인 383: `"` → `&ldquo;` / `&rdquo;`
- ✅ 라인 410: `"` → `&ldquo;` / `&rdquo;`
- ✅ 라인 437: `"` → `&ldquo;` / `&rdquo;`
- ✅ 라인 802: `"보험", "대출"` → `&ldquo;보험&rdquo;, &ldquo;대출&rdquo;`

**`.eslintrc.json`**:
- ✅ `react/no-unescaped-entities: "error"` 규칙 추가

---

## 에러 발생 시 대응

### ESLint 에러 (react/no-unescaped-entities)
**증상**: 빌드 시 `"` can be escaped with `&ldquo;` 에러

**해결**:
1. 에러 로그에서 파일명과 라인 번호 확인
2. 해당 라인의 `"` → `&ldquo;` / `&rdquo;` 변환
3. `.\deploy.ps1 "ESLint 에러 수정"` 실행

**자동화**: `/vercel-deploy-fixer` 서브에이전트가 자동 수정

---

### 환경변수 누락
**증상**: 빌드는 성공했지만 런타임 에러

**해결**:
1. Vercel Dashboard → Settings → Environment Variables
2. 누락된 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Production / Preview / Development 모두 체크
4. "Redeploy" 클릭 (재배포)

---

### 빌드 타임아웃
**증상**: "Build exceeded maximum duration"

**해결**:
1. Vercel 프로젝트 설정 → Functions
2. Timeout 30초로 증가
3. 또는 무거운 의존성 제거

---

## 배포 후 체크리스트

### 필수 확인 사항
- [ ] 랜딩 페이지 정상 로딩
- [ ] CSS 완벽 적용
- [ ] 회원가입/로그인 작동
- [ ] 무료 300 크레딧 지급 확인
- [ ] 상품 목록 표시
- [ ] 관리자 페이지 접근 (role=admin)

### 선택 확인 사항
- [ ] Google Analytics 추적 작동
- [ ] SEO 메타태그 확인
- [ ] FAQ JSON-LD 구조화 데이터
- [ ] 모바일 반응형 확인

---

## Git Remote 관리

### Remote 확인
```powershell
git remote -v
```

**출력**:
```
origin      https://github.com/woopsmarketing/backlinkshop.git
vercel-repo https://github.com/woopsmarketing/backlinkshop-vercel.git
```

### Remote 추가 (필요 시)
```powershell
git remote add vercel-repo https://github.com/woopsmarketing/backlinkshop-vercel.git
```

### Remote 제거 (필요 시)
```powershell
git remote remove vercel-repo
```

---

## 롤백 방법

### 이전 버전으로 되돌리기

1. **커밋 히스토리 확인**:
   ```powershell
   git log --oneline -10
   ```

2. **특정 커밋으로 롤백**:
   ```powershell
   git reset --hard <커밋 해시>
   git push origin main --force
   git push vercel-repo main --force
   ```

3. **Vercel 재배포 확인**

**⚠️ 주의**: `--force` 사용 시 이후 커밋 모두 삭제됨!

---

## 도메인 연결 (추후)

### 커스텀 도메인 추가

1. **Vercel Dashboard** → 프로젝트 선택
2. **Settings** → **Domains**
3. **"Add Domain"** 클릭
4. 도메인 입력 (예: `백링크프로.com`)
5. DNS 설정:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
6. 5-10분 후 연결 완료

---

## 문제 해결 요약

| 문제 | 원인 | 해결 |
|------|------|------|
| ESLint 에러 | 따옴표 이스케이프 안 됨 | ✅ HTML 엔티티로 변환 |
| Vercel 구버전 빌드 | 잘못된 레포 연결 | ✅ 두 레포 동기화 |
| 수동 푸시 번거로움 | 2곳 푸시 필요 | ✅ `deploy.ps1` 스크립트 |

---

## 다음 단계

### 지금 바로 (5분)
1. ✅ Vercel Dashboard에서 배포 완료 확인
2. ✅ 배포된 URL 접속 테스트
3. ✅ 회원가입/로그인 테스트

### 오늘 중 (1시간)
1. 관리자 계정 설정 (Supabase)
2. 초기 상품 등록 (3-5개)
3. 테스트 주문 진행

### 내일 (2시간)
1. 도메인 구매 및 연결
2. Google Ads 캠페인 설정
3. 첫 광고 게재 시작

---

## 🎉 배포 완료!

**현재 상태**:
- ✅ 코드 100% 동기화
- ✅ ESLint 에러 0개
- ✅ Vercel 배포 준비 완료
- ✅ 자동 배포 시스템 구축

**다음 배포 시**:
```powershell
.\deploy.ps1 "변경 내용"
```

**끝!** 🚀
