/**
 * 목차 — 섹션 배열에서 자동 생성한다. 본문과 어긋날 수 없다.
 */
export function TableOfContents({ sections }: { sections: { id: string; heading: string }[] }) {
  if (sections.length < 3) return null

  return (
    <nav className="bl-toc" aria-labelledby="toc-heading">
      <p id="toc-heading" className="bl-toc__heading">
        목차
      </p>
      <ol>
        {sections.map(section => (
          <li key={section.id}>
            <a href={`#${section.id}`}>{section.heading}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
