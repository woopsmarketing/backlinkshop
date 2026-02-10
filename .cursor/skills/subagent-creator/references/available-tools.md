# Available Tools for Cursor Subagents

서브에이전트는 Cursor의 모든 내부 도구에 접근할 수 있습니다. `tools` 필드를 생략하면 부모로부터 모든 도구를 상속받습니다.

## 핵심 도구 (Core Tools)

| 도구 | 설명 |
|------|------|
| `Read` | 파일 내용 읽기 |
| `Write` | 파일 생성 또는 덮어쓰기 |
| `StrReplace` | 기존 파일에 정확한 편집 수행 |
| `Glob` | 패턴 매칭으로 파일 찾기 |
| `Grep` | 정규식으로 파일 내용 검색 |
| `Shell` | 셸 명령 실행 |
| `Task` | 서브에이전트 생성 (서브에이전트에서는 권장하지 않음) |

## 상호작용 도구 (Interaction Tools)

| 도구 | 설명 |
|------|------|
| `AskQuestion` | 사용자에게 명확한 질문 |
| `TodoWrite` | 작업 목록 관리 |

## 웹 도구 (Web Tools)

| 도구 | 설명 |
|------|------|
| `WebFetch` | 웹 콘텐츠 가져오기 및 처리 |
| `WebSearch` | 웹 검색 |

## IDE 도구 (사용 가능한 경우)

| 도구 | 설명 |
|------|------|
| `ReadLints` | VS Code에서 언어 진단 정보 가져오기 |
| `EditNotebook` | Jupyter 커널에서 코드 실행 |

## MCP 도구

서브에이전트는 구성된 MCP 서버의 도구에도 접근할 수 있습니다. MCP 도구 이름은 `CallMcpTool` 패턴을 따릅니다.

## 일반적인 도구 조합

### 읽기 전용 리서치
```yaml
tools: Read, Grep, Glob, Shell
```
**적합한 용도**: 코드 분석, 문서 검토, 코드베이스 탐색

**사용 예시**:
- 코드 리뷰 (보고만 하고 수정하지 않음)
- 보안 감사
- 문서 분석
- 아키텍처 검토

### 코드 수정
```yaml
tools: Read, Write, StrReplace, Grep, Glob, Shell
```
**적합한 용도**: 기능 구현, 버그 수정, 리팩토링

**사용 예시**:
- 기능 개발
- 버그 수정
- 코드 리팩토링
- 테스트 작성

### 최소 쓰기 권한
```yaml
tools: Read, Grep, Glob
```
**적합한 용도**: 보안 감사, 코드 리뷰 (보고 전용)

**사용 예시**:
- 보안 취약점 스캔
- 코드 품질 분석
- 의존성 검토
- 라이선스 검사

### 전체 접근
```yaml
# tools 필드 생략
```
**적합한 용도**: 복잡한 작업, 다양한 도구가 필요한 경우

**사용 예시**:
- 전체 기능 구현
- 복잡한 디버깅
- 프로젝트 설정
- 마이그레이션 작업

## 도구 선택 가이드

### 언제 도구를 제한해야 하는가?

1. **보안이 중요한 작업**
   - 읽기 전용 접근으로 제한
   - 예: 보안 감사, 코드 리뷰

2. **특정 작업에 집중**
   - 필요한 도구만 제공
   - 예: 문서 작성 (Read, Write만 필요)

3. **실수 방지**
   - 위험한 작업을 방지하기 위해 도구 제한
   - 예: 분석 전용 에이전트는 Shell 제외

### 언제 모든 도구를 상속해야 하는가?

1. **복잡한 워크플로우**
   - 여러 단계에서 다양한 도구 필요
   - 예: 전체 기능 구현

2. **유연성이 필요한 경우**
   - 작업 범위가 명확하지 않음
   - 예: 일반 목적 디버거

3. **기본 동작**
   - 특별한 제약이 없는 경우
   - 대부분의 서브에이전트

## 도구별 상세 설명

### Read
- 파일 내용을 읽습니다
- 라인 범위 지정 가능
- 이미지 파일도 읽을 수 있음

### Write
- 새 파일 생성 또는 기존 파일 덮어쓰기
- 전체 파일 내용을 한 번에 작성
- 주의: 기존 내용을 완전히 대체

### StrReplace
- 기존 파일에 정확한 문자열 교체
- old_string과 new_string 필요
- 부분 수정에 적합

### Glob
- 패턴으로 파일 찾기
- 예: `*.py`, `**/*.test.js`
- 빠르고 효율적

### Grep
- 파일 내용에서 정규식 검색
- 여러 파일을 동시에 검색
- 컨텍스트 라인 포함 가능

### Shell
- 셸 명령 실행
- Git 작업, 패키지 설치 등
- 긴 실행 시간 작업 지원

### Task
- 새로운 서브에이전트 생성
- 서브에이전트 내에서는 권장하지 않음
- 무한 재귀 방지

## 예시: 도구 조합별 서브에이전트

### 예시 1: 코드 리뷰어 (읽기 전용)
```yaml
---
name: code-reviewer
description: Expert code review specialist. Use proactively after code changes.
tools: Read, Grep, Glob, Shell
model: inherit
---
```

### 예시 2: 버그 수정 (전체 접근)
```yaml
---
name: bug-fixer
description: Debugging specialist for fixing errors and test failures.
model: inherit
# tools 필드 생략 - 모든 도구 상속
---
```

### 예시 3: 문서 작성 (제한적 쓰기)
```yaml
---
name: doc-writer
description: Technical documentation specialist.
tools: Read, Write, Grep, Glob
model: inherit
---
```

## 주의사항

1. **Task 도구**: 서브에이전트 내에서 Task를 사용하면 무한 재귀가 발생할 수 있습니다.
2. **Shell 도구**: 위험한 명령을 실행할 수 있으므로 신중하게 사용하세요.
3. **Write 도구**: 기존 파일을 덮어쓰므로 주의가 필요합니다.
4. **최소 권한 원칙**: 필요한 도구만 제공하는 것이 안전합니다.
