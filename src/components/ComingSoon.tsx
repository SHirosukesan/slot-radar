type Props = { phase: number; title: string; items: string[] }

/** 未実装の画面。空白にせず、いつ何ができるかを示す */
export function ComingSoon({ phase, title, items }: Props) {
  return (
    <section className="mx-4 mt-6 rounded-2xl border border-border bg-surface p-5" aria-label="準備中">
      <span className="rounded-md bg-accent-soft px-2 py-0.5 text-sm font-bold text-accent">
        Phase {phase} で実装予定
      </span>
      <h2 className="mt-3 text-lg font-bold">{title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
