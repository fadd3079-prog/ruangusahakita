import DashboardHeader from '../../components/dashboard/DashboardHeader'
import DashboardSection from '../../components/dashboard/DashboardSection'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import IncomingRequestCard from '../../components/dashboard/IncomingRequestCard'
import PortfolioPreviewList from '../../components/dashboard/PortfolioPreviewList'
import ProfileCompletionCard from '../../components/dashboard/ProfileCompletionCard'
import QuickActionPanel from '../../components/dashboard/QuickActionPanel'
import ServicePreviewList from '../../components/dashboard/ServicePreviewList'
import { creatorDashboard } from '../../data/mockData'

function CreatorDashboardPage() {
  return (
    <>
      <DashboardHeader description="Kelola profil, layanan, portofolio, dan permintaan masuk." title={`Halo, ${creatorDashboard.profile.name}`} />
      <div className="ruk-grid ruk-grid-3 mb-4">
        <DashboardStatCard label="Layanan aktif" value={creatorDashboard.stats.activeServices} />
        <DashboardStatCard label="Portofolio" value={creatorDashboard.stats.portfolioCount} />
        <DashboardStatCard label="Permintaan masuk" value={creatorDashboard.stats.incomingRequests} />
      </div>
      <div className="d-grid gap-4">
        <ProfileCompletionCard percent={creatorDashboard.profile.completionPercent} to="/dashboard/kreator/profil" />
        <QuickActionPanel />
        <DashboardSection title="Permintaan masuk">
          <IncomingRequestCard requests={creatorDashboard.latestRequests} />
        </DashboardSection>
        <DashboardSection title="Layanan aktif">
          <ServicePreviewList services={creatorDashboard.latestServices} />
        </DashboardSection>
        <DashboardSection title="Portofolio terbaru">
          <PortfolioPreviewList items={creatorDashboard.latestPortfolio} />
        </DashboardSection>
      </div>
    </>
  )
}

export default CreatorDashboardPage
