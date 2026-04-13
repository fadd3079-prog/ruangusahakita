import { useFavoriteStore } from '../../store/favoriteStore'
import Button from '../ui/Button'

function FavoriteButton({ creatorId }) {
  const favoriteIds = useFavoriteStore((state) => state.favoriteIds)
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite)
  const saved = favoriteIds.includes(creatorId)

  return (
    <Button onClick={() => toggleFavorite(creatorId)} variant={saved ? 'secondary' : 'outline'}>
      {saved ? 'Tersimpan' : 'Simpan ke favorit'}
    </Button>
  )
}

export default FavoriteButton
