function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700">
      {children}
      {onRemove && (
        <button aria-label={`Hapus filter ${children}`} className="text-slate-400 hover:text-ruk-danger focus:outline-none transition-colors" onClick={onRemove} type="button">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
    </span>
  )
}

export default Chip
