/**
 * LP 결과 페이지에서 ParsedSeo 결과를 "요약 카드" 배열로 변환하는 유틸.
 *
 * React 렌더 로직과 분리해 단위 테스트로 경계 조건을 검증한다.
 */

export type MetricLevel = 'good' | 'warn' | 'bad' | 'neutral'

export type Metric = {
  label: string
  value: string
  hint?: string
  level: MetricLevel
}

export type ParsedFields = {
  title?: string | null
  titleLength?: number
  metaDescription?: string | null
  metaDescriptionLength?: number
  h1?: string[]
  imgTotal?: number
  imgWithoutAlt?: number
  wordCount?: number
  loadTimeMs?: number
  isHttps?: boolean
  hasViewport?: boolean
  hasStructuredData?: boolean
  structuredDataTypes?: string[]
  internalLinks?: number
  externalLinks?: number
  hasOgImage?: boolean
  canonical?: string | null
  lang?: string | null
}

export function buildMetrics(p: ParsedFields): Metric[] {
  const out: Metric[] = []

  if (p.title !== undefined) {
    const len = p.titleLength ?? p.title?.length ?? 0
    out.push({
      label: '페이지 제목',
      value: p.title ? `${len}자` : '없음',
      hint: len >= 10 && len <= 60 ? '적정 길이' : len === 0 ? '제목 누락' : '길이 조정 권장',
      level: p.title ? (len >= 10 && len <= 60 ? 'good' : 'warn') : 'bad',
    })
  }

  if (p.metaDescription !== undefined) {
    const len = p.metaDescriptionLength ?? p.metaDescription?.length ?? 0
    out.push({
      label: '메타 설명',
      value: p.metaDescription ? `${len}자` : '없음',
      hint: len >= 50 && len <= 160 ? '적정 길이' : len === 0 ? '설명 누락' : '길이 조정 권장',
      level: p.metaDescription ? (len >= 50 && len <= 160 ? 'good' : 'warn') : 'bad',
    })
  }

  if (p.h1) {
    const count = p.h1.length
    out.push({
      label: 'H1 태그',
      value: `${count}개`,
      hint: count === 1 ? '권장 1개' : count === 0 ? '누락' : '2개 이상 중복',
      level: count === 1 ? 'good' : count === 0 ? 'bad' : 'warn',
    })
  }

  if (p.imgTotal !== undefined) {
    const miss = p.imgWithoutAlt ?? 0
    out.push({
      label: '이미지 ALT',
      value: `${p.imgTotal - miss}/${p.imgTotal}`,
      hint: miss === 0 ? '모두 설정됨' : `${miss}개 누락`,
      level: miss === 0 ? 'good' : miss < 3 ? 'warn' : 'bad',
    })
  }

  if (p.isHttps !== undefined) {
    out.push({
      label: 'HTTPS',
      value: p.isHttps ? '적용됨' : '미적용',
      level: p.isHttps ? 'good' : 'bad',
    })
  }

  if (p.hasViewport !== undefined) {
    out.push({
      label: '모바일 최적화',
      value: p.hasViewport ? 'viewport 설정' : '미설정',
      level: p.hasViewport ? 'good' : 'bad',
    })
  }

  if (p.loadTimeMs !== undefined) {
    const ms = p.loadTimeMs
    out.push({
      label: '응답 속도',
      value: ms >= 1000 ? `${(ms / 1000).toFixed(1)}초` : `${ms}ms`,
      hint: ms < 800 ? '빠름' : ms < 2000 ? '보통' : '느림',
      level: ms < 800 ? 'good' : ms < 2000 ? 'warn' : 'bad',
    })
  }

  if (p.hasStructuredData !== undefined) {
    out.push({
      label: '구조화 데이터',
      value: p.hasStructuredData ? p.structuredDataTypes?.slice(0, 2).join(', ') || '있음' : '없음',
      level: p.hasStructuredData ? 'good' : 'warn',
    })
  }

  if (p.wordCount !== undefined) {
    out.push({
      label: '본문 분량',
      value: `${p.wordCount.toLocaleString()}자`,
      hint: p.wordCount >= 300 ? '충분' : '빈약',
      level: p.wordCount >= 300 ? 'good' : 'warn',
    })
  }

  return out
}

/**
 * lp_requests.seo_report_data 에 저장된 JSON 이 "결과 페이지에 표시 가능한 리포트"인지 확인.
 *
 * 재시도 메타만 남아있는 실패 payload 와 구분하려면 `analysisHtml` 키 존재 여부를 쓴다.
 */
export function isVisibleReport(status: string, raw: unknown): boolean {
  if (status !== 'processing' && status !== 'sending_report' && status !== 'completed') {
    return false
  }
  if (!raw || typeof raw !== 'object') return false
  return 'analysisHtml' in (raw as Record<string, unknown>)
}
