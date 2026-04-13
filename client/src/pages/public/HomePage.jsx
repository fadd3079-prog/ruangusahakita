import AiTeaserSection from '../../components/home/AiTeaserSection'
import FaqSection from '../../components/home/FaqSection'
import FeaturedCreatorsSection from '../../components/home/FeaturedCreatorsSection'
import HeroSection from '../../components/home/HeroSection'
import HowItWorksSection from '../../components/home/HowItWorksSection'
import TargetAudienceSection from '../../components/home/TargetAudienceSection'
import TrustSection from '../../components/home/TrustSection'
import ValuePropsSection from '../../components/home/ValuePropsSection'
import { ROUTES } from '../../constants/routes'
import Button from '../../components/ui/Button'

function HomePage() {
  return (
    <>
      <HeroSection />
      <ValuePropsSection />
      <TargetAudienceSection />
      <HowItWorksSection />
      <FeaturedCreatorsSection />
      <AiTeaserSection />
      <TrustSection />
      <FaqSection />
      <section className="ruk-section ruk-home-cta">
        <div className="container text-center">
          <div className="ruk-home-cta-panel">
          <h2 className="fw-bold">Mulai dengan langkah sederhana</h2>
          <p className="ruk-muted">Cari kreator yang cocok atau bangun profil kreator profesional.</p>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
            <Button to={ROUTES.creators}>Cari kreator</Button>
            <Button to={ROUTES.roleSelect} variant="secondary">Daftar sebagai kreator</Button>
          </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
