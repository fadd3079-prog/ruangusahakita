import { ROUTES } from '../../constants/routes'
import Button from '../ui/Button'
import FavoriteButton from './FavoriteButton'

function StickyActionBar({ creatorId }) {
  return (
    <div className="ruk-sticky-action d-flex gap-2">
      <FavoriteButton creatorId={creatorId} />
      <Button className="flex-fill" to={ROUTES.newBrief}>Ajukan kerja sama</Button>
    </div>
  )
}

export default StickyActionBar
