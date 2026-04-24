'use client'

import {
  formatMetricValue,
  trimDomainLabel,
  type CompetitorMetrics,
  type MetricFormat,
} from '@/lib/lp-metrics'
import type { AnalyzeCompetitorAnalysis } from './AnalyzeClient'

type Row = {
  label: string
  key?: keyof CompetitorMetrics
  /** onPage nested 객체 접근용 getter. key 와 동시에 지정되지 않음 */
  getOnPage?: (o: Record<string, unknown> | null | undefined) => string
  format?: MetricFormat
  suffix?: string
}

type Section = {
  title: string
  description?: string
  rows: Row[]
}

const SECTIONS: Section[] = [
  {
    title: '도메인 권위도',
    description: '검색엔진이 도메인 전체에 부여하는 신뢰 점수 (높을수록 유리)',
    rows: [
      { label: 'Moz DA', key: 'mozDA', format: 'score' },
      { label: 'Moz PA', key: 'mozPA', format: 'score' },
      { label: 'Ahrefs DR', key: 'ahrefsDR', format: 'score' },
      { label: 'Majestic TF', key: 'majesticTF', format: 'score' },
      { label: 'Majestic CF', key: 'majesticCF', format: 'score' },
    ],
  },
  {
    title: '백링크 프로필',
    description: 'Ahrefs · VebAPI 수집 기반 링크 양·질 지표',
    rows: [
      { label: 'Ahrefs 백링크', key: 'ahrefsBacklinks', format: 'number' },
      { label: '참조 도메인', key: 'ahrefsRefDomains', format: 'number' },
      { label: 'VebAPI 백링크', key: 'backlinkTotal', format: 'number' },
      { label: 'VebAPI 참조도메인', key: 'referringDomains', format: 'number' },
      { label: 'EDU 링크', key: 'majesticRefEdu', format: 'number' },
      { label: 'GOV 링크', key: 'majesticRefGov', format: 'number' },
    ],
  },
  {
    title: '트래픽 & 키워드',
    description: '검색 유입·노출 중인 키워드 규모',
    rows: [
      { label: '월간 유기 트래픽', key: 'ahrefsTraffic', format: 'number' },
      { label: '트래픽 가치($)', key: 'ahrefsTrafficValue', format: 'number' },
      { label: '노출 키워드', key: 'ahrefsOrganicKeywords', format: 'number' },
    ],
  },
  {
    title: '도메인 연령',
    description: '도메인 생존·활용 이력',
    rows: [
      { label: '도메인 연령', key: 'domainAgeYears', format: 'score', suffix: '년' },
      { label: '최초 아카이브', key: 'waybackFirstSeen', format: 'text' },
      { label: 'Wayback 스냅샷', key: 'waybackSnapshots', format: 'number' },
    ],
  },
  {
    title: '온페이지 최적화',
    description: '랜딩 페이지 기본 구성 (내부 SEO 수준)',
    rows: [
      {
        label: 'Title 길이',
        getOnPage: o => (o && typeof o.titleLength === 'number' ? `${o.titleLength}자` : '-'),
      },
      {
        label: 'Description 길이',
        getOnPage: o =>
          o && typeof o.metaDescriptionLength === 'number' ? `${o.metaDescriptionLength}자` : '-',
      },
      {
        label: 'H1 개수',
        getOnPage: o => (o && typeof o.h1Count === 'number' ? `${o.h1Count}개` : '-'),
      },
      {
        label: 'H2 개수',
        getOnPage: o => (o && typeof o.h2Count === 'number' ? `${o.h2Count}개` : '-'),
      },
      {
        label: '본문 단어 수',
        getOnPage: o => (o && typeof o.wordCount === 'number' ? o.wordCount.toLocaleString() : '-'),
      },
      {
        label: '이미지 ALT',
        getOnPage: o => {
          if (!o) return '-'
          const total = typeof o.imgTotal === 'number' ? o.imgTotal : 0
          const miss = typeof o.imgWithoutAlt === 'number' ? o.imgWithoutAlt : 0
          if (!total) return '0/0'
          return `${total - miss}/${total}`
        },
      },
      {
        label: '로딩 속도',
        getOnPage: o => (o && typeof o.loadTimeMs === 'number' ? `${o.loadTimeMs}ms` : '-'),
      },
      {
        label: 'HTTPS',
        getOnPage: o => (o && o.hasHttps ? '✓' : '✗'),
      },
      {
        label: '구조화 데이터',
        getOnPage: o => (o && o.hasStructuredData ? '✓' : '✗'),
      },
      {
        label: 'OG 태그',
        getOnPage: o => (o && o.hasOgTags ? '✓' : '✗'),
      },
    ],
  },
]

type Props = {
  comp: AnalyzeCompetitorAnalysis | null | undefined
  myDomainLabel: string
}

export function AnalyzeCompetitorTable({ comp, myDomainLabel }: Props) {
  if (!comp || !comp.competitors || comp.competitors.length === 0) return null
  const competitors = comp.competitors.slice(0, 5)
  const me = comp.customerMetrics ?? null

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          경쟁사 비교{comp.keyword ? ` — "${comp.keyword}"` : ''}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          구글 검색 상위 {competitors.length}개 도메인과 내 사이트 전면 비교
        </p>
      </div>

      <div className="space-y-6">
        {SECTIONS.map(section => (
          <SectionTable
            key={section.title}
            section={section}
            me={me}
            competitors={competitors}
            myDomainLabel={myDomainLabel}
          />
        ))}
      </div>
    </section>
  )
}

function SectionTable({
  section,
  me,
  competitors,
  myDomainLabel,
}: {
  section: Section
  me: CompetitorMetrics | null
  competitors: CompetitorMetrics[]
  myDomainLabel: string
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
        {section.title}
      </p>
      {section.description && (
        <p className="mb-3 text-[11px] text-slate-500">{section.description}</p>
      )}
      <div className="-mx-2 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-500">
                지표
              </th>
              <th className="min-w-[90px] px-3 py-2 text-center text-xs font-bold text-rose-600">
                {trimDomainLabel(myDomainLabel, 14)}
                <br />
                <span className="text-[10px] font-normal text-rose-400">내 사이트</span>
              </th>
              {competitors.map((c, i) => (
                <th
                  key={i}
                  className="min-w-[90px] px-3 py-2 text-center text-xs font-semibold text-slate-600"
                >
                  {trimDomainLabel(c.domain, 14)}
                  <br />
                  <span className="text-[10px] font-normal text-slate-400">{i + 1}위</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map(row => {
              const myCell = getCellValue(row, me)
              const myNumber = asNumber(getRaw(row, me))
              return (
                <tr key={row.label} className="border-t border-slate-100">
                  <td className="sticky left-0 z-10 bg-white px-3 py-2 text-xs text-slate-600">
                    {row.label}
                  </td>
                  <td
                    className={`px-3 py-2 text-center text-xs font-bold ${
                      isMeBehindTop(row, me, competitors[0]) ? 'text-rose-600' : 'text-slate-900'
                    }`}
                  >
                    {myCell}
                  </td>
                  {competitors.map((c, i) => {
                    const cellValue = getCellValue(row, c)
                    const cellNum = asNumber(getRaw(row, c))
                    const isTopBetter = myNumber !== null && cellNum !== null && cellNum > myNumber
                    return (
                      <td
                        key={i}
                        className={`px-3 py-2 text-center text-xs font-semibold ${
                          isTopBetter ? 'text-indigo-700' : 'text-slate-700'
                        }`}
                      >
                        {cellValue}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function getCellValue(row: Row, m: CompetitorMetrics | null): string {
  if (!m) return '-'
  if (row.getOnPage) {
    return row.getOnPage(m.onPage ?? null)
  }
  if (!row.key) return '-'
  const raw = m[row.key]
  return formatMetricValue(raw, row.format ?? 'number', row.suffix)
}

function getRaw(row: Row, m: CompetitorMetrics | null): unknown {
  if (!m) return null
  if (row.getOnPage) return null
  if (!row.key) return null
  return m[row.key]
}

function asNumber(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

function isMeBehindTop(
  row: Row,
  me: CompetitorMetrics | null,
  top: CompetitorMetrics | undefined
): boolean {
  if (!top) return false
  const mine = asNumber(getRaw(row, me))
  const upper = asNumber(getRaw(row, top ?? null))
  if (mine === null || upper === null) return false
  return upper > mine && upper > 0
}
