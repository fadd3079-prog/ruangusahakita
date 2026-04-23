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
      <section className="py-24 bg-gradient-to-br from-ruk-navy to-[#0f4d4a] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Mulai dari profil yang tepat</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">Cari kreator yang cocok atau bangun etalase jasa yang lebih mudah dipercaya untuk bisnis Anda.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button to={ROUTES.creators} className="!bg-white !text-ruk-navy hover:!bg-gray-100 px-8 py-4 text-lg">Cari Kreator</Button>
            <Button to={ROUTES.roleSelect} className="!bg-transparent border-2 border-white/30 text-white hover:!bg-white/10 px-8 py-4 text-lg">Daftar sebagai Kreator</Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
