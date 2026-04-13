import RoleSelector from '../../components/forms/RoleSelector'

function RoleSelectPage() {
  return (
    <div>
      <div className="text-center mb-4">
        <h1 className="fw-bold">Pilih peran</h1>
        <p className="ruk-muted">Pilih alur yang sesuai agar dashboard dan langkah berikutnya tepat.</p>
      </div>
      <RoleSelector />
    </div>
  )
}

export default RoleSelectPage
