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
      { label: 'Kelola portofolio', to: ROUTES.creatorPortfolio },
      { label: 'Dashboard Kreator', to: ROUTES.creatorDashboard },
    ],
  },
]

function Footer() {
  return (
    <footer className="ruk-footer">
      <div className="container">
        <div className="row g-4 g-lg-5">
          <div className="col-lg-4">
            <Link className="ruk-footer-brand" to={ROUTES.home}>
              <img alt="" aria-hidden="true" src={assets.logos.primary} />
              <span>Ruang Usaha Kita</span>
            </Link>
            <p className="ruk-muted mt-3 mb-3">
              Marketplace jasa promosi digital yang membantu UMKM menemukan kreator, melihat portofolio, dan memulai kerja sama dengan brief yang rapi.
            </p>
            <div className="ruk-footer-contact">
              <span>Bantuan: halo@ruangusahakita.id</span>
              <span>Jam layanan: Senin-Jumat</span>
            </div>
          </div>
          {linkGroups.map((group) => (
            <div className="col-6 col-lg-2" key={group.title}>
              <h2 className="h6 fw-bold">{group.title}</h2>
              <ul className="list-unstyled ruk-footer-links mb-0">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-lg-2">
            <h2 className="h6 fw-bold">Bantuan</h2>
            <ul className="list-unstyled ruk-footer-links mb-3">
              <li><Link to={ROUTES.help}>Pusat bantuan</Link></li>
              <li><Link to={ROUTES.faq}>FAQ</Link></li>
              <li><Link to={ROUTES.login}>Masuk</Link></li>
            </ul>
            <div aria-label="Media sosial" className="ruk-social-links">
              <a href="https://instagram.com" rel="noreferrer" target="_blank">IG</a>
              <a href="https://linkedin.com" rel="noreferrer" target="_blank">In</a>
              <a href="https://x.com" rel="noreferrer" target="_blank">X</a>
            </div>
          </div>
        </div>
        <div className="ruk-footer-bottom">
          <p className="small ruk-muted mb-0">© 2026 Ruang Usaha Kita. Semua hak dilindungi.</p>
          <p className="small ruk-muted mb-0">Ruang yang lebih jelas untuk menemukan kreator dan memulai kerja sama promosi digital.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
