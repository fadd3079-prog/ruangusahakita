import EmptyState from '../../components/common/EmptyState'

function MaintenancePage() {
  return (
    <section className="ruk-section">
      <div className="container">
        <EmptyState
          actionLabel="Kembali ke beranda"
          actionTo="/"
          description="Beberapa bagian sedang disiapkan agar pengalaman tetap rapi."
          title="Platform sedang dirapikan"
        />
      </div>
    </section>
  )
}

export default MaintenancePage
