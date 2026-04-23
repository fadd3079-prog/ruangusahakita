import Button from '../ui/Button'
import Card from '../ui/Card'

function NextActionCard({ title, description, actionLabel, to }) {
  return (
    <Card className="!p-8 bg-gradient-to-br from-slate-50 to-white border-slate-100">
      <h2 className="text-xl font-bold text-ruk-navy mb-2">{title}</h2>
      <p className="text-slate-500 font-medium mb-6">{description}</p>
      <Button to={to}>{actionLabel}</Button>
    </Card>
  )
}

export default NextActionCard
