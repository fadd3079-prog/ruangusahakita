import ServiceCard from '../marketplace/ServiceCard'

function ServicePreviewList({ services }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => <ServiceCard key={service.id} service={service} />)}
    </div>
  )
}

export default ServicePreviewList
