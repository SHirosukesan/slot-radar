import {
  DEFAULT_PREFERENCES,
  type FavoriteRecord,
  type Preferences,
  type SavedFilter,
  type SearchHistoryEntry,
} from '../../types/preferences'
import { getDb, newId, nowIso } from './db'

const PREF_KEY = 'main'
const HISTORY_LIMIT = 10

// ---- 設定 ----
export async function loadPreferences(): Promise<Preferences> {
  const db = await getDb()
  const row = await db.get('user_preferences', PREF_KEY)
  if (!row) return { ...DEFAULT_PREFERENCES }
  const { key: _key, ...prefs } = row
  return { ...DEFAULT_PREFERENCES, ...prefs }
}

export async function savePreferences(prefs: Preferences): Promise<Preferences> {
  const db = await getDb()
  const next = { ...prefs, updatedAt: nowIso() }
  await db.put('user_preferences', { ...next, key: PREF_KEY })
  return next
}

// ---- お気に入り ----
export async function loadFavorites(): Promise<FavoriteRecord[]> {
  const db = await getDb()
  return db.getAll('favorites')
}

export async function setFavorite(shopId: string, on: boolean): Promise<void> {
  const db = await getDb()
  if (!on) return db.delete('favorites', shopId)
  const now = nowIso()
  const existing = await db.get('favorites', shopId)
  await db.put('favorites', { shopId, createdAt: existing?.createdAt ?? now, updatedAt: now })
}

// ---- 検索履歴（新しい順・重複なし・最大10件） ----
export async function loadSearchHistory(): Promise<SearchHistoryEntry[]> {
  const db = await getDb()
  const all = await db.getAllFromIndex('search_history', 'by_created')
  return all.reverse()
}

export async function addSearchHistory(q: string): Promise<SearchHistoryEntry[]> {
  const text = q.trim()
  if (!text) return loadSearchHistory()
  const db = await getDb()
  const tx = db.transaction('search_history', 'readwrite')
  const all = await tx.store.index('by_created').getAll()
  for (const e of all) if (e.q === text) await tx.store.delete(e.id)
  await tx.store.put({ id: newId(), q: text, createdAt: nowIso() })
  const after = (await tx.store.index('by_created').getAll()).reverse()
  for (const e of after.slice(HISTORY_LIMIT)) await tx.store.delete(e.id)
  await tx.done
  return after.slice(0, HISTORY_LIMIT)
}

export async function clearSearchHistory(): Promise<void> {
  const db = await getDb()
  await db.clear('search_history')
}

// ---- 検索プリセット ----
export async function loadSavedFilters(): Promise<SavedFilter[]> {
  const db = await getDb()
  const all = await db.getAll('saved_filters')
  return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function addSavedFilter(name: string, params: string): Promise<SavedFilter> {
  const db = await getDb()
  const now = nowIso()
  const row: SavedFilter = { id: newId(), name: name.trim().slice(0, 30) || '名前なし', params, createdAt: now, updatedAt: now }
  await db.put('saved_filters', row)
  return row
}

export async function deleteSavedFilter(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('saved_filters', id)
}
