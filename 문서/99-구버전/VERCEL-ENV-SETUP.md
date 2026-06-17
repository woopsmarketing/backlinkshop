# Vercel 환경변수 설정 가이드

## 🔑 필수 환경변수

### 1. RESEND_API_KEY

- **값**: `re_...` (Resend에서 발급받은 API 키)
- **설명**: 이메일 발송을 위한 Resend API 인증 키

### 2. RESEND_FROM_EMAIL

- **값**: `noreply@backlinkshop.co.kr`
- **설명**: 이메일 발신자 주소 (도메인 인증 완료 필요)
- **참고**: Resend에서 도메인 인증이 완료되어야 사용 가능

### 3. ADMIN_EMAIL

- **값**: `vrfm508@gmail.com` (또는 관리자 이메일)
- **설명**: 신규 주문 알림을 받을 관리자 이메일 주소

### 4. NEXT_PUBLIC_APP_URL

- **값**: `https://backlinkshop.co.kr`
- **설명**: 프로덕션 사이트 URL (이메일 템플릿 내 링크에 사용)

---

## 📋 Vercel 환경변수 설정 방법

### 방법 1: Vercel 대시보드에서 설정

1. **Vercel 프로젝트 페이지 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택 (Backlink-shop)

2. **Settings 탭 클릭**

3. **Environment Variables 메뉴 선택**

4. **각 환경변수 추가**
   - Key: `RESEND_API_KEY`
   - Value: `re_...` (실제 API 키)
   - Environment: `Production`, `Preview`, `Development` 모두 체크
   - **Add** 버튼 클릭

5. **나머지 환경변수도 동일하게 추가**

   ```
   RESEND_FROM_EMAIL = noreply@backlinkshop.co.kr
   ADMIN_EMAIL = vrfm508@gmail.com
   NEXT_PUBLIC_APP_URL = https://backlinkshop.co.kr
   ```

6. **재배포 필요**
   - 환경변수 추가 후 자동으로 재배포되지 않음
   - **Deployments** 탭 → 최신 배포 → **Redeploy** 클릭
   - 또는 GitHub에 새 커밋 푸시

---

### 방법 2: Vercel CLI로 설정

```bash
# Vercel CLI 설치 (이미 설치되어 있다면 생략)
npm i -g vercel

# 프로젝트 디렉토리에서 실행
vercel env add RESEND_API_KEY production
vercel env add RESEND_FROM_EMAIL production
vercel env add ADMIN_EMAIL production
vercel env add NEXT_PUBLIC_APP_URL production

# 재배포
vercel --prod
```

---

## ✅ 설정 확인 방법

### 1. Vercel 로그 확인

배포 후 Vercel 대시보드에서:

1. **Deployments** 탭 클릭
2. 최신 배포 선택
3. **Runtime Logs** 확인

**성공 시 로그:**

```
✅ [이메일 발송 성공] { to: 'user@example.com', subject: '주문이 접수되었습니다 - 백링크샵', messageId: '...' }
```

**실패 시 로그:**

```
❌ [이메일 발송 실패] RESEND_API_KEY가 설정되지 않았습니다
```

### 2. 테스트 주문 생성

1. 사이트에서 실제 주문 생성
2. Resend 대시보드 확인: https://resend.com/emails
3. 이메일 수신 확인:
   - 고객 이메일 (주문자)
   - 관리자 이메일 (`ADMIN_EMAIL`)

---

## 🐛 문제 해결

### 이메일이 발송되지 않는 경우

#### 1. 환경변수 미설정

**증상**: Vercel 로그에 `RESEND_API_KEY가 설정되지 않았습니다` 출력

**해결**:

- Vercel 대시보드에서 환경변수 확인
- 모든 환경(Production, Preview, Development)에 추가했는지 확인
- 재배포 실행

#### 2. 도메인 인증 미완료

**증상**: Resend에서 `Domain not verified` 에러

**해결**:

- Resend 대시보드에서 도메인 인증 상태 확인
- DNS 레코드 (TXT, MX) 재확인
- 도메인 인증 완료 후 `RESEND_FROM_EMAIL`을 인증된 도메인 주소로 변경

#### 3. API 키 오류

**증상**: `Invalid API key` 또는 `Unauthorized` 에러

**해결**:

- Resend에서 API 키 재발급
- Vercel 환경변수 업데이트
- 재배포

#### 4. 이메일 템플릿 오류

**증상**: `Failed to render email` 에러

**해결**:

- 로컬에서 `npm run dev` 실행 후 테스트
- TypeScript 에러 확인
- 빌드 로그 확인

---

## 📊 현재 설정 상태

### ✅ 완료된 항목

- [x] Resend 계정 생성
- [x] API 키 발급
- [x] 도메인 인증 (backlinkshop.co.kr)
- [x] 이메일 템플릿 구현
- [x] 코드 배포

### ⏳ 진행 필요

- [ ] Vercel 환경변수 추가
- [ ] 재배포 실행
- [ ] 테스트 주문으로 이메일 발송 확인

---

## 📝 참고 문서

- Resend 공식 문서: https://resend.com/docs
- Vercel 환경변수 가이드: https://vercel.com/docs/environment-variables
- 프로젝트 이메일 설정 가이드: `README-EMAIL-SETUP.md`
