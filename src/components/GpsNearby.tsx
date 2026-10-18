import { useState } from 'react'
import { Link } from 'react-router'
import { useAppData } from '../hooks/useAppData'
import { distanceKm, formatDistance, type LatLng } from '../lib/geo'
import type { Shop } from '../types/shop'
import { LocateIcon } from './icons'
import { SampleBadge } from './SampleDataBanner'

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'done'; point: LatLng; candidates: { shop: Shop; km: number }[] }
  | { kind: 'error'; message: string }

const CANDIDATE_COUNT = 3

/**
 * GPS で近くの店舗「候補」を出すだけ。どの店にするかは本人が選ぶ（仕様 3章）。
 * 現在地は保存しない。拒否されても他の方法で探せることを案内する。
 */
export function GpsNearby({ shops }: { shops: readonly Shop[] }) {
  const { setTempOrigin, tempOrigin } = useAppData()
  const [state, setState] = useState<State>({ kind: 'idle' })

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setState({ kind: 'error', message: 'この端末・ブラウザは位置情報に対応していません。' })
      return
    }
    setState({ kind: 'loading' })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const point = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        const candidates = shops
          .filter((s) => s.location && s.status !== 'closed')
          .map((s) => ({ shop: s, km: distanceKm(point, s.location!) }))
          .sort((a, b) => a.km - b.km)
          .slice(0, CANDIDATE_COUNT)
        setState({ kind: 'done', point, candidates })
      },
      (err) => {
        const message =
          err.code === err.PERMISSION_DENIED
            ? '位置情報の利用が許可されていません。'
            : err.code === err.TIMEOUT
              ? '現在地の取得に時間がかかりすぎました。'
              : '現在地を取得できませんでした。'
        setState({ kind: 'error', message })
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    )
  }

  return (
    <section className="mx-4 mt-3" aria-label="現在地の近く">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={locate}
          disabled={state.kind === 'loading'}
          className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 text-sm font-bold disabled:opacity-60"
        >
          <LocateIcon size={18} />
          {state.kind === 'loading' ? '現在地を取得中…' : '現在地の近くの候補'}
        </button>
        {tempOrigin && (
          <button
            type="button"
            onClick={() => setTempOrigin(null)}
            className="min-h-11 rounded-xl border border-accent/50 px-3 text-sm text-accent"
          >
            一時検索地点を解除
          </button>
        )}
      </div>

      {state.kind === 'error' && (
        <div role="alert" className="mt-2 rounded-xl border border-border bg-surface p-3 text-sm">
          <p className="font-bold">{state.message}</p>
          <p className="mt-1 text-text-muted">
            GPS なしでも、基本地域・都道府県・お気に入り・検索履歴から探せます。
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link to="/settings" className="inline-flex min-h-11 items-center text-accent underline">
              地域を設定する
            </Link>
            <Link to="/favorites" className="inline-flex min-h-11 items-center text-accent underline">
              お気に入りを見る
            </Link>
          </div>
        </div>
      )}

      {state.kind === 'done' && (
        <div className="mt-2 rounded-xl border border-border bg-surface p-3">
          <p className="text-sm font-bold">現在地から近い候補（直線距離）</p>
          {state.candidates.length === 0 ? (
            <p className="mt-1 text-sm text-text-muted">位置が分かる店舗がありません。</p>
          ) : (
            <ul className="mt-2 space-y-1.5" aria-label="近くの店舗候補">
              {state.candidates.map(({ shop, km }) => (
                <li key={shop.id}>
                  <Link
                    to={`/shops/${shop.id}`}
                    className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm"
                  >
                    {shop.isSample && <SampleBadge />}
                    <span className="min-w-0 flex-1 truncate">{shop.name}</span>
                    <span className="tabular shrink-0 text-text-muted">{formatDistance(km)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => {
              setTempOrigin({ point: state.point, label: '現在地（一時）' })
              setState({ kind: 'idle' })
            }}
            className="mt-2 min-h-11 w-full rounded-xl bg-accent-strong text-sm font-bold text-white"
          >
            現在地を一時的な検索地点にする
          </button>
          <p className="mt-1 text-xs text-text-muted">一時検索地点は保存されず、次回起動時は基本地域に戻ります。</p>
        </div>
      )}
    </section>
  )
}
