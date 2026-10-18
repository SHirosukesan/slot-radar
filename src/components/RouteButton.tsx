import { googleDirections } from '../lib/maps'
import type { Shop } from '../types/shop'
import { RouteIcon } from './icons'

/** Googleマップの経路案内。位置未確認・架空の店舗は押せず、理由を表示 */
export function RouteButton({ shop, variant = 'compact' }: { shop: Shop; variant?: 'compact' | 'wide' }) {
  const link = googleDirections(shop)
  const base =
    variant === 'wide'
      ? 'flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-base font-bold'
      : 'inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-bold'

  if (!link.ok) {
    return (
      <span
        className={`${base} cursor-not-allowed border border-border text-text-muted`}
        aria-disabled="true"
        title={`経路なし：${link.reason}`}
      >
        <RouteIcon size={18} />
        <span className="whitespace-nowrap">経路なし・{link.reason}</span>
      </span>
    )
  }
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-accent-strong text-white hover:bg-accent-strong/90`}
    >
      <RouteIcon size={18} />
      <span className="whitespace-nowrap">Googleマップで経路</span>
    </a>
  )
}
