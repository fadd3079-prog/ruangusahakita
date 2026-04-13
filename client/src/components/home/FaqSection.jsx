const faqs = [
  ['Apakah pembayaran sudah aktif?', 'Untuk MVP, pembayaran penuh dan escrow aktif belum termasuk scope. Fokusnya alur discovery dan brief.'],
  ['Apakah AI sudah terhubung?', 'Belum. AI tampil sebagai helper placeholder agar alurnya siap dikembangkan.'],
  ['Apakah kreator bisa mengelola layanan?', 'Ya, kreator punya dashboard dasar untuk profil, layanan, portofolio, dan permintaan masuk.'],
]

function FaqSection() {
  return (
    <section className="ruk-section">
      <div className="container">
        <h2 className="fw-bold text-center mb-4">Pertanyaan umum</h2>
        <div className="accordion" id="home-faq">
          {faqs.map(([question, answer], index) => (
            <div className="accordion-item" key={question}>
              <h3 className="accordion-header">
                <button
                  aria-controls={`faq-${index}`}
                  aria-expanded={index === 0}
                  className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                  data-bs-target={`#faq-${index}`}
                  data-bs-toggle="collapse"
                  type="button"
                >
                  {question}
                </button>
              </h3>
              <div className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#home-faq" id={`faq-${index}`}>
                <div className="accordion-body">{answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FaqSection
