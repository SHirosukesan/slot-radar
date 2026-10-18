import { useFavorites } from '../hooks/useFavorites'
import { StarIcon } from './icons'

type Props = { shopId: string; shopName: string; className?: string }

export function FavoriteButton({ shopId, shopName, className = '' }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const on = isFavorite(shopId)
  return (
    <button
      type="button"
      onClick={() => toggleFavorite(shopId)}
      aria-pressed={on}
      aria-label={on ? `${shopName} をお気に入りから外す` : `${shopName} をお気に入りに追加`}
      className={`flex size-11 items-center justify-center rounded-full hover:bg-surface-2 ${
        on ? 'text-accent' : 'text-text-muted'
      } ${className}`}
    >
      <StarIcon filled={on} />
    </button>
  )
}
