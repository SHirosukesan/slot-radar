import { render, screen } from '@testing-library/react'
import type { Score } from '../types/score'
import { ScoreTile } from './ScoreTile'

const basis = { periodDays: 90 as const, sampleDays: 80, note: 'n', source: 's' }

describe('ScoreTile', () => {
  it('未評価は「—」と「未評価」を出し、0 を出さない', () => {
    render(<ScoreTile kind="setting" score={{ status: 'unrated' }} />)
    const tile = screen.getByRole('group', { name: '設定狙い 未評価' })
    expect(tile).toHaveTextContent('—')
    expect(tile).toHaveTextContent('未評価')
    expect(tile.textContent).not.toMatch(/\d/)
  })

  it('評価保留は点数を出さず「評価保留」', () => {
    render(<ScoreTile kind="setting" score={{ status: 'on_hold', reason: '欠損' }} />)
    const tile = screen.getByRole('group', { name: '設定狙い 評価保留' })
    expect(tile).toHaveTextContent('—')
    expect(tile.textContent).not.toMatch(/\d/)
  })

  it('暫定は点数と「暫定」ラベルを両方出す', () => {
    render(<ScoreTile kind="hyena" score={{ status: 'provisional', value: 70, confidence: 'low', basis }} />)
    const tile = screen.getByRole('group', { name: 'ハイエナ 70点 暫定' })
    expect(tile).toHaveTextContent('70')
    expect(tile).toHaveTextContent('暫定')
  })

  it('評価済みは点数と信頼度を出す', () => {
    render(<ScoreTile kind="overall" score={{ status: 'rated', value: 74, confidence: 'high', basis }} />)
    expect(screen.getByRole('group', { name: '総合 74点 信頼度 高' })).toBeInTheDocument()
  })

  it('型レベルで「未評価なのに点数あり」を作れない', () => {
    // @ts-expect-error unrated は value を持てない（0点で埋めることを禁止）
    const bad: Score = { status: 'unrated', value: 0 }
    expect(bad.status).toBe('unrated')
  })
})
