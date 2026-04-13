import SectionHeader from '../ui/SectionHeader'

function CreatorAbout({ creator }) {
  return (
    <section className="py-0">
      <SectionHeader
        description="Profil singkat agar UMKM mudah menilai kecocokan kreator."
        title="Tentang kreator"
      />
      <p className="mb-0 ruk-creator-about-body">{creator.fullBio}</p>
    </section>
  )
}

export default CreatorAbout
