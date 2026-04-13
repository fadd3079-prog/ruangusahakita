import Card from '../ui/Card'

function DashboardStatCard({ label, value, description }) {
  return (
    <Card>
      <p className="ruk-muted mb-1">{label}</p>
      <p className="h3 fw-bold mb-1">{value}</p>
      {description && <p className="small ruk-muted mb-0">{description}</p>}
    </Card>
  )
}

export default DashboardStatCard
