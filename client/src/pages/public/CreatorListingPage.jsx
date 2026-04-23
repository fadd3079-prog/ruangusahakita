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
import { nicheOptions } from '../../constants/filters'
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
  const featuredNiches = ['', ...nicheOptions.slice(0, 5)]

  return (
    <section className="min-h-screen bg-gray-50 pb-20 pt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-10 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-ruk-navy tracking-tight">Temukan Jasa Promosi Terbaik</h1>
          <p className="mt-4 text-lg text-gray-600">Bandingkan harga, ulasan, dan portofolio dengan transparan.</p>
        </div>

        <div className="mb-10 flex flex-col gap-6">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {featuredNiches.map((niche) => (
              <button
                className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-bold transition-colors border ${filters.niche === niche ? 'bg-ruk-navy text-white border-ruk-navy' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 shadow-sm'}`}
                key={niche || 'all'}
                onClick={() => updateFilters({ ...filters, niche })}
                type="button"
              >
                {niche || 'Semua Kategori'}
              </button>
            ))}
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
            <SearchBar onChange={(value) => updateFilters({ ...filters, q: value })} onSubmit={submitSearch} value={filters.q} />
            <div className="mt-4 block lg:hidden">
              <Button className="w-full bg-gray-50 text-gray-700 border border-gray-200" onClick={() => setDrawerOpen(true)} variant="outline">Filter lengkap</Button>
            </div>
            <div className="mt-4">
              <ActiveFilterChips filters={filters} onRemove={removeFilter} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <FilterPanel filters={filters} onChange={updateFilters} onReset={resetFilters} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-6 pb-4 border-b border-gray-200">
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
