const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** 「10/17 23:30」形式（日本時間）。null や不正値は「不明」 */
export function formatUpdatedAt(iso: string | null): string {
  if (!iso) return '不明'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '不明'
  return dateTimeFormatter.format(date)
}

export function formatPeriod(days: number): string {
  return days === 365 ? '1年' : `${days}日`
}
