import { Link } from 'react-router'
import { ComingSoon } from '../components/ComingSoon'
import { PageHeader } from '../components/PageHeader'
import { ShopCard } from '../components/ShopCard'
import { useMemo } from 'react'
import { useAppData, useOrigin } from '../hooks/useAppData'
import { listShops } from '../services/shopRepository'
import { runShopQuery } from '../services/shopQuery'
import { DEFAULT_QUERY } from '../types/query'

export function RecordsPage() {
  return (
    <>
      <PageHeader title="実戦記録" />
      <ComingSoon
        phase={6}
        title="実戦記録"
        items={['勤務・拘束時間と遊技時間のタイマー', '台移動ワンタップ・後から編集', '1日に複数店舗の記録']}
      />
    </>
  )
}

export function BalancePage() {
  return (
    <>
      <PageHeader title="収支" />
      <ComingSoon
        phase={6}
        title="収支・給与"
        items={['店舗別収支（円・枚）', '日給・未払い管理', '親（雇用主）の損益（給与控除後の概算）']}
      />
    </>
  )
}

export function FavoritesPage() {
  const { favorites, prefs } = useAppData()
  const origin = useOrigin()
  // お気に入りは地域・距離に関係なく全件表示（見逃し防止）
  const shops = useMemo(
    () =>
      runShopQuery(
        listShops(),
        { ...DEFAULT_QUERY, area: { kind: 'all' }, favoritesOnly: true, maxDistanceKm: null },
        {
          favorites,
          basePrefectureCode: prefs.basePrefectureCode,
          origin: origin?.point ?? null,
          maxDistanceKm: null,
          hideLowConfidence: prefs.hideLowConfidence,
        },
      ).results,
    [favorites, prefs.basePrefectureCode, prefs.hideLowConfidence, origin],
  )
  return (
    <>
      <PageHeader title="お気に入り" />
      <p className="mx-4 mt-3 text-xs text-text-muted">この端末に保存されます。地域・距離の条件に関係なく全件表示します。</p>
      {shops.length === 0 ? (
        <div className="mx-4 mt-6 rounded-2xl border border-border bg-surface p-5 text-center">
          <p className="text-text-muted">お気に入りの店舗はまだありません</p>
          <Link to="/shops" className="mt-3 inline-flex min-h-11 items-center font-bold text-accent underline">
            店舗検索で ☆ を付ける
          </Link>
        </div>
      ) : (
        <ul className="space-y-3 px-4 pt-3" aria-label="お気に入り店舗">
          {shops.map((r) => (
            <li key={r.shop.id}>
              <ShopCard result={r} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export function NotFoundPage() {
  return (
    <>
      <PageHeader title="ページが見つかりません" backTo="/" />
      <div className="mx-4 mt-6">
        <Link to="/" className="inline-flex min-h-11 items-center font-bold text-accent underline">
          ホームへ戻る
        </Link>
      </div>
    </>
  )
}
