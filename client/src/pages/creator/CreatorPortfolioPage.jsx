import DashboardHeader from '../../components/dashboard/DashboardHeader'
import PortfolioPreviewList from '../../components/dashboard/PortfolioPreviewList'
import Button from '../../components/ui/Button'
import { portfolioItems } from '../../data/mockData'

function CreatorPortfolioPage() {
  return (
    <>
      <DashboardHeader
        action={<Button to="/dashboard/kreator/portofolio/tambah">Tambah portofolio</Button>}
        description="Tampilkan contoh hasil agar UMKM lebih yakin."
        title="Kelola Portofolio"
      />
      <PortfolioPreviewList items={portfolioItems} />
    </>
  )
}

export default CreatorPortfolioPage
