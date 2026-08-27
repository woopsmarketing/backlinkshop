/**
 * JSON-LD 출력 공용 래퍼.
 * 구조화 데이터는 화면에 실제로 존재하는 콘텐츠만 담는다.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
