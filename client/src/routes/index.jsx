import { Navigate, Route, Routes } from 'react-router-dom'
import { authRoutes } from './authRoutes'
import { creatorRoutes } from './creatorRoutes'
import { publicRoutes } from './publicRoutes'
import { umkmRoutes } from './umkmRoutes'
import MaintenancePage from '../pages/misc/MaintenancePage'
import NotFoundPage from '../pages/misc/NotFoundPage'
import { ROUTES } from '../constants/routes'

function AppRoutes() {
  return (
    <Routes>
      {publicRoutes}
      {authRoutes}
      {umkmRoutes}
      {creatorRoutes}
      <Route element={<MaintenancePage />} path={ROUTES.maintenance} />
      <Route element={<NotFoundPage />} path={ROUTES.notFound} />
      <Route element={<Navigate replace to={ROUTES.notFound} />} path="*" />
    </Routes>
  )
}

export default AppRoutes
