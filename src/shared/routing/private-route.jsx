import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/use-auth'

export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="route-state">Verificando sesión...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return <Outlet />
}