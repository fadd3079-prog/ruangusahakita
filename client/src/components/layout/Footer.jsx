import { Link } from 'react-router-dom'
import { assets } from '../../constants/assets'
import { ROUTES } from '../../constants/routes'

const linkGroups = [
  {
    title: 'Platform',
    links: [
      { label: 'Beranda', to: ROUTES.home },
      { label: 'Cari Kreator', to: ROUTES.creators },
      { label: 'Cara Kerja', to: ROUTES.howItWorks },
      { label: 'Tentang', to: ROUTES.about },
    ],
  },
  {
    title: 'Untuk UMKM',
    links: [
      { label: 'Cari kreator', to: ROUTES.creators },
      { label: 'Buat brief baru', to: ROUTES.newBrief },
      { label: 'Kreator favorit', to: ROUTES.umkmFavorites },
      { label: 'Dashboard UMKM', to: ROUTES.umkmDashboard },
    ],
  },
  {
    title: 'Untuk Kreator',
    links: [
      { label: 'Daftar kreator', to: ROUTES.roleSelect },
      { label: 'Kelola layanan', to: ROUTES.creatorServices },
      { label: 'Kelola portofolio', to: ROUTES.creatorDashboard },
      { label: 'Dashboard Kreator', to: ROUTES.creatorDashboard },
    ],
  },
]

function Footer() {
  return (
    <footer className="bg-[#0A1F38] text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
          <div className="lg:col-span-4">
            <Link className="flex items-center gap-4 font-black text-2xl tracking-tight hover:text-white transition-opacity hover:opacity-90" to={ROUTES.home}>
              <img alt="Ruang Usaha Kita" className="h-10 w-auto" src={assets.logos.white} />
              <span>Ruang Usaha Kita</span>
            </Link>
            <p className="mt-6 text-slate-400 leading-relaxed text-base max-w-sm font-medium">
              Marketplace jasa promosi digital yang membantu UMKM menemukan kreator, melihat portofolio, dan memulai kerja sama dengan brief yang rapi.
            </p>
            <div className="mt-10 space-y-3">
              <div className="inline-block bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 text-sm text-slate-300 font-medium">
                Bantuan: halo@ruangusahakita.id
              </div>
              <div className="inline-block bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 text-sm text-slate-300 font-medium ml-0 sm:ml-3 mt-3 sm:mt-0">
                Layanan: Senin - Jumat
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pl-0 lg:pl-12">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-bold text-white tracking-widest text-xs uppercase mb-8 opacity-60">{group.title}</h3>
                <ul className="space-y-5">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link className="text-slate-400 hover:text-white text-sm font-semibold transition-all hover:translate-x-1 inline-block" to={link.to}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="font-bold text-white tracking-widest text-xs uppercase mb-8 opacity-60">Bantuan</h3>
              <ul className="space-y-5 mb-10">
                <li><Link className="text-slate-400 hover:text-white text-sm font-semibold transition-all hover:translate-x-1 inline-block" to={ROUTES.help}>Pusat bantuan</Link></li>
                <li><Link className="text-slate-400 hover:text-white text-sm font-semibold transition-all hover:translate-x-1 inline-block" to={ROUTES.faq}>FAQ</Link></li>
                <li><Link className="text-slate-400 hover:text-white text-sm font-semibold transition-all hover:translate-x-1 inline-block" to={ROUTES.login}>Masuk</Link></li>
              </ul>
              <div className="flex gap-4">
                <a href="https://instagram.com" rel="noreferrer" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-ruk-navy hover:-translate-y-1 transition-all shadow-sm">IG</a>
                <a href="https://linkedin.com" rel="noreferrer" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-ruk-navy hover:-translate-y-1 transition-all shadow-sm">In</a>
                <a href="https://x.com" rel="noreferrer" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-ruk-navy hover:-translate-y-1 transition-all shadow-sm">X</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
          <p>© 2026 Ruang Usaha Kita. Semua hak dilindungi.</p>
          <p>Ruang yang lebih jelas untuk menemukan kreator.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
