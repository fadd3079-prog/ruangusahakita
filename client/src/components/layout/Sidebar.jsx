import { NavLink } from 'react-router-dom'
import { dashboardMenu } from '../../constants/labels'
import { assets } from '../../constants/assets'
import { ROUTES } from '../../constants/routes'
import { Link } from 'react-router-dom'

function Sidebar({ role = 'umkm' }) {
  return (
    <aside className="w-64 bg-ruk-navy text-white flex-shrink-0 border-r border-slate-800 hidden lg:flex lg:flex-col relative z-20 shadow-xl">
      <div className="p-6 border-b border-white/10">
        <Link className="flex items-center gap-3 font-black text-lg tracking-tight hover:text-teal-300 transition-colors" to={ROUTES.home}>
          <img alt="Logo" className="h-8 w-auto" src={assets.logos.white} />
          Ruang Usaha Kita
        </Link>
      </div>
      <nav aria-label={`Menu dashboard ${role}`} className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-1">
          {dashboardMenu[role].map((item) => (
            <li key={item.to}>
              <NavLink 
                end={item.to.endsWith(role)} 
                to={item.to}
                className={({ isActive }) => 
                  `block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20 shadow-sm' 
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10 text-xs font-medium text-slate-500 text-center">
        © 2026 Ruang Usaha Kita
      </div>
    </aside>
  )
}

export default Sidebar
