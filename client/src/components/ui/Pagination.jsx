function Pagination({ currentPage = 1, totalPages = 1, onChange }) {
  return (
    <nav aria-label="Paginasi hasil" className="d-flex justify-content-center mt-4">
      <div className="btn-group">
        <button className="btn btn-outline-secondary" disabled={currentPage === 1} onClick={() => onChange(currentPage - 1)} type="button">
          Sebelumnya
        </button>
        <span className="btn btn-outline-secondary disabled">
          {currentPage} dari {totalPages}
        </span>
        <button className="btn btn-outline-secondary" disabled={currentPage === totalPages} onClick={() => onChange(currentPage + 1)} type="button">
          Berikutnya
        </button>
      </div>
    </nav>
  )
}

export default Pagination
