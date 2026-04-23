import { buildCreatorPath, buildServicePath } from '../../constants/routes'
import { useFavoriteStore } from '../../store/favoriteStore'
import { formatCurrency } from '../../utils/formatCurrency'
import { Link } from 'react-router-dom'

function CreatorCard({ creator }) {
  const favoriteIds = useFavoriteStore((state) => state.favoriteIds)
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite)
  const saved = favoriteIds.includes(creator.id)
  const primaryService = creator.services?.[0]
  const tags = [creator.niche, creator.city].filter(Boolean)

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 h-full">
      <button
        aria-label={saved ? `Hapus ${creator.name} dari favorit` : `Simpan ${creator.name} ke favorit`}
        className="absolute right-4 top-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-xl text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-[0_4px_20px_rgb(0,0,0,0.08)] focus:outline-none"
        onClick={() => toggleFavorite(creator.id)}
        type="button"
      >
        <span className={saved ? 'text-red-500' : ''}>★</span>
      </button>

      <div className="p-6 md:p-8 pb-6 flex-grow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
          <img alt={`Foto profil ${creator.name}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-sm ring-4 ring-gray-50 flex-shrink-0" src={creator.avatarUrl} />
          <div>
            <h3 className="text-xl font-bold text-ruk-navy line-clamp-1">{creator.name}</h3>
            <p className="text-sm font-semibold text-ruk-primary mt-1">{creator.niche}</p>
            <div className="flex items-center gap-1.5 mt-2 text-sm font-semibold text-gray-700">
              <span className="text-amber-400 text-base">★</span> {creator.ratingAvg} 
              <span className="text-gray-300 font-normal mx-1">|</span>
              <span className="text-gray-500 font-normal">{creator.reviewCount} ulasan</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-6 min-h-[44px]">
          {creator.shortBio}
        </p>

        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-xs font-bold text-teal-700" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 pt-0 mt-auto bg-gray-50/50">
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between mb-6">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Mulai dari</p>
          <span className="text-xl font-black text-ruk-navy">{formatCurrency(creator.priceFrom)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link to={buildCreatorPath(creator.slug)} className="w-full px-4 py-3 text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-ruk-navy text-center flex items-center justify-center rounded-xl font-bold transition-all shadow-sm">
            Profil
          </Link>
          <Link to={primaryService ? buildServicePath(primaryService.slug) : buildCreatorPath(creator.slug)} className="w-full px-4 py-3 text-sm bg-ruk-primary hover:bg-[#105c51] text-white text-center flex items-center justify-center rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(22,113,99,0.39)] hover:shadow-[0_6px_20px_rgba(22,113,99,0.23)]">
            Pilih Jasa
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CreatorCard
