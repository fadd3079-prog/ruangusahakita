import { ROUTES } from '../../constants/routes'
import Button from '../ui/Button'
import PriceTag from '../ui/PriceTag'

function ServiceHero({ service }) {
  return (
    <section className="ruk-section-compact pt-0">
      <div className="ruk-service-hero">
      <div className="row g-4 align-items-start">
        <div className="col-lg-7">
          <h1 className="fw-bold">{service.title}</h1>
          <p className="lead ruk-muted">{service.shortDescription}</p>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {service.platforms.map((platform) => <span className="ruk-badge ruk-badge-muted" key={platform}>{platform}</span>)}
          </div>
          <p className="mb-0">{service.description}</p>
        </div>
        <div className="col-lg-5">
          <div className="ruk-service-price-card p-4">
            <PriceTag prefix="Harga" value={service.price} />
            <hr />
            <p className="mb-2"><strong>Estimasi:</strong> {service.deliveryDays} hari</p>
            <p className="mb-3"><strong>Revisi:</strong> {service.revisionCount} kali</p>
            <Button className="w-100" to={ROUTES.newBrief}>Ajukan brief</Button>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}

export default ServiceHero
