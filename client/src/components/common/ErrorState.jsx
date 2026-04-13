import Button from '../ui/Button'

function ErrorState({ title = 'Terjadi kendala saat memuat data', description = 'Coba lagi sebentar lagi.', actionLabel, actionTo }) {
  return (
    <div className="ruk-surface p-4 text-center">
      <h2 className="h5 fw-bold">{title}</h2>
      <p className="ruk-muted mb-3">{description}</p>
      {actionLabel && actionTo && <Button to={actionTo}>{actionLabel}</Button>}
    </div>
  )
}

export default ErrorState
