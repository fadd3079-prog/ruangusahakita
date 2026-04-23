import { assets } from '../../constants/assets'
import { ROUTES } from '../../constants/routes'
import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section className="relative bg-ruk-navy pt-24 pb-28 lg:pt-32 lg:pb-36 overflow-hidden">
      {/* Premium Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-ruk-navy via-[#0C2949] to-[#167163]/60 opacity-95"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Satu ruang untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">usaha yang bertumbuh.</span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-white/70 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Temukan content creator, marketer, desainer, dan tim iklan yang siap membantu UMKM tampil lebih rapi, ramai, dan mudah dipercaya.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link 
                className="inline-flex items-center justify-center px-8 py-4.5 text-base font-bold text-ruk-navy bg-white rounded-full hover:bg-teal-50 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(22,113,99,0.3)] hover:-translate-y-0.5" 
                to={ROUTES.creators}
              >
                Saya Pelaku Usaha
              </Link>
              <Link 
                className="inline-flex items-center justify-center px-8 py-4.5 text-base font-bold text-white bg-white/5 border border-white/20 backdrop-blur-md rounded-full hover:bg-white/10 transition-all hover:-translate-y-0.5" 
                to={ROUTES.roleSelect}
              >
                Saya Kreator
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white">1.8K+</p>
                <p className="mt-2 text-xs sm:text-sm text-teal-200/80 font-semibold uppercase tracking-wider">Kreator & Marketer</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white">2.4K+</p>
                <p className="mt-2 text-xs sm:text-sm text-teal-200/80 font-semibold uppercase tracking-wider">UMKM Terbantu</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white">99%</p>
                <p className="mt-2 text-xs sm:text-sm text-teal-200/80 font-semibold uppercase tracking-wider">Tingkat Kepuasan</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none lg:h-full mt-12 lg:mt-0">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[640px] border border-white/10 group">
              <img 
                alt="Analisis digital" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={assets.photos.aiAnalytics} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ruk-navy/90 via-ruk-navy/20 to-transparent"></div>
            </div>

            {/* Premium Floating Elements */}
            <div className="absolute top-8 -right-4 sm:-right-8 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-white/40 flex items-center gap-4 animate-bounce-slow">
              <img alt="" aria-hidden="true" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" src={assets.avatars.arya} />
              <div>
                <p className="text-sm font-bold text-ruk-navy leading-tight">Indra Surya A.</p>
                <p className="text-xs text-ruk-primary font-bold mt-0.5">Digital Marketer</p>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-4 sm:-left-8 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-white/40 max-w-[300px]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-teal-400 to-ruk-primary rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner">
                  99%
                </div>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  Sukses berkembang setelah menggunakan <span className="font-bold text-ruk-navy">Ruang Usaha Kita</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
