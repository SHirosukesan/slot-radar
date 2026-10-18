import { PageHeader } from '../components/PageHeader'
import { SampleDataBanner } from '../components/SampleDataBanner'
import { ShopCard } from '../components/ShopCard'
import { listShops } from '../services/shopRepository'

export function ShopListPage() {
  const shops = listShops()
  const hasSample = shops.some((s) => s.isSample)

  return (
    <>
      <PageHeader title="店舗検索" />
      {hasSample && <SampleDataBanner />}
      <p className="tabular px-4 pt-3 text-sm text-text-muted">{shops.length} 件</p>
      {shops.length === 0 ? (
        <p className="mx-4 mt-6 text-center text-text-muted">店舗がありません</p>
      ) : (
        <ul className="space-y-3 px-4 pt-2" aria-label="店舗一覧">
          {shops.map((shop) => (
            <li key={shop.id}>
              <ShopCard shop={shop} />
            </li>
          ))}
        </ul>
      )}
      <p className="px-4 pt-4 text-xs text-text-muted">並び替え・絞り込み・地図表示は Phase 2 で追加します。</p>
    </>
  )
}
