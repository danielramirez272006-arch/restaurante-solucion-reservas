import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../features/auth/use-auth'

function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	const closeMenu = () => setIsOpen(false)
	const { user, isAuthenticated, logout } = useAuth()
	const navigate = useNavigate()

	const handleLogout = () => {
		closeMenu()
		logout()
		navigate('/')
	}

	return (
		<header className="site-header">
			<div className="nav-wrap">
				<Link className="brand" to="/" onClick={closeMenu}>
					<span className="brand-mark">DR</span>
					<span>Donde Ray<small>cocina de autor</small></span>
				</Link>
				<button className="menu-toggle" type="button" aria-expanded={isOpen} aria-label="Abrir navegación" onClick={() => setIsOpen(!isOpen)}>
					<span /> <span />
				</button>
				<nav className={`main-nav ${isOpen ? 'main-nav--open' : ''}`} aria-label="Navegación principal">
					<NavLink to="/" end onClick={closeMenu}>Inicio</NavLink>
					<NavLink to="/menu" onClick={closeMenu}>Carta</NavLink>
					<a href="/#nosotros" onClick={closeMenu}>Nosotros</a>

					{isAuthenticated ? (
						<>
							{user?.role === 'admin' ? (
								<NavLink to="/admin" onClick={closeMenu}>Panel Admin</NavLink>
							) : (
								<>
									<NavLink to="/dashboard" onClick={closeMenu}>Mi Panel</NavLink>
									<NavLink to="/mis-reservas" onClick={closeMenu}>Mis Reservas</NavLink>
									<NavLink className="button button--small button--primary" to="/reservar" onClick={closeMenu}>Reservar mesa</NavLink>
								</>
							)}
							<button
								type="button"
								className="nav-login"
								style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: '6px 12px' }}
								onClick={handleLogout}
							>
								Salir
							</button>
						</>
					) : (
						<>
							<NavLink className="nav-login" to="/login" onClick={closeMenu}>Iniciar sesión</NavLink>
							<NavLink className="button button--small button--primary" to="/reservar" onClick={closeMenu}>Reservar mesa</NavLink>
						</>
					)}
				</nav>
			</div>
		</header>
	)
}

export default Navbar
