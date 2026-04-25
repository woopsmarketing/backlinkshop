'use client'

import {
  buildOnPageDetail,
  summarizeOnPage,
  type MetricLevel,
  type OnPageGroup,
  type OnPageItem,
  type ParsedFields,
} from '@/lib/lp-metrics'

type Props = {
  parsed: ParsedFields | null | undefined
}

export function AnalyzeOnPageDetail({ parsed }: Props) {
  const groups = buildOnPageDetail(parsed)
  if (groups.length === 0) return null
  const summary = summarizeOnPage(groups)

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">온페이지 상세 진단</h2>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
              총 <span className="font-bold">{summary.total}</span>개
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">
              ✓ 통과 {summary.good}
            </span>
            {summary.warn > 0 && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-700">
                ⚠ 주의 {summary.warn}
              </span>
            )}
            {summary.bad > 0 && (
              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-rose-700">
                ✗ 문제 {summary.bad}
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-500">
          이메일로 받으셨던 47개 항목 진단을 결과 페이지에서 그대로 펼쳐드려요.
        </p>
      </div>

      <div className="space-y-6">
        {groups.map(group => (
          <GroupBlock key={group.title} group={group} />
        ))}
      </div>
    </section>
  )
}

function GroupBlock({ group }: { group: OnPageGroup }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="border-l-4 border-indigo-500 bg-slate-50 px-4 py-2.5">
        <p className="text-sm font-bold text-slate-900">{group.title}</p>
        {group.description && (
          <p className="mt-0.5 text-[11px] text-slate-500">{group.description}</p>
        )}
      </div>
      <ul>
        {group.items.map((item, idx) => (
          <ItemRow key={item.label} item={item} zebra={idx % 2 === 1} />
        ))}
      </ul>
    </div>
  )
}

function ItemRow({ item, zebra }: { item: OnPageItem; zebra: boolean }) {
  const { iconColor, valueColor } = toneClasses(item.level)
  return (
    <li
      className={`flex flex-wrap items-start justify-between gap-3 border-t border-slate-100 px-4 py-2.5 first:border-t-0 sm:flex-nowrap ${
        zebra ? 'bg-slate-50/40' : 'bg-white'
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <LevelIcon level={item.level} className={iconColor} />
        <span className="text-xs font-medium text-slate-600 sm:text-sm">{item.label}</span>
      </div>
      <div className="flex min-w-0 flex-col items-end text-right">
        <span className={`break-all text-xs font-bold sm:text-sm ${valueColor}`}>{item.value}</span>
        {item.hint && (
          <span className="mt-0.5 text-[10px] leading-snug text-slate-400 sm:text-[11px]">
            {item.hint}
          </span>
        )}
      </div>
    </li>
  )
}

function LevelIcon({ level, className }: { level: MetricLevel; className: string }) {
  const symbol = level === 'good' ? '✓' : level === 'warn' ? '⚠' : level === 'bad' ? '✗' : '·'
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${className}`}
      aria-label={level}
    >
      {symbol}
    </span>
  )
}

function toneClasses(level: MetricLevel): { iconColor: string; valueColor: string } {
  switch (level) {
    case 'good':
      return {
        iconColor: 'bg-emerald-100 text-emerald-700',
        valueColor: 'text-emerald-700',
      }
    case 'warn':
      return {
        iconColor: 'bg-amber-100 text-amber-700',
        valueColor: 'text-amber-700',
      }
    case 'bad':
      return {
        iconColor: 'bg-rose-100 text-rose-700',
        valueColor: 'text-rose-600',
      }
    default:
      return {
        iconColor: 'bg-slate-200 text-slate-500',
        valueColor: 'text-slate-700',
      }
  }
}
