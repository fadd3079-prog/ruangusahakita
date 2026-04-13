import { Route } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import CreatorAddPortfolioPage from '../pages/creator/CreatorAddPortfolioPage'
import CreatorAddServicePage from '../pages/creator/CreatorAddServicePage'
import CreatorDashboardPage from '../pages/creator/CreatorDashboardPage'
import CreatorEditPortfolioPage from '../pages/creator/CreatorEditPortfolioPage'
import CreatorEditServicePage from '../pages/creator/CreatorEditServicePage'
import CreatorPortfolioPage from '../pages/creator/CreatorPortfolioPage'
import CreatorProfilePage from '../pages/creator/CreatorProfilePage'
import CreatorRequestDetailPage from '../pages/creator/CreatorRequestDetailPage'
import CreatorRequestsPage from '../pages/creator/CreatorRequestsPage'
import CreatorServicesPage from '../pages/creator/CreatorServicesPage'
import CreatorSettingsPage from '../pages/creator/CreatorSettingsPage'
import { ROUTES } from '../constants/routes'

export const creatorRoutes = (
  <Route element={<DashboardLayout />}>
    <Route element={<CreatorDashboardPage />} path={ROUTES.creatorDashboard} />
    <Route element={<CreatorProfilePage />} path={ROUTES.creatorProfile} />
    <Route element={<CreatorServicesPage />} path={ROUTES.creatorServices} />
    <Route element={<CreatorAddServicePage />} path={ROUTES.creatorAddService} />
    <Route element={<CreatorEditServicePage />} path={ROUTES.creatorEditService} />
    <Route element={<CreatorPortfolioPage />} path={ROUTES.creatorPortfolio} />
    <Route element={<CreatorAddPortfolioPage />} path={ROUTES.creatorAddPortfolio} />
    <Route element={<CreatorEditPortfolioPage />} path={ROUTES.creatorEditPortfolio} />
    <Route element={<CreatorRequestsPage />} path={ROUTES.creatorRequests} />
    <Route element={<CreatorRequestDetailPage />} path={ROUTES.creatorRequestDetail} />
    <Route element={<CreatorSettingsPage />} path={ROUTES.creatorSettings} />
  </Route>
)
