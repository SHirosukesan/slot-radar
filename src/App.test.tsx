import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { savePreferences } from './services/storage/repositories'
import { clearDb, renderApp } from './test/renderApp'
import { DEFAULT_PREFERENCES } from './types/preferences'

beforeEach(clearDb)

describe('画面遷移', () => {
  it('下部ナビの5タブすべてに移動できる', async () => {
    const user = userEvent.setup()
    await renderApp('/')
    const nav = screen.getByRole('navigation', { name: 'メインメニュー' })
    for (const tab of ['店舗検索', '実戦記録', '収支', 'お気に入り']) {
      await user.click(within(nav).getByRole('link', { name: tab }))
      expect(await screen.findByRole('heading', { level: 1, name: tab })).toBeInTheDocument()
      expect(within(nav).getByRole('link', { name: tab })).toHaveAttribute('aria-current', 'page')
    }
    await user.click(within(nav).getByRole('link', { name: 'ホーム' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('SLOT RADAR')
  })

  it('店舗一覧に架空データの帯とバッジが出る', async () => {
    await renderApp('/shops')
    expect(screen.getByText('架空データを表示中')).toBeInTheDocument()
    const list = screen.getByRole('list', { name: '店舗一覧' })
    for (const card of within(list).getAllByRole('article')) {
      expect(card).toHaveTextContent('架空')
    }
  })

  it('一覧 → 詳細に移動し、根拠が表示される', async () => {
    const user = userEvent.setup()
    await renderApp('/shops')
    await user.click(screen.getByRole('link', { name: /サンプル会館 中央駅前店/ }))
    expect(screen.getByRole('heading', { level: 2, name: 'サンプル会館 中央駅前店' })).toBeInTheDocument()
    expect(screen.getAllByText(/出典：架空データ/, { selector: 'span' })).toHaveLength(3)
  })

  it('データ無しの店舗は詳細でも「根拠データなし」で 0 点にならない', async () => {
    await renderApp('/shops/sample-004')
    expect(screen.getAllByText('根拠データなし（未評価）')).toHaveLength(3)
    for (const tile of screen.getAllByRole('group')) {
      expect(tile.textContent).not.toMatch(/\d/)
    }
  })

  it('存在しない店舗 ID・URL でも落ちずに案内を出す', async () => {
    await renderApp('/shops/does-not-exist')
    expect(screen.getByRole('heading', { name: '店舗が見つかりません' })).toBeInTheDocument()
  })

  it('存在しない URL は「ページが見つかりません」', async () => {
    await renderApp('/nope')
    expect(screen.getByRole('heading', { name: 'ページが見つかりません' })).toBeInTheDocument()
  })
})

describe('保存と再起動（IndexedDB）', () => {
  it('お気に入りは再起動（再表示）後も残る', async () => {
    const user = userEvent.setup()
    const first = await renderApp('/shops')
    await user.click(screen.getByRole('button', { name: 'テストホール 北口 をお気に入りに追加' }))
    first.unmount()

    await renderApp('/favorites')
    const list = screen.getByRole('list', { name: 'お気に入り店舗' })
    expect(within(list).getAllByRole('article')).toHaveLength(1)
    expect(list).toHaveTextContent('テストホール 北口')
  })

  it('初回の地域設定が保存され、店舗検索の範囲に使われる', async () => {
    const user = userEvent.setup()
    const first = await renderApp('/')
    await user.selectOptions(screen.getByLabelText('都道府県'), '27')
    await user.click(screen.getByRole('button', { name: 'この地域にする' }))
    expect(screen.getByText('大阪府')).toBeInTheDocument()
    first.unmount()

    await renderApp('/shops')
    const list = screen.getByRole('list', { name: '店舗一覧' })
    const cards = within(list).getAllByRole('article')
    expect(cards).toHaveLength(1)
    expect(cards[0]).toHaveTextContent('かりそめ会館')
  })

  it('一時的な条件（キーワード）は URL だけに残り、次回起動時は解除', async () => {
    const user = userEvent.setup()
    const first = await renderApp('/shops')
    await user.type(screen.getByRole('searchbox'), 'テスト{Enter}')
    expect(within(screen.getByRole('list', { name: '店舗一覧' })).getAllByRole('article')).toHaveLength(1)
    first.unmount()

    await renderApp('/shops')
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(within(screen.getByRole('list', { name: '店舗一覧' })).getAllByRole('article').length).toBeGreaterThan(1)
  })
})

describe('検索条件', () => {
  it('URL の条件をそのまま復元できる（共有リンク）', async () => {
    await renderApp('/shops?sort=hyena&order=asc&area=all')
    expect(screen.getByLabelText('並び順')).toHaveValue('hyena')
    expect(screen.getByRole('button', { name: /低い順/ })).toBeInTheDocument()
  })

  it('0件の時はリセットの案内が出て、押すと戻る', async () => {
    const user = userEvent.setup()
    await renderApp('/shops?q=存在しない店名')
    expect(screen.getByText('条件に合う店舗がありません')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '条件をリセット' }))
    expect(screen.getByRole('list', { name: '店舗一覧' })).toBeInTheDocument()
  })

  it('低信頼の評価を隠しても店舗自体は消えない', async () => {
    await savePreferences({ ...DEFAULT_PREFERENCES, hideLowConfidence: true, onboardingDone: true })
    await renderApp('/shops?area=all')
    const list = screen.getByRole('list', { name: '店舗一覧' })
    expect(within(list).getAllByRole('article')).toHaveLength(8)
    expect(screen.getAllByRole('group', { name: '総合 低信頼・非表示' }).length).toBeGreaterThan(0)
  })

  it('架空店舗の経路ボタンは押せず、理由を表示する', async () => {
    await renderApp('/shops/sample-001')
    expect(screen.queryByRole('link', { name: /Googleマップで経路/ })).not.toBeInTheDocument()
    expect(screen.getByText(/経路なし・架空店舗/)).toBeInTheDocument()
  })
})

describe('GPS', () => {
  const original = navigator.geolocation
  afterEach(() => Object.defineProperty(navigator, 'geolocation', { value: original, configurable: true }))

  it('拒否されても代わりの探し方を案内し、一覧は使える', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: (_ok: unknown, err: (e: unknown) => void) =>
          err({ code: 1, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 }),
      },
    })
    const user = userEvent.setup()
    await renderApp('/shops')
    await user.click(screen.getByRole('button', { name: '現在地の近くの候補' }))
    expect(screen.getByRole('alert')).toHaveTextContent('位置情報の利用が許可されていません')
    expect(screen.getByRole('link', { name: '地域を設定する' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: '店舗一覧' })).toBeInTheDocument()
  })

  it('許可されたら近い候補を出し、選ぶのは本人（自動で確定しない）', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: (ok: (p: unknown) => void) => ok({ coords: { latitude: 34.666, longitude: 135.5 } }),
      },
    })
    const user = userEvent.setup()
    await renderApp('/shops')
    await user.click(screen.getByRole('button', { name: '現在地の近くの候補' }))
    const candidates = screen.getByRole('list', { name: '近くの店舗候補' })
    expect(within(candidates).getAllByRole('link')[0]).toHaveTextContent('かりそめ会館')
    // まだ基準地点は変わっていない
    expect(screen.getByText(/距離の基準：なし/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '現在地を一時的な検索地点にする' }))
    expect(screen.getByText(/距離の基準：現在地（一時）/)).toBeInTheDocument()
  })
})
