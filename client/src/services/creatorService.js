import { creators } from '../data/mockData'

function matchesText(creator, keyword) {
  const target = `${creator.name} ${creator.niche} ${creator.city} ${creator.shortBio}`.toLowerCase()
  return target.includes(keyword.toLowerCase())
}

function matchesPrice(creator, priceRange) {
  if (!priceRange) return true
  const [min, max] = priceRange.split('-').map(Number)
  return creator.priceFrom >= min && creator.priceFrom <= max
}

export const creatorService = {
  async getCreators(filters = {}) {
    const data = creators.filter((creator) => {
      const keywordMatch = !filters.q || matchesText(creator, filters.q)
      const nicheMatch = !filters.niche || creator.niche === filters.niche
      const cityMatch = !filters.city || creator.city === filters.city
      const platformMatch = !filters.platform || creator.platforms.includes(filters.platform)
      const ratingMatch = !filters.rating || creator.ratingAvg >= Number(filters.rating)

      return keywordMatch && nicheMatch && cityMatch && platformMatch && ratingMatch && matchesPrice(creator, filters.price)
    })

    return Promise.resolve(data)
  },

  async getCreatorBySlug(slug) {
    return Promise.resolve(creators.find((creator) => creator.slug === slug) || null)
  },
}
