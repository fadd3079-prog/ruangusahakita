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
  const classes = classNames('ruk-btn', `ruk-btn-${variant}`, className)

  if (to) {
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
