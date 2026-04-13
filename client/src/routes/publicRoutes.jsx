import { Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import HomePage from '../pages/public/HomePage'
import CreatorListingPage from '../pages/public/CreatorListingPage'
import CreatorDetailPage from '../pages/public/CreatorDetailPage'
import ServiceDetailPage from '../pages/public/ServiceDetailPage'
import InfoPage from '../pages/public/InfoPage'
import { ROUTES } from '../constants/routes'

export const publicRoutes = (
  <Route element={<PublicLayout />}>
    <Route element={<HomePage />} path={ROUTES.home} />
    <Route element={<InfoPage type="about" />} path={ROUTES.about} />
    <Route element={<InfoPage type="how" />} path={ROUTES.howItWorks} />
    <Route element={<CreatorListingPage />} path={ROUTES.creators} />
    <Route element={<CreatorDetailPage />} path={ROUTES.creatorDetail} />
    <Route element={<ServiceDetailPage />} path={ROUTES.serviceDetail} />
    <Route element={<InfoPage type="help" />} path={ROUTES.help} />
    <Route element={<InfoPage type="faq" />} path={ROUTES.faq} />
  </Route>
)
