import { buildServicePath } from '../../constants/routes'
import Button from '../ui/Button'
import Card from '../ui/Card'
import PriceTag from '../ui/PriceTag'

function ServiceCard({ service }) {
  return (
    <Card className="h-100">
      <h3 className="h5 fw-bold">{service.title}</h3>
      <p className="ruk-muted">{service.shortDescription}</p>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="ruk-badge ruk-badge-info">{service.deliveryDays} hari</span>
        <span className="ruk-badge ruk-badge-muted">{service.revisionCount} revisi</span>
      </div>
      <PriceTag prefix="Mulai" value={service.price} />
      <Button className="w-100 mt-3" to={buildServicePath(service.slug)}>
        Lihat layanan
      </Button>
    </Card>
  )
}

export default ServiceCard
