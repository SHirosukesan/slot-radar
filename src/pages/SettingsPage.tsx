import { PageHeader } from '../components/PageHeader'
import { PrefectureOptions, selectClass } from '../components/PrefectureSelect'
import { useAppData } from '../hooks/useAppData'
import { formatUpdatedAt } from '../lib/format'
import { DISTANCE_CHOICES_KM } from '../types/query'

export function SettingsPage() {
  const { prefs, updatePrefs, tempOrigin, setTempOrigin, history, clearHistory, storageError } = useAppData()

  return (
    <>
      <PageHeader title="設定" backTo="/" />
      <div className="space-y-5 px-4 pt-4">
        <section aria-labelledby="set-region">
          <h2 id="set-region" className="text-base font-bold">
            基本地域（自宅・よく行く地域）
          </h2>
          <p className="mt-1 text-sm text-text-muted">店舗検索の初期範囲と、距離の基準地点（県庁所在地付近）に使います。</p>
          <label htmlFor="base-pref" className="sr-only">
            基本地域
          </label>
          <select
            id="base-pref"
            className={`${selectClass} mt-2`}
            value={prefs.basePrefectureCode == null ? '' : String(prefs.basePrefectureCode)}
            onChange={(e) =>
              updatePrefs({
                basePrefectureCode: e.target.value === '' ? null : Number(e.target.value),
                onboardingDone: true,
              })
            }
          >
            <option value="">未設定（全国）</option>
            <PrefectureOptions />
          </select>
        </section>

        <section aria-labelledby="set-temp">
          <h2 id="set-temp" className="text-base font-bold">
            一時的な検索地点
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {tempOrigin ? `${tempOrigin.label} を使用中（保存されません）` : '使用していません（基本地域を使用）'}
          </p>
          {tempOrigin && (
            <button
              type="button"
              onClick={() => setTempOrigin(null)}
              className="mt-2 min-h-11 rounded-xl border border-border px-4 text-sm font-bold"
            >
              解除して基本地域に戻す
            </button>
          )}
        </section>

        <section aria-labelledby="set-dist">
          <h2 id="set-dist" className="text-base font-bold">
            距離の上限（初期値）
          </h2>
          <label htmlFor="max-dist" className="sr-only">
            距離の上限
          </label>
          <select
            id="max-dist"
            className={`${selectClass} mt-2`}
            value={prefs.maxDistanceKm == null ? '' : String(prefs.maxDistanceKm)}
            onChange={(e) => updatePrefs({ maxDistanceKm: e.target.value === '' ? null : Number(e.target.value) })}
          >
            {DISTANCE_CHOICES_KM.map((km) => (
              <option key={km ?? 'none'} value={km == null ? '' : String(km)}>
                {km == null ? '制限なし' : `${km}km以内`}
              </option>
            ))}
          </select>
        </section>

        <section aria-labelledby="set-conf">
          <h2 id="set-conf" className="text-base font-bold">
            信頼度
          </h2>
          <label className="mt-2 flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="size-5 accent-[var(--color-accent)]"
              checked={prefs.hideLowConfidence}
              onChange={(e) => updatePrefs({ hideLowConfidence: e.target.checked })}
            />
            <span>
              信頼度「低」の評価を隠す
              <span className="block text-xs text-text-muted">店舗や開催予定そのものは隠しません</span>
            </span>
          </label>
        </section>

        <section aria-labelledby="set-history">
          <h2 id="set-history" className="text-base font-bold">
            検索履歴
          </h2>
          <p className="tabular mt-1 text-sm text-text-muted">{history.length} 件</p>
          <button
            type="button"
            disabled={history.length === 0}
            onClick={clearHistory}
            className="mt-2 min-h-11 rounded-xl border border-border px-4 text-sm font-bold disabled:opacity-40"
          >
            検索履歴を消す
          </button>
        </section>

        <section aria-labelledby="set-storage" className="rounded-xl border border-border bg-surface p-3 text-sm">
          <h2 id="set-storage" className="font-bold">
            データの保存先
          </h2>
          {storageError ? (
            <p className="mt-1 text-warn">{storageError}</p>
          ) : (
            <p className="mt-1 text-text-muted">
              この端末のブラウザ内（IndexedDB）に保存しています。サーバーには送信しません。最終保存{' '}
              <span className="tabular">{formatUpdatedAt(prefs.updatedAt)}</span>
            </p>
          )}
        </section>
      </div>
    </>
  )
}
