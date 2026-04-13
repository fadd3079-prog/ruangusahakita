import { useParams } from 'react-router-dom'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import PortfolioForm from '../../components/forms/PortfolioForm'
import { portfolioItems } from '../../data/mockData'

function CreatorEditPortfolioPage() {
  const { portfolioId } = useParams()
  const item = portfolioItems.find((portfolio) => portfolio.id === portfolioId)

  return (
    <>
      <DashboardHeader description="Perbarui detail portofolio agar tetap relevan." title="Ubah Portofolio" />
      <PortfolioForm initialItem={item} />
    </>
  )
}

export default CreatorEditPortfolioPage
