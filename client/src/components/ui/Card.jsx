import { classNames } from '../../utils/classNames'

function Card({ children, className = '', body = true }) {
  return (
    <article className={classNames('ruk-card', className)}>
      {body ? <div className="ruk-card-body">{children}</div> : children}
    </article>
  )
}

export default Card
