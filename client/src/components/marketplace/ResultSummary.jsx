function ResultSummary({ count }) {
  return (
    <p className="fw-semibold mb-0 ruk-result-summary">
      {count} kreator ditemukan
      <span className="ruk-muted fw-normal">. Gunakan filter untuk mempersempit pilihan.</span>
    </p>
  )
}

export default ResultSummary
