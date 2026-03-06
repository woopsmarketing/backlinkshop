# 🐛 버그 수정: 중복 가입 보너스 지급

## 문제 요약

**증상**: 일부 사용자가 회원가입 시 가입 보너스(30만 크레딧)를 2번 받는 문제 발생

**발견 일시**: 2026-03-05

**영향 범위**: 회원가입 직후 여러 페이지를 빠르게 접속한 사용자

---

## 🔍 원인 분석

### Race Condition (경쟁 상태)

사용자가 로그인 후 여러 페이지를 빠르게 접속하면, 각 페이지에서 `ensureUserInitialized()` 함수가 거의 동시에 호출됩니다.

#### 발생 시나리오

```
시간축:
11:45:36.671 → 첫 번째 ensureUserInitialized 호출
              ├─ profiles 체크: 없음
              ├─ profiles INSERT 성공
              └─ 가입 보너스 지급 (+300,000)

11:45:36.680 → 두 번째 ensureUserInitialized 호출 (0.009초 후)
              ├─ profiles 체크: 없음 (첫 번째가 아직 완료 안됨)
              ├─ profiles INSERT 시도 → 중복 키 에러
              ├─ 에러 무시하고 계속 진행
              └─ 가입 보너스 또 지급 (+300,000) ← 버그!
```

### 기존 코드 문제점

**파일**: `server/actions/auth.ts`

```typescript
// 2. profiles 생성 (이미 있으면 무시)
const { error: profileError } = await supabase
  .from('profiles')
  .insert({ user_id: userId, role: 'user', email: userEmail })
  .select()
  .single()

// 중복 키 에러는 무시
if (profileError && profileError.code !== '23505') {
  throw profileError
}

// 3. 가입 보너스 지급
// ⚠️ 문제: profiles INSERT가 실패해도 보너스는 지급됨!
if (SIGNUP_BONUS_AMOUNT > 0) {
  await supabase.rpc('apply_credit_delta', {
    p_user_id: userId,
    p_amount: SIGNUP_BONUS_AMOUNT,
    p_reason: CREDIT_REASON.SIGNUP_BONUS,
    p_ref_type: null,
    p_ref_id: null,
  })
}
```

**문제**:

1. `profiles` INSERT가 중복 키 에러로 실패해도 함수가 계속 실행됨
2. 가입 보너스 지급 전에 **이미 지급되었는지 확인하지 않음**
3. 결과적으로 두 번째 호출에서도 보너스를 지급함

---

## ✅ 해결 방법

### 1. 코드 수정

**파일**: `server/actions/auth.ts`

#### 변경 사항 A: 중복 키 에러 시 즉시 종료

```typescript
// 중복 키 에러(23505)면 이미 초기화된 사용자이므로 종료
if (profileError && profileError.code === '23505') {
  console.log('이미 초기화된 사용자:', userId)
  return // ← 즉시 종료하여 중복 지급 방지
}

// 다른 에러는 throw
if (profileError) {
  throw profileError
}
```

#### 변경 사항 B: 가입 보너스 중복 확인

```typescript
// 3. 가입 보너스 지급 전 중복 확인
if (SIGNUP_BONUS_AMOUNT > 0) {
  // 이미 가입 보너스를 받았는지 체크
  const { data: existingBonus } = await supabase
    .from('credit_ledger')
    .select('id')
    .eq('user_id', userId)
    .eq('reason', CREDIT_REASON.SIGNUP_BONUS)
    .limit(1)
    .single()

  // 이미 받았으면 중복 지급 방지
  if (existingBonus) {
    console.log('이미 가입 보너스를 받은 사용자:', userId)
    return
  }

  // 4. 가입 보너스 지급
  const { error: creditError } = await supabase.rpc('apply_credit_delta', {
    p_user_id: userId,
    p_amount: SIGNUP_BONUS_AMOUNT,
    p_reason: CREDIT_REASON.SIGNUP_BONUS,
    p_ref_type: null,
    p_ref_id: null,
  })

  if (creditError) {
    console.error('가입 보너스 지급 실패:', creditError)
  }
}
```

### 2. 기존 사용자 데이터 수정

중복 보너스를 받은 기존 사용자의 크레딧을 수정하는 스크립트를 제공합니다.

#### 실행 방법

```bash
# 1. 중복 보너스 사용자 확인 (실제 수정 안함)
node scripts/fix-duplicate-signup-bonus.js

# 2. 실제 수정 실행
node scripts/fix-duplicate-signup-bonus.js --fix
```

#### 스크립트 동작

1. `credit_ledger`에서 `signup_bonus`를 2번 이상 받은 사용자 검색
2. 중복 지급된 금액 계산
3. `refund` 사유로 차감 기록 추가
4. `credit_balances` 자동 업데이트

---

## 📊 영향 분석

### 영향받은 사용자

```sql
-- 중복 보너스를 받은 사용자 확인
SELECT
  user_id,
  COUNT(*) as bonus_count,
  SUM(amount) as total_bonus
FROM credit_ledger
WHERE reason = 'signup_bonus'
GROUP BY user_id
HAVING COUNT(*) > 1;
```

### 예시 케이스

**사용자 ID**: `8a6d032e-4b78-420f-81bd-a31df582823f`

**거래 내역**:

```json
[
  {
    "id": 102,
    "amount": 300000,
    "reason": "signup_bonus",
    "created_at": "2026-03-05 11:45:36.671"
  },
  {
    "id": 103,
    "amount": 300000,
    "reason": "signup_bonus",
    "created_at": "2026-03-05 11:45:36.680" // 0.009초 후 중복!
  },
  {
    "id": 104,
    "amount": -570000,
    "reason": "product_purchase",
    "created_at": "2026-03-05 11:47:03.174"
  }
]
```

**결과**:

- 정상 잔액: 300,000 - 570,000 = -270,000 (주문 실패해야 함)
- 실제 잔액: 600,000 - 570,000 = 30,000 (주문 성공)
- **중복 지급으로 인해 잔액 부족 검증 우회**

---

## 🧪 테스트

### 수동 테스트

1. 새 계정으로 회원가입
2. 로그인 후 여러 탭에서 동시에 대시보드 접속
3. `credit_ledger` 확인:
   ```sql
   SELECT * FROM credit_ledger
   WHERE user_id = 'new-user-id'
   AND reason = 'signup_bonus';
   ```
4. **예상 결과**: 1개의 레코드만 존재

### E2E 테스트 추가 권장

```typescript
test('가입 보너스는 1번만 지급되어야 함', async ({ page }) => {
  // 회원가입
  await signUp(page, testEmail, testPassword)

  // 여러 페이지 동시 접속
  await Promise.all([page.goto('/dashboard'), page.goto('/credits'), page.goto('/products')])

  // 가입 보너스 확인
  const bonusCount = await getBonusCount(testUserId)
  expect(bonusCount).toBe(1)
})
```

---

## 📝 체크리스트

### 배포 전

- [x] 코드 수정 완료 (`server/actions/auth.ts`)
- [x] 수정 스크립트 작성 (`scripts/fix-duplicate-signup-bonus.js`)
- [x] 문서화 완료 (이 파일)
- [ ] 로컬 테스트 완료
- [ ] E2E 테스트 추가 (선택)

### 배포 후

- [ ] 기존 사용자 데이터 수정 실행
- [ ] 신규 회원가입 테스트
- [ ] 모니터링 (중복 보너스 재발 여부)

---

## 🔗 관련 파일

- **수정된 파일**: `server/actions/auth.ts`
- **수정 스크립트**: `scripts/fix-duplicate-signup-bonus.js`
- **관련 마이그레이션**: `supabase/migrations/20260205000003_credit_functions.sql`
- **관련 상수**: `lib/constants.ts` (SIGNUP_BONUS_AMOUNT)

---

## 💡 향후 개선 사항

1. **데이터베이스 제약 조건 추가**

   ```sql
   -- credit_ledger에 unique constraint 추가 (선택)
   CREATE UNIQUE INDEX idx_unique_signup_bonus
   ON credit_ledger(user_id, reason)
   WHERE reason = 'signup_bonus';
   ```

2. **분산 락(Distributed Lock) 도입**
   - Redis 또는 Supabase Advisory Lock 사용
   - `ensureUserInitialized` 실행 시 락 획득

3. **Idempotency Key 패턴**
   - 가입 보너스 지급 시 고유 키 사용
   - 중복 요청 자동 무시

---

## 📞 문의

문제가 재발하거나 추가 질문이 있으면 개발팀에 문의하세요.
