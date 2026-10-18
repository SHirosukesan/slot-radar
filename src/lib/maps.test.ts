import { SAMPLE_SHOPS } from '../fixtures/sampleShops'
import type { Shop } from '../types/shop'
import { distanceKm, formatDistance } from './geo'
import { googleDirections } from './maps'

const realShop = (location: Shop['location']): Shop => ({ ...SAMPLE_SHOPS[0], isSample: false, location })

describe('Googleマップ経路リンク', () => {
  it('確認済みの位置なら経路 URL を作る', () => {
    const link = googleDirections(realShop({ lat: 35.1, lng: 139.2, verified: true, googlePlaceId: 'abc' }))
    expect(link.ok).toBe(true)
    if (link.ok) {
      const url = new URL(link.url)
      expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/')
      expect(url.searchParams.get('destination')).toBe('35.1,139.2')
      expect(url.searchParams.get('destination_place_id')).toBe('abc')
    }
  })

  it('未確認の位置・位置なし・架空店舗には誘導しない', () => {
    expect(googleDirections(realShop({ lat: 1, lng: 1, verified: false }))).toEqual({ ok: false, reason: '位置未確認' })
    expect(googleDirections(realShop(null))).toEqual({ ok: false, reason: '位置不明' })
    expect(googleDirections(SAMPLE_SHOPS[0]).ok).toBe(false)
  })
})

describe('距離', () => {
  it('東京駅〜大阪駅はおよそ 400km（直線）', () => {
    const d = distanceKm({ lat: 35.681, lng: 139.767 }, { lat: 34.702, lng: 135.495 })
    expect(d).toBeGreaterThan(395)
    expect(d).toBeLessThan(410)
  })
  it('表示形式', () => {
    expect(formatDistance(0.85)).toBe('850m')
    expect(formatDistance(1.234)).toBe('1.2km')
    expect(formatDistance(23.6)).toBe('24km')
    expect(formatDistance(null)).toBe('距離不明')
  })
})
