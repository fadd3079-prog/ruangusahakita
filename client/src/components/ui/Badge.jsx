import { classNames } from '../../utils/classNames'

function Badge({ children, tone = 'primary', className = '' }) {
  return (
    <span className={classNames('ruk-badge', `ruk-badge-${tone}`, className)}>
      {children}
    </span>
  )
}

export default Badge
