import { NavLink } from 'react-router-dom'
import { dashboardMenu } from '../../constants/labels'

function Topbar({ role = 'umkm' }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Dashboard</p>
            <h1 className="text-xl font-black text-ruk-navy tracking-tight">{role === 'umkm' ? 'UMKM' : 'Kreator'}</h1>
          </div>
          <nav aria-label="Menu cepat dashboard" className="hidden md:flex gap-3 flex-wrap">
            {dashboardMenu[role].slice(0, 4).map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to}
                className={({ isActive }) => 
                  `px-4 py-2 text-sm font-bold rounded-lg transition-all shadow-sm border ${
                    isActive 
                      ? 'bg-ruk-primary text-white border-ruk-primary shadow-[0_4px_14px_0_rgba(22,113,99,0.39)]' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Topbar
