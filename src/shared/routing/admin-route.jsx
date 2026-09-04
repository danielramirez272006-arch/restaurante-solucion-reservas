import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/use-auth'

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) return <div className="route-state">Verificando permisos...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />

  return <Outlet />
}