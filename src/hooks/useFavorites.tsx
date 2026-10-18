import { useAppData } from './useAppData'

/** お気に入り（星）。実体は useAppData（IndexedDB に保存） */
export function useFavorites() {
  const { favorites, toggleFavorite } = useAppData()
  return {
    favoriteIds: favorites,
    toggleFavorite,
    isFavorite: (shopId: string) => favorites.has(shopId),
  }
}
