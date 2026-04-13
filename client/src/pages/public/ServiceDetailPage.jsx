import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'
import PrimaryActionPanel from '../../components/detail/PrimaryActionPanel'
import RelatedPortfolio from '../../components/detail/RelatedPortfolio'
import ServiceDescription from '../../components/detail/ServiceDescription'
import ServiceHero from '../../components/detail/ServiceHero'
import ServiceOutputList from '../../components/detail/ServiceOutputList'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { serviceService } from '../../services/serviceService'

function ServiceDetailPage() {
  const { serviceSlug } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    serviceService.getServiceBySlug(serviceSlug).then((result) => {
      setService(result)
      setLoading(false)
    })
  }, [serviceSlug])

  if (loading) return <div className="container py-5"><p>Memuat detail layanan...</p></div>
  if (!service) {
    return (
      <div className="container py-5">
        <EmptyState actionLabel="Cari kreator" actionTo="/cari-kreator" description="Layanan ini belum tersedia." title="Layanan tidak ditemukan" />
      </div>
    )
  }

  return (
    <div className="ruk-detail-shell">
      <div className="container py-4 pb-5">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cari Kreator', to: '/cari-kreator' }, { label: service.title }]} />
        <ServiceHero service={service} />
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="ruk-detail-block">
              <ServiceOutputList outputs={service.outputs} />
            </div>
            <div className="ruk-detail-block">
              <ServiceDescription service={service} />
            </div>
            <div className="ruk-detail-block">
              <RelatedPortfolio items={service.examples} />
            </div>
          </div>
          <div className="col-lg-4">
            <PrimaryActionPanel creator={service.creator} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetailPage
