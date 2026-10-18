import { lazy, Suspense, useMemo } from 'react'
import { Link } from 'react-router'
import { GpsNearby } from '../components/GpsNearby'
import { GearIcon, ListIcon, MapIcon } from '../components/icons'
import { PageHeader } from '../components/PageHeader'
import { SampleDataBanner } from '../components/SampleDataBanner'
import { SearchControls } from '../components/SearchControls'
import { ShopCard } from '../components/ShopCard'
import { useAppData, useOrigin } from '../hooks/useAppData'
import { useShopSearch, type ViewMode } from '../hooks/useShopSearch'
import { listShops } from '../services/shopRepository'
import { runShopQuery } from '../services/shopQuery'

const ShopMap = lazy(() => import('../components/ShopMap'))

export function ShopListPage() {
  const { prefs, favorites } = useAppData()
  const origin = useOrigin()
  const { query, setQuery, view, setView, reset, applyParams } = useShopSearch()
  const shops = listShops()

  const outcome = useMemo(
    () =>
      runShopQuery(shops, query, {
        favorites,
        basePrefectureCode: prefs.basePrefectureCode,
        origin: origin?.point ?? null,
        maxDistanceKm: prefs.maxDistanceKm,
        hideLowConfidence: prefs.hideLowConfidence,
      }),
    [shops, query, favorites, prefs.basePrefectureCode, prefs.maxDistanceKm, prefs.hideLowConfidence, origin],
  )
  const { results } = outcome
  const hasSample = shops.some((s) => s.isSample)

  return (
    <>
      <PageHeader
        title="店舗検索"
        right={
          <div className="flex items-center">
            <ViewToggle view={view} setView={setView} />
            <Link to="/settings" aria-label="設定" className="flex size-11 items-center justify-center rounded-full text-text-muted hover:bg-surface">
              <GearIcon size={22} />
            </Link>
          </div>
        }
      />
      {hasSample && <SampleDataBanner />}
      {prefs.basePrefectureCode == null && (
        <p className="mx-4 mt-3 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
          基本地域が未設定のため全国を表示しています。
          <Link to="/settings" className="ml-1 inline-flex min-h-11 items-center font-bold text-accent underline">
            地域を設定
          </Link>
        </p>
      )}

      <SearchControls query={query} setQuery={setQuery} reset={reset} applyParams={applyParams} />
      <GpsNearby shops={shops} />

      <div className="flex flex-wrap items-baseline justify-between gap-x-3 px-4 pt-4 text-sm text-text-muted" aria-live="polite">
        <span className="tabular">
          <strong className="text-base text-text">{results.length}</strong> 件 / 全{outcome.totalBeforeFilter}件
        </span>
        <span className="text-xs">距離の基準：{origin ? origin.label : 'なし'}</span>
      </div>
      {outcome.unknownDistanceCount > 0 && (
        <p className="px-4 pt-1 text-xs text-text-muted">位置不明の {outcome.unknownDistanceCount} 件は距離で判定できないため残しています。</p>
      )}

      {results.length === 0 ? (
        <div className="mx-4 mt-4 rounded-2xl border border-border bg-surface p-5 text-center">
          <p className="font-bold">条件に合う店舗がありません</p>
          <p className="mt-1 text-sm text-text-muted">範囲・距離・キーワードを変えてみてください。</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={reset} className="min-h-11 rounded-xl border border-border px-4 text-sm font-bold">
              条件をリセット
            </button>
            <button
              type="button"
              onClick={() => setQuery({ area: { kind: 'all' }, maxDistanceKm: null })}
              className="min-h-11 rounded-xl bg-accent-strong px-4 text-sm font-bold text-white"
            >
              全国・距離制限なしで探す
            </button>
          </div>
        </div>
      ) : view === 'map' ? (
        <div className="px-4 pt-2">
          <Suspense fallback={<p className="py-10 text-center text-text-muted">地図を読み込み中…</p>}>
            <ShopMap results={results} origin={origin} />
          </Suspense>
          <p className="mt-2 text-xs text-text-muted">
            {hasSample && '架空店舗の位置は架空です。'}位置不明の店舗は地図に出ません。印をタップで店名、名前のリンクで詳細へ。
          </p>
        </div>
      ) : (
        <ul className="space-y-3 px-4 pt-2" aria-label="店舗一覧">
          {results.map((r) => (
            <li key={r.shop.id}>
              <ShopCard result={r} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function ViewToggle({ view, setView }: { view: ViewMode; setView: (v: ViewMode) => void }) {
  const next: ViewMode = view === 'map' ? 'list' : 'map'
  return (
    <button
      type="button"
      onClick={() => setView(next)}
      className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-accent hover:bg-surface"
    >
      {next === 'map' ? <MapIcon size={20} /> : <ListIcon size={20} />}
      {next === 'map' ? '地図' : '一覧'}
    </button>
  )
}
