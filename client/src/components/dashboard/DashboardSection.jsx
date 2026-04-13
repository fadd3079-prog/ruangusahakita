function DashboardSection({ title, children, action }) {
  return (
    <section className="ruk-surface p-4">
      <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
        <h2 className="h5 fw-bold mb-0">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export default DashboardSection
