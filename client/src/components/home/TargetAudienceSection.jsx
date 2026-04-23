import { ROUTES } from '../../constants/routes'
import Button from '../ui/Button'
import SectionHeader from '../ui/SectionHeader'

function TargetAudienceSection() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white opacity-80 pointer-events-none"></div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <SectionHeader 
          align="center"
          description="Platform kami menghubungkan dua sisi untuk berkembang bersama melalui kolaborasi digital yang profesional."
          eyebrow="Tumbuh Bersama"
          title="Satu Ekosistem, Dua Peran"
        />

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mt-16">
          <div className="group relative bg-white rounded-3xl p-10 lg:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-teal-400 to-ruk-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-20 h-20 bg-gradient-to-br from-teal-50 to-teal-100 text-ruk-primary rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <h3 className="text-3xl font-bold text-ruk-navy mb-4 tracking-tight">Untuk UMKM</h3>
            <p className="text-gray-500 mb-10 leading-relaxed text-lg font-medium">Cari kreator berdasarkan niche, lokasi, harga, portofolio, dan rating. Mulai promosi bisnis Anda hari ini.</p>
            <Button className="mt-auto w-full sm:w-auto px-10 shadow-[0_4px_14px_0_rgba(22,113,99,0.39)]" to={ROUTES.creators}>Temukan Kreator</Button>
          </div>
          
          <div className="group relative bg-white rounded-3xl p-10 lg:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-400 to-ruk-navy opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-3xl font-bold text-ruk-navy mb-4 tracking-tight">Untuk Kreator</h3>
            <p className="text-gray-500 mb-10 leading-relaxed text-lg font-medium">Bangun profil profesional agar jasa dan portofoliomu mudah ditemukan oleh klien potensial di sekitarmu.</p>
            <Button className="mt-auto w-full sm:w-auto px-10 border-slate-200 text-ruk-navy hover:bg-slate-50 hover:border-slate-300" to={ROUTES.roleSelect} variant="outline">Daftar Kreator</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TargetAudienceSection
