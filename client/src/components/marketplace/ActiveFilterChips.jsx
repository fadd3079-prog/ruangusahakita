import { priceOptions, ratingOptions } from '../../constants/filters'
import Chip from '../ui/Chip'

function labelFor(key, value) {
  if (key === 'price') return priceOptions.find((item) => item.value === value)?.label || value
  if (key === 'rating') return ratingOptions.find((item) => item.value === value)?.label || value
  return value
}

function ActiveFilterChips({ filters, onRemove }) {
  const entries = Object.entries(filters).filter(([, value]) => Boolean(value))

  if (!entries.length) return null

  return (
    <div className="d-flex flex-wrap gap-2 ruk-active-filters">
      {entries.map(([key, value]) => (
        <Chip key={key} onRemove={() => onRemove(key)}>
          {labelFor(key, value)}
        </Chip>
      ))}
    </div>
  )
}

export default ActiveFilterChips
