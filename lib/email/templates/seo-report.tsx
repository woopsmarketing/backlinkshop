/**
 * 온페이지 SEO 점검 결과 이메일 템플릿
 * 600px 폭, 모바일 친화적, 텔레그램 1:1 문의 CTA 집중
 */

import * as React from 'react'
import type { ParsedSeo } from '@/lib/seo-analyzer'
import type { CompetitorAnalysis } from '@/lib/competitor-analyzer'

interface SeoReportEmailProps {
  customerEmail: string
  orderId: string
  siteUrl?: string
  keywords?: string
  score?: number | null
  analysisHtml?: string
  parsedData?: ParsedSeo
  competitorData?: CompetitorAnalysis | null
}

function scoreColor(s: number) {
  return s >= 80 ? '#16a34a' : s >= 60 ? '#ca8a04' : '#dc2626'
}
function scoreLabel(s: number) {
  return s >= 80 ? '양호' : s >= 60 ? '보통' : '개선 필요'
}
function pass(ok: boolean) {
  return ok ? '\u2713' : '\u2717'
}
function passStyle(ok: boolean): React.CSSProperties {
  return { color: ok ? '#16a34a' : '#dc2626', fontWeight: 600 }
}

function DataRow({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <tr>
      <td
        style={{
          padding: '7px 10px',
          borderBottom: '1px solid #f3f4f6',
          color: '#6b7280',
          fontSize: '12px',
          width: '38%',
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: '7px 10px',
          borderBottom: '1px solid #f3f4f6',
          fontSize: '12px',
          textAlign: 'right',
          ...(ok !== undefined ? passStyle(ok) : { color: '#111827' }),
        }}
      >
        {ok !== undefined && <span style={{ marginRight: '3px' }}>{pass(ok)}</span>}
        {value}
      </td>
    </tr>
  )
}

function Collapsible({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        margin: '0 0 14px 0',
        overflow: 'hidden',
      }}
    >
      <summary
        style={{
          padding: '14px 16px',
          cursor: 'pointer',
          listStyle: 'none',
          background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{title}</span>
        {subtitle && (
          <span style={{ marginLeft: '8px', fontSize: '11px', color: '#6b7280' }}>{subtitle}</span>
        )}
        <span style={{ float: 'right', fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>
          ▼ 펼치기/접기
        </span>
      </summary>
      <div style={{ padding: '16px' }}>{children}</div>
    </details>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: '13px',
        fontWeight: 700,
        color: '#111827',
        margin: '20px 0 6px 0',
        padding: '6px 10px',
        background: '#f9fafb',
        borderRadius: '4px',
        borderLeft: '3px solid #2563eb',
      }}
    >
      {children}
    </h3>
  )
}

/* ─── 경쟁사 비교 테이블 ─── */

type MetricFormat = 'number' | 'score' | 'text'

interface MetricDef {
  label: string
  key: keyof import('@/lib/competitor-analyzer').CompetitorData
  format?: MetricFormat
  suffix?: string
}

function formatMetricValue(value: any, format: MetricFormat, suffix?: string): string {
  if (value === undefined || value === null) return '-'
  if (format === 'number') return Number(value).toLocaleString() + (suffix || '')
  if (format === 'score') return `${value}${suffix || ''}`
  return String(value)
}

function CompetitorMetricSection({
  title,
  metrics,
  comp,
}: {
  title: string
  metrics: MetricDef[]
  comp: import('@/lib/competitor-analyzer').CompetitorAnalysis
}) {
  const trimDomain = (d: string) => (d.length > 12 ? d.slice(0, 12) + '..' : d)

  return (
    <>
      <p
        style={{
          margin: '14px 0 4px 0',
          fontSize: '11px',
          fontWeight: 700,
          color: '#1e40af',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {title}
      </p>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '11px',
          background: '#fafafa',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th
              style={{
                padding: '6px 8px',
                textAlign: 'left',
                color: '#6b7280',
                fontWeight: 600,
                width: '38%',
              }}
            >
              지표
            </th>
            <th
              style={{ padding: '6px 4px', textAlign: 'center', color: '#dc2626', fontWeight: 700 }}
            >
              내 사이트
            </th>
            {comp.competitors.map((c, i) => (
              <th
                key={i}
                style={{
                  padding: '6px 4px',
                  textAlign: 'center',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '10px',
                }}
              >
                {i + 1}위
                <br />
                <span style={{ color: '#9ca3af', fontSize: '9px', fontWeight: 400 }}>
                  {trimDomain(c.domain)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map(m => {
            const myValue = (comp.customerMetrics as any)?.[m.key]
            const topValue = (comp.competitors[0] as any)?.[m.key]
            const myNum = typeof myValue === 'number' ? myValue : 0
            const topNum = typeof topValue === 'number' ? topValue : 0
            const isLower = myNum < topNum

            return (
              <tr key={m.key}>
                <td
                  style={{ padding: '5px 8px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}
                >
                  {m.label}
                </td>
                <td
                  style={{
                    padding: '5px 4px',
                    textAlign: 'center',
                    fontWeight: 700,
                    color: isLower && topNum > 0 ? '#dc2626' : '#111827',
                    borderTop: '1px solid #f3f4f6',
                  }}
                >
                  {formatMetricValue(myValue, m.format || 'number', m.suffix)}
                </td>
                {comp.competitors.map((c, i) => (
                  <td
                    key={i}
                    style={{
                      padding: '5px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: '#374151',
                      borderTop: '1px solid #f3f4f6',
                    }}
                  >
                    {formatMetricValue((c as any)[m.key], m.format || 'number', m.suffix)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

function CompetitorMetricsTable({
  comp,
}: {
  comp: import('@/lib/competitor-analyzer').CompetitorAnalysis
}) {
  return (
    <div>
      {/* 1. 도메인 권위도 */}
      <CompetitorMetricSection
        title="도메인 권위도"
        comp={comp}
        metrics={[
          { label: 'Moz DA (권위도)', key: 'mozDA', format: 'score' },
          { label: 'Moz PA (페이지)', key: 'mozPA', format: 'score' },
          { label: 'Ahrefs DR', key: 'ahrefsDR', format: 'score' },
          { label: 'Majestic TF (신뢰)', key: 'majesticTF', format: 'score' },
          { label: 'Majestic CF (인용)', key: 'majesticCF', format: 'score' },
        ]}
      />

      {/* 2. 백링크 프로필 */}
      <CompetitorMetricSection
        title="백링크 프로필"
        comp={comp}
        metrics={[
          { label: 'Ahrefs 백링크', key: 'ahrefsBacklinks', format: 'number' },
          { label: '참조 도메인', key: 'ahrefsRefDomains', format: 'number' },
          { label: 'Moz 백링크', key: 'mozLinks', format: 'number' },
          { label: 'EDU 링크', key: 'majesticRefEdu', format: 'number' },
          { label: 'GOV 링크', key: 'majesticRefGov', format: 'number' },
        ]}
      />

      {/* 3. 트래픽 & 키워드 */}
      <CompetitorMetricSection
        title="트래픽 & 키워드"
        comp={comp}
        metrics={[
          { label: '월간 유기 트래픽', key: 'ahrefsTraffic', format: 'number' },
          { label: '트래픽 가치($)', key: 'ahrefsTrafficValue', format: 'number' },
          { label: '노출 키워드 수', key: 'ahrefsOrganicKeywords', format: 'number' },
        ]}
      />

      {/* 4. 도메인 연령 */}
      <CompetitorMetricSection
        title="도메인 연령 & 이력"
        comp={comp}
        metrics={[
          { label: '도메인 연령', key: 'domainAgeYears', format: 'score', suffix: '년' },
          { label: '최초 아카이브', key: 'waybackFirstSeen', format: 'text' },
        ]}
      />

      {/* 5. 온페이지 내부 최적화 */}
      <OnPageMetricSection comp={comp} />
    </div>
  )
}

/**
 * 온페이지 지표 비교 섹션 (별도 구조: nested onPage 객체 처리)
 */
function OnPageMetricSection({
  comp,
}: {
  comp: import('@/lib/competitor-analyzer').CompetitorAnalysis
}) {
  const trimDomain = (d: string) => (d.length > 12 ? d.slice(0, 12) + '..' : d)

  const rows: Array<{ label: string; get: (o: any) => string }> = [
    { label: 'Title 길이', get: o => (o?.titleLength ? `${o.titleLength}자` : '-') },
    {
      label: 'Description 길이',
      get: o => (o?.metaDescriptionLength ? `${o.metaDescriptionLength}자` : '-'),
    },
    { label: 'H1 개수', get: o => (o ? `${o.h1Count}개` : '-') },
    { label: 'H2 개수', get: o => (o ? `${o.h2Count}개` : '-') },
    { label: '단어 수', get: o => (o?.wordCount ? o.wordCount.toLocaleString() : '-') },
    {
      label: '이미지',
      get: o => (o ? `${o.imgTotal}개 (Alt ${o.imgTotal - o.imgWithoutAlt}/${o.imgTotal})` : '-'),
    },
    { label: '내부 링크', get: o => (o ? `${o.internalLinks}개` : '-') },
    { label: '로딩 속도', get: o => (o?.loadTimeMs ? `${o.loadTimeMs}ms` : '-') },
    { label: 'HTTPS', get: o => (o?.hasHttps ? '✓' : '✗') },
    { label: '구조화 데이터', get: o => (o?.hasStructuredData ? '✓' : '✗') },
    { label: 'OG Tags', get: o => (o?.hasOgTags ? '✓' : '✗') },
  ]

  return (
    <>
      <p
        style={{
          margin: '14px 0 4px 0',
          fontSize: '11px',
          fontWeight: 700,
          color: '#1e40af',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        내부 최적화 (온페이지)
      </p>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '11px',
          background: '#fafafa',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th
              style={{
                padding: '6px 8px',
                textAlign: 'left',
                color: '#6b7280',
                fontWeight: 600,
                width: '38%',
              }}
            >
              지표
            </th>
            <th
              style={{ padding: '6px 4px', textAlign: 'center', color: '#dc2626', fontWeight: 700 }}
            >
              내 사이트
            </th>
            {comp.competitors.map((c, i) => (
              <th
                key={i}
                style={{
                  padding: '6px 4px',
                  textAlign: 'center',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '10px',
                }}
              >
                {i + 1}위
                <br />
                <span style={{ color: '#9ca3af', fontSize: '9px', fontWeight: 400 }}>
                  {trimDomain(c.domain)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.label}>
              <td style={{ padding: '5px 8px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>
                {row.label}
              </td>
              <td
                style={{
                  padding: '5px 4px',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: '#111827',
                  borderTop: '1px solid #f3f4f6',
                }}
              >
                {row.get(comp.customerMetrics?.onPage)}
              </td>
              {comp.competitors.map((c, i) => (
                <td
                  key={i}
                  style={{
                    padding: '5px 4px',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#374151',
                    borderTop: '1px solid #f3f4f6',
                  }}
                >
                  {row.get(c.onPage)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function CompetitorGapSummary({
  comp,
}: {
  comp: import('@/lib/competitor-analyzer').CompetitorAnalysis
}) {
  const top = comp.competitors[0]
  if (!top) return null

  const myBL = comp.customerMetrics?.ahrefsBacklinks || comp.customerMetrics?.backlinkTotal || 0
  const topBL = top.ahrefsBacklinks || top.backlinkTotal || 0
  const blGap = topBL - myBL

  const myRD = comp.customerMetrics?.ahrefsRefDomains || comp.customerMetrics?.referringDomains || 0
  const topRD = top.ahrefsRefDomains || top.referringDomains || 0
  const rdGap = topRD - myRD

  const myDA = comp.customerMetrics?.mozDA || 0
  const topDA = top.mozDA || 0
  const daGap = topDA - myDA

  return (
    <div
      style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        padding: '12px',
        marginTop: '14px',
      }}
    >
      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#991b1b', fontWeight: 700 }}>
        1위 경쟁사와의 주요 격차
      </p>
      <table style={{ width: '100%', fontSize: '11px' }}>
        <tbody>
          {blGap > 0 && (
            <tr>
              <td style={{ color: '#6b7280', padding: '2px 0' }}>백링크</td>
              <td style={{ color: '#dc2626', fontWeight: 700, textAlign: 'right' }}>
                {blGap.toLocaleString()}개 부족
              </td>
            </tr>
          )}
          {rdGap > 0 && (
            <tr>
              <td style={{ color: '#6b7280', padding: '2px 0' }}>참조 도메인</td>
              <td style={{ color: '#dc2626', fontWeight: 700, textAlign: 'right' }}>
                {rdGap.toLocaleString()}개 부족
              </td>
            </tr>
          )}
          {daGap > 0 && (
            <tr>
              <td style={{ color: '#6b7280', padding: '2px 0' }}>DA 점수</td>
              <td style={{ color: '#dc2626', fontWeight: 700, textAlign: 'right' }}>
                {daGap}점 차이
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#6b7280', lineHeight: 1.5 }}>
        경쟁사는 이미 백링크를 꾸준히 구축하고 있습니다. 지금 시작하지 않으면 격차는 더 벌어집니다.
      </p>
    </div>
  )
}

/* ─── 액션 체크리스트 ─── */

interface ActionItem {
  priority: 1 | 2 | 3
  title: string
  reason: string
}

function buildActionChecklist(p: ParsedSeo | undefined, keyword?: string): ActionItem[] {
  if (!p) return []
  const items: ActionItem[] = []
  const kw = (keyword || '').trim()

  // P1 — 핵심 치명타
  if (p.statusCode !== 200) {
    items.push({
      priority: 1,
      title: `HTTP 상태코드 수정 (현재 ${p.statusCode})`,
      reason: '검색엔진이 페이지를 정상 크롤링 할 수 없습니다',
    })
  }
  if (!p.isHttps) {
    items.push({
      priority: 1,
      title: 'HTTPS(SSL 인증서) 적용',
      reason: '구글은 HTTPS를 랭킹 시그널로 사용합니다',
    })
  }
  if (!p.title || p.titleLength < 20) {
    items.push({
      priority: 1,
      title: `Title 태그 보강 (현재 ${p.titleLength}자)`,
      reason: `30~60자 권장. ${kw ? `"${kw}" 키워드 포함 필수` : '핵심 키워드 포함 필수'}`,
    })
  } else if (kw && p.title && !p.title.toLowerCase().includes(kw.toLowerCase())) {
    items.push({
      priority: 1,
      title: `Title에 "${kw}" 키워드 포함`,
      reason: '타겟 키워드가 Title에 없으면 검색 노출이 크게 떨어집니다',
    })
  }
  if (!p.metaDescription || p.metaDescriptionLength === 0) {
    items.push({
      priority: 1,
      title: 'Meta Description 작성',
      reason: '검색 결과 클릭률(CTR)에 직결. 120~160자 권장',
    })
  }
  if (p.h1.length === 0) {
    items.push({
      priority: 1,
      title: 'H1 태그 추가',
      reason: '페이지 핵심 주제를 검색엔진에 전달하는 가장 중요한 신호',
    })
  }

  // P2 — 강하게 권장
  if (p.metaDescription && p.metaDescriptionLength > 0 && p.metaDescriptionLength < 80) {
    items.push({
      priority: 2,
      title: `Meta Description 확장 (현재 ${p.metaDescriptionLength}자)`,
      reason: '120~160자로 늘려 검색 결과 노출 정보량 확대',
    })
  }
  if (p.h1.length > 1) {
    items.push({
      priority: 2,
      title: `H1 태그 1개로 축소 (현재 ${p.h1.length}개)`,
      reason: 'H1 복수 사용은 페이지 주제를 흐립니다',
    })
  }
  if (kw && p.h1.length > 0 && !p.h1.some(h => h.toLowerCase().includes(kw.toLowerCase()))) {
    items.push({
      priority: 2,
      title: `H1에 "${kw}" 키워드 포함`,
      reason: 'Title-H1-본문의 키워드 일관성이 랭킹에 유리',
    })
  }
  if (!p.canonical) {
    items.push({
      priority: 2,
      title: 'Canonical URL 설정',
      reason: '중복 콘텐츠 페널티 방지',
    })
  }
  if (!p.hasStructuredData) {
    items.push({
      priority: 2,
      title: 'JSON-LD 구조화 데이터 추가',
      reason: 'Rich Snippet 노출로 CTR 상승 기대',
    })
  }
  if (!p.hasOgTitle || !p.hasOgDescription || !p.hasOgImage) {
    items.push({
      priority: 2,
      title: 'Open Graph 태그 완성 (og:title, description, image)',
      reason: 'SNS/메신저 공유 시 미리보기 노출 품질 결정',
    })
  }
  if (p.imgTotal > 0 && p.imgWithoutAlt > 0) {
    items.push({
      priority: 2,
      title: `이미지 Alt 속성 추가 (누락 ${p.imgWithoutAlt}개)`,
      reason: '접근성 + 이미지 검색 노출 개선',
    })
  }
  if (p.wordCount > 0 && p.wordCount < 300) {
    items.push({
      priority: 2,
      title: `본문 콘텐츠 확장 (현재 ${p.wordCount}단어)`,
      reason: '300단어 미만은 얇은 콘텐츠로 평가될 수 있음',
    })
  }

  // P3 — 권장
  if (!p.hasGzip) {
    items.push({
      priority: 3,
      title: 'Gzip/Brotli 압축 활성화',
      reason: '페이지 로딩 속도 개선',
    })
  }
  if (!p.hasHsts) {
    items.push({
      priority: 3,
      title: 'HSTS 헤더 추가',
      reason: '보안 강화 및 HTTPS 강제 적용',
    })
  }
  if (!p.hasTwitterCard) {
    items.push({
      priority: 3,
      title: 'Twitter Card 메타 태그 추가',
      reason: '트위터/X 공유 시 미리보기 품질 개선',
    })
  }
  if (!p.hasFavicon) {
    items.push({
      priority: 3,
      title: 'Favicon 추가',
      reason: '브랜드 인지도 및 검색 결과 시각 노출 개선',
    })
  }
  if (p.loadTimeMs > 3000) {
    items.push({
      priority: 3,
      title: `로딩 속도 개선 (현재 ${p.loadTimeMs}ms)`,
      reason: 'Core Web Vitals 점수 및 사용자 이탈율 개선',
    })
  }

  return items.sort((a, b) => a.priority - b.priority).slice(0, 8)
}

function ActionChecklist({ p, keyword }: { p?: ParsedSeo; keyword?: string }) {
  const items = buildActionChecklist(p, keyword)
  if (items.length === 0) return null

  const priorityMeta = {
    1: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', label: '긴급' },
    2: { bg: '#fffbeb', border: '#fde68a', color: '#d97706', label: '중요' },
    3: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', label: '권장' },
  } as const

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '10px',
        padding: '18px',
        margin: '0 0 16px 0',
        border: '2px solid #1e40af',
      }}
    >
      <h3
        style={{
          margin: '0 0 4px 0',
          fontSize: '15px',
          fontWeight: 700,
          color: '#1e40af',
        }}
      >
        ✅ 지금 바로 실행할 개선 체크리스트
      </h3>
      <p
        style={{
          margin: '0 0 14px 0',
          fontSize: '11px',
          color: '#6b7280',
        }}
      >
        분석 결과를 토대로 우선순위가 높은 액션 {items.length}개를 선별했습니다
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {items.map((item, i) => {
            const meta = priorityMeta[item.priority]
            return (
              <tr key={i}>
                <td
                  style={{
                    padding: '10px 0',
                    borderTop: i === 0 ? 'none' : '1px solid #f3f4f6',
                    verticalAlign: 'top',
                    width: '30px',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}
                  />
                </td>
                <td
                  style={{
                    padding: '10px 8px',
                    borderTop: i === 0 ? 'none' : '1px solid #f3f4f6',
                    verticalAlign: 'top',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        background: meta.bg,
                        color: meta.color,
                        border: `1px solid ${meta.border}`,
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '3px',
                        marginRight: '6px',
                      }}
                    >
                      P{item.priority} {meta.label}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#111827',
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: '11px',
                      color: '#6b7280',
                      lineHeight: 1.5,
                    }}
                  >
                    {item.reason}
                  </p>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ─── 메인 테이블 래퍼 (600px 중앙 정렬) ─── */
function W({ children, bg }: { children: React.ReactNode; bg?: string }) {
  return (
    <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: bg || 'transparent' }}>
      <tbody>
        <tr>
          <td align="center" style={{ padding: '0 16px' }}>
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ maxWidth: '680px' }}>
              <tbody>
                <tr>
                  <td>{children}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export const SeoReportEmail: React.FC<SeoReportEmailProps> = ({
  customerEmail,
  orderId,
  siteUrl,
  keywords,
  score,
  analysisHtml,
  parsedData: p,
  competitorData: comp,
}) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>{`
        body { margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; -webkit-text-size-adjust: 100%; }
        .data-table { width: 100%; border-collapse: collapse; background: white; border-radius: 6px; overflow: hidden; }
        .analysis-box { background: white; border-radius: 10px; padding: 22px 24px; margin: 0; font-size: 14px; line-height: 1.85; color: #1f2937; border: 1px solid #e5e7eb; }
        .analysis-box h2 { font-size: 17px; color: #1e3a8a; border-bottom: 2px solid #dbeafe; padding-bottom: 8px; margin: 24px 0 12px 0; font-weight: 800; }
        .analysis-box h2:first-child { margin-top: 0; }
        .analysis-box h3 { font-size: 15px; color: #1e40af; margin: 22px 0 10px 0; padding-left: 12px; border-left: 4px solid #2563eb; font-weight: 700; }
        .analysis-box h3:first-child { margin-top: 4px; }
        .analysis-box p { margin: 10px 0; }
        .analysis-box strong { color: #0f172a; font-weight: 700; }
        .analysis-box em { color: #2563eb; font-style: normal; font-weight: 600; }
        .analysis-box code { background: #eff6ff; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-family: 'SF Mono', Consolas, monospace; }
        .analysis-box ul { padding-left: 20px; margin: 10px 0; }
        .analysis-box li { margin-bottom: 10px; padding-left: 4px; }
        .analysis-box li::marker { color: #2563eb; }
        .analysis-box li strong { display: inline-block; color: #1e40af; margin-right: 4px; }
        /* 섹션 카드 강조: 잘된 부분 / 개선 / 경쟁사 / 종합 — h3 직후 단락 박스 */
        .analysis-box h3 + p, .analysis-box h3 + ul { background: #fafbff; border-radius: 6px; padding: 12px 14px; }
        @media only screen and (max-width: 620px) {
          .mobile-full { width: 100% !important; display: block !important; }
        }
      `}</style>
    </head>
    <body>
      {/* ===== 헤더 ===== */}
      <W bg="linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)">
        <div style={{ padding: '28px 0', textAlign: 'center', color: 'white' }}>
          <p
            style={{
              margin: '0 0 4px 0',
              fontSize: '12px',
              opacity: 0.8,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            백링크샵 SEO 리포트
          </p>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>온페이지 SEO 점검 결과</h1>
        </div>
      </W>

      {/* ===== 본문 ===== */}
      <W bg="#f3f4f6">
        <div style={{ padding: '24px 0' }}>
          {/* 인사말 */}
          <p style={{ fontSize: '14px', marginBottom: '6px' }}>
            안녕하세요, <strong>{customerEmail}</strong>님!
          </p>
          <p style={{ fontSize: '13px', color: '#374151', marginBottom: '6px' }}>
            <strong>{siteUrl || '요청하신 사이트'}</strong>를 47개 항목에 걸쳐 정밀 진단했습니다.
            {keywords && (
              <>
                {' '}
                타겟 키워드 <strong>&ldquo;{keywords}&rdquo;</strong> 기준입니다.
              </>
            )}
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>&#10003;</span> 양호 &nbsp;
            <span style={{ color: '#dc2626', fontWeight: 600 }}>&#10007;</span> 개선 필요
          </p>

          {/* ===== SEO 점수 ===== */}
          {score != null && (
            <div
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '20px',
                margin: '0 0 16px 0',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>종합 SEO 점수</p>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: scoreColor(score),
                  margin: '6px 0',
                }}
              >
                {score}
                <span style={{ fontSize: '18px' }}>점</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: scoreColor(score) }}>
                {scoreLabel(score)}
              </p>
            </div>
          )}

          {/* ===== 경쟁사 격차 분석 ===== */}
          {comp && comp.competitors.length > 0 && (
            <div
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '16px',
                margin: '0 0 16px 0',
              }}
            >
              <h3
                style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#111827' }}
              >
                &ldquo;{comp.keyword}&rdquo; 경쟁사 격차 분석
              </h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#6b7280' }}>
                같은 키워드로 구글 상위에 노출되고 있는 경쟁사와의 주요 지표 비교입니다
              </p>

              <CompetitorGapSummary comp={comp} />
            </div>
          )}

          {/* ===== 경쟁사 TOP5 상세 비교표 ===== */}
          {comp && comp.competitors.length > 0 && (
            <div
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '16px',
                margin: '0 0 16px 0',
              }}
            >
              <h3
                style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#111827' }}
              >
                📊 내 사이트 vs 경쟁사 TOP{comp.competitors.length} 상세 비교
              </h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#6b7280' }}>
                Moz · Ahrefs · Majestic + 온페이지 내부 최적화
              </p>
              <CompetitorMetricsTable comp={comp} />
            </div>
          )}

          {/* ===== 액션 체크리스트 ===== */}
          <ActionChecklist p={p} keyword={keywords} />

          {/* ===== 메인 CTA: 텔레그램 1:1 문의 ===== */}
          <div
            style={{
              background: '#1e40af',
              borderRadius: '10px',
              padding: '20px',
              margin: '0 0 20px 0',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: 'white' }}>
              이 결과, 어떻게 활용해야 할지 궁금하신가요?
            </p>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
              전문가가 보고서를 함께 분석하고 맞춤 전략을 무료로 안내해드립니다
            </p>
            <a
              href="https://t.me/goat82"
              style={{
                display: 'inline-block',
                background: '#facc15',
                color: '#1e3a5f',
                padding: '12px 36px',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              1:1 전문가 상담 (무료)
            </a>
          </div>

          {/* ===== 파싱 데이터 테이블 ===== */}
          {p && (
            <>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '8px 0 12px 0',
                }}
              >
                🔍 내 사이트 47개 항목 상세 진단
              </h3>
              <SectionTitle>기본 정보</SectionTitle>
              <table className="data-table">
                <tbody>
                  <DataRow label="URL" value={p.url} />
                  <DataRow
                    label="상태 코드"
                    value={String(p.statusCode)}
                    ok={p.statusCode === 200}
                  />
                  <DataRow label="HTTPS" value={p.isHttps ? '적용됨' : '미적용'} ok={p.isHttps} />
                  <DataRow label="로딩 시간" value={`${p.loadTimeMs}ms`} ok={p.loadTimeMs < 3000} />
                  <DataRow label="HTML 크기" value={`${(p.htmlSize / 1024).toFixed(1)} KB`} />
                  <DataRow label="단어 수" value={`${p.wordCount}개`} ok={p.wordCount >= 300} />
                  <DataRow
                    label="텍스트/HTML 비율"
                    value={`${p.textToHtmlRatio}%${p.textToHtmlRatio < 10 ? ' — SPA일 수 있음' : ''}`}
                    ok={p.textToHtmlRatio >= 10}
                  />
                  <DataRow
                    label="URL 깊이"
                    value={`${p.urlDepth}단계 (${p.urlLength}자)`}
                    ok={p.urlDepth <= 3}
                  />
                  {p.redirectCount > 0 && (
                    <DataRow
                      label="리다이렉트"
                      value={p.redirectIsWww ? '1회 (www 정규화)' : `${p.redirectCount}회`}
                      ok={p.redirectIsWww}
                    />
                  )}
                </tbody>
              </table>

              <SectionTitle>메타 태그</SectionTitle>
              <table className="data-table">
                <tbody>
                  <DataRow
                    label="Title"
                    value={
                      p.title
                        ? `${p.title.slice(0, 40)}${p.title.length > 40 ? '...' : ''} (${p.titleLength}자)`
                        : '없음'
                    }
                    ok={!!p.title && p.titleLength >= 15 && p.titleLength <= 60}
                  />
                  <DataRow
                    label="Description"
                    value={
                      p.metaDescription
                        ? `${p.metaDescription.slice(0, 40)}... (${p.metaDescriptionLength}자)`
                        : '없음'
                    }
                    ok={!!p.metaDescription && p.metaDescriptionLength >= 40}
                  />
                  <DataRow
                    label="Keywords"
                    value={p.metaKeywords ? `${p.metaKeywords.split(',').length}개` : '없음'}
                  />
                  <DataRow
                    label="Canonical"
                    value={p.canonical ? p.canonical.slice(0, 35) + '...' : '없음'}
                    ok={!!p.canonical}
                  />
                  <DataRow label="Robots" value={p.hasRobotsMeta || '없음'} />
                  <DataRow label="Lang" value={p.lang || '없음'} ok={!!p.lang} />
                </tbody>
              </table>

              <SectionTitle>제목 구조</SectionTitle>
              <table className="data-table">
                <tbody>
                  <DataRow
                    label="H1"
                    value={
                      p.h1.length > 0
                        ? `${p.h1.length}개 — "${p.h1[0]?.slice(0, 30)}${(p.h1[0]?.length || 0) > 30 ? '...' : ''}"`
                        : '없음'
                    }
                    ok={p.h1.length === 1}
                  />
                  <DataRow label="H2" value={`${p.h2.length}개`} ok={p.h2.length > 0} />
                  <DataRow label="H3" value={`${p.h3Count}개`} />
                  {p.duplicateH1 && <DataRow label="중복 H1" value="감지됨" ok={false} />}
                </tbody>
              </table>

              <SectionTitle>이미지 &amp; 링크</SectionTitle>
              <table className="data-table">
                <tbody>
                  <DataRow label="이미지" value={`${p.imgTotal}개`} />
                  <DataRow
                    label="Alt 미설정"
                    value={`${p.imgWithoutAlt}개`}
                    ok={p.imgWithoutAlt === 0}
                  />
                  <DataRow
                    label="내부 링크"
                    value={`${p.internalLinks}개`}
                    ok={p.internalLinks > 0}
                  />
                  <DataRow label="외부 링크" value={`${p.externalLinks}개`} />
                  {p.nofollowLinks > 0 && (
                    <DataRow label="Nofollow" value={`${p.nofollowLinks}개`} />
                  )}
                </tbody>
              </table>

              <SectionTitle>기술 SEO</SectionTitle>
              <table className="data-table">
                <tbody>
                  <DataRow
                    label="Viewport"
                    value={p.hasViewport ? '설정됨' : '미설정'}
                    ok={p.hasViewport}
                  />
                  <DataRow
                    label="Charset"
                    value={p.hasCharset ? '설정됨' : '미설정'}
                    ok={p.hasCharset}
                  />
                  <DataRow
                    label="Favicon"
                    value={p.hasFavicon ? '있음' : '없음'}
                    ok={p.hasFavicon}
                  />
                  <DataRow
                    label="Gzip/Brotli"
                    value={p.hasGzip ? '적용됨' : '미적용'}
                    ok={p.hasGzip}
                  />
                  <DataRow label="HSTS" value={p.hasHsts ? '적용됨' : '미적용'} ok={p.hasHsts} />
                  <DataRow
                    label="인라인 CSS"
                    value={`${(p.inlineCssSize / 1024).toFixed(1)} KB`}
                    ok={p.inlineCssSize < 50000}
                  />
                  <DataRow
                    label="인라인 JS"
                    value={`${(p.inlineJsSize / 1024).toFixed(1)} KB`}
                    ok={p.inlineJsSize < 100000}
                  />
                  {p.hasDeprecatedTags.length > 0 && (
                    <DataRow label="Deprecated" value={p.hasDeprecatedTags.join(', ')} ok={false} />
                  )}
                </tbody>
              </table>

              <SectionTitle>소셜 &amp; 구조화 데이터</SectionTitle>
              <table className="data-table">
                <tbody>
                  <DataRow
                    label="OG Tags"
                    value={`title=${pass(p.hasOgTitle)}, desc=${pass(p.hasOgDescription)}, img=${pass(p.hasOgImage)}`}
                    ok={p.hasOgTitle && p.hasOgDescription && p.hasOgImage}
                  />
                  <DataRow
                    label="Twitter Card"
                    value={p.hasTwitterCard ? '있음' : '없음'}
                    ok={p.hasTwitterCard}
                  />
                  <DataRow
                    label="JSON-LD"
                    value={p.hasStructuredData ? p.structuredDataTypes.join(', ') : '없음'}
                    ok={p.hasStructuredData}
                  />
                </tbody>
              </table>
            </>
          )}

          {/* ===== AI 분석 결과 ===== */}
          {analysisHtml && (
            <>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '24px 0 8px 0',
                }}
              >
                🧠 SEO 전문가 진단 의견
              </h2>
              <div className="analysis-box" dangerouslySetInnerHTML={{ __html: analysisHtml }} />
            </>
          )}

          {/* ===== 하단 CTA: 텔레그램 집중 ===== */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
              borderRadius: '10px',
              padding: '24px',
              margin: '20px 0',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700, color: 'white' }}>
              보고서 결과가 궁금하시다면
            </p>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
              전문가가 직접 분석 결과를 설명하고, 내 사이트에 맞는 최적의 전략을 제안해드립니다
            </p>
            <a
              href="https://t.me/goat82"
              style={{
                display: 'inline-block',
                background: '#facc15',
                color: '#1e3a5f',
                padding: '12px 40px',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px',
              }}
            >
              1:1 무료 상담받기
            </a>
          </div>

          {/* ===== 보조 서비스 링크 ===== */}
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>무료 SEO 도구</p>
            <a
              href="https://seoworld.co.kr"
              style={{
                color: '#2563eb',
                fontSize: '12px',
                textDecoration: 'none',
                marginRight: '16px',
              }}
            >
              SEO 분석 도구 &rarr;
            </a>
            <a
              href="https://domainchecker.co.kr"
              style={{ color: '#2563eb', fontSize: '12px', textDecoration: 'none' }}
            >
              도메인 분석 &rarr;
            </a>
          </div>

          {/* ===== 푸터 ===== */}
          <div
            style={{
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '11px',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <p style={{ margin: '0 0 4px 0' }}>백링크샵 | backlinkshop.co.kr</p>
            <p style={{ margin: 0 }}>문의: support@backlink-shop.com</p>
          </div>
        </div>
      </W>
    </body>
  </html>
)
