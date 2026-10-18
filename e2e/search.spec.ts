import { expect, test } from '@playwright/test'

test('初回の地域設定とお気に入りが再読み込み後も残る', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('都道府県').selectOption('13')
  await page.getByRole('button', { name: 'この地域にする' }).click()
  await expect(page.getByText('基本地域：')).toContainText('東京都')

  await page.goto('/#/shops')
  await page.getByRole('button', { name: 'テストホール 北口 をお気に入りに追加' }).click()

  await page.reload()
  await expect(page.getByRole('button', { name: 'テストホール 北口 をお気に入りから外す' })).toBeVisible()
  // 基本地域（東京都）の店だけ
  const cards = page.getByRole('list', { name: '店舗一覧' }).getByRole('article')
  await expect(cards).toHaveCount(3)

  await page.goto('/#/favorites')
  await expect(page.getByRole('list', { name: 'お気に入り店舗' }).getByRole('article')).toHaveCount(1)
})

test('共有された検索条件の URL で同じ結果になる', async ({ page }) => {
  await page.goto('/#/shops?sort=hyena&order=asc&area=all')
  await expect(page.getByLabel('並び順')).toHaveValue('hyena')
  await expect(page.getByRole('button', { name: /低い順/ })).toBeVisible()
  await expect(page.getByRole('list', { name: '店舗一覧' }).getByRole('article')).toHaveCount(8)
})

test('GPS を拒否しても案内が出て一覧は使える', async ({ page, context }) => {
  await context.clearPermissions()
  await page.goto('/#/shops')
  await page.getByRole('button', { name: '現在地の近くの候補' }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page.getByRole('list', { name: '店舗一覧' })).toBeVisible()
})

test('GPS を許可すると候補を出し、選ぶまで基準地点は変わらない', async ({ page, context }) => {
  await context.grantPermissions(['geolocation'])
  await context.setGeolocation({ latitude: 35.69, longitude: 139.7 })
  await page.goto('/#/shops')
  await page.getByRole('button', { name: '現在地の近くの候補' }).click()
  await expect(page.getByRole('list', { name: '近くの店舗候補' })).toBeVisible()
  await expect(page.getByText(/距離の基準：なし/)).toBeVisible()
  await page.getByRole('button', { name: '現在地を一時的な検索地点にする' }).click()
  await expect(page.getByText(/距離の基準：現在地（一時）/)).toBeVisible()
})

test('一覧⇄地図を切り替えられる（位置のある店だけ印が出る）', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/#/shops?area=all')
  await page.getByRole('button', { name: '地図' }).click()
  const map = page.getByRole('region', { name: '店舗の地図' })
  await expect(map).toBeVisible()
  // 架空8店のうち位置ありは7店（+ 基準地点の印は基本地域未設定のため無し）
  await expect(map.locator('path.leaflet-interactive')).toHaveCount(7)
  await expect(page).toHaveURL(/view=map/)
  await page.getByRole('button', { name: '一覧' }).click()
  await expect(page.getByRole('list', { name: '店舗一覧' })).toBeVisible()
  expect(errors).toEqual([])
})

test('0件でも落ちず、リセットで戻る', async ({ page }) => {
  await page.goto('/#/shops?q=zzzzzz')
  await expect(page.getByText('条件に合う店舗がありません')).toBeVisible()
  await page.getByRole('button', { name: '条件をリセット' }).click()
  await expect(page.getByRole('list', { name: '店舗一覧' })).toBeVisible()
})
