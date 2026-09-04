import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function AdminRoute() {
	const location = useLocation()
	const rawUser = localStorage.getItem('user') || localStorage.getItem('currentUser')
	const user = (() => {
		try { return rawUser ? JSON.parse(rawUser) : null } catch { return null }
	})()
	const role = user?.role || user?.rol
	return role === 'admin' ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}
