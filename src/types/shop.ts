import type { ShopScores } from './score'

export type ShopStatus = 'open' | 'closed' | 'unknown'

export type Shop = {
  id: string
  name: string
  prefecture: string
  city: string
  address: string
  status: ShopStatus
  /** true のデータは画面で必ず「架空」と表示する */
  isSample: boolean
  scores: ShopScores
  /** 評価データの最終更新（ISO 8601, 日本時間）。不明なら null */
  updatedAt: string | null
}
