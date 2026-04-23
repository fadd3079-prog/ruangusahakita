import { Link, Outlet } from 'react-router-dom'
import ToastAlert from '../components/common/ToastAlert'
import { ROUTES } from '../constants/routes'
import { assets } from '../constants/assets'

function AuthLayout() {
  return (
    <main className="min-h-screen flex items-center justify-center py-12 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50 via-slate-50 to-slate-50 opacity-80 pointer-events-none"></div>
      <div className="container mx-auto px-4 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link className="inline-flex items-center gap-3 font-black text-2xl text-ruk-navy tracking-tight hover:opacity-90 transition-opacity" to={ROUTES.home}>
            <img alt="Logo" className="h-10 w-auto" src={assets.logos.primary} />
            Ruang Usaha Kita
          </Link>
        </div>
        <Outlet />
      </div>
      <ToastAlert />
    </main>
  )
}

export default AuthLayout
