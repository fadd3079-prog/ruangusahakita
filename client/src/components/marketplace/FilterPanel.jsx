import { cityOptions, nicheOptions, platformOptions, priceOptions, ratingOptions } from '../../constants/filters'
import Button from '../ui/Button'
import Select from '../ui/Select'

function FilterPanel({ filters, onChange, onReset }) {
  const setFilter = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <aside className="space-y-6">
      <h2 className="text-lg font-extrabold text-ruk-navy">Filter kreator</h2>
      <div className="space-y-4">
        <Select id="filter-niche" label="Niche" onChange={(event) => setFilter('niche', event.target.value)} value={filters.niche}>
          <option value="">Semua niche</option>
          {nicheOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </Select>
        <Select id="filter-city" label="Lokasi" onChange={(event) => setFilter('city', event.target.value)} value={filters.city}>
          <option value="">Semua kota</option>
          {cityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </Select>
        <Select id="filter-price" label="Kisaran harga" onChange={(event) => setFilter('price', event.target.value)} value={filters.price}>
          <option value="">Semua harga</option>
          {priceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
        <Select id="filter-platform" label="Platform utama" onChange={(event) => setFilter('platform', event.target.value)} value={filters.platform}>
          <option value="">Semua platform</option>
          {platformOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </Select>
        <Select id="filter-rating" label="Rating minimal" onChange={(event) => setFilter('rating', event.target.value)} value={filters.rating}>
          <option value="">Semua rating</option>
          {ratingOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </div>
      <Button className="w-full mt-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors" onClick={onReset} variant="outline">
        Reset filter
      </Button>
    </aside>
  )
}

export default FilterPanel
