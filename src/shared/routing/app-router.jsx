import { BrowserRouter, Navigate, Route, Routes, Link, Outlet } from 'react-router-dom'
import AdminRoute from './admin-route'
import DashboardPage from '../../pages/admin/dashboard-page'
import ManageClientsPage from '../../pages/admin/manage-clients-page'

function AdminLayout() {
	return <><nav className="topbar"><Link className="brand" to="/admin">DONDE <em>RAY</em></Link><div className="nav-links"><Link to="/admin">Panel</Link><Link to="/admin/clientes">Clientes</Link></div></nav><Outlet /></>
}

function AccessDenied() {
	return <main className="page"><section className="panel"><p className="eyebrow">Acceso restringido</p><h1>Se necesita una cuenta admin</h1><p className="lede">Este espacio está reservado para el equipo administrativo de Donde Ray.</p></section></main>
}

export default function AppRouter() {
	return <BrowserRouter><Routes><Route element={<AdminRoute />}><Route element={<AdminLayout />}><Route path="/admin" element={<DashboardPage />} /><Route path="/admin/reservas" element={<DashboardPage />} /><Route path="/admin/clientes" element={<ManageClientsPage />} /></Route></Route><Route path="/login" element={<AccessDenied />} /><Route path="*" element={<Navigate to="/admin" replace />} /></Routes></BrowserRouter>
}
