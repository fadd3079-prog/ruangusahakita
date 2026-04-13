function Textarea({ id, label, helperText, error, rows = 4, ...props }) {
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold" htmlFor={id}>
        {label}
      </label>
      <textarea
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={Boolean(error)}
        className="form-control ruk-textarea"
        id={id}
        rows={rows}
        {...props}
      />
      {helperText && <div className="form-text" id={helperId}>{helperText}</div>}
      {error && <div className="text-danger small mt-1" id={errorId}>{error}</div>}
    </div>
  )
}

export default Textarea
