import SectionHeader from '../ui/SectionHeader'

const signals = [
  'Rating dan ulasan membantu menilai kreator.',
  'Harga mulai terlihat sebelum membuka detail.',
  'Brief membuat ekspektasi kerja sama lebih jelas.',
  'Dashboard memisahkan area publik dan pengelolaan.',
]

function TrustSection() {
  return (
    <section className="ruk-section ruk-section-soft-blue">
      <div className="container">
        <SectionHeader align="center" title="Dibuat agar kerja sama terasa lebih aman" />
        <div className="ruk-grid ruk-grid-4">
          {signals.map((signal) => (
            <div className="ruk-surface p-3" key={signal}>
              <p className="fw-semibold mb-0">{signal}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection
