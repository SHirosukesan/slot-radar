import type { Shop } from '../types/shop'
import { UNRATED } from '../types/score'

/**
 * 【架空データ】画面確認専用のサンプル店舗。
 * - 店名・住所・点数はすべて架空。実在の店舗・実績とは無関係。
 * - 点数は表示確認のための手入力値で、本番の算出ロジックの結果ではない。
 * - isSample: true を必ず付ける（画面に「架空」バッジが出る）。
 */
const SAMPLE_SOURCE = '架空データ（画面確認用）'

export const SAMPLE_SHOPS: readonly Shop[] = [
  {
    id: 'sample-001',
    name: 'サンプル会館 中央駅前店',
    prefecture: '東京都',
    city: '架空市中央区',
    address: '東京都架空市中央区サンプル1-2-3（架空）',
    status: 'open',
    isSample: true,
    updatedAt: '2026-10-17T23:30:00+09:00',
    scores: {
      overall: {
        status: 'rated',
        value: 74,
        confidence: 'high',
        basis: { periodDays: 90, sampleDays: 88, note: '通常日・特定日とも安定', source: SAMPLE_SOURCE },
      },
      setting: {
        status: 'rated',
        value: 68,
        confidence: 'medium',
        basis: { periodDays: 90, sampleDays: 88, note: '主要機種の高設定挙動が多め', source: SAMPLE_SOURCE },
      },
      hyena: {
        status: 'rated',
        value: 81,
        confidence: 'high',
        basis: { periodDays: 30, sampleDays: 30, note: '設置台数が多く、狙い台の母数が大きい', source: SAMPLE_SOURCE },
      },
    },
  },
  {
    id: 'sample-002',
    name: 'テストホール 北口',
    prefecture: '東京都',
    city: '架空市北区',
    address: '東京都架空市北区テスト4-5（架空）',
    status: 'open',
    isSample: true,
    updatedAt: '2026-10-16T23:10:00+09:00',
    scores: {
      overall: {
        status: 'provisional',
        value: 55,
        confidence: 'low',
        basis: { periodDays: 30, sampleDays: 9, note: 'データ取得日が少ない', source: SAMPLE_SOURCE },
      },
      setting: UNRATED,
      hyena: {
        status: 'rated',
        value: 62,
        confidence: 'medium',
        basis: { periodDays: 30, sampleDays: 27, note: '中規模店', source: SAMPLE_SOURCE },
      },
    },
  },
  {
    id: 'sample-003',
    name: 'デモスロット館 とても長い店舗名のレイアウト確認用 第二駐車場併設 大型旗艦店',
    prefecture: '神奈川県',
    city: '架空市港区',
    address: '神奈川県架空市港区デモ6-7-8（架空）',
    status: 'open',
    isSample: true,
    updatedAt: '2026-10-15T22:45:00+09:00',
    scores: {
      overall: {
        status: 'rated',
        value: 47,
        confidence: 'medium',
        basis: { periodDays: 90, sampleDays: 71, note: '特定日以外は弱め', source: SAMPLE_SOURCE },
      },
      setting: { status: 'on_hold', reason: '人気機種のデータ欠損が多く、判断できない' },
      hyena: {
        status: 'provisional',
        value: 70,
        confidence: 'low',
        basis: { periodDays: 30, sampleDays: 6, note: '母数不足', source: SAMPLE_SOURCE },
      },
    },
  },
  {
    id: 'sample-004',
    name: 'みほん遊技場',
    prefecture: '埼玉県',
    city: '架空市',
    address: '埼玉県架空市みほん9（架空）',
    status: 'unknown',
    isSample: true,
    updatedAt: null,
    scores: { overall: UNRATED, setting: UNRATED, hyena: UNRATED },
  },
]
