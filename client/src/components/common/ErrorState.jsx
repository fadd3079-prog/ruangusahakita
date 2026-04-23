import Button from '../ui/Button'

function ErrorState({ title = 'Terjadi kendala saat memuat data', description = 'Coba lagi sebentar lagi.', actionLabel, actionTo }) {
  return (
    <div className="bg-red-50 rounded-2xl border border-red-100 p-10 text-center shadow-sm">
      <h2 className="text-xl font-bold text-red-900 mb-2">{title}</h2>
      <p className="text-red-700 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && actionTo && <Button to={actionTo} className="!bg-red-600 hover:!bg-red-700">{actionLabel}</Button>}
    </div>
  )
}

export default ErrorState
