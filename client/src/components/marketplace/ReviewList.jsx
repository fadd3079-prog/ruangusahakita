import RatingStars from '../ui/RatingStars'

function ReviewList({ reviews }) {
  return (
    <div className="d-grid gap-3">
      {reviews.map((review) => (
        <article className="ruk-surface p-3" key={review.id}>
          <div className="d-flex justify-content-between gap-3">
            <h3 className="h6 fw-bold mb-1">{review.reviewerName}</h3>
            <RatingStars value={review.rating} />
          </div>
          <p className="ruk-muted mb-0">{review.comment}</p>
        </article>
      ))}
    </div>
  )
}

export default ReviewList
