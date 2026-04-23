import { ROUTES } from '../../constants/routes'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import PriceTag from '../ui/PriceTag'
import RatingStars from '../ui/RatingStars'
import FavoriteButton from './FavoriteButton'

function CreatorHero({ creator }) {
  return (
    <section className="bg-gradient-to-b from-white to-[#f8fafc] border-b border-gray-100 pb-12 pt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white bg-white">
          <div className="h-48 md:h-72 lg:h-80 w-full overflow-hidden relative group">
            <div className="absolute inset-0 bg-ruk-navy/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
            <img alt={`Banner ${creator.name}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={creator.bannerUrl} />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
          </div>
          <div className="p-8 md:p-12 relative z-20 bg-white rounded-t-[2.5rem] -mt-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-end -mt-24 md:-mt-32">
                <div className="rounded-full p-2 bg-white shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-50 relative z-30">
                  <Avatar alt={`Foto ${creator.name}`} size={160} src={creator.avatarUrl} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-slate-50" />
                </div>
                <div className="pt-2 md:pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-xs font-bold text-teal-700 shadow-sm border border-teal-100">{creator.niche}</span>
                    {creator.platforms.map((platform) => (
                      <span key={platform} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200 shadow-sm">{platform}</span>
                    ))}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-ruk-navy mb-3 tracking-tight">{creator.name}</h1>
                  <p className="text-slate-500 mb-6 font-medium text-lg max-w-2xl">{creator.city} • {creator.shortBio}</p>
                  <div className="flex flex-wrap gap-5 items-center bg-slate-50 rounded-2xl px-5 py-3 w-fit border border-slate-100">
                    <RatingStars count={creator.reviewCount} value={creator.ratingAvg} />
                    <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
                    <PriceTag value={creator.priceFrom} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-6 lg:mt-0">
                <FavoriteButton creatorId={creator.id} />
                <Button className="w-full sm:w-auto px-10 shadow-[0_4px_14px_0_rgba(22,113,99,0.39)]" to={ROUTES.newBrief}>Ajukan kerja sama</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreatorHero
