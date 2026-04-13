function RatingStars({ value, count }) {
  return (
    <span aria-label={`Rating ${value} dari 5`} className="d-inline-flex align-items-center gap-1 fw-semibold">
      <span aria-hidden="true" className="text-warning">★</span>
      <span>{value}</span>
      {count !== undefined && <span className="ruk-muted fw-normal">({count})</span>}
    </span>
  )
}

export default RatingStars
