# 이메일 알림 시스템 설정 가이드

## 📧 Resend 설정

### 1. Resend 계정 생성

1. [Resend](https://resend.com) 접속
2. 회원가입 (무료 플랜: 월 3,000통)
3. API Key 발급

### 2. 도메인 인증 (중요!)

Resend에서 이메일을 발송하려면 **도메인 인증**이 필요합니다.

#### 옵션 A: 테스트용 (즉시 사용 가능)

- `onboarding@resend.dev` 사용
- 제한: 본인 이메일로만 발송 가능
- 프로덕션 사용 불가

#### 옵션 B: 프로덕션용 (도메인 필요)

1. Resend 대시보드 → Domains → Add Domain
2. 도메인 입력 (예: `backlink-shop.com`)
3. DNS 레코드 추가:
   ```
   Type: TXT
   Name: @
   Value: (Resend에서 제공하는 값)
   ```
4. 인증 완료 후 발신자 이메일 설정:
   - `noreply@backlink-shop.com`
   - `support@backlink-shop.com`

### 3. 환경변수 설정

`.env.local` 파일에 다음 추가:

```bash
# Resend API Key (필수)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# 발신자 이메일 (도메인 인증 필요)
RESEND_FROM_EMAIL=noreply@backlink-shop.com

# 관리자 이메일 (신규 주문 알림 수신)
ADMIN_EMAIL=admin@backlink-shop.com

# 앱 URL (이메일 링크용)
NEXT_PUBLIC_APP_URL=https://backlink-shop.com
```

### 4. 테스트

로컬에서 테스트:

```bash
npm run dev
```

1. 회원가입 후 상품 주문
2. 이메일 수신 확인:
   - 고객: 주문 접수 이메일
   - 관리자: 신규 주문 알림 이메일

---

## 📬 발송되는 이메일 종류

### 고객용 이메일

1. **주문 접수 확인**
   - 발송 시점: 주문 생성 즉시
   - 내용: 주문 정보, 요청사항, 다음 단계 안내

2. **주문 상태 변경**
   - 발송 시점: 관리자가 상태 변경 시
   - 내용: 처리중 → 완료 → 실패 각 단계별 안내

3. **보고서 업로드**
   - 발송 시점: 관리자가 보고서 업로드 시
   - 내용: 보고서 다운로드 링크

4. **크레딧 충전 승인**
   - 발송 시점: 관리자가 충전 승인 시
   - 내용: 충전 금액, 현재 잔액

### 관리자용 이메일

1. **신규 주문 알림**
   - 발송 시점: 고객이 주문 생성 시
   - 내용: 주문 상세, 고객 정보, 요청사항

---

## 🚨 문제 해결

### 이메일이 발송되지 않는 경우

1. **API Key 확인**

   ```bash
   # .env.local 파일 확인
   echo $RESEND_API_KEY
   ```

2. **도메인 인증 상태 확인**
   - Resend 대시보드 → Domains
   - Status가 "Verified"인지 확인

3. **로그 확인**

   ```bash
   # 서버 로그에서 에러 확인
   npm run dev
   # 주문 생성 후 콘솔 확인
   ```

4. **Resend 대시보드 확인**
   - Emails 탭에서 발송 내역 확인
   - 실패한 이메일의 에러 메시지 확인

### 스팸 폴더 확인

- 처음에는 스팸으로 분류될 수 있음
- 발신자를 연락처에 추가하면 해결

---

## 💡 프로덕션 배포 시 주의사항

### 1. 환경변수 설정

Vercel/기타 호스팅 서비스에서:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_APP_URL`

### 2. 도메인 인증 필수

- 테스트용 `onboarding@resend.dev`는 프로덕션 사용 불가
- 반드시 자체 도메인 인증 필요

### 3. 발송량 모니터링

- 무료 플랜: 월 3,000통
- 초과 시 유료 플랜 전환 필요
- Resend 대시보드에서 사용량 확인

---

## 📊 이메일 템플릿 커스터마이징

템플릿 파일 위치:

```
lib/email/templates/
├── order-created-customer.tsx    # 주문 접수 (고객)
├── order-created-admin.tsx       # 신규 주문 (관리자)
├── order-status-changed.tsx      # 상태 변경
├── report-uploaded.tsx           # 보고서 업로드
└── topup-approved.tsx            # 충전 승인
```

수정 방법:

1. 해당 파일 열기
2. HTML/CSS 수정
3. 저장 후 재시작

---

## 🔗 참고 링크

- [Resend 공식 문서](https://resend.com/docs)
- [Resend React Email](https://react.email)
- [도메인 인증 가이드](https://resend.com/docs/dashboard/domains/introduction)
