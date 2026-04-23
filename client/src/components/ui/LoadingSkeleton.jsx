function LoadingSkeleton({ lines = 3 }) {
  return (
    <div aria-label="Memuat data" aria-live="polite" className="flex flex-col gap-3" role="status">
      {Array.from({ length: lines }).map((_, index) => (
        <div className="h-4 rounded-full bg-slate-200 animate-pulse" key={index} style={{ width: `${100 - index * 12}%` }} />
      ))}
    </div>
  )
}

export default LoadingSkeleton
