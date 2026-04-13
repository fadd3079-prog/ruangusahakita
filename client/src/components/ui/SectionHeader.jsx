function SectionHeader({ eyebrow, title, description, align = 'start' }) {
  return (
    <div className={`mb-4 text-${align}`}>
      {eyebrow && <p className="text-uppercase small fw-bold ruk-hero-eyebrow mb-2">{eyebrow}</p>}
      <h2 className="fw-bold mb-2">{title}</h2>
      {description && <p className="ruk-muted mb-0">{description}</p>}
    </div>
  )
}

export default SectionHeader
