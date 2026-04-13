import Button from '../ui/Button'

function AiTeaserSection() {
  return (
    <section className="ruk-section ruk-section-soft-teal">
      <div className="container">
        <div className="ruk-card p-4 p-lg-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <p className="text-uppercase small fw-bold ruk-hero-eyebrow mb-2">AI helper placeholder</p>
              <h2 className="fw-bold">Bantu buat brief dengan bahasa sederhana</h2>
              <p className="ruk-muted mb-0">
                Isi kebutuhan promosi singkat, lalu dapatkan draft brief yang bisa kamu baca dan ubah sebelum dikirim.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Button to="/dashboard/umkm/brief/baru">Coba buat brief</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AiTeaserSection
