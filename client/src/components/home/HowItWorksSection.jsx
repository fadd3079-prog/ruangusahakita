import SectionHeader from '../ui/SectionHeader'

const steps = [
  'Cari kreator yang sesuai kebutuhan promosi.',
  'Bandingkan profil, layanan, harga, dan portofolio.',
  'Ajukan brief agar ekspektasi kerja sama jelas.',
  'Pantau status dari dashboard sederhana.',
]

function HowItWorksSection() {
  return (
    <section className="ruk-section">
      <div className="container">
        <SectionHeader align="center" title="Cara kerja singkat" />
        <div className="ruk-grid ruk-grid-4">
          {steps.map((step, index) => (
            <article className="ruk-surface p-4" key={step}>
              <span className="ruk-badge ruk-badge-primary mb-3">Langkah {index + 1}</span>
              <h3 className="h6 fw-bold mb-0">{step}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
