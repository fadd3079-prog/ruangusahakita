import { assets } from '../../constants/assets'
import { ROUTES } from '../../constants/routes'
import Button from '../ui/Button'

function HeroSection() {
  return (
    <section className="ruk-hero">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <p className="text-uppercase small fw-bold ruk-hero-eyebrow mb-2">Marketplace promosi digital</p>
            <h1 className="display-5 fw-bold mb-3 ruk-hero-title">Temukan kreator promosi yang cocok untuk usahamu</h1>
            <p className="lead ruk-muted">
              Lebih mudah cari kreator, lihat jasa, bandingkan harga, dan mulai kerja sama dengan brief yang rapi.
            </p>
            <div className="ruk-hero-cta">
              <Button to={ROUTES.creators}>Cari kreator</Button>
              <Button to={ROUTES.roleSelect} variant="secondary">Daftar sebagai kreator</Button>
            </div>
            <div className="small ruk-hero-highlights">
              <span>Rating dan ulasan</span>
              <span>Brief terstruktur</span>
              <span>Dashboard sederhana</span>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ruk-hero-preview">
              <img alt="Pemilik UMKM menyiapkan produk untuk promosi digital" className="rounded-3 mb-3" src={assets.photos.heroUmkm} />
              <div className="row g-3">
                <div className="col-6">
                  <div className="ruk-hero-metric p-3">
                    <p className="small ruk-muted mb-1">Kreator cocok</p>
                    <p className="h4 fw-bold mb-0">48+</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="ruk-hero-metric p-3">
                    <p className="small ruk-muted mb-1">Brief rapi</p>
                    <p className="h4 fw-bold mb-0">3 langkah</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
