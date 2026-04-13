import { ROUTES } from '../../constants/routes'
import Button from '../ui/Button'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

function TargetAudienceSection() {
  return (
    <section className="ruk-section ruk-section-soft-teal">
      <div className="container">
        <SectionHeader align="center" title="Untuk UMKM dan kreator lokal" />
        <div className="ruk-grid ruk-grid-2">
          <Card>
            <h3 className="fw-bold">Untuk UMKM</h3>
            <p className="ruk-muted">Cari kreator berdasarkan niche, lokasi, harga, portofolio, dan rating.</p>
            <Button to={ROUTES.creators}>Cari kreator</Button>
          </Card>
          <Card>
            <h3 className="fw-bold">Untuk Kreator</h3>
            <p className="ruk-muted">Bangun profil profesional agar jasa dan portofoliomu mudah ditemukan.</p>
            <Button to={ROUTES.roleSelect} variant="secondary">Daftar sebagai kreator</Button>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default TargetAudienceSection
