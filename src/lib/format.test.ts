import { formatPeriod, formatUpdatedAt } from './format'

describe('formatUpdatedAt', () => {
  it('日本時間で表示する', () => {
    // UTC 14:30 = 日本時間 23:30
    expect(formatUpdatedAt('2026-10-17T14:30:00Z')).toBe('10/17 23:30')
  })
  it('null・不正値は「不明」', () => {
    expect(formatUpdatedAt(null)).toBe('不明')
    expect(formatUpdatedAt('not-a-date')).toBe('不明')
  })
})

describe('formatPeriod', () => {
  it('365日は「1年」', () => {
    expect(formatPeriod(365)).toBe('1年')
    expect(formatPeriod(30)).toBe('30日')
  })
})
