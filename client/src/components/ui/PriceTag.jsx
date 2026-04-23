import { formatCurrency } from '../../utils/formatCurrency'

function PriceTag({ value, prefix = 'Harga mulai' }) {
  return (
    <span className="font-extrabold">
      <span className="ruk-muted font-semibold">{prefix} </span>
      <span className="text-ruk-price">{formatCurrency(value)}</span>
    </span>
  )
}

export default PriceTag
