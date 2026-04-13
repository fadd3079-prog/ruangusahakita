import { buildCreatorPath, ROUTES } from '../../constants/routes'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

function PrimaryActionPanel({ creator }) {
  return (
    <aside className="ruk-primary-action p-4">
      <h2 className="h5 fw-bold">Kreator layanan ini</h2>
      <div className="d-flex align-items-center gap-3 mb-3">
        <Avatar alt={`Foto ${creator.name}`} src={creator.avatarUrl} />
        <div>
          <p className="fw-bold mb-0">{creator.name}</p>
          <Button className="mt-2" to={buildCreatorPath(creator.slug)} variant="outline">
            Lihat profil
          </Button>
        </div>
      </div>
      <Button className="w-100" to={ROUTES.newBrief}>Ajukan kerja sama</Button>
    </aside>
  )
}

export default PrimaryActionPanel
