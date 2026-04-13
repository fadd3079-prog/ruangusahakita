import Button from '../ui/Button'

function QuickActionPanel() {
  return (
    <div className="ruk-surface p-4 d-flex flex-column flex-md-row gap-2">
      <Button to="/dashboard/kreator/layanan/tambah">Tambah layanan</Button>
      <Button to="/dashboard/kreator/portofolio/tambah" variant="secondary">Tambah portofolio</Button>
    </div>
  )
}

export default QuickActionPanel
