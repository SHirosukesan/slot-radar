import { SAMPLE_SHOPS } from '../fixtures/sampleShops'
import type { Shop } from '../types/shop'

/**
 * 店舗データの取得窓口。
 * 画面はここだけを呼ぶ。Phase 1 は架空データを返すだけだが、
 * 後で IndexedDB・実データアダプターに差し替えても画面側は変えずに済む。
 */
export function listShops(): readonly Shop[] {
  return SAMPLE_SHOPS
}

export function getShop(id: string): Shop | undefined {
  return SAMPLE_SHOPS.find((shop) => shop.id === id)
}
