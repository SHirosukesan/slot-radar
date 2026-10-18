import { distanceKm, type LatLng } from '../lib/geo'
import type { ShopQuery, SortKey } from '../types/query'
import type { Score, ScoreKind, ShopScores } from '../types/score'
import type { Shop } from '../types/shop'

/** 画面表示用の評価。低信頼を隠す設定のときは hidden_low_confidence になる */
export type DisplayScore = Score | { status: 'hidden_low_confidence' }
export type DisplayScores = Record<ScoreKind, DisplayScore>

export type ShopResult = {
  shop: Shop
  /** 基準地点からの直線距離。位置不明・基準地点なしなら null */
  distanceKm: number | null
  scores: DisplayScores
  isFavorite: boolean
}

export type QueryContext = {
  favorites: ReadonlySet<string>
  basePrefectureCode: number | null
  /** 距離の基準地点（一時検索地点 → 基本地域の順） */
  origin: LatLng | null
  maxDistanceKm: number | null
  hideLowConfidence: boolean
}

export type QueryOutcome = {
  results: ShopResult[]
  /** 条件をかける前の件数 */
  totalBeforeFilter: number
  /** 距離条件がある時、位置不明のため距離判定できずに残した件数 */
  unknownDistanceCount: number
}

/** 低信頼の評価だけを隠す。店舗自体は消さない（仕様 5章） */
export function toDisplayScore(score: Score, hideLowConfidence: boolean): DisplayScore {
  if (!hideLowConfidence) return score
  if ((score.status === 'rated' || score.status === 'provisional') && score.confidence === 'low') {
    return { status: 'hidden_low_confidence' }
  }
  return score
}

function toDisplayScores(scores: ShopScores, hide: boolean): DisplayScores {
  return {
    overall: toDisplayScore(scores.overall, hide),
    setting: toDisplayScore(scores.setting, hide),
    hyena: toDisplayScore(scores.hyena, hide),
  }
}

/** 表示中の点数。未評価・保留・非表示は null（＝0点扱いしない） */
export function scoreValue(s: DisplayScore): number | null {
  return s.status === 'rated' || s.status === 'provisional' ? s.value : null
}

/** 全角/半角・大文字/小文字・ひらがな/カタカナの違いを吸収して比較 */
export function normalizeText(s: string): string {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60))
    .replace(/\s+/g, '')
}

function matchesArea(shop: Shop, query: ShopQuery, ctx: QueryContext): boolean {
  switch (query.area.kind) {
    case 'all':
      return true
    case 'base':
      // 基本地域が未設定なら全国
      return ctx.basePrefectureCode == null || shop.prefectureCode === ctx.basePrefectureCode
    case 'prefectures':
      return query.area.codes.length === 0 || query.area.codes.includes(shop.prefectureCode)
  }
}

function sortValue(r: ShopResult, key: SortKey): number | null {
  switch (key) {
    case 'overall':
    case 'setting':
    case 'hyena':
      return scoreValue(r.scores[key])
    case 'updated':
      return r.shop.updatedAt ? Date.parse(r.shop.updatedAt) : null
    case 'distance':
      return r.distanceKm
    case 'recommended':
    case 'hidden_gem':
      return null
  }
}

/** 値なし（未評価・不明）は昇順・降順どちらでも常に末尾 */
function compareNullable(a: number | null, b: number | null, order: 'asc' | 'desc'): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  return order === 'asc' ? a - b : b - a
}

/**
 * おすすめ（暫定ルール）: お気に入り → 総合点の高い順 → 更新の新しい順。
 * 本格的な「おすすめ」算出は Phase 5 で決める。
 */
function compareRecommended(a: ShopResult, b: ShopResult): number {
  if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
  return (
    compareNullable(scoreValue(a.scores.overall), scoreValue(b.scores.overall), 'desc') ||
    compareNullable(sortValue(a, 'updated'), sortValue(b, 'updated'), 'desc')
  )
}

export function runShopQuery(shops: readonly Shop[], query: ShopQuery, ctx: QueryContext): QueryOutcome {
  const q = normalizeText(query.q)
  const maxKm = query.maxDistanceKm !== undefined ? query.maxDistanceKm : ctx.maxDistanceKm
  let unknownDistanceCount = 0

  const results: ShopResult[] = []
  for (const shop of shops) {
    if (!matchesArea(shop, query, ctx)) continue
    if (query.favoritesOnly && !ctx.favorites.has(shop.id)) continue
    if (q && !normalizeText(`${shop.name}${shop.prefecture}${shop.city}${shop.address}`).includes(q)) continue

    const d = ctx.origin && shop.location ? distanceKm(ctx.origin, shop.location) : null
    if (maxKm != null && ctx.origin) {
      if (d == null) unknownDistanceCount++ // 位置不明は消さずに残す
      else if (d > maxKm) continue
    }

    results.push({
      shop,
      distanceKm: d,
      scores: toDisplayScores(shop.scores, ctx.hideLowConfidence),
      isFavorite: ctx.favorites.has(shop.id),
    })
  }

  const key = query.sort
  const sorted = [...results].sort((a, b) => {
    if (key === 'recommended' || key === 'hidden_gem') return compareRecommended(a, b)
    return compareNullable(sortValue(a, key), sortValue(b, key), query.order) || compareRecommended(a, b)
  })

  return { results: sorted, totalBeforeFilter: shops.length, unknownDistanceCount }
}
