import SectionHeader from '../ui/SectionHeader'

const steps = [
  { title: 'Cari Kreator', desc: 'Berdasarkan niche dan harga sesuai kebutuhan promosi Anda.' },
  { title: 'Bandingkan', desc: 'Nilai profil, ulasan klien sebelumnya, dan portofolio terbaik.' },
  { title: 'Ajukan Brief', desc: 'Gunakan template kami agar ekspektasi kerja sangat jelas.' },
  { title: 'Pantau Status', desc: 'Kelola semua proyek aktif dari satu dashboard sederhana.' },
]

function HowItWorksSection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <SectionHeader 
          align="center"
          description="Hanya butuh 4 langkah mudah dan terstruktur untuk mulai berkolaborasi secara profesional."
          eyebrow="Cara Kerja"
          title="Alur Kerja Sederhana"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-16 relative">
          <div className="hidden lg:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-teal-100 via-teal-300 to-teal-100 z-0"></div>
          
          {steps.map((step, index) => (
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 relative z-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group" key={step.title}>
              <span className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 text-ruk-primary shadow-sm border border-teal-100/50 font-black items-center justify-center mb-8 text-xl group-hover:scale-110 transition-transform duration-300">
                {index + 1}
              </span>
              <h3 className="mb-3 text-xl font-bold text-ruk-navy tracking-tight">{step.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
