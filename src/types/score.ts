/** 店舗一覧で中心に表示する3つの評価軸（仕様 3章） */
export type ScoreKind = 'overall' | 'setting' | 'hyena'

export const SCORE_KINDS: readonly ScoreKind[] = ['overall', 'setting', 'hyena']

export const SCORE_LABEL: Record<ScoreKind, string> = {
  overall: '総合',
  setting: '設定狙い',
  hyena: 'ハイエナ',
}

export type Confidence = 'high' | 'medium' | 'low'

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

/** 集計期間（日）。仕様 5章: 30日 / 90日 / 1年 */
export type PeriodDays = 30 | 90 | 365

/** 点数の根拠。スコアと一緒に必ず保持する */
export type ScoreBasis = {
  periodDays: PeriodDays
  /** 計算に使えた営業日数（母数） */
  sampleDays: number
  /** 根拠の短い説明 */
  note: string
  /** 出典名（架空データなら「架空データ（画面確認用）」） */
  source: string
}

/**
 * 評価値。状態ごとに持てる項目を型で分けている。
 * - rated:       根拠十分な点数
 * - provisional: 母数が少ない暫定値
 * - unrated:     データなし。点数を持てない（0点で埋めることを型で禁止）
 * - on_hold:     欠損・矛盾が大きく評価保留。点数を持てない
 */
export type Score =
  | { status: 'rated'; value: number; confidence: Confidence; basis: ScoreBasis }
  | { status: 'provisional'; value: number; confidence: 'low'; basis: ScoreBasis }
  | { status: 'unrated' }
  | { status: 'on_hold'; reason: string }

export type ShopScores = Record<ScoreKind, Score>

export const UNRATED: Score = { status: 'unrated' }
