function Chip({ children, onRemove }) {
  return (
    <span className="ruk-chip">
      {children}
      {onRemove && (
        <button aria-label={`Hapus filter ${children}`} className="btn-close btn-close-sm" onClick={onRemove} type="button" />
      )}
    </span>
  )
}

export default Chip
