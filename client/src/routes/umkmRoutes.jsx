import { Route } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import FavoritesPage from '../pages/umkm/FavoritesPage'
import NewBriefPage from '../pages/umkm/NewBriefPage'
import RequestDetailPage from '../pages/umkm/RequestDetailPage'
import RequestsPage from '../pages/umkm/RequestsPage'
import UmkmDashboardPage from '../pages/umkm/UmkmDashboardPage'
import UmkmProfilePage from '../pages/umkm/UmkmProfilePage'
import UmkmSettingsPage from '../pages/umkm/UmkmSettingsPage'
import { ROUTES } from '../constants/routes'

export const umkmRoutes = (
  <Route element={<DashboardLayout />}>
    <Route element={<UmkmDashboardPage />} path={ROUTES.umkmDashboard} />
    <Route element={<UmkmProfilePage />} path={ROUTES.umkmProfile} />
    <Route element={<FavoritesPage />} path={ROUTES.umkmFavorites} />
    <Route element={<RequestsPage />} path={ROUTES.umkmRequests} />
    <Route element={<RequestDetailPage />} path={ROUTES.umkmRequestDetail} />
    <Route element={<UmkmSettingsPage />} path={ROUTES.umkmSettings} />
    <Route element={<NewBriefPage />} path={ROUTES.newBrief} />
  </Route>
)
