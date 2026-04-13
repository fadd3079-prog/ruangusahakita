import ServiceCard from '../marketplace/ServiceCard'

function ServicePreviewList({ services }) {
  return (
    <div className="ruk-grid ruk-grid-2">
      {services.map((service) => <ServiceCard key={service.id} service={service} />)}
    </div>
  )
}

export default ServicePreviewList
