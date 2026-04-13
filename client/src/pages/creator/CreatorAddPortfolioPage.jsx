import DashboardHeader from '../../components/dashboard/DashboardHeader'
import PortfolioForm from '../../components/forms/PortfolioForm'

function CreatorAddPortfolioPage() {
  return (
    <>
      <DashboardHeader description="Tambahkan contoh konten yang paling mewakili gaya kerjamu." title="Tambah Portofolio" />
      <PortfolioForm />
    </>
  )
}

export default CreatorAddPortfolioPage
