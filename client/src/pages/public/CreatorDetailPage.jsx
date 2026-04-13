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

  if (loading) return <div className="container py-5"><p>Memuat profil kreator...</p></div>
  if (!creator) {
    return (
      <div className="container py-5">
        <EmptyState actionLabel="Cari kreator lain" actionTo="/cari-kreator" description="Coba buka kreator lain dari halaman listing." title="Kreator tidak ditemukan" />
      </div>
    )
  }

  return (
    <div className="ruk-detail-shell">
      <CreatorHero creator={creator} />
      <div className="container pb-5">
        <div className="ruk-detail-block">
          <CreatorStats creator={creator} />
        </div>
        <div className="ruk-detail-block">
          <CreatorAbout creator={creator} />
        </div>
        <div className="ruk-detail-block">
          <ServiceList services={creator.services} />
        </div>
        <section className="ruk-detail-block">
          <SectionHeader title="Portofolio unggulan" />
          <PortfolioGrid items={creator.portfolioItems} />
        </section>
        <section className="ruk-detail-block">
          <SectionHeader title="Ulasan" />
          <ReviewList reviews={creator.reviews} />
        </section>
        <section className="ruk-detail-block">
          <SectionHeader title="FAQ kecil" />
          <div className="ruk-section-card p-4">
            <h2 className="h6 fw-bold">Apakah brief bisa diubah?</h2>
            <p className="ruk-muted mb-0">Bisa. Brief awal membantu kreator memahami kebutuhan, lalu detail bisa disesuaikan sebelum kerja dimulai.</p>
          </div>
        </section>
      </div>
      <StickyActionBar creatorId={creator.id} />
    </div>
  )
}

export default CreatorDetailPage
