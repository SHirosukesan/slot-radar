import { clearDb } from '../../test/renderApp'
import { DEFAULT_PREFERENCES } from '../../types/preferences'
import * as repo from './repositories'

beforeEach(clearDb)

describe('端末内保存', () => {
  it('設定が無ければ既定値（低信頼は隠す）', async () => {
    expect(await repo.loadPreferences()).toEqual(DEFAULT_PREFERENCES)
    expect(DEFAULT_PREFERENCES.hideLowConfidence).toBe(true)
  })

  it('設定を保存・読込でき、更新日時が付く', async () => {
    await repo.savePreferences({ ...DEFAULT_PREFERENCES, basePrefectureCode: 13 })
    const p = await repo.loadPreferences()
    expect(p.basePrefectureCode).toBe(13)
    expect(p.updatedAt).not.toBeNull()
  })

  it('お気に入りの追加・解除', async () => {
    await repo.setFavorite('a', true)
    await repo.setFavorite('b', true)
    await repo.setFavorite('a', false)
    expect((await repo.loadFavorites()).map((f) => f.shopId)).toEqual(['b'])
  })

  it('検索履歴は新しい順・重複なし・10件まで', async () => {
    for (let i = 0; i < 12; i++) await repo.addSearchHistory(`q${i}`)
    await repo.addSearchHistory('q5')
    const h = await repo.loadSearchHistory()
    expect(h).toHaveLength(10)
    expect(h[0].q).toBe('q5')
    expect(h.filter((e) => e.q === 'q5')).toHaveLength(1)
    expect(h.map((e) => e.q)).not.toContain('q0')
  })

  it('空の検索語は履歴に残さない', async () => {
    await repo.addSearchHistory('   ')
    expect(await repo.loadSearchHistory()).toHaveLength(0)
  })

  it('プリセットの保存・削除', async () => {
    const a = await repo.addSavedFilter('週末', 'sort=hyena')
    await repo.addSavedFilter('', 'area=all')
    let list = await repo.loadSavedFilters()
    expect(list.map((p) => p.name)).toEqual(['週末', '名前なし'])
    await repo.deleteSavedFilter(a.id)
    list = await repo.loadSavedFilters()
    expect(list).toHaveLength(1)
  })
})
