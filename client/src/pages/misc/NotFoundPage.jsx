import EmptyState from '../../components/common/EmptyState'

function NotFoundPage() {
  return (
    <section className="ruk-section">
      <div className="container">
        <EmptyState
          actionLabel="Kembali ke beranda"
          actionTo="/"
          description="Halaman yang kamu cari belum tersedia atau sudah dipindahkan."
          title="Halaman tidak ditemukan"
        />
      </div>
    </section>
  )
}

export default NotFoundPage
