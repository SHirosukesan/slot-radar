import type { Score, ScoreBasis, Confidence } from '../types/score'
import type { Shop } from '../types/shop'
import { UNRATED } from '../types/score'

/**
 * 【架空データ】画面確認専用のサンプル店舗。
 * - 店名・住所・点数・座標はすべて架空。実在の店舗・実績とは無関係。
 * - 座標は地図・距離の表示確認用に適当な場所へ置いただけで、verified: false。
 *   （経路案内は出さない）
 * - 点数は表示確認のための手入力値で、本番の算出ロジックの結果ではない。
 */
const SOURCE = '架空データ（画面確認用）'

const basis = (periodDays: ScoreBasis['periodDays'], sampleDays: number, note: string): ScoreBasis => ({
  periodDays,
  sampleDays,
  note,
  source: SOURCE,
})
const rated = (value: number, confidence: Confidence, b: ScoreBasis): Score => ({
  status: 'rated',
  value,
  confidence,
  basis: b,
})
const provisional = (value: number, b: ScoreBasis): Score => ({
  status: 'provisional',
  value,
  confidence: 'low',
  basis: b,
})
const fakeLoc = (lat: number, lng: number) => ({ lat, lng, verified: false })

export const SAMPLE_SHOPS: readonly Shop[] = [
  {
    id: 'sample-001',
    name: 'サンプル会館 中央駅前店',
    prefectureCode: 13,
    prefecture: '東京都',
    city: '架空市中央区',
    address: '東京都架空市中央区サンプル1-2-3（架空）',
    location: fakeLoc(35.6905, 139.7005),
    status: 'open',
    isSample: true,
    updatedAt: '2026-10-17T23:30:00+09:00',
    scores: {
      overall: rated(74, 'high', basis(90, 88, '通常日・特定日とも安定')),
      setting: rated(68, 'medium', basis(90, 88, '主要機種の高設定挙動が多め')),
      hyena: rated(81, 'high', basis(30, 30, '設置台数が多く、狙い台の母数が大きい')),
    },
  },
  {
    id: 'sample-002',
    name: 'テストホール 北口',
    prefectureCode: 13,
    prefecture: '東京都',
    city: '架空市北区',
    address: '東京都架空市北区テスト4-5（架空）',
    location: fakeLoc(35.7295, 139.7109),
    status: 'open',
    isSample: true,
    updatedAt: '2026-10-16T23:10:00+09:00',
    scores: {
      overall: provisional(55, basis(30, 9, 'データ取得日が少ない')),
      setting: UNRATED,
      hyena: rated(62, 'medium', basis(30, 27, '中規模店')),
    },
  },
  {
    id: 'sample-003',
    name: 'デモスロット館 とても長い店舗名のレイアウト確認用 第二駐車場併設 大型旗艦店',
    prefectureCode: 14,
    prefecture: '神奈川県',
    city: '架空市港区',
    address: '神奈川県架空市港区デモ6-7-8（架空）',
    location: fakeLoc(35.4660, 139.6225),
    status: 'open',
    isSample: true,
    updatedAt: '2026-10-15T22:45:00+09:00',
    scores: {
      overall: rated(47, 'medium', basis(90, 71, '特定日以外は弱め')),
      setting: { status: 'on_hold', reason: '人気機種のデータ欠損が多く、判断できない' },
      hyena: provisional(70, basis(30, 6, '母数不足')),
    },
  },
  {
    id: 'sample-004',
    name: 'みほん遊技場',
    prefectureCode: 11,
    prefecture: '埼玉県',
    city: '架空市',
    address: '埼玉県架空市みほん9（架空）',
    location: null,
    status: 'unknown',
    isSample: true,
    updatedAt: null,
    scores: { overall: UNRATED, setting: UNRATED, hyena: UNRATED },
  },
  {
    id: 'sample-005',
    name: 'ためしプラザ 西口',
    prefectureCode: 13,
    prefecture: '東京都',
    city: '架空市西区',
    address: '東京都架空市西区ためし2-1（架空）',
    location: fakeLoc(35.6580, 139.6970),
    status: 'open',
    isSample: true,
    updatedAt: '2026-10-18T09:00:00+09:00',
    scores: {
      overall: rated(63, 'high', basis(365, 340, '1年を通して中位で安定')),
      setting: rated(71, 'high', basis(90, 85, '特定日の高設定投入が多い')),
      hyena: rated(44, 'medium', basis(30, 28, '台数が少なめ')),
    },
  },
  {
    id: 'sample-006',
    name: 'もけいホール 臨海',
    prefectureCode: 14,
    prefecture: '神奈川県',
    city: '架空市臨海区',
    address: '神奈川県架空市臨海区もけい3（架空）',
    location: fakeLoc(35.5310, 139.6970),
    status: 'open',
    isSample: true,
    updatedAt: '2026-10-12T23:55:00+09:00',
    scores: {
      overall: rated(58, 'low', basis(90, 40, '欠損日が多い')),
      setting: provisional(49, basis(30, 7, '母数不足')),
      hyena: rated(77, 'high', basis(30, 30, '大型店で回転が早い')),
    },
  },
  {
    id: 'sample-007',
    name: 'かりそめ会館 なんば筋',
    prefectureCode: 27,
    prefecture: '大阪府',
    city: '架空市浪速区',
    address: '大阪府架空市浪速区かりそめ1（架空）',
    location: fakeLoc(34.6655, 135.5010),
    status: 'open',
    isSample: true,
    updatedAt: '2026-10-17T22:00:00+09:00',
    scores: {
      overall: rated(69, 'high', basis(90, 90, '安定')),
      setting: rated(66, 'medium', basis(90, 90, '中')),
      hyena: rated(59, 'medium', basis(30, 29, '中')),
    },
  },
  {
    id: 'sample-008',
    name: 'ダミー遊技場 さいたま新都心',
    prefectureCode: 11,
    prefecture: '埼玉県',
    city: '架空市大宮区',
    address: '埼玉県架空市大宮区ダミー5（架空）',
    location: fakeLoc(35.8935, 139.6320),
    status: 'closed',
    isSample: true,
    updatedAt: '2026-09-30T23:00:00+09:00',
    scores: {
      overall: { status: 'on_hold', reason: '閉店のため評価停止' },
      setting: UNRATED,
      hyena: UNRATED,
    },
  },
]
