import { Link } from 'react-router-dom'

function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="breadcrumb mb-0">
        {items.map((item, index) => (
          <li
            className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}
            key={item.label}
          >
            {item.to && index !== items.length - 1 ? <Link to={item.to}>{item.label}</Link> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
