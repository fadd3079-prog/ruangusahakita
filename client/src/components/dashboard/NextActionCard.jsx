import Button from '../ui/Button'
import Card from '../ui/Card'

function NextActionCard({ title, description, actionLabel, to }) {
  return (
    <Card>
      <h2 className="h5 fw-bold">{title}</h2>
      <p className="ruk-muted">{description}</p>
      <Button to={to}>{actionLabel}</Button>
    </Card>
  )
}

export default NextActionCard
