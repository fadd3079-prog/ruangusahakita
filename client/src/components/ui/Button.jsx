import { Link } from 'react-router-dom'
import { classNames } from '../../utils/classNames'

function Button({
  children,
  to,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0'
  
  const variants = {
    primary: 'bg-ruk-primary hover:bg-[#105c51] text-white focus:ring-ruk-primary/30 shadow-[0_4px_14px_0_rgba(22,113,99,0.39)] hover:shadow-[0_6px_20px_rgba(22,113,99,0.23)] px-6 py-3',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-ruk-navy focus:ring-slate-200/50 shadow-sm px-6 py-3',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-200/50 px-6 py-3',
  }

  const classes = classNames(baseClasses, variants[variant], className)

  if (to) {
    if (to.startsWith('#')) {
      return (
        <a className={classes} href={to} {...props}>
          {children}
        </a>
      )
    }
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  )
}

export default Button
