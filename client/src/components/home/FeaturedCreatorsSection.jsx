import { creators } from '../../data/mockData'
import CreatorCard from '../marketplace/CreatorCard'
import SectionHeader from '../ui/SectionHeader'
import Button from '../ui/Button'
import { ROUTES } from '../../constants/routes'

function FeaturedCreatorsSection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <SectionHeader 
            align="start"
            description="Pilih jasa promosi seperti belanja di marketplace. Bandingkan rating, harga, dan layanan dengan mudah."
            eyebrow="Katalog"
            title="Kreator Pilihan Kami"
          />
          <div className="pb-10">
            <Button className="w-full sm:w-auto" to={ROUTES.creators} variant="secondary">Lihat Semua</Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.slice(0, 3).map((creator) => (
            <CreatorCard creator={creator} key={creator.id} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCreatorsSection
