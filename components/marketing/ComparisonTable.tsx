import type { ReactNode } from 'react'

/**
 * 비교표. 좁은 화면에서 페이지가 아니라 표 자체가 가로 스크롤된다.
 */
export function ComparisonTable({
  caption,
  columns,
  rows,
  rowHeader = '구분',
}: {
  caption: string
  columns: string[]
  rows: { header: string; cells: ReactNode[] }[]
  /** 첫 열(행 제목) 헤더 라벨. 표의 문맥에 맞게 바꾼다. 예: 유형, 기준, 증상 */
  rowHeader?: string
}) {
  return (
    <div className="bl-scroll-x">
      <table className="bl-compare">
        <caption className="bl-sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{rowHeader}</th>
            {columns.map(column => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.header}>
              <th scope="row">{row.header}</th>
              {row.cells.map((cell, index) => (
                <td key={`${row.header}-${columns[index] ?? index}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
