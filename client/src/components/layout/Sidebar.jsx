import { NavLink } from 'react-router-dom'
import { dashboardMenu } from '../../constants/labels'

function Sidebar({ role = 'umkm' }) {
  return (
    <aside className="ruk-sidebar p-4">
      <h2 className="h5 fw-bold mb-4">Ruang Usaha Kita</h2>
      <nav aria-label={`Menu dashboard ${role}`}>
        <ul className="list-unstyled d-grid gap-2 mb-0">
          {dashboardMenu[role].map((item) => (
            <li key={item.to}>
              <NavLink end={item.to.endsWith(role)} to={item.to}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
