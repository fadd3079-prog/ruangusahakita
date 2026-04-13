function LoadingSkeleton({ lines = 3 }) {
  return (
    <div aria-label="Memuat data" aria-live="polite" className="d-grid gap-2" role="status">
      {Array.from({ length: lines }).map((_, index) => (
        <div className="ruk-skeleton" key={index} style={{ width: `${100 - index * 12}%` }} />
      ))}
    </div>
  )
}

export default LoadingSkeleton
