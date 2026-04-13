import DashboardHeader from '../../components/dashboard/DashboardHeader'
import DashboardSection from '../../components/dashboard/DashboardSection'
import RequestStatusList from '../../components/dashboard/RequestStatusList'
import { requests } from '../../data/mockData'

function CreatorRequestsPage() {
  return (
    <>
      <DashboardHeader description="Lihat brief dari UMKM dan pahami ekspektasi kerja sama." title="Permintaan Masuk" />
      <DashboardSection title="Daftar permintaan">
        <RequestStatusList requests={requests} role="creator" />
      </DashboardSection>
    </>
  )
}

export default CreatorRequestsPage
