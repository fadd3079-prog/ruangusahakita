import DashboardHeader from '../../components/dashboard/DashboardHeader'
import BusinessProfileForm from '../../components/forms/BusinessProfileForm'

function UmkmProfilePage() {
  return (
    <>
      <DashboardHeader description="Isi profil dasar agar brief lebih mudah dibuat." title="Profil Usaha" />
      <BusinessProfileForm />
    </>
  )
}

export default UmkmProfilePage
