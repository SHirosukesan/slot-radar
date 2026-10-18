import { Link } from 'react-router'
import { formatDistance } from '../lib/geo'
import { formatUpdatedAt } from '../lib/format'
import type { ShopResult } from '../services/shopQuery'
import { SCORE_KINDS } from '../types/score'
import { FavoriteButton } from './FavoriteButton'
import { RouteButton } from './RouteButton'
import { SampleBadge } from './SampleDataBanner'
import { ScoreTile } from './ScoreTile'

const STATUS_NOTE = { open: null, closed: '閉店', unknown: '営業状態 不明' } as const

/**
 * 店舗カード。一覧は数値中心、詳しい根拠は詳細画面へ（仕様 3章）。
 * 星・経路ボタンはリンクの外に置き、操作が重ならないようにする。
 */
export function ShopCard({ result }: { result: ShopResult }) {
  const { shop, scores, distanceKm } = result
  const statusNote = STATUS_NOTE[shop.status]
  return (
    <article className="relative rounded-2xl border border-border bg-surface" aria-labelledby={`shop-${shop.id}`}>
      <Link to={`/shops/${shop.id}`} className="block rounded-t-2xl p-4 pb-2 pr-3 hover:bg-surface-2/40">
        <div className="flex items-start gap-2 pr-11">
          {shop.isSample && <SampleBadge />}
          <h2 id={`shop-${shop.id}`} className="line-clamp-2 text-lg font-bold leading-snug break-all">
            {shop.name}
          </h2>
        </div>
        <p className="mt-1 flex flex-wrap gap-x-2 text-sm text-text-muted">
          <span>
            {shop.prefecture} {shop.city}
          </span>
          {statusNote && <span className="font-bold text-warn">{statusNote}</span>}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {SCORE_KINDS.map((kind) => (
            <ScoreTile key={kind} kind={kind} score={scores[kind]} />
          ))}
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2 px-2 pb-2 pl-3">
        <RouteButton shop={shop} />
        <p className="tabular text-right text-xs leading-tight text-text-muted">
          <span className="block">{formatDistance(distanceKm)}</span>
          <span className="block">更新 {formatUpdatedAt(shop.updatedAt)}</span>
        </p>
      </div>
      <FavoriteButton shopId={shop.id} shopName={shop.name} className="absolute right-1.5 top-1.5" />
    </article>
  )
}
