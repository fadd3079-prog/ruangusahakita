import DashboardHeader from '../../components/dashboard/DashboardHeader'
import BriefForm from '../../components/forms/BriefForm'

function NewBriefPage() {
  return (
    <>
      <DashboardHeader description="Isi kebutuhan promosi dengan bahasa sederhana. Brief bisa diubah sebelum kerja dimulai." title="Brief Baru" />
      <BriefForm />
    </>
  )
}

export default NewBriefPage
