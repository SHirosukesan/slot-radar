import { useId, useState, type FormEvent } from 'react'
import { getPrefecture } from '../data/prefectures'
import { useAppData, useOrigin } from '../hooks/useAppData'
import { serializeQuery } from '../services/queryParams'
import { defaultOrderFor, DISTANCE_CHOICES_KM, orderLabels, SORT_OPTIONS, type ShopQuery, type SortKey } from '../types/query'
import { SortIcon } from './icons'
import { PrefectureOptions, selectClass } from './PrefectureSelect'

type Props = {
  query: ShopQuery
  setQuery: (patch: Partial<ShopQuery>) => void
  reset: () => void
  applyParams: (raw: string) => void
}

const fieldLabel = 'mb-1 block text-xs font-bold text-text-muted'

/** 検索・並び替え・絞り込み。主要な条件だけ表に出し、その他は折り畳む（仕様 3章） */
export function SearchControls({ query, setQuery, reset, applyParams }: Props) {
  const { prefs, updatePrefs, history, pushHistory, clearHistory, presets, savePreset, removePreset } = useAppData()
  const origin = useOrigin()
  const ids = useId()
  const [text, setText] = useState(query.q)
  const [focused, setFocused] = useState(false)
  const [presetName, setPresetName] = useState('')
  // プリセット適用・リセットで URL 側の q が変わった時に入力欄を合わせる（描画中に調整する React 推奨の書き方）
  const [syncedQ, setSyncedQ] = useState(query.q)
  if (syncedQ !== query.q) {
    setSyncedQ(query.q)
    setText(query.q)
  }

  const basePref = getPrefecture(prefs.basePrefectureCode)
  const effectiveDistance = query.maxDistanceKm !== undefined ? query.maxDistanceKm : prefs.maxDistanceKm
  const order = orderLabels(query.sort)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setQuery({ q: text.trim() })
    pushHistory(text)
    ;(document.activeElement as HTMLElement | null)?.blur()
  }

  const areaValue =
    query.area.kind === 'prefectures' ? String(query.area.codes[0] ?? 'base') : query.area.kind

  return (
    <section className="space-y-3 px-4 pt-3" aria-label="検索条件">
      <form role="search" onSubmit={submit} className="relative">
        <label htmlFor={`${ids}-q`} className="sr-only">
          店名・地域で検索
        </label>
        <input
          id={`${ids}-q`}
          type="search"
          enterKeyHint="search"
          value={text}
          placeholder="店名・地域で検索"
          onChange={(e) => {
            setText(e.target.value)
            if (e.target.value === '') setQuery({ q: '' })
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          className="min-h-12 w-full rounded-xl border border-border bg-surface-2 px-4 text-base text-text placeholder:text-text-muted focus:border-accent"
          autoComplete="off"
        />
        {focused && !text && history.length > 0 && (
          <div className="absolute inset-x-0 top-full z-10 mt-1 rounded-xl border border-border bg-surface p-2 shadow-lg">
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-xs font-bold text-text-muted">検索履歴</span>
              <button type="button" onClick={clearHistory} className="min-h-9 px-2 text-xs text-text-muted underline">
                履歴を消す
              </button>
            </div>
            <ul aria-label="検索履歴" className="flex flex-wrap gap-1.5">
              {history.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setText(h.q)
                      setQuery({ q: h.q })
                      pushHistory(h.q)
                    }}
                    className="min-h-9 rounded-full border border-border bg-surface-2 px-3 text-sm"
                  >
                    {h.q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor={`${ids}-area`} className={fieldLabel}>
            範囲
          </label>
          <select
            id={`${ids}-area`}
            className={selectClass}
            value={areaValue}
            onChange={(e) => {
              const v = e.target.value
              if (v === 'base' || v === 'all') setQuery({ area: { kind: v } })
              else setQuery({ area: { kind: 'prefectures', codes: [Number(v)] } })
            }}
          >
            <option value="base">{basePref ? `${basePref.name}（基本）` : '基本地域（未設定）'}</option>
            <option value="all">全国</option>
            <PrefectureOptions />
          </select>
        </div>
        <div>
          <label htmlFor={`${ids}-dist`} className={fieldLabel}>
            距離
          </label>
          <select
            id={`${ids}-dist`}
            className={selectClass}
            value={effectiveDistance == null ? '' : String(effectiveDistance)}
            disabled={!origin}
            onChange={(e) => {
              const v = e.target.value === '' ? null : Number(e.target.value)
              updatePrefs({ maxDistanceKm: v })
              setQuery({ maxDistanceKm: undefined })
            }}
          >
            {DISTANCE_CHOICES_KM.map((km) => (
              <option key={km ?? 'none'} value={km == null ? '' : String(km)}>
                {km == null ? '制限なし' : `${km}km以内`}
              </option>
            ))}
          </select>
        </div>
      </div>
      {!origin && <p className="text-xs text-text-muted">距離で絞るには、地域設定か「現在地の近く」を使ってください。</p>}

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <div>
          <label htmlFor={`${ids}-sort`} className={fieldLabel}>
            並び順
          </label>
          <select
            id={`${ids}-sort`}
            className={selectClass}
            value={query.sort}
            onChange={(e) => {
              const sort = e.target.value as SortKey
              setQuery({ sort, order: defaultOrderFor(sort) })
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key} disabled={!!o.disabledReason}>
                {o.disabledReason ? `${o.label}（${o.disabledReason}）` : o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            disabled={!order}
            onClick={() => setQuery({ order: query.order === 'asc' ? 'desc' : 'asc' })}
            className="flex min-h-11 min-w-28 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-2 px-3 text-sm font-bold disabled:opacity-40"
            aria-label={order ? `順番: ${order[query.order]}（タップで切替）` : '順番の切替なし'}
          >
            <SortIcon size={18} />
            {order ? order[query.order] : '—'}
          </button>
        </div>
      </div>
      {query.sort === 'recommended' && (
        <p className="text-xs text-text-muted">おすすめ（暫定）＝お気に入り → 総合点 → 更新の新しい順。未評価は常に後ろ。</p>
      )}

      <details className="rounded-xl border border-border bg-surface">
        <summary className="flex min-h-11 cursor-pointer items-center px-3 text-sm font-bold">その他の条件・検索の保存</summary>
        <div className="space-y-3 border-t border-border p-3">
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="size-5 accent-[var(--color-accent)]"
              checked={prefs.hideLowConfidence}
              onChange={(e) => updatePrefs({ hideLowConfidence: e.target.checked })}
            />
            <span>
              信頼度「低」の評価を隠す
              <span className="block text-xs text-text-muted">店舗自体は隠しません（保存されます）</span>
            </span>
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="size-5 accent-[var(--color-accent)]"
              checked={query.favoritesOnly}
              onChange={(e) => setQuery({ favoritesOnly: e.target.checked })}
            />
            <span>お気に入りのみ</span>
          </label>

          <div>
            <p className={fieldLabel}>検索プリセット</p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                savePreset(presetName, serializeQuery({ ...query, maxDistanceKm: effectiveDistance }).toString())
                setPresetName('')
              }}
            >
              <label htmlFor={`${ids}-preset`} className="sr-only">
                プリセット名
              </label>
              <input
                id={`${ids}-preset`}
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="名前（例: 週末ハイエナ）"
                maxLength={30}
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-3 text-base"
              />
              <button type="submit" className="min-h-11 shrink-0 rounded-xl bg-accent-strong px-4 text-sm font-bold text-white">
                今の条件を保存
              </button>
            </form>
            {presets.length > 0 && (
              <ul className="mt-2 space-y-1.5" aria-label="保存したプリセット">
                {presets.map((p) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        applyParams(p.params)
                        const dist = new URLSearchParams(p.params).get('dist')
                        if (dist) updatePrefs({ maxDistanceKm: dist === 'none' ? null : Number(dist) })
                      }}
                      className="min-h-11 flex-1 truncate rounded-xl border border-border bg-surface-2 px-3 text-left text-sm"
                    >
                      {p.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => removePreset(p.id)}
                      className="min-h-11 shrink-0 px-2 text-xs text-text-muted underline"
                      aria-label={`${p.name} を削除`}
                    >
                      削除
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setText('')
              reset()
            }}
            className="min-h-11 w-full rounded-xl border border-border text-sm font-bold"
          >
            一時的な条件をリセット
          </button>
        </div>
      </details>
    </section>
  )
}
