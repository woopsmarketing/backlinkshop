---
name: subagent-creator
description: Creates specialized Cursor subagents (.cursor/agents/*.md) with clear triggers, scope, and output formats. Use when the user asks to create a new subagent, design agent organization, or mentions creating specialized agents.
---

# Subagent Creator for Cursor

이 스킬은 Cursor용 전문화된 서브에이전트를 생성합니다. 서브에이전트는 특정 작업에 최적화된 AI 에이전트로, `.cursor/agents/` 폴더에 저장됩니다.

## 목표

완전한 서브에이전트 마크다운 파일을 생성하여 다음 위치에 저장:
- `.cursor/agents/<subagent-name>.md`

## 서브에이전트 생성 프로세스

### 1단계: 요구사항 수집

사용자에게 다음 정보를 확인:

1. **서브에이전트 이름**: 소문자와 하이픈만 사용 (예: `code-reviewer`, `test-runner`)
2. **목적**: 이 서브에이전트가 수행할 주요 작업
3. **트리거 시나리오**: 언제 이 서브에이전트를 사용해야 하는가?
4. **사전 예방적 사용 여부**: 자동으로 실행되어야 하는가?
5. **필요한 도구**: 어떤 도구에 접근해야 하는가? (생략 시 모든 도구 상속)
6. **모델**: 특정 모델이 필요한가? (기본값: inherit)

### 2단계: 서브에이전트 파일 구조 설계

모든 서브에이전트는 다음 구조를 따라야 합니다:

```markdown
---
name: <lowercase-hyphen-name>
description: <what it does + WHEN to use. Include "use proactively" when appropriate>
model: inherit
tools: [optional - omit to inherit all tools]
---

You are <role and expertise>

When invoked:
1) <step 1>
2) <step 2>
3) <step 3>

<Additional guidelines, checklists, or processes>

Output format:
- <how to structure the response>
- <what to include>
- <what to prioritize>
```

### 3단계: Description 작성 가이드라인

Description은 **매우 중요**합니다. 메인 에이전트가 언제 이 서브에이전트를 호출할지 결정하는 기준입니다.

**좋은 Description 예시:**
```yaml
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
```

**Description 작성 규칙:**
1. **WHAT을 명확히**: 무엇을 하는 에이전트인가?
2. **WHEN을 명시**: 언제 사용해야 하는가?
3. **사전 예방적 사용 표시**: 자동 실행이 필요하면 "use proactively" 포함
4. **구체적인 트리거 키워드**: 관련 용어를 포함하여 검색 가능하게

### 4단계: Tools 선택

도구 필드는 선택사항입니다. 생략하면 모든 도구를 상속받습니다.

**일반적인 도구 조합:**

| 용도 | 도구 조합 |
|------|-----------|
| 읽기 전용 분석 | `Read, Grep, Glob, Bash` |
| 코드 수정 | `Read, Write, Edit, Grep, Glob, Bash` |
| 보안 감사 (보고만) | `Read, Grep, Glob` |
| 전체 접근 | 필드 생략 (모든 도구 상속) |

자세한 내용은 [references/available-tools.md](references/available-tools.md)를 참조하세요.

### 5단계: 파일 생성

1. `.cursor/agents/` 디렉토리가 없으면 생성
2. `.cursor/agents/<subagent-name>.md` 파일 생성
3. YAML frontmatter와 본문 작성
4. 사용자에게 생성 완료 알림

## 서브에이전트 작성 모범 사례

### ✅ 해야 할 것

1. **명확한 역할 정의**: "You are..." 문장으로 시작
2. **단계별 프로세스**: "When invoked:" 섹션에 명확한 단계 제공
3. **체크리스트 제공**: 검토해야 할 항목 나열
4. **출력 형식 지정**: 응답 구조를 명확히 정의
5. **구체적인 예시**: 가능한 경우 예시 포함
6. **간결함 유지**: 불필요한 설명 제거, 핵심만 전달

### ❌ 하지 말아야 할 것

1. **모호한 지시사항**: "적절히 처리하세요" 같은 표현 지양
2. **과도한 설명**: AI는 이미 똑똑함, 필수 정보만 제공
3. **일반적인 이름**: `helper`, `utils` 같은 이름 지양
4. **시간 의존적 정보**: "2025년 이전이면..." 같은 표현 지양
5. **일관성 없는 용어**: 같은 개념에 다른 용어 사용 지양

## 템플릿 사용

빠른 시작을 위해 [assets/subagent-template.md](assets/subagent-template.md)의 템플릿을 사용하세요.

## 예시 참조

다양한 서브에이전트 예시는 [references/examples.md](references/examples.md)를 참조하세요.

## 워크플로우 요약

```
1. 요구사항 수집
   ↓
2. 이름과 목적 정의
   ↓
3. Description 작성 (WHAT + WHEN)
   ↓
4. Tools 선택 (필요시)
   ↓
5. 본문 작성 (역할, 단계, 출력 형식)
   ↓
6. .cursor/agents/<name>.md 파일 생성
   ↓
7. 사용자에게 완료 알림
```

## 검증 체크리스트

서브에이전트 생성 후 다음을 확인:

- [ ] YAML frontmatter가 올바른 형식인가?
- [ ] `name`이 소문자와 하이픈만 사용하는가?
- [ ] `description`이 WHAT과 WHEN을 모두 포함하는가?
- [ ] "When invoked:" 섹션이 명확한 단계를 제공하는가?
- [ ] 출력 형식이 명확히 정의되어 있는가?
- [ ] 불필요한 설명이 제거되었는가?
- [ ] 일관된 용어를 사용하는가?

## 추가 리소스

- **템플릿**: [assets/subagent-template.md](assets/subagent-template.md)
- **도구 가이드**: [references/available-tools.md](references/available-tools.md)
- **예시 모음**: [references/examples.md](references/examples.md)
