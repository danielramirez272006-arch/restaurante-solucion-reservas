import { Navigate, Outlet, Route, Routes, NavLink, Link } from 'react-router-dom'
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
        <div className="admin-header-left">
          <Link className="brand" to="/admin">
            <span className="brand-mark" style={{ background: 'var(--green)', color: '#fff', border: '1px solid var(--gold)' }}>DR</span>
            <span><strong style={{ color: '#f8f5ed' }}>Donde Ray</strong><small style={{ color: '#ffd685' }}>Gestión Caribeña · Limón</small></span>
          </Link>
          <nav className="admin-nav" aria-label="Navegación de administración">
            <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
              Resumen
            </NavLink>
            <NavLink to="/admin/reservas" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
              Reservas
            </NavLink>
            <NavLink to="/admin/clientes" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
              Clientes
            </NavLink>
            <Link to="/" className="admin-nav-link" target="_blank" rel="noopener noreferrer">
              ↗ Ver Sitio
            </Link>
          </nav>
        </div>
        <div className="admin-header-right">
          <div className="admin-user-info">
            <span className="admin-user-role">Admin</span>
            <strong className="admin-user-name">{user?.name || 'Administrador'}</strong>
          </div>
          <button type="button" className="admin-logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <div className="admin-body">
        <Outlet />
      </div>
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
