import Card from '../ui/Card'

function CreatorStats({ creator }) {
  const stats = [
    { label: 'Rating', value: creator.ratingAvg },
    { label: 'Ulasan', value: creator.reviewCount },
    { label: 'Layanan aktif', value: creator.services.length },
  ]

  return (
    <div className="ruk-grid ruk-grid-3 ruk-creator-stats">
      {stats.map((stat) => (
        <Card className="ruk-stat-card" key={stat.label}>
          <p className="ruk-muted mb-1">{stat.label}</p>
          <p className="h4 fw-bold mb-0">{stat.value}</p>
        </Card>
      ))}
    </div>
  )
}

export default CreatorStats
