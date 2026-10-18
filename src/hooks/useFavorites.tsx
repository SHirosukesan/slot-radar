import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type FavoritesContextValue = {
  isFavorite: (shopId: string) => boolean
  toggleFavorite: (shopId: string) => void
  favoriteIds: ReadonlySet<string>
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

/**
 * お気に入り（星）。Phase 1 はメモリ上だけで保持し、再読み込みで消える。
 * 端末への保存（IndexedDB）は Phase 2。
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(() => new Set())

  const toggleFavorite = useCallback((shopId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(shopId)) next.delete(shopId)
      else next.add(shopId)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ favoriteIds, toggleFavorite, isFavorite: (id: string) => favoriteIds.has(id) }),
    [favoriteIds, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites は FavoritesProvider の内側で使ってください')
  return ctx
}
