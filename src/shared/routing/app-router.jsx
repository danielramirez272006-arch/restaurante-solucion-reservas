import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../features/auth/use-auth'
import AdminRoute from './admin-route'
import PrivateRoute from './private-route'
import DashboardPage from '../../pages/client/dashboard-page'
import { BookReservationPage } from '../../pages/client/book-reservation-page'
import { MyReservationsPage } from '../../pages/client/my-reservations-page'
import AdminDashboardPage from '../../pages/admin/dashboard-page'
import ManageReservationsPage from '../../pages/admin/manage-reservations-page'
import ManageClientsPage from '../../pages/admin/manage-clients-page'
import LoginPage from '../../pages/public/login-page'
import RegisterPage from '../../pages/public/register-page'

function NotFound() {
  return <main className="route-state"><h1>Página no encontrada</h1><a href="/login">Ir al login</a></main>
}

function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  return <div className="admin-shell">
    <header className="admin-header">
      <strong>Donde Ray · Administración</strong>
      <span>{user?.name}</span>
      <button type="button" onClick={logout}>Cerrar sesión</button>
    </header>
    {children}
  </div>
}

export default function AppRouter() {
  return <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/reservar" element={<BookReservationPage />} />
      <Route path="/mis-reservas" element={<MyReservationsPage />} />
    </Route>

    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/reservas" element={<ManageReservationsPage />} />
        <Route path="/admin/clientes" element={<ManageClientsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
}
