import { ROUTES } from '../../constants/routes'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import PriceTag from '../ui/PriceTag'
import RatingStars from '../ui/RatingStars'
import FavoriteButton from './FavoriteButton'

function CreatorHero({ creator }) {
  return (
    <section className="ruk-section-compact">
      <div className="container">
        <div className="ruk-card ruk-creator-hero-card overflow-hidden">
          <img alt={`Banner ${creator.name}`} className="ruk-creator-banner" src={creator.bannerUrl} />
          <div className="ruk-card-body">
            <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-4">
              <div className="d-flex flex-column flex-md-row gap-3">
                <Avatar alt={`Foto ${creator.name}`} size={96} src={creator.avatarUrl} />
                <div>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <Badge>{creator.niche}</Badge>
                    {creator.platforms.map((platform) => <Badge key={platform} tone="muted">{platform}</Badge>)}
                  </div>
                  <h1 className="fw-bold mb-2">{creator.name}</h1>
                  <p className="ruk-muted mb-2">{creator.city} • {creator.shortBio}</p>
                  <div className="d-flex flex-wrap gap-3 align-items-center">
                    <RatingStars count={creator.reviewCount} value={creator.ratingAvg} />
                    <PriceTag value={creator.priceFrom} />
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column flex-sm-row gap-2">
                <FavoriteButton creatorId={creator.id} />
                <Button to={ROUTES.newBrief}>Ajukan kerja sama</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreatorHero
