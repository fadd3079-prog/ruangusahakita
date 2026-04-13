import { Link, Outlet } from 'react-router-dom'
import ToastAlert from '../components/common/ToastAlert'
import { ROUTES } from '../constants/routes'

function AuthLayout() {
  return (
    <main className="min-vh-100 d-flex align-items-center py-5 bg-light">
      <div className="container">
        <Link className="fw-bold d-inline-flex mb-4" to={ROUTES.home}>
          Ruang Usaha Kita
        </Link>
        <Outlet />
      </div>
      <ToastAlert />
    </main>
  )
}

export default AuthLayout
