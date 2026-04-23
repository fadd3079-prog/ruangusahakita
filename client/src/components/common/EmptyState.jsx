import Button from '../ui/Button'

function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
      <div aria-hidden="true" className="text-4xl text-gray-300 mb-4">○</div>
      <h2 className="text-xl font-bold text-ruk-navy mb-2">{title}</h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && actionTo && (
        <Button to={actionTo} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
