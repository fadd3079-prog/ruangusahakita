import { classNames } from '../../utils/classNames'

function IconButton({ label, children, className = '', ...props }) {
  return (
    <button
      aria-label={label}
      className={classNames('inline-flex items-center justify-center p-2 rounded-xl text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-ruk-navy focus:outline-none focus:ring-2 focus:ring-ruk-primary/20 transition-all', className)}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton
