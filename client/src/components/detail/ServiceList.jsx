import ServiceCard from '../marketplace/ServiceCard'
import SectionHeader from '../ui/SectionHeader'

function ServiceList({ services }) {
  return (
    <section className="py-0">
      <SectionHeader
        description="Pilih paket yang paling sesuai dengan kebutuhan promosi."
        title="Layanan aktif"
      />
      <div className="ruk-grid ruk-grid-3">
        {services.map((service) => <ServiceCard key={service.id} service={service} />)}
      </div>
    </section>
  )
}

export default ServiceList
