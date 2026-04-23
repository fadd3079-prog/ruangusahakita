import { assets } from '../../constants/assets'
import Button from '../ui/Button'

function AiTeaserSection() {
  return (
    <section className="py-24 lg:py-32 bg-ruk-navy text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c2949] via-[#08213e] to-[#041224]"></div>
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-teal-500/20 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-blue-500/20 blur-[100px]"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="mb-12 inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <img alt="AI Icon" className="w-8 h-8 rounded-full bg-white p-0.5" src={assets.logos.primary} />
          <span className="font-bold tracking-wider uppercase text-xs text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-400">AI Smart Matching</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight">
              Tidak Tahu Harus Memilih Siapa? <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">Biarkan AI Membantu.</span>
            </h2>
            <p className="mt-8 text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
              Cukup masukkan kebutuhan bisnis Anda, sistem kami akan merekomendasikan kreator paling sesuai berdasarkan niche industri, performa historis, dan budget Anda.
            </p>
            
            <div className="mt-12 bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative transform transition-all duration-500 hover:-translate-y-2">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal-300 to-teal-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-ruk-navy">
                <span className="text-ruk-navy text-sm font-black">AI</span>
              </div>
              <p className="text-lg md:text-xl italic text-slate-200 leading-relaxed font-medium">
                "Saya punya bisnis kedai kopi kecil dan butuh orang untuk manage TikTok agar lebih viral. Budget sekitar Rp 1 Juta per bulan..."
              </p>
              <div className="mt-8 flex justify-end">
                <Button
                  className="!rounded-full !w-14 !h-14 !p-0 !bg-teal-400 hover:!bg-teal-300 text-ruk-navy shadow-[0_4px_20px_rgba(45,212,191,0.4)] transition-all hover:scale-110"
                  to="/dashboard/umkm/brief/baru"
                >
                  <span className="text-2xl font-bold">→</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-transparent rounded-[2.5rem] transform rotate-3 transition-transform duration-500 group-hover:rotate-6"></div>
            <img 
              alt="Asisten AI" 
              className="relative rounded-[2.5rem] object-cover w-full h-[600px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 transition-transform duration-700 group-hover:scale-105"
              src={assets.photos.aiAssistant} 
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AiTeaserSection
