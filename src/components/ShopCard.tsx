import { Link } from 'react-router'
import { formatUpdatedAt } from '../lib/format'
import { SCORE_KINDS } from '../types/score'
import type { Shop } from '../types/shop'
import { FavoriteButton } from './FavoriteButton'
import { SampleBadge } from './SampleDataBanner'
import { ScoreTile } from './ScoreTile'

/**
 * 店舗カード。一覧は数値中心、詳しい根拠は詳細画面へ（仕様 3章）。
 * 星ボタンはリンクの外に置き、操作が重ならないようにする。
 */
export function ShopCard({ shop }: { shop: Shop }) {
  return (
    <article className="relative rounded-2xl border border-border bg-surface" aria-labelledby={`shop-${shop.id}`}>
      <Link to={`/shops/${shop.id}`} className="block rounded-2xl p-4 pr-3 hover:bg-surface-2/40">
        <div className="flex items-start gap-2 pr-11">
          {shop.isSample && <SampleBadge />}
          <h2 id={`shop-${shop.id}`} className="line-clamp-2 text-lg font-bold leading-snug break-all">
            {shop.name}
          </h2>
        </div>
        <p className="mt-1 text-sm text-text-muted">
          {shop.prefecture} {shop.city}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {SCORE_KINDS.map((kind) => (
            <ScoreTile key={kind} kind={kind} score={shop.scores[kind]} />
          ))}
        </div>

        <p className="tabular mt-2 text-right text-xs text-text-muted">
          更新 {formatUpdatedAt(shop.updatedAt)}
        </p>
      </Link>
      <FavoriteButton shopId={shop.id} shopName={shop.name} className="absolute right-1.5 top-1.5" />
    </article>
  )
}
