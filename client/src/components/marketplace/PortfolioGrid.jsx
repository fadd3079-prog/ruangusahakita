function PortfolioGrid({ items }) {
  return (
    <div className="ruk-grid ruk-grid-3">
      {items.map((item) => (
        <article className="ruk-card ruk-portfolio-item" key={item.id}>
          <img alt={item.title} src={item.thumbnailUrl} />
          <div className="ruk-card-body">
            <p className="small fw-bold ruk-hero-eyebrow mb-1">{item.platform} • {item.category}</p>
            <h3 className="h6 fw-bold">{item.title}</h3>
            <p className="small ruk-muted mb-0">{item.caption}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

export default PortfolioGrid
