import { formatCurrency } from '../../utils/formatCurrency'

function PriceTag({ value, prefix = 'Harga mulai' }) {
  return (
    <span className="fw-bold">
      <span className="ruk-muted fw-semibold">{prefix} </span>
      {formatCurrency(value)}
    </span>
  )
}

export default PriceTag
