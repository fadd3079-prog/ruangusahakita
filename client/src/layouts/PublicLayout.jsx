import { Outlet } from 'react-router-dom'
import ToastAlert from '../components/common/ToastAlert'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="ruk-page-shell">
        <Outlet />
      </main>
      <Footer />
      <ToastAlert />
    </>
  )
}

export default PublicLayout
