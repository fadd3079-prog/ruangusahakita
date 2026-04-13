import { useParams } from 'react-router-dom'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import ServiceForm from '../../components/forms/ServiceForm'
import { services } from '../../data/mockData'

function CreatorEditServicePage() {
  const { serviceId } = useParams()
  const service = services.find((item) => item.id === serviceId)

  return (
    <>
      <DashboardHeader description="Perbarui informasi layanan agar tetap mudah dipahami." title="Ubah Layanan" />
      <ServiceForm initialService={service} />
    </>
  )
}

export default CreatorEditServicePage
