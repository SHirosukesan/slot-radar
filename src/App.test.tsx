import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('画面遷移', () => {
  it('下部ナビの5タブすべてに移動できる', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const nav = screen.getByRole('navigation', { name: 'メインメニュー' })
    const tabs: [string, string][] = [
      ['店舗検索', '店舗検索'],
      ['実戦記録', '実戦記録'],
      ['収支', '収支'],
      ['お気に入り', 'お気に入り'],
    ]
    for (const [tab, heading] of tabs) {
      await user.click(within(nav).getByRole('link', { name: tab }))
      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
      expect(within(nav).getByRole('link', { name: tab })).toHaveAttribute('aria-current', 'page')
    }
    await user.click(within(nav).getByRole('link', { name: 'ホーム' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('SLOT RADAR')
  })

  it('店舗一覧に架空データの帯とバッジが出る', () => {
    renderAt('/shops')
    expect(screen.getByRole('note')).toHaveTextContent('架空データを表示中')
    const list = screen.getByRole('list', { name: '店舗一覧' })
    for (const card of within(list).getAllByRole('article')) {
      expect(card).toHaveTextContent('架空')
    }
  })

  it('一覧 → 詳細に移動し、根拠が表示される', async () => {
    const user = userEvent.setup()
    renderAt('/shops')
    await user.click(screen.getByRole('link', { name: /サンプル会館 中央駅前店/ }))
    expect(screen.getByRole('heading', { level: 1, name: '店舗詳細' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'サンプル会館 中央駅前店' })).toBeInTheDocument()
    expect(screen.getAllByText(/出典：架空データ/, { selector: 'span' })).toHaveLength(3)
  })

  it('データ無しの店舗は詳細でも「根拠データなし」で 0 点にならない', () => {
    renderAt('/shops/sample-004')
    expect(screen.getAllByText('根拠データなし（未評価）')).toHaveLength(3)
    for (const tile of screen.getAllByRole('group')) {
      expect(tile.textContent).not.toMatch(/\d/)
    }
  })

  it('存在しない店舗 ID でも落ちずに案内を出す', () => {
    renderAt('/shops/does-not-exist')
    expect(screen.getByRole('heading', { name: '店舗が見つかりません' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '店舗一覧へ戻る' })).toBeInTheDocument()
  })

  it('存在しない URL は「ページが見つかりません」', () => {
    renderAt('/nope')
    expect(screen.getByRole('heading', { name: 'ページが見つかりません' })).toBeInTheDocument()
  })

  it('星を付けるとお気に入り画面に出る', async () => {
    const user = userEvent.setup()
    renderAt('/shops')
    const star = screen.getByRole('button', { name: 'テストホール 北口 をお気に入りに追加' })
    await user.click(star)
    expect(star).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('link', { name: 'お気に入り' }))
    const list = screen.getByRole('list', { name: 'お気に入り店舗' })
    expect(within(list).getAllByRole('article')).toHaveLength(1)
    expect(list).toHaveTextContent('テストホール 北口')
  })
})
