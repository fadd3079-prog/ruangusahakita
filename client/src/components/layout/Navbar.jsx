import { NavLink } from 'react-router-dom'
import { assets } from '../../constants/assets'
import { ROUTES } from '../../constants/routes'
import Button from '../ui/Button'

const navLinks = [
  { label: 'Beranda', to: ROUTES.home, end: true },
  { label: 'Cari Kreator', to: ROUTES.creators },
  { label: 'Cara Kerja', to: ROUTES.howItWorks },
  { label: 'Tentang', to: ROUTES.about },
  { label: 'FAQ/Bantuan', to: ROUTES.faq },
]

function Navbar() {
  return (
    <header className="ruk-navbar sticky-top">
      <nav aria-label="Navigasi utama" className="navbar navbar-expand-lg ruk-navbar-shell">
        <div className="container">
          <NavLink className="navbar-brand ruk-brand" to={ROUTES.home}>
            <img alt="" aria-hidden="true" className="ruk-logo" src={assets.logos.primary} />
            <span>Ruang Usaha Kita</span>
          </NavLink>
          <button
            aria-controls="main-navigation"
            aria-expanded="false"
            aria-label="Buka menu"
            className="navbar-toggler"
            data-bs-target="#main-navigation"
            data-bs-toggle="collapse"
            type="button"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse ruk-navbar-menu" id="main-navigation">
            <ul className="navbar-nav mx-lg-auto mb-3 mb-lg-0 gap-lg-1">
              {navLinks.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink className="nav-link ruk-nav-link" end={item.end} to={item.to}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="ruk-navbar-actions pt-2 pt-lg-0">
              <Button to={ROUTES.login} variant="outline">Masuk</Button>
              <Button to={ROUTES.register}>Daftar</Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
