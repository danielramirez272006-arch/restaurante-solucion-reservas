import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../features/auth/use-auth'
import AdminRoute from './admin-route'
import PrivateRoute from './private-route'
import DashboardPage from '../../pages/client/dashboard-page'
import LoginPage from '../../pages/public/login-page'
import RegisterPage from '../../pages/public/register-page'

function AdminPlaceholder() {
    const { user, logout } = useAuth()
    return <main className="dashboard-page"><section className="dashboard-content"><p className="eyebrow">Administración</p><h1>Panel de Raymon.</h1><p>Sesión activa como {user?.name}.</p><button className="button button-dark" onClick={logout}>Cerrar sesión</button></section></main>
}

function NotFound() {
    return <main className="route-state"><h1>Página no encontrada</h1><a href="/login">Ir al login</a></main>
}

export default function AppRouter() {
    return <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/reservar" element={<DashboardPage />} />
            <Route path="/mis-reservas" element={<DashboardPage />} />
        </Route>
        <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPlaceholder />} />
        </Route>
        <Route path="*" element={<NotFound />} />
    </Routes>
}