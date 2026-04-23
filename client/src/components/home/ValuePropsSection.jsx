import SectionHeader from '../ui/SectionHeader'

const values = [
  {
    title: 'Cari tanpa ribet',
    description: 'Search, filter, harga mulai, lokasi, dan rating terlihat sejak awal tanpa perlu repot DM.',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
  },
  {
    title: 'Profil lebih jelas',
    description: 'Kreator memiliki etalase layanan dan portofolio profesional yang mudah dinilai sekilas.',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  },
  {
    title: 'Brief lebih rapi',
    description: 'UMKM dibantu menyampaikan kebutuhan promosi dengan struktur bahasa yang sederhana dan tepat sasaran.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  }
]

function ValuePropsSection() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-50 via-white to-white opacity-80"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <SectionHeader 
          align="center"
          description="Platform yang didesain khusus untuk memudahkan UMKM dan Kreator berkolaborasi secara transparan dan profesional."
          eyebrow="Mengapa Kami"
          title="Lebih Jelas dari Cari Kreator Lewat DM"
        />
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mt-16">
          {values.map((value) => (
            <div key={value.title} className="bg-white rounded-3xl p-10 border border-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] group shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-8 text-ruk-primary group-hover:bg-teal-50 group-hover:scale-110 group-hover:border-teal-100 transition-all duration-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={value.icon}></path>
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-ruk-navy tracking-tight">{value.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ValuePropsSection
