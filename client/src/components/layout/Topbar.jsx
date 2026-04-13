import { NavLink } from 'react-router-dom'
import { dashboardMenu } from '../../constants/labels'

function Topbar({ role = 'umkm' }) {
  return (
    <header className="bg-white border-bottom sticky-top">
      <div className="container-fluid py-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div>
            <p className="small ruk-muted mb-0">Dashboard</p>
            <h1 className="h5 fw-bold mb-0">{role === 'umkm' ? 'UMKM' : 'Kreator'}</h1>
          </div>
          <nav aria-label="Menu cepat dashboard" className="d-none d-md-flex gap-2 flex-wrap">
            {dashboardMenu[role].slice(0, 4).map((item) => (
              <NavLink className="btn btn-sm btn-outline-secondary" key={item.to} to={item.to}>
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
