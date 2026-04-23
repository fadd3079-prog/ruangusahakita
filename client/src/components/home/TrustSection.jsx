const signals = [
  { title: 'Rating & Ulasan', desc: 'Membantu Anda menilai kreator secara objektif.' },
  { title: 'Transparansi Harga', desc: 'Harga mulai terlihat sebelum membuka detail.' },
  { title: 'Brief Terstruktur', desc: 'Ekspektasi kerja sama lebih jelas bagi kedua pihak.' },
  { title: 'Dashboard Khusus', desc: 'Memisahkan area publik dan pengelolaan proyek.' },
]

function TrustSection() {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-ruk-navy">Dibuat Agar Kerja Sama Terasa Lebih Aman</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signals.map((signal) => (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm" key={signal.title}>
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-ruk-navy text-lg mb-2">{signal.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{signal.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection
