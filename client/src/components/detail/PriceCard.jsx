import { ROUTES } from '../../constants/routes'
import Button from '../ui/Button'
import PriceTag from '../ui/PriceTag'

function PriceCard({ service }) {
  return (
    <aside className="ruk-surface p-4">
      <h2 className="h5 fw-bold">Ringkasan layanan</h2>
      <PriceTag prefix="Harga" value={service.price} />
      <div className="d-grid gap-2 my-3">
        <span>{service.deliveryDays} hari pengerjaan</span>
        <span>{service.revisionCount} kali revisi</span>
      </div>
      <Button className="w-100" to={ROUTES.newBrief}>Ajukan brief</Button>
    </aside>
  )
}

export default PriceCard
