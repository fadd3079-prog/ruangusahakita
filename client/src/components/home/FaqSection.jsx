import { useState } from 'react'

const faqs = [
  ['Apakah pembayaran sudah aktif?', 'Untuk MVP, pembayaran penuh dan escrow aktif belum termasuk scope. Fokusnya alur discovery dan brief.'],
  ['Apakah AI sudah terhubung?', 'Belum. AI tampil sebagai helper placeholder agar alurnya siap dikembangkan.'],
  ['Apakah kreator bisa mengelola layanan?', 'Ya, kreator punya dashboard dasar untuk profil, layanan, portofolio, dan permintaan masuk.'],
]

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-ruk-navy">Pertanyaan Umum</h2>
        </div>
        <div className="space-y-4">
          {faqs.map(([question, answer], index) => (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow" key={question}>
              <button
                aria-controls={`faq-${index}`}
                aria-expanded={openIndex === index}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset bg-white"
                onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
                type="button"
              >
                <span className="font-bold text-ruk-navy text-lg">{question}</span>
                <span className={`ml-6 flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180 text-teal-600' : 'text-gray-400'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div className={`px-6 pb-6 text-gray-600 leading-relaxed ${openIndex === index ? 'block' : 'hidden'}`} id={`faq-${index}`}>
                {answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FaqSection
