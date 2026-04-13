import Button from '../ui/Button'

function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="ruk-surface p-4 text-center">
      <div aria-hidden="true" className="fs-1 mb-2">○</div>
      <h2 className="h5 fw-bold">{title}</h2>
      <p className="ruk-muted mb-3">{description}</p>
      {actionLabel && actionTo && (
        <Button to={actionTo} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
