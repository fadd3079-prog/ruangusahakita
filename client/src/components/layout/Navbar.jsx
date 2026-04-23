import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../constants/assets'
import { ROUTES } from '../../constants/routes'
import { classNames } from '../../utils/classNames'
import Button from '../ui/Button'

const navLinks = [
  { label: 'Home', to: ROUTES.home, end: true },
  { label: 'Cari Kreator', to: ROUTES.creators },
  { label: 'Solusi Bisnis', to: ROUTES.howItWorks },
  { label: 'Paket', to: ROUTES.about },
  { label: 'Edukasi', to: ROUTES.help },
  { label: 'FAQ', to: ROUTES.faq },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-ruk-navy/85 backdrop-blur-xl shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-20 md:h-24">
          <NavLink className="flex items-center gap-3 shrink-0 group" onClick={() => setIsOpen(false)} to={ROUTES.home}>
            <img alt="Logo" className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" src={assets.logos.white} />
            <span className="text-white font-black text-xl hidden sm:block tracking-tight">Ruang Usaha Kita</span>
          </NavLink>
          
          <div className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8">
            <nav className="flex gap-2">
              {navLinks.map((item) => (
                <NavLink 
                  key={item.to} 
                  end={item.end} 
                  to={item.to}
                  className={({ isActive }) => classNames(
                    'px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200',
                    isActive ? 'bg-white/10 text-white shadow-inner' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-4 ml-2 xl:ml-6 border-l border-white/10 pl-6 xl:pl-8">
              <Button onClick={() => setIsOpen(false)} to={ROUTES.login} className="!bg-transparent !px-6 border-none text-white hover:text-teal-300" variant="outline">Masuk</Button>
              <Button onClick={() => setIsOpen(false)} to={ROUTES.register} className="!bg-white !text-ruk-navy !rounded-full !px-8 hover:!bg-teal-50 shadow-[0_4px_14px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.3)]">Daftar</Button>
            </div>
          </div>

          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/80 hover:text-white p-2 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg"
              type="button"
              aria-label="Toggle menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-ruk-navy/95 backdrop-blur-2xl border-t border-white/10 absolute w-full shadow-2xl">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                end={item.end}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => classNames(
                  'block px-4 py-3.5 rounded-xl text-base font-semibold transition-colors',
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-8 flex flex-col gap-4 pt-6 border-t border-white/10">
              <Button onClick={() => setIsOpen(false)} to={ROUTES.login} className="w-full !bg-white/5 border-white/10 text-white hover:!bg-white/10 !rounded-xl" variant="outline">Masuk</Button>
              <Button onClick={() => setIsOpen(false)} to={ROUTES.register} className="w-full !bg-white !text-ruk-navy !rounded-xl">Daftar</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
