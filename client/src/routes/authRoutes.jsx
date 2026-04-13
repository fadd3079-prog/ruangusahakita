import { Route } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import RoleSelectPage from '../pages/auth/RoleSelectPage'
import { ROUTES } from '../constants/routes'

export const authRoutes = (
  <Route element={<AuthLayout />}>
    <Route element={<LoginPage />} path={ROUTES.login} />
    <Route element={<RegisterPage />} path={ROUTES.register} />
    <Route element={<RoleSelectPage />} path={ROUTES.roleSelect} />
    <Route element={<ForgotPasswordPage />} path={ROUTES.forgotPassword} />
  </Route>
)
