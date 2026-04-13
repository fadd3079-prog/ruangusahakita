export function readFilters(searchParams) {
  return {
    q: searchParams.get('q') || '',
    niche: searchParams.get('niche') || '',
    city: searchParams.get('city') || '',
    price: searchParams.get('price') || '',
    platform: searchParams.get('platform') || '',
    rating: searchParams.get('rating') || '',
  }
}

export function writeFilters(filters) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })

  return params
}
