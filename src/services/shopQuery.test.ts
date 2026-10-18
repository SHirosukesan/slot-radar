import { SAMPLE_SHOPS } from '../fixtures/sampleShops'
import { DEFAULT_QUERY, type ShopQuery } from '../types/query'
import { normalizeText, runShopQuery, scoreValue, type QueryContext } from './shopQuery'

const ctx = (patch: Partial<QueryContext> = {}): QueryContext => ({
  favorites: new Set(),
  basePrefectureCode: null,
  origin: null,
  maxDistanceKm: null,
  hideLowConfidence: false,
  ...patch,
})
const q = (patch: Partial<ShopQuery> = {}): ShopQuery => ({ ...DEFAULT_QUERY, ...patch })
const ids = (o: ReturnType<typeof runShopQuery>) => o.results.map((r) => r.shop.id)

describe('並び替え', () => {
  it('未評価・保留は高い順でも低い順でも常に末尾', () => {
    for (const order of ['desc', 'asc'] as const) {
      const out = runShopQuery(SAMPLE_SHOPS, q({ sort: 'setting', order }), ctx())
      const values = out.results.map((r) => scoreValue(r.scores.setting))
      const firstNull = values.indexOf(null)
      expect(firstNull).toBeGreaterThan(0)
      expect(values.slice(firstNull).every((v) => v === null)).toBe(true)
      const nums = values.slice(0, firstNull) as number[]
      expect(nums).toEqual([...nums].sort((a, b) => (order === 'desc' ? b - a : a - b)))
    }
  })

  it('総合の高い順', () => {
    const out = runShopQuery(SAMPLE_SHOPS, q({ sort: 'overall', order: 'desc' }), ctx())
    expect(ids(out).slice(0, 3)).toEqual(['sample-001', 'sample-007', 'sample-005'])
  })

  it('更新の新しい順・古い順（更新不明は末尾）', () => {
    const desc = ids(runShopQuery(SAMPLE_SHOPS, q({ sort: 'updated', order: 'desc' }), ctx()))
    expect(desc[0]).toBe('sample-005')
    expect(desc.at(-1)).toBe('sample-004')
    const asc = ids(runShopQuery(SAMPLE_SHOPS, q({ sort: 'updated', order: 'asc' }), ctx()))
    expect(asc[0]).toBe('sample-008')
    expect(asc.at(-1)).toBe('sample-004')
  })

  it('距離の近い順（位置不明は末尾）', () => {
    const origin = { lat: 34.666, lng: 135.5 } // 大阪付近
    const out = runShopQuery(SAMPLE_SHOPS, q({ sort: 'distance', order: 'asc' }), ctx({ origin }))
    expect(ids(out)[0]).toBe('sample-007')
    expect(ids(out).at(-1)).toBe('sample-004')
  })

  it('おすすめ（暫定）はお気に入りが先頭', () => {
    const out = runShopQuery(SAMPLE_SHOPS, q(), ctx({ favorites: new Set(['sample-004']) }))
    expect(ids(out)[0]).toBe('sample-004')
  })
})

describe('絞り込み', () => {
  it('基本地域が未設定なら全国、設定済みならその都道府県', () => {
    expect(runShopQuery(SAMPLE_SHOPS, q(), ctx()).results).toHaveLength(SAMPLE_SHOPS.length)
    const tokyo = runShopQuery(SAMPLE_SHOPS, q(), ctx({ basePrefectureCode: 13 }))
    expect(tokyo.results.every((r) => r.shop.prefectureCode === 13)).toBe(true)
  })

  it('範囲「全国」は基本地域を無視する', () => {
    const out = runShopQuery(SAMPLE_SHOPS, q({ area: { kind: 'all' } }), ctx({ basePrefectureCode: 13 }))
    expect(out.results).toHaveLength(SAMPLE_SHOPS.length)
  })

  it('距離で絞っても、位置不明の店は消さずに数える', () => {
    const origin = { lat: 35.69, lng: 139.7 }
    const out = runShopQuery(SAMPLE_SHOPS, q({ area: { kind: 'all' } }), ctx({ origin, maxDistanceKm: 10 }))
    expect(ids(out)).toContain('sample-004')
    expect(ids(out)).not.toContain('sample-007') // 大阪は除外
    expect(out.unknownDistanceCount).toBe(1)
  })

  it('URL の距離指定は保存済み設定より優先、null は制限なし', () => {
    const origin = { lat: 35.69, lng: 139.7 }
    const out = runShopQuery(SAMPLE_SHOPS, q({ area: { kind: 'all' }, maxDistanceKm: null }), ctx({ origin, maxDistanceKm: 1 }))
    expect(out.results).toHaveLength(SAMPLE_SHOPS.length)
  })

  it('基準地点がなければ距離条件はかけない（店舗を消さない）', () => {
    const out = runShopQuery(SAMPLE_SHOPS, q(), ctx({ maxDistanceKm: 1 }))
    expect(out.results).toHaveLength(SAMPLE_SHOPS.length)
  })

  it('キーワードは全角半角・ひらがなカタカナの違いを吸収', () => {
    expect(ids(runShopQuery(SAMPLE_SHOPS, q({ q: 'てすと' }), ctx()))).toEqual(['sample-002'])
    expect(normalizeText('ＴＥＳＴ　ホール')).toBe('testホール')
  })

  it('低信頼を隠しても店舗数は変わらず、評価だけ非表示', () => {
    const shown = runShopQuery(SAMPLE_SHOPS, q(), ctx())
    const hidden = runShopQuery(SAMPLE_SHOPS, q(), ctx({ hideLowConfidence: true }))
    expect(hidden.results).toHaveLength(shown.results.length)
    const r = hidden.results.find((x) => x.shop.id === 'sample-002')!
    expect(r.scores.overall.status).toBe('hidden_low_confidence')
    expect(r.scores.hyena.status).toBe('rated') // 信頼度「中」は表示
  })

  it('信頼度「低」で隠した評価は並び替えでも点数として扱わない', () => {
    const out = runShopQuery(SAMPLE_SHOPS, q({ sort: 'overall' }), ctx({ hideLowConfidence: true }))
    expect(scoreValue(out.results.find((r) => r.shop.id === 'sample-006')!.scores.overall)).toBeNull()
  })

  it('お気に入りのみ', () => {
    const out = runShopQuery(SAMPLE_SHOPS, q({ favoritesOnly: true }), ctx({ favorites: new Set(['sample-003']) }))
    expect(ids(out)).toEqual(['sample-003'])
  })
})
