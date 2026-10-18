/** 架空データを表示中であることを常に知らせる帯 */
export function SampleDataBanner() {
  return (
    <p
      role="note"
      className="mx-4 mt-3 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-warn"
    >
      <strong className="font-bold">架空データを表示中</strong>
      <span className="text-text-muted">：店名・住所・点数はすべて画面確認用の架空の値です</span>
    </p>
  )
}

export function SampleBadge() {
  return (
    <span className="inline-flex shrink-0 items-center rounded border border-warn/50 px-1.5 text-xs font-bold leading-5 text-warn">
      架空
    </span>
  )
}
