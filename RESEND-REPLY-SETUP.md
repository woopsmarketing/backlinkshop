# Resend 이메일 답장 처리 가이드

## 🔴 현재 상황

**발신자 이메일**: `noreply@backlinkshop.co.kr`

이 이메일은 **"답장 불가"** 주소입니다. 고객이 이 주소로 답장을 보내면:

- ❌ 답장이 전달되지 않음
- ❌ 관리자가 답장을 볼 수 없음
- ❌ 고객의 메시지가 손실됨

---

## ✅ 해결 방법 (2가지)

### **방법 1: Reply-To 헤더 추가 (권장)**

발신자는 `noreply@`로 유지하되, **답장은 다른 주소로 받도록** 설정합니다.

#### 1. 코드 수정

**파일**: `lib/email/send-email.ts`

```typescript
// 이메일 발송
const { data, error } = await resend.emails.send({
  from: FROM_EMAIL,
  to: [to],
  subject,
  react,
  replyTo: 'vnfm0580@gmail.com', // 답장 받을 이메일 추가
})
```

#### 2. 장점

- ✅ 발신자 주소는 `noreply@` 유지 (전문적)
- ✅ 고객이 답장하면 `vnfm0580@gmail.com`으로 전달
- ✅ Gmail에서 바로 확인 가능
- ✅ 추가 설정 불필요

---

### **방법 2: 발신자 주소 변경**

`noreply@` 대신 **실제 답장 받을 수 있는 주소**로 변경합니다.

#### 1. Resend에서 새 발신자 주소 추가

1. **Resend 대시보드**: https://resend.com/domains
2. **backlinkshop.co.kr** 도메인 선택
3. **Add Email** 클릭
4. `support@backlinkshop.co.kr` 또는 `contact@backlinkshop.co.kr` 추가

#### 2. Vercel 환경변수 변경

```
RESEND_FROM_EMAIL=support@backlinkshop.co.kr
```

#### 3. 장점

- ✅ 발신자 주소로 직접 답장 가능
- ✅ 더 친근한 이미지 (noreply가 아님)

#### 4. 단점

- ❌ Resend에서 추가 이메일 주소 설정 필요
- ❌ DNS 레코드 추가 필요 (이미 설정되어 있으면 OK)

---

## 📊 비교표

| 항목          | Reply-To 추가 | 발신자 주소 변경  |
| ------------- | ------------- | ----------------- |
| 설정 난이도   | ⭐ 쉬움       | ⭐⭐ 보통         |
| 추가 DNS 설정 | 불필요        | 필요 (새 주소 시) |
| 발신자 표시   | `noreply@`    | `support@`        |
| 답장 수신     | Gmail         | Gmail 또는 Resend |
| 권장도        | ✅ 권장       | ⚠️ 선택           |

---

## 🚀 즉시 적용 (방법 1 권장)

**방법 1**을 적용하면 **코드 수정 1줄**로 즉시 해결됩니다!

```typescript
// lib/email/send-email.ts
await resend.emails.send({
  from: FROM_EMAIL,
  to: [to],
  subject,
  react,
  replyTo: 'vnfm0580@gmail.com', // ← 이 한 줄 추가
})
```

### 적용 후:

1. 고객이 이메일을 받음 (발신자: `noreply@backlinkshop.co.kr`)
2. 고객이 "답장" 버튼 클릭
3. 답장 주소가 자동으로 `vnfm0580@gmail.com`으로 설정됨
4. 관리자가 Gmail에서 답장 확인 ✅

---

## 📝 참고

- Resend 공식 문서: https://resend.com/docs/api-reference/emails/send-email
- Reply-To 헤더 설명: https://en.wikipedia.org/wiki/Reply-To

---

**지금 바로 방법 1을 적용하시겠습니까?**
