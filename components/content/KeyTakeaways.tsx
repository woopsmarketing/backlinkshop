export function KeyTakeaways({ items }: { items: string[] }) {
  if (!items.length) return null

  return (
    <aside className="bl-takeaways" aria-labelledby="takeaways-heading">
      <p id="takeaways-heading" className="bl-takeaways__heading">
        먼저 알아두면 좋은 것
      </p>
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  )
}
