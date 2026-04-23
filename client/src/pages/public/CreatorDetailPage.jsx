import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'
import CreatorAbout from '../../components/detail/CreatorAbout'
import CreatorHero from '../../components/detail/CreatorHero'
import CreatorStats from '../../components/detail/CreatorStats'
import ServiceList from '../../components/detail/ServiceList'
import StickyActionBar from '../../components/detail/StickyActionBar'
import PortfolioGrid from '../../components/marketplace/PortfolioGrid'
import ReviewList from '../../components/marketplace/ReviewList'
import SectionHeader from '../../components/ui/SectionHeader'
import { creatorService } from '../../services/creatorService'

function CreatorDetailPage() {
  const { creatorSlug } = useParams()
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    creatorService.getCreatorBySlug(creatorSlug).then((result) => {
      setCreator(result)
      setLoading(false)
    })
  }, [creatorSlug])

  if (loading) return <div className="container mx-auto px-4 py-32 text-center"><p className="text-slate-500 font-medium text-lg">Memuat profil kreator...</p></div>
  if (!creator) {
    return (
      <div className="container mx-auto px-4 py-32">
        <EmptyState actionLabel="Cari kreator lain" actionTo="/cari-kreator" description="Coba buka kreator lain dari halaman listing." title="Kreator tidak ditemukan" />
      </div>
    )
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-40">
      <CreatorHero creator={creator} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mt-10 space-y-10">
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-12">
          <CreatorStats creator={creator} />
        </div>
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-12">
          <CreatorAbout creator={creator} />
        </div>
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-12">
          <ServiceList services={creator.services} />
        </div>
        <section className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-12">
          <div className="mb-8"><SectionHeader title="Portofolio unggulan" /></div>
          <PortfolioGrid items={creator.portfolioItems} />
        </section>
        <section className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-12">
          <div className="mb-8"><SectionHeader title="Ulasan" /></div>
          <ReviewList reviews={creator.reviews} />
        </section>
        <section className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-12 mb-32">
          <div className="mb-8"><SectionHeader title="FAQ" /></div>
          <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100">
            <h2 className="text-xl font-bold text-ruk-navy mb-3">Apakah brief bisa diubah?</h2>
            <p className="text-slate-600 mb-0 font-medium leading-relaxed">Bisa. Brief awal membantu kreator memahami kebutuhan, lalu detail bisa disesuaikan sebelum kerja dimulai.</p>
          </div>
        </section>
      </div>
      <StickyActionBar creatorId={creator.id} />
    </div>
  )
}

export default CreatorDetailPage
