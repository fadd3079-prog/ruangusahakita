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

  if (loading) return <div className="container mx-auto px-4 py-32 text-center"><p className="text-slate-500 font-medium text-lg">Memuat detail layanan...</p></div>
  if (!service) {
    return (
      <div className="container mx-auto px-4 py-32">
        <EmptyState actionLabel="Cari kreator" actionTo="/cari-kreator" description="Layanan ini belum tersedia." title="Layanan tidak ditemukan" />
      </div>
    )
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 pb-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cari Kreator', to: '/cari-kreator' }, { label: service.title }]} />
        <ServiceHero service={service} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-12">
              <ServiceOutputList outputs={service.outputs} />
            </div>
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-12">
              <ServiceDescription service={service} />
            </div>
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-12">
              <RelatedPortfolio items={service.examples} />
            </div>
          </div>
          <div className="lg:col-span-4">
            <PrimaryActionPanel creator={service.creator} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetailPage
