import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ActiveFilterChips from '../../components/marketplace/ActiveFilterChips'
import CreatorGrid from '../../components/marketplace/CreatorGrid'
import FilterDrawer from '../../components/marketplace/FilterDrawer'
import FilterPanel from '../../components/marketplace/FilterPanel'
import ResultSummary from '../../components/marketplace/ResultSummary'
import SearchBar from '../../components/marketplace/SearchBar'
import Button from '../../components/ui/Button'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import { creators as creatorData } from '../../data/mockData'
import { readFilters, writeFilters } from '../../utils/queryParams'

const emptyFilters = { q: '', niche: '', city: '', price: '', platform: '', rating: '' }

function CreatorListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => readFilters(searchParams))
  const [loading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const creators = useMemo(() => {
    return creatorData.filter((creator) => {
      const target = `${creator.name} ${creator.niche} ${creator.city} ${creator.shortBio}`.toLowerCase()
      const [minPrice, maxPrice] = filters.price ? filters.price.split('-').map(Number) : [0, Number.MAX_SAFE_INTEGER]

      return (
        (!filters.q || target.includes(filters.q.toLowerCase())) &&
        (!filters.niche || creator.niche === filters.niche) &&
        (!filters.city || creator.city === filters.city) &&
        (!filters.platform || creator.platforms.includes(filters.platform)) &&
        (!filters.rating || creator.ratingAvg >= Number(filters.rating)) &&
        creator.priceFrom >= minPrice &&
        creator.priceFrom <= maxPrice
      )
    })
  }, [filters])

  const updateFilters = (nextFilters) => {
    setFilters(nextFilters)
    setSearchParams(writeFilters(nextFilters), { replace: true })
  }

  const submitSearch = (event) => {
    event.preventDefault()
  }

  const removeFilter = (key) => updateFilters({ ...filters, [key]: '' })
  const resetFilters = () => updateFilters(emptyFilters)

  return (
    <section className="ruk-section-compact ruk-listing-page">
      <div className="container">
        <div className="ruk-page-header ruk-listing-header">
          <h1 className="fw-bold">Cari Kreator</h1>
          <p className="lead ruk-muted mb-0">Temukan kreator yang sesuai dengan kebutuhan promosimu.</p>
        </div>
        <div className="row g-4">
          <div className="col-lg-3 d-none d-lg-block">
            <FilterPanel filters={filters} onChange={updateFilters} onReset={resetFilters} />
          </div>
          <div className="col-lg-9">
            <div className="d-grid gap-3 mb-4 ruk-listing-controls">
              <SearchBar onChange={(value) => updateFilters({ ...filters, q: value })} onSubmit={submitSearch} value={filters.q} />
              <div className="d-flex d-lg-none">
                <Button className="w-100" onClick={() => setDrawerOpen(true)} variant="outline">Filter</Button>
              </div>
              <ActiveFilterChips filters={filters} onRemove={removeFilter} />
              <ResultSummary count={creators.length} />
            </div>
            {loading ? <LoadingSkeleton lines={8} /> : <CreatorGrid creators={creators} />}
          </div>
        </div>
      </div>
      <FilterDrawer
        filters={filters}
        onChange={updateFilters}
        onClose={() => setDrawerOpen(false)}
        onReset={resetFilters}
        open={drawerOpen}
      />
    </section>
  )
}

export default CreatorListingPage
