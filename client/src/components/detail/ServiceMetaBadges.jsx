function ServiceMetaBadges({ service }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      <span className="ruk-badge ruk-badge-info">{service.deliveryDays} hari</span>
      <span className="ruk-badge ruk-badge-warning">{service.revisionCount} revisi</span>
      {service.platforms.map((platform) => <span className="ruk-badge ruk-badge-muted" key={platform}>{platform}</span>)}
    </div>
  )
}

export default ServiceMetaBadges
