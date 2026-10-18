import type { Shop } from '../types/shop'

export type RouteLink = { ok: true; url: string } | { ok: false; reason: string }

/**
 * Googleマップの経路案内URL（無料の URL 方式。API キー不要）。
 * https://developers.google.com/maps/documentation/urls/get-started
 * 位置が確認済みの店舗だけ。未確認・架空の位置へは誘導しない（仕様 10章-9）。
 */
export function googleDirections(shop: Shop): RouteLink {
  if (shop.isSample) return { ok: false, reason: '架空店舗' }
  const loc = shop.location
  if (!loc) return { ok: false, reason: '位置不明' }
  if (!loc.verified) return { ok: false, reason: '位置未確認' }

  const params = new URLSearchParams({ api: '1', destination: `${loc.lat},${loc.lng}` })
  if (loc.googlePlaceId) params.set('destination_place_id', loc.googlePlaceId)
  return { ok: true, url: `https://www.google.com/maps/dir/?${params.toString()}` }
}
