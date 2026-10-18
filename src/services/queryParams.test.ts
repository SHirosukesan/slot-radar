import { DEFAULT_QUERY } from '../types/query'
import { parseQuery, serializeQuery } from './queryParams'

describe('検索条件 ⇄ URL', () => {
  it('既定値は URL に書かない', () => {
    expect(serializeQuery(DEFAULT_QUERY).toString()).toBe('')
  })

  it('往復しても同じ条件に戻る', () => {
    const query = {
      q: 'テスト',
      sort: 'distance' as const,
      order: 'desc' as const,
      area: { kind: 'prefectures' as const, codes: [13, 14] },
      favoritesOnly: true,
      maxDistanceKm: 5,
    }
    expect(parseQuery(serializeQuery(query))).toEqual(query)
  })

  it('不正な値は既定値に戻す', () => {
    const p = parseQuery(new URLSearchParams('sort=evil&order=x&area=0,99,abc&dist=-3'))
    expect(p.sort).toBe('recommended')
    expect(p.order).toBe('desc')
    expect(p.area).toEqual({ kind: 'base' })
    expect(p.maxDistanceKm).toBeUndefined()
  })

  it('未実装の並び順（穴場候補）は URL から指定できない', () => {
    expect(parseQuery(new URLSearchParams('sort=hidden_gem')).sort).toBe('recommended')
  })

  it('距離の昇降順の既定は「近い順」', () => {
    expect(parseQuery(new URLSearchParams('sort=distance')).order).toBe('asc')
  })
})
