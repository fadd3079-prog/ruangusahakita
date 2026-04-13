import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const values = [
  ['Cari tanpa ribet', 'Search, filter, harga mulai, lokasi, dan rating terlihat sejak awal.'],
  ['Profil lebih jelas', 'Kreator punya etalase layanan dan portofolio yang mudah dinilai.'],
  ['Brief lebih rapi', 'UMKM dibantu menyampaikan kebutuhan promosi dengan bahasa sederhana.'],
]

function ValuePropsSection() {
  return (
    <section className="ruk-section ruk-section-soft-blue">
      <div className="container">
        <SectionHeader
          align="center"
          description="Fokus MVP adalah discovery, trust, dan alur kerja sama awal."
          title="Lebih jelas dari cari kreator lewat DM"
        />
        <div className="ruk-grid ruk-grid-3">
          {values.map(([title, description]) => (
            <Card key={title}>
              <h3 className="h5 fw-bold">{title}</h3>
              <p className="ruk-muted mb-0">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ValuePropsSection
