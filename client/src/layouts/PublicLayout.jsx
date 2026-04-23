import { Outlet } from 'react-router-dom'
import ToastAlert from '../components/common/ToastAlert'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col bg-white">
        <Outlet />
      </main>
      <Footer />
      <ToastAlert />
    </div>
  )
}

export default PublicLayout
