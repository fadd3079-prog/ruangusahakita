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
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Topbar role={role} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastAlert />
    </div>
  )
}

export default DashboardLayout
