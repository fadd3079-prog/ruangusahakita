import { creators } from '../../data/mockData'
import CreatorCard from '../marketplace/CreatorCard'
import SectionHeader from '../ui/SectionHeader'

function FeaturedCreatorsSection() {
  return (
    <section className="ruk-section">
      <div className="container">
        <SectionHeader
          align="center"
          description="Preview etalase kreator yang mudah discan seperti marketplace."
          title="Kreator pilihan"
        />
        <div className="ruk-grid ruk-grid-3">
          {creators.map((creator) => <CreatorCard creator={creator} key={creator.id} />)}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCreatorsSection
