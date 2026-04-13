import EmptyState from '../../components/common/EmptyState'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import DashboardSection from '../../components/dashboard/DashboardSection'
import RequestStatusList from '../../components/dashboard/RequestStatusList'
import { requests } from '../../data/mockData'

function RequestsPage() {
  return (
    <>
      <DashboardHeader description="Pantau status brief dan kerja sama." title="Permintaan Saya" />
      {requests.length ? (
        <DashboardSection title="Daftar permintaan">
          <RequestStatusList requests={requests} />
        </DashboardSection>
      ) : (
        <EmptyState actionLabel="Buat brief baru" actionTo="/dashboard/umkm/brief/baru" description="Mulai cari kreator yang sesuai dengan kebutuhan usahamu." title="Kamu belum mengirim permintaan kerja sama" />
      )}
    </>
  )
}

export default RequestsPage
