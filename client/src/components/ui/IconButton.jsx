import { classNames } from '../../utils/classNames'

function IconButton({ label, children, className = '', ...props }) {
  return (
    <button
      aria-label={label}
      className={classNames('btn ruk-btn ruk-btn-outline px-3', className)}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton
