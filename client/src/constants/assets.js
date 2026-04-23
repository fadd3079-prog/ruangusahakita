import logoPrimary from '../assets/images/logo.png'
import logoWhite from '../assets/images/logo-putih-kecil.png'
import heroUmkm from '../assets/images/photo/umkm.webp'
import aiAssistant from '../assets/images/photo/artificialintelligence.webp'
import aiAnalytics from '../assets/images/photo/artificialintelligence1.webp'
import bannerLifestyle from '../assets/images/photo/marketing.webp'
import bannerBeauty from '../assets/images/photo/digitalmerketing.webp'
import avatarNadia from '../assets/images/profile/female-1.webp'
import avatarArya from '../assets/images/profile/avatar-4.webp'
import avatarMira from '../assets/images/profile/avatar-8.webp'
import portfolioKuliner from '../assets/images/portfolio/portfolio-1.webp'
import portfolioLifestyle from '../assets/images/portfolio/portfolio-10.webp'
import portfolioBeauty from '../assets/images/portfolio/portfolio-21.webp'

export const assets = {
  logos: {
    primary: logoPrimary,
    white: logoWhite,
  },
  photos: {
    heroUmkm,
    aiAssistant,
    aiAnalytics,
    bannerKuliner: heroUmkm,
    bannerLifestyle,
    bannerBeauty,
  },
  avatars: {
    nadia: avatarNadia,
    arya: avatarArya,
    mira: avatarMira,
  },
  portfolio: {
    kuliner: portfolioKuliner,
    lifestyle: portfolioLifestyle,
    beauty: portfolioBeauty,
  },
}

export const brandLogo = assets.logos.primary
export const logoAsset = assets.logos.primary
export const heroImage = assets.photos.heroUmkm
export const placeholderImage = assets.photos.heroUmkm

export const getAssetByName = (name) => {
  if (!name) return ''

  const lowerName = name.toLowerCase()

  const flatAssets = {
    logo: assets.logos.primary,
    heroumkm: assets.photos.heroUmkm,
    bannerkuliner: assets.photos.bannerKuliner,
    bannerlifestyle: assets.photos.bannerLifestyle,
    bannerbeauty: assets.photos.bannerBeauty,
    nadia: assets.avatars.nadia,
    arya: assets.avatars.arya,
    mira: assets.avatars.mira,
    kuliner: assets.portfolio.kuliner,
    lifestyle: assets.portfolio.lifestyle,
    beauty: assets.portfolio.beauty,
  }

  return flatAssets[lowerName] || ''
}

export default assets
