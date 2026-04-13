import DashboardHeader from '../../components/dashboard/DashboardHeader'
import ServiceForm from '../../components/forms/ServiceForm'

function CreatorAddServicePage() {
  return (
    <>
      <DashboardHeader description="Tulis layanan dengan harga, output, durasi, dan revisi yang jelas." title="Tambah Layanan" />
      <ServiceForm />
    </>
  )
}

export default CreatorAddServicePage
