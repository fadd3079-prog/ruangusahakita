export const ROUTES = {
  home: '/',
  about: '/tentang',
  howItWorks: '/cara-kerja',
  creators: '/cari-kreator',
  creatorDetail: '/kreator/:creatorSlug',
  serviceDetail: '/layanan/:serviceSlug',
  help: '/bantuan',
  faq: '/faq',
  login: '/masuk',
  register: '/daftar',
  roleSelect: '/daftar/pilih-peran',
  forgotPassword: '/lupa-kata-sandi',
  umkmDashboard: '/dashboard/umkm',
  umkmProfile: '/dashboard/umkm/profil-usaha',
  umkmFavorites: '/dashboard/umkm/favorit',
  umkmRequests: '/dashboard/umkm/permintaan',
  umkmRequestDetail: '/dashboard/umkm/permintaan/:requestId',
  umkmSettings: '/dashboard/umkm/pengaturan',
  newBrief: '/dashboard/umkm/brief/baru',
  creatorDashboard: '/dashboard/kreator',
  creatorProfile: '/dashboard/kreator/profil',
  creatorServices: '/dashboard/kreator/layanan',
  creatorAddService: '/dashboard/kreator/layanan/tambah',
  creatorEditService: '/dashboard/kreator/layanan/:serviceId/edit',
  creatorPortfolio: '/dashboard/kreator/portofolio',
  creatorAddPortfolio: '/dashboard/kreator/portofolio/tambah',
  creatorEditPortfolio: '/dashboard/kreator/portofolio/:portfolioId/edit',
  creatorRequests: '/dashboard/kreator/permintaan',
  creatorRequestDetail: '/dashboard/kreator/permintaan/:requestId',
  creatorSettings: '/dashboard/kreator/pengaturan',
  notFound: '/404',
  maintenance: '/maintenance',
}

export const buildCreatorPath = (slug) => `/kreator/${slug}`
export const buildServicePath = (slug) => `/layanan/${slug}`
export const buildUmkmRequestPath = (id) => `/dashboard/umkm/permintaan/${id}`
export const buildCreatorRequestPath = (id) => `/dashboard/kreator/permintaan/${id}`
export const buildCreatorServiceEditPath = (id) => `/dashboard/kreator/layanan/${id}/edit`
export const buildCreatorPortfolioEditPath = (id) => `/dashboard/kreator/portofolio/${id}/edit`
