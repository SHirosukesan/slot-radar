import type { ShopScores } from './score'

export type ShopStatus = 'open' | 'closed' | 'unknown'

export type ShopLocation = {
  lat: number
  lng: number
  /** 住所・地図上の位置を確認済みか。false の店舗には経路案内を出さない */
  verified: boolean
  googlePlaceId?: string
}

export type Shop = {
  id: string
  name: string
  /** JIS 都道府県コード（1〜47） */
  prefectureCode: number
  prefecture: string
  city: string
  address: string
  /** 位置不明なら null（距離は「距離不明」、地図には出さない） */
  location: ShopLocation | null
  status: ShopStatus
  /** true のデータは画面で必ず「架空」と表示する */
  isSample: boolean
  scores: ShopScores
  /** 評価データの最終更新（ISO 8601, 日本時間）。不明なら null */
  updatedAt: string | null
}
