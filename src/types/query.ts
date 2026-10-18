/** 並び順（仕様 3章）。検索画面ひとつに集約し、別の「穴場モード」は作らない */
export type SortKey = 'recommended' | 'overall' | 'setting' | 'hyena' | 'hidden_gem' | 'updated' | 'distance'
export type SortOrder = 'desc' | 'asc'

export const SORT_OPTIONS: readonly { key: SortKey; label: string; disabledReason?: string }[] = [
  { key: 'recommended', label: 'おすすめ' },
  { key: 'overall', label: '総合' },
  { key: 'setting', label: '設定狙い' },
  { key: 'hyena', label: 'ハイエナ' },
  { key: 'hidden_gem', label: '穴場候補', disabledReason: 'Phase 5 で評価方法を実装予定' },
  { key: 'updated', label: '更新' },
  { key: 'distance', label: '距離' },
]

/** 昇順・降順の表示名（並び順ごとに自然な言葉にする） */
export function orderLabels(sort: SortKey): { desc: string; asc: string } | null {
  switch (sort) {
    case 'recommended':
    case 'hidden_gem':
      return null
    case 'updated':
      return { desc: '新しい順', asc: '古い順' }
    case 'distance':
      return { desc: '遠い順', asc: '近い順' }
    default:
      return { desc: '高い順', asc: '低い順' }
  }
}

/** 検索範囲。base = 基本地域の都道府県 */
export type AreaScope = { kind: 'base' } | { kind: 'all' } | { kind: 'prefectures'; codes: number[] }

/** 一時的な検索条件（URL に載せて共有可能。次回起動時は初期値に戻る） */
export type ShopQuery = {
  q: string
  sort: SortKey
  order: SortOrder
  area: AreaScope
  favoritesOnly: boolean
  /** URL で共有された距離。無ければ保存済み設定を使う */
  maxDistanceKm?: number | null
}

export const DEFAULT_QUERY: ShopQuery = {
  q: '',
  sort: 'recommended',
  order: 'desc',
  area: { kind: 'base' },
  favoritesOnly: false,
}

export function defaultOrderFor(sort: SortKey): SortOrder {
  return sort === 'distance' ? 'asc' : 'desc'
}

export const DISTANCE_CHOICES_KM: readonly (number | null)[] = [null, 1, 3, 5, 10, 20, 50]
