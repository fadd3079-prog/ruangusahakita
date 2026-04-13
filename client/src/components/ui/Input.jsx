function Input({ id, label, helperText, error, ...props }) {
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold" htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={Boolean(error)}
        className="form-control ruk-input"
        id={id}
        {...props}
      />
      {helperText && <div className="form-text" id={helperId}>{helperText}</div>}
      {error && <div className="text-danger small mt-1" id={errorId}>{error}</div>}
    </div>
  )
}

export default Input
