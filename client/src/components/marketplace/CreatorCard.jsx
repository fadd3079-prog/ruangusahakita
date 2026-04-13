import { buildCreatorPath } from '../../constants/routes'
import { useFavoriteStore } from '../../store/favoriteStore'
import Button from '../ui/Button'
import Card from '../ui/Card'
import PriceTag from '../ui/PriceTag'
import RatingStars from '../ui/RatingStars'

function CreatorCard({ creator }) {
  const favoriteIds = useFavoriteStore((state) => state.favoriteIds)
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite)
  const saved = favoriteIds.includes(creator.id)

  return (
    <Card body={false} className="ruk-creator-card h-100">
      <img alt={`Foto profil ${creator.name}`} src={creator.avatarUrl} />
      <div className="ruk-card-body d-flex flex-column gap-3">
        <div>
          <div className="d-flex justify-content-between align-items-start gap-2">
            <h2 className="h5 fw-bold mb-1">{creator.name}</h2>
            <button
              aria-label={saved ? `Hapus ${creator.name} dari favorit` : `Simpan ${creator.name} ke favorit`}
              className="btn btn-sm btn-outline-secondary ruk-favorite-btn"
              onClick={() => toggleFavorite(creator.id)}
              type="button"
            >
              {saved ? 'Tersimpan' : 'Simpan'}
            </button>
          </div>
          <p className="small ruk-muted mb-2">{creator.niche} • {creator.city}</p>
          <RatingStars count={creator.reviewCount} value={creator.ratingAvg} />
        </div>
        <p className="mb-0 ruk-muted">{creator.shortBio}</p>
        <PriceTag value={creator.priceFrom} />
        <Button className="mt-auto" to={buildCreatorPath(creator.slug)}>
          Lihat profil
        </Button>
      </div>
    </Card>
  )
}

export default CreatorCard
