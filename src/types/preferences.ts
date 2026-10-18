/** 端末に保存する基本設定（仕様 3章: 地域・距離・信頼度など基本設定は永続化） */
export type Preferences = {
  /** 自宅/基本地域。未設定なら null（全国表示） */
  basePrefectureCode: number | null
  /** 距離の上限（km）。null = 制限なし */
  maxDistanceKm: number | null
  /** 信頼度「低」の評価を隠す（店舗自体は隠さない） */
  hideLowConfidence: boolean
  /** 初回の地域設定を終えた（またはスキップした） */
  onboardingDone: boolean
  updatedAt: string | null
}

export const DEFAULT_PREFERENCES: Preferences = {
  basePrefectureCode: null,
  maxDistanceKm: null,
  // 仕様 5章「信頼度高を初期表示し、低信頼分析だけ隠せる」
  hideLowConfidence: true,
  onboardingDone: false,
  updatedAt: null,
}

export type SavedFilter = {
  id: string
  name: string
  /** URL のクエリ文字列（例: sort=hyena&area=13） */
  params: string
  createdAt: string
  updatedAt: string
}

export type SearchHistoryEntry = {
  id: string
  q: string
  createdAt: string
}

export type FavoriteRecord = {
  shopId: string
  createdAt: string
  updatedAt: string
}
