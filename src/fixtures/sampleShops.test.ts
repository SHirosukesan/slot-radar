import { SAMPLE_SHOPS } from './sampleShops'

describe('架空サンプルデータ', () => {
  it('すべて isSample: true で、住所に（架空）と書かれている', () => {
    expect(SAMPLE_SHOPS.length).toBeGreaterThan(0)
    for (const shop of SAMPLE_SHOPS) {
      expect(shop.isSample).toBe(true)
      expect(shop.address).toContain('（架空）')
    }
  })

  it('ID が重複しない', () => {
    const ids = SAMPLE_SHOPS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('点数は 0〜100 の整数', () => {
    for (const shop of SAMPLE_SHOPS) {
      for (const score of Object.values(shop.scores)) {
        if (score.status === 'rated' || score.status === 'provisional') {
          expect(Number.isInteger(score.value)).toBe(true)
          expect(score.value).toBeGreaterThanOrEqual(0)
          expect(score.value).toBeLessThanOrEqual(100)
        }
      }
    }
  })

  it('架空店舗の座標は未確認扱い（経路を出さない）', () => {
    for (const shop of SAMPLE_SHOPS) expect(shop.location?.verified ?? false).toBe(false)
  })

  it('表示確認用に、未評価・暫定・保留・長い店名を含む', () => {
    const statuses = SAMPLE_SHOPS.flatMap((s) => Object.values(s.scores).map((v) => v.status))
    expect(statuses).toEqual(expect.arrayContaining(['rated', 'provisional', 'unrated', 'on_hold']))
    expect(SAMPLE_SHOPS.some((s) => s.name.length >= 30)).toBe(true)
  })
})
