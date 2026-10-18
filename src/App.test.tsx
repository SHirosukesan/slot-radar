import { render, screen, within } from '@testing-library/react'
import App from './App'

describe('起動画面 (Phase 0)', () => {
  it('アプリ名を見出しとして表示する', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('SLOT RADAR')
  })

  it('開発中のフェーズとデータ未登録であることを明示する', () => {
    render(<App />)
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Phase 0')
    expect(status).toHaveTextContent('開発中')
    expect(status).toHaveTextContent('実データ・架空データとも未登録')
  })

  it('評価軸はデータが無いので 0 点ではなく「— / 未評価」と表示する', () => {
    render(<App />)
    const list = screen.getByRole('list', { name: '予定している主な評価軸' })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    for (const item of items) {
      expect(item).toHaveTextContent('—')
      expect(item).toHaveTextContent('未評価')
      expect(item).not.toHaveTextContent(/\b0\b/)
    }
  })
})
