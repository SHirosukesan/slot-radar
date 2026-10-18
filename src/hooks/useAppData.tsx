import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getPrefecture } from '../data/prefectures'
import type { LatLng } from '../lib/geo'
import * as repo from '../services/storage/repositories'
import { DEFAULT_PREFERENCES, type Preferences, type SavedFilter, type SearchHistoryEntry } from '../types/preferences'

export type TempOrigin = { point: LatLng; label: string }

type AppData = {
  ready: boolean
  /** IndexedDB が使えない環境（プライベートモード等）。メモリ上でのみ動く */
  storageError: string | null
  prefs: Preferences
  updatePrefs: (patch: Partial<Preferences>) => void
  favorites: ReadonlySet<string>
  toggleFavorite: (shopId: string) => void
  history: SearchHistoryEntry[]
  pushHistory: (q: string) => void
  clearHistory: () => void
  presets: SavedFilter[]
  savePreset: (name: string, params: string) => void
  removePreset: (id: string) => void
  /** 一時的な検索地点（保存しない。次回起動時は基本地域に戻る） */
  tempOrigin: TempOrigin | null
  setTempOrigin: (o: TempOrigin | null) => void
}

const Ctx = createContext<AppData | null>(null)

const STORAGE_ERROR_MESSAGE = 'この環境では端末に保存できません。設定やお気に入りは再読み込みで消えます。'

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES)
  const [favorites, setFavorites] = useState<ReadonlySet<string>>(() => new Set())
  const [history, setHistory] = useState<SearchHistoryEntry[]>([])
  const [presets, setPresets] = useState<SavedFilter[]>([])
  const [tempOrigin, setTempOrigin] = useState<TempOrigin | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([repo.loadPreferences(), repo.loadFavorites(), repo.loadSearchHistory(), repo.loadSavedFilters()])
      .then(([p, f, h, s]) => {
        if (cancelled) return
        setPrefs(p)
        setFavorites(new Set(f.map((r) => r.shopId)))
        setHistory(h)
        setPresets(s)
      })
      .catch(() => !cancelled && setStorageError(STORAGE_ERROR_MESSAGE))
      .finally(() => !cancelled && setReady(true))
    return () => {
      cancelled = true
    }
  }, [])

  /** 画面は先に更新し、保存は裏で行う。失敗したら警告だけ出す */
  const persist = useCallback((p: Promise<unknown>) => {
    p.catch(() => setStorageError(STORAGE_ERROR_MESSAGE))
  }, [])

  const updatePrefs = useCallback(
    (patch: Partial<Preferences>) => {
      const next = { ...prefs, ...patch }
      setPrefs(next)
      persist(repo.savePreferences(next))
    },
    [prefs, persist],
  )

  const toggleFavorite = useCallback(
    (shopId: string) => {
      const next = new Set(favorites)
      const on = !next.has(shopId)
      if (on) next.add(shopId)
      else next.delete(shopId)
      setFavorites(next)
      persist(repo.setFavorite(shopId, on))
    },
    [favorites, persist],
  )

  const pushHistory = useCallback(
    (q: string) => {
      const text = q.trim()
      if (!text) return
      setHistory((prev) => [{ id: `tmp-${text}`, q: text, createdAt: new Date().toISOString() }, ...prev.filter((e) => e.q !== text)].slice(0, 10))
      persist(repo.addSearchHistory(text).then(setHistory))
    },
    [persist],
  )

  const clearHistory = useCallback(() => {
    setHistory([])
    persist(repo.clearSearchHistory())
  }, [persist])

  const savePreset = useCallback(
    (name: string, params: string) => {
      persist(repo.addSavedFilter(name, params).then((row) => setPresets((prev) => [...prev, row])))
    },
    [persist],
  )

  const removePreset = useCallback(
    (id: string) => {
      setPresets((prev) => prev.filter((p) => p.id !== id))
      persist(repo.deleteSavedFilter(id))
    },
    [persist],
  )

  const value = useMemo<AppData>(
    () => ({
      ready,
      storageError,
      prefs,
      updatePrefs,
      favorites,
      toggleFavorite,
      history,
      pushHistory,
      clearHistory,
      presets,
      savePreset,
      removePreset,
      tempOrigin,
      setTempOrigin,
    }),
    [ready, storageError, prefs, updatePrefs, favorites, toggleFavorite, history, pushHistory, clearHistory, presets, savePreset, removePreset, tempOrigin],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useAppData(): AppData {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppData は AppDataProvider の内側で使ってください')
  return ctx
}

export type Origin = { point: LatLng; label: string; kind: 'temp' | 'base' }

/** 距離の基準地点: 一時検索地点 → 基本地域（県庁所在地）→ なし */
// oxlint-disable-next-line react/only-export-components
export function useOrigin(): Origin | null {
  const { tempOrigin, prefs } = useAppData()
  const code = prefs.basePrefectureCode
  return useMemo(() => {
    if (tempOrigin) return { ...tempOrigin, kind: 'temp' as const }
    const pref = getPrefecture(code)
    if (pref) return { point: { lat: pref.lat, lng: pref.lng }, label: `${pref.name}（県庁所在地付近）`, kind: 'base' as const }
    return null
  }, [tempOrigin, code])
}
