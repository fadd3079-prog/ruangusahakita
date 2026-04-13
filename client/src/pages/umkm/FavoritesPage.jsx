import EmptyState from '../../components/common/EmptyState'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import FavoriteList from '../../components/dashboard/FavoriteList'
import { creators } from '../../data/mockData'
import { useFavoriteStore } from '../../store/favoriteStore'

function FavoritesPage() {
  const favoriteIds = useFavoriteStore((state) => state.favoriteIds)
  const favoriteCreators = creators.filter((creator) => favoriteIds.includes(creator.id))

  return (
    <>
      <DashboardHeader description="Kembali ke kreator yang sudah kamu simpan." title="Kreator Favorit" />
      {favoriteCreators.length ? (
        <FavoriteList creators={favoriteCreators} />
      ) : (
        <EmptyState actionLabel="Cari kreator" actionTo="/cari-kreator" description="Simpan kreator dari halaman listing agar mudah ditemukan lagi." title="Belum ada kreator favorit" />
      )}
    </>
  )
}

export default FavoritesPage
