import { expect, test, type Page } from '@playwright/test'

/** ページに横スクロール（はみ出し）が無いこと */
async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
}

test('各画面で横にはみ出さず、コンソールエラーが出ない', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))

  for (const path of ['/', '/shops', '/shops?view=map', '/shops/sample-003', '/records', '/balance', '/favorites', '/settings', '/nope']) {
    await page.goto(`/#${path}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expectNoHorizontalOverflow(page)
  }
  expect(errors).toEqual([])
})

test('下部ナビの全タブが 44px 以上で、移動できる', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'メインメニュー' })
  for (const name of ['店舗検索', '実戦記録', '収支', 'お気に入り', 'ホーム']) {
    const link = nav.getByRole('link', { name })
    const box = await link.boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(44)
    await link.click()
    await expect(link).toHaveAttribute('aria-current', 'page')
  }
})

test('一覧 → 詳細 → 戻る', async ({ page }) => {
  await page.goto('/#/shops')
  await expect(page.getByText('架空データを表示中')).toBeVisible()
  await page.getByRole('link', { name: /サンプル会館 中央駅前店/ }).click()
  await expect(page.getByRole('heading', { level: 2, name: 'サンプル会館 中央駅前店' })).toBeVisible()
  await page.getByRole('button', { name: '戻る' }).click()
  await expect(page.getByRole('heading', { level: 1, name: '店舗検索' })).toBeVisible()
})

test('詳細画面を直接開いて再読み込みしても表示される', async ({ page }) => {
  await page.goto('/#/shops/sample-002')
  await page.reload()
  await expect(page.getByRole('heading', { level: 2, name: 'テストホール 北口' })).toBeVisible()
  // 直接開いた時の「戻る」は一覧へ
  await page.getByRole('button', { name: '戻る' }).click()
  await expect(page).toHaveURL(/#\/shops$/)
})
