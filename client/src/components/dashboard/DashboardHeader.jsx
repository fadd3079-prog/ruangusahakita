function DashboardHeader({ title, description, action }) {
  return (
    <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
      <div>
        <h1 className="fw-bold">{title}</h1>
        {description && <p className="ruk-muted mb-0">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export default DashboardHeader
