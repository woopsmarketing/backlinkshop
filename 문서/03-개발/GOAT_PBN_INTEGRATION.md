# GOAT PBN API 연동 구현 완료

## 📋 개요

Backlink-shop에서 PBN 백링크 상품 주문 시 app.goatpbn.com API를 자동으로 호출하여 캠페인을 생성하는 시스템이 구현되었습니다.

## ✅ 구현 완료 항목

### 1. 데이터베이스 스키마 변경

- **파일**: `supabase/migrations/20260305000001_add_goat_campaign_fields.sql`
- **변경 사항**:
  - `orders.goat_campaign_id` (text, nullable): GOAT PBN 캠페인 ID
  - `orders.api_error` (text, nullable): API 호출 실패 시 에러 메시지

### 2. 환경 변수 설정

- **파일**: `.env.example`
- **추가된 변수**:
  ```bash
  GOAT_PBN_API_URL=https://app.goatpbn.com
  GOAT_PBN_API_KEY=your_api_key_here
  GOAT_PBN_DEFAULT_SITE_ID=your_default_site_id_here
  ```

### 3. TypeScript 타입 정의

- **파일**: `types/goat-pbn.ts`
- **타입**:
  - `GoatPBNCampaignRequest`: API 요청 파라미터
  - `GoatPBNCampaignResponse`: API 응답
  - `CreateGoatCampaignParams`: 간소화된 파라미터

### 4. API 클라이언트

- **파일**: `lib/api/goat-pbn.ts`
- **함수**:
  - `createGoatPBNCampaign()`: 캠페인 생성 API 호출
  - `testGoatPBNConnection()`: API 연결 테스트
- **특징**:
  - 30초 타임아웃 설정
  - 상세 로깅
  - 에러 핸들링

### 5. 주문 생성 로직 수정

- **파일**: `server/actions/orders.ts`
- **변경 사항**:
  - PBN 상품 판별 강화 (플랜 백링크 제외)
  - 크레딧 차감 후 GOAT PBN API 자동 호출
  - API 성공 시: `goat_campaign_id` 저장 + 상태 `processing`으로 변경
  - API 실패 시: `api_error` 저장 + 상태 `pending` 유지
  - 이메일에 API 결과 포함

### 6. 이메일 템플릿 수정

- **파일**:
  - `lib/email/render.tsx`
  - `lib/email/templates/order-created-customer.tsx`
  - `lib/email/templates/order-created-admin.tsx`
- **변경 사항**:
  - API 성공 시: "✅ 캠페인이 자동으로 시작되었습니다!" 메시지
  - API 실패 시: "⚠️ 자동 캠페인 생성 실패" 메시지 + 수동 처리 안내

### 7. 관리자 페이지 UI

- **파일**:
  - `app/admin/orders/components/AdminOrdersTable.tsx`
  - `server/queries/admin-orders.ts`
- **추가 기능**:
  - 테이블에 캠페인 상태 아이콘 표시 (🚀 성공, ⚠️ 에러)
  - 상세 모달에 GOAT PBN 캠페인 정보 표시
  - API 에러 발생 시 "🔄 API 재시도" 버튼

### 8. API 재시도 기능

- **파일**: `server/actions/admin-orders.ts`
- **함수**: `retryGoatPBNApiAction()`
- **기능**:
  - API 호출 실패한 주문에 대해 재시도
  - 성공 시: `goat_campaign_id` 저장 + `api_error` 제거 + 상태 `processing`으로 변경

## 🔄 데이터 플로우

```
1. 사용자가 PBN 백링크 주문
   ↓
2. 주문 생성 (orders 테이블)
   ↓
3. 크레딧 차감
   ↓
4. GOAT PBN API 호출
   ↓
   ├─ 성공 → goat_campaign_id 저장 + status: processing
   └─ 실패 → api_error 저장 + status: pending (수동 처리 필요)
   ↓
5. 이메일 발송 (고객 + 관리자)
```

## 🚀 배포 가이드

### 1. 데이터베이스 마이그레이션 실행

```bash
# Supabase CLI 사용
supabase db push

# 또는 Supabase Dashboard에서 SQL 실행
```

### 2. 환경 변수 설정

`.env.local` 파일에 다음 변수 추가:

```bash
GOAT_PBN_API_URL=https://app.goatpbn.com
GOAT_PBN_API_KEY=실제_발급받은_API_키
GOAT_PBN_DEFAULT_SITE_ID=기본_사이트_ID
```

### 3. Vercel 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables에 추가:

- `GOAT_PBN_API_URL`
- `GOAT_PBN_API_KEY`
- `GOAT_PBN_DEFAULT_SITE_ID`

### 4. 배포

```bash
git add .
git commit -m "feat: GOAT PBN API 연동 구현"
git push origin main
```

## 🧪 테스트 방법

### 1. 로컬 테스트

1. `.env.local`에 API 키 설정
2. 개발 서버 실행: `npm run dev`
3. PBN 백링크 상품 주문 생성
4. 콘솔 로그 확인:
   - `🚀 GOAT PBN 캠페인 생성 시작`
   - `✅ GOAT PBN 캠페인 생성 성공` 또는 `❌ GOAT PBN API 호출 실패`

### 2. API 연결 테스트

```typescript
import { testGoatPBNConnection } from '@/lib/api/goat-pbn'

const isConnected = await testGoatPBNConnection()
console.log('API 연결:', isConnected)
```

### 3. 관리자 페이지 확인

1. `/admin/orders` 접속
2. PBN 주문 확인
3. 상세보기 클릭
4. GOAT PBN 캠페인 정보 확인
5. API 에러 발생 시 재시도 버튼 테스트

## 📊 모니터링

### 로그 확인 위치

- **성공 로그**: `✅ GOAT PBN 캠페인 생성 성공`
- **실패 로그**: `❌ GOAT PBN API 호출 실패`
- **재시도 로그**: `🔄 GOAT PBN API 재시도 시작`

### 데이터베이스 확인

```sql
-- API 에러가 있는 주문 조회
SELECT id, site_url, keywords, api_error
FROM orders
WHERE api_error IS NOT NULL;

-- 캠페인 생성 성공한 주문 조회
SELECT id, site_url, keywords, goat_campaign_id, status
FROM orders
WHERE goat_campaign_id IS NOT NULL;
```

## ⚠️ 주의사항

1. **API 키 보안**
   - `.env.local` 파일은 절대 커밋하지 말 것
   - API 키는 서버 사이드에서만 사용

2. **에러 처리**
   - API 호출 실패해도 주문은 유지됨 (수동 처리 가능)
   - 관리자는 재시도 버튼으로 다시 시도 가능

3. **타임아웃**
   - API 호출 타임아웃: 30초
   - 타임아웃 발생 시 `api_error`에 기록

4. **상품 구분**
   - PBN 백링크 상품만 API 호출 (플랜 백링크 제외)
   - 상품명에 "PBN" 포함 && "플랜" 미포함

## 🔮 향후 개선 사항

1. **웹훅 연동** (선택)
   - GOAT PBN에서 캠페인 완료 시 Backlink-shop으로 알림
   - 자동으로 주문 상태 `completed`로 변경

2. **진행률 동기화** (선택)
   - GOAT PBN API에서 캠페인 진행률 조회
   - 관리자 페이지에 진행률 표시

3. **보고서 자동 업로드** (선택)
   - GOAT PBN에서 보고서 생성 완료 시 자동 업로드

## 📞 문의

문제 발생 시:

1. 콘솔 로그 확인
2. `orders` 테이블의 `api_error` 컬럼 확인
3. GOAT PBN API 키 유효성 확인
4. 네트워크 연결 확인
