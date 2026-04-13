import { Outlet, useLocation } from 'react-router-dom'
import ToastAlert from '../components/common/ToastAlert'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

function getRoleFromPath(pathname) {
  return pathname.includes('/dashboard/kreator') ? 'creator' : 'umkm'
}

function DashboardLayout() {
  const location = useLocation()
  const role = getRoleFromPath(location.pathname)

  return (
    <div className="ruk-dashboard-shell">
      <Sidebar role={role} />
      <div>
        <Topbar role={role} />
        <main className="container-fluid py-4">
          <Outlet />
        </main>
      </div>
      <ToastAlert />
    </div>
  )
}

export default DashboardLayout
