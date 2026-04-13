import DashboardHeader from '../../components/dashboard/DashboardHeader'
import DashboardSection from '../../components/dashboard/DashboardSection'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import FavoriteList from '../../components/dashboard/FavoriteList'
import NextActionCard from '../../components/dashboard/NextActionCard'
import RequestStatusList from '../../components/dashboard/RequestStatusList'
import Button from '../../components/ui/Button'
import { ROUTES } from '../../constants/routes'
import { umkmDashboard } from '../../data/mockData'

function UmkmDashboardPage() {
  return (
    <>
      <DashboardHeader
        action={<Button to={ROUTES.creators}>Cari kreator lagi</Button>}
        description="Lihat tindakan berikutnya, permintaan aktif, dan kreator favorit."
        title={`Halo, ${umkmDashboard.profile.name}`}
      />
      <div className="ruk-grid ruk-grid-3 mb-4">
        <DashboardStatCard description="Permintaan yang sedang berjalan" label="Permintaan aktif" value={umkmDashboard.stats.activeRequests} />
        <DashboardStatCard description="Kreator tersimpan" label="Favorit" value={umkmDashboard.stats.favoritesCount} />
        <NextActionCard actionLabel="Buat brief baru" description="Mulai kerja sama dengan kebutuhan promosi yang rapi." title="Tindakan berikutnya" to={ROUTES.newBrief} />
      </div>
      <div className="d-grid gap-4">
        <DashboardSection title="Permintaan aktif">
          <RequestStatusList requests={umkmDashboard.recentRequests} />
        </DashboardSection>
        <DashboardSection title="Kreator favorit">
          <FavoriteList creators={umkmDashboard.favoriteCreators} />
        </DashboardSection>
      </div>
    </>
  )
}

export default UmkmDashboardPage
