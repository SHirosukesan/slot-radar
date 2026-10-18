import { DEFAULT_QUERY, SORT_OPTIONS, type AreaScope, type ShopQuery, type SortKey } from '../types/query'

/**
 * 検索条件 ⇄ URL のクエリ文字列。
 * URL に載せることで「条件をリンクで共有」「戻るで前の条件に戻る」ができる。
 * 既定値と同じ項目は URL に書かない（短く保つ）。
 */
const SORT_KEYS = new Set<string>(SORT_OPTIONS.filter((o) => !o.disabledReason).map((o) => o.key))

export function parseQuery(params: URLSearchParams): ShopQuery {
  const sortRaw = params.get('sort') ?? ''
  const sort = (SORT_KEYS.has(sortRaw) ? sortRaw : DEFAULT_QUERY.sort) as SortKey
  const order = params.get('order') === 'asc' ? 'asc' : params.get('order') === 'desc' ? 'desc' : null

  const query: ShopQuery = {
    q: (params.get('q') ?? '').slice(0, 100),
    sort,
    order: order ?? (sort === 'distance' ? 'asc' : 'desc'),
    area: parseArea(params.get('area')),
    favoritesOnly: params.get('fav') === '1',
  }
  const dist = params.get('dist')
  if (dist === 'none') query.maxDistanceKm = null
  else if (dist && /^\d{1,4}$/.test(dist) && Number(dist) > 0) query.maxDistanceKm = Number(dist)
  return query
}

function parseArea(raw: string | null): AreaScope {
  if (!raw || raw === 'base') return { kind: 'base' }
  if (raw === 'all') return { kind: 'all' }
  const codes = raw
    .split(',')
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 47)
  return codes.length ? { kind: 'prefectures', codes: [...new Set(codes)].sort((a, b) => a - b) } : { kind: 'base' }
}

export function serializeQuery(query: ShopQuery): URLSearchParams {
  const p = new URLSearchParams()
  if (query.q) p.set('q', query.q)
  if (query.sort !== DEFAULT_QUERY.sort) p.set('sort', query.sort)
  const defaultOrder = query.sort === 'distance' ? 'asc' : 'desc'
  if (query.order !== defaultOrder) p.set('order', query.order)
  if (query.area.kind === 'all') p.set('area', 'all')
  if (query.area.kind === 'prefectures' && query.area.codes.length) p.set('area', query.area.codes.join(','))
  if (query.favoritesOnly) p.set('fav', '1')
  if (query.maxDistanceKm !== undefined) p.set('dist', query.maxDistanceKm == null ? 'none' : String(query.maxDistanceKm))
  return p
}
