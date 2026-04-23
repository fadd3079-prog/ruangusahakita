function Pagination({ currentPage = 1, totalPages = 1, onChange }) {
  return (
    <nav aria-label="Paginasi hasil" className="flex justify-center mt-8">
      <div className="inline-flex rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button className="px-4 py-2 text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50 hover:text-ruk-navy disabled:opacity-50 disabled:cursor-not-allowed border-r border-slate-200 transition-colors" disabled={currentPage === 1} onClick={() => onChange(currentPage - 1)} type="button">
          Sebelumnya
        </button>
        <span className="px-4 py-2 text-sm font-bold bg-slate-50 text-ruk-navy border-r border-slate-200">
          {currentPage} dari {totalPages}
        </span>
        <button className="px-4 py-2 text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50 hover:text-ruk-navy disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={currentPage === totalPages} onClick={() => onChange(currentPage + 1)} type="button">
          Berikutnya
        </button>
      </div>
    </nav>
  )
}

export default Pagination
