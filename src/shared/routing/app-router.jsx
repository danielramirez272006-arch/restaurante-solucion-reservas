import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../features/auth/use-auth'
import AdminRoute from './admin-route'
import PrivateRoute from './private-route'
import MainLayout from '../components/layout/main-layout.jsx'
import DashboardPage from '../../pages/client/dashboard-page'
import { BookReservationPage } from '../../pages/client/book-reservation-page'
import { MyReservationsPage } from '../../pages/client/my-reservations-page'
import AdminDashboardPage from '../../pages/admin/dashboard-page'
import ManageReservationsPage from '../../pages/admin/manage-reservations-page'
import ManageClientsPage from '../../pages/admin/manage-clients-page'
import HomePage from '../../pages/public/home-page.jsx'
import MenuPage from '../../pages/public/menu-page.jsx'
import NotFoundPage from '../../pages/public/not-found-page.jsx'
import LoginPage from '../../pages/public/login-page'
import RegisterPage from '../../pages/public/register-page'

function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <strong>Donde Ray · Administración</strong>
        <span>{user?.name}</span>
        <button type="button" onClick={logout}>Cerrar sesión</button>
      </header>
      <Outlet />
    </div>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/reservar" element={<BookReservationPage />} />
        <Route path="/reservas" element={<Navigate to="/reservar" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mis-reservas" element={<MyReservationsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/reservas" element={<ManageReservationsPage />} />
          <Route path="/admin/clientes" element={<ManageClientsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
