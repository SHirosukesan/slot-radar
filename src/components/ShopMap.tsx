import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import type { Origin } from '../hooks/useAppData'
import type { ShopResult } from '../services/shopQuery'

/**
 * 店舗の地図表示。無料の Leaflet + OpenStreetMap タイルを使う
 * （Google Maps の埋込 API は従量課金のため使わない。docs/data-sources.md 参照）。
 * 遅延読み込み（地図を開いた時だけダウンロード）するため default export。
 */
export default function ShopMap({ results, origin }: { results: ShopResult[]; origin: Origin | null }) {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!el.current) return
    const map = L.map(el.current, { zoomControl: true, attributionControl: true })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    }).addTo(map)

    const points: L.LatLngExpression[] = []
    for (const r of results) {
      const loc = r.shop.location
      if (!loc) continue
      const latlng: L.LatLngExpression = [loc.lat, loc.lng]
      points.push(latlng)
      const popup = document.createElement('div')
      const name = document.createElement('a')
      name.href = `#/shops/${encodeURIComponent(r.shop.id)}`
      name.textContent = (r.shop.isSample ? '【架空】' : '') + r.shop.name
      name.className = 'shop-map-link'
      popup.appendChild(name)
      L.circleMarker(latlng, {
        radius: r.isFavorite ? 11 : 9,
        color: '#f4f2fa',
        weight: 2,
        fillColor: r.isFavorite ? '#a78bfa' : '#7c3aed',
        fillOpacity: 0.95,
      })
        .bindPopup(popup)
        .bindTooltip(r.shop.name, { direction: 'top', offset: [0, -8] })
        .addTo(map)
    }
    if (origin) {
      const o: L.LatLngExpression = [origin.point.lat, origin.point.lng]
      points.push(o)
      L.circleMarker(o, { radius: 6, color: '#fbbf24', weight: 3, fillOpacity: 0 })
        .bindTooltip(`基準: ${origin.label}`)
        .addTo(map)
    }

    if (points.length > 0) map.fitBounds(L.latLngBounds(points), { padding: [32, 32], maxZoom: 15 })
    else map.setView([36.2, 138.25], 5) // 日本全体

    return () => {
      map.remove()
    }
  }, [results, origin])

  return <div ref={el} className="shop-map relative z-0 h-[60dvh] min-h-80 w-full rounded-2xl border border-border" role="region" aria-label="店舗の地図" />
}
