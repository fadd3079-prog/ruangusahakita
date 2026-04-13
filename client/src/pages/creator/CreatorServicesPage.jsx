import DashboardHeader from '../../components/dashboard/DashboardHeader'
import ServicePreviewList from '../../components/dashboard/ServicePreviewList'
import Button from '../../components/ui/Button'
import { services } from '../../data/mockData'

function CreatorServicesPage() {
  return (
    <>
      <DashboardHeader
        action={<Button to="/dashboard/kreator/layanan/tambah">Tambah layanan</Button>}
        description="Kelola paket jasa agar UMKM mudah memahami penawaranmu."
        title="Kelola Layanan"
      />
      <ServicePreviewList services={services} />
    </>
  )
}

export default CreatorServicesPage
