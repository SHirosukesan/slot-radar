import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { FavoriteRecord, Preferences, SavedFilter, SearchHistoryEntry } from '../../types/preferences'

/**
 * 端末内データベース（IndexedDB）。
 * ストア名は仕様 7章のデータモデル（favorites, user_preferences, saved_filters）に合わせる。
 * 後で同期（Phase 7）を足せるよう、全レコードに作成・更新日時を持たせる。
 */
interface SlotRadarDB extends DBSchema {
  user_preferences: { key: string; value: Preferences & { key: string } }
  favorites: { key: string; value: FavoriteRecord }
  saved_filters: { key: string; value: SavedFilter }
  search_history: { key: string; value: SearchHistoryEntry; indexes: { by_created: string } }
}

export const DB_NAME = 'slot-radar'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<SlotRadarDB>> | null = null

export function getDb(): Promise<IDBPDatabase<SlotRadarDB>> {
  if (!dbPromise) {
    dbPromise = openDB<SlotRadarDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('user_preferences', { keyPath: 'key' })
        db.createObjectStore('favorites', { keyPath: 'shopId' })
        db.createObjectStore('saved_filters', { keyPath: 'id' })
        const history = db.createObjectStore('search_history', { keyPath: 'id' })
        history.createIndex('by_created', 'createdAt')
      },
    }).catch((err) => {
      dbPromise = null
      throw err
    })
  }
  return dbPromise
}

/** テスト用: 接続を閉じて次回開き直す */
export async function resetDbConnection(): Promise<void> {
  if (dbPromise) (await dbPromise.catch(() => null))?.close()
  dbPromise = null
}

let lastIssuedMs = 0

/**
 * 現在時刻（ISO 8601）。同じミリ秒に複数回呼んでも必ず増えるようにし、
 * 作成日時での並び順（履歴・プリセット）が崩れないようにする。
 */
export function nowIso(): string {
  const ms = Math.max(Date.now(), lastIssuedMs + 1)
  lastIssuedMs = ms
  return new Date(ms).toISOString()
}

export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}
