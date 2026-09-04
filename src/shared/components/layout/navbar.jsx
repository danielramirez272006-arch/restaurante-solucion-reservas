import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	const closeMenu = () => setIsOpen(false)

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
					<NavLink className="nav-login" to="/login" onClick={closeMenu}>Iniciar sesión</NavLink>
					<NavLink className="button button--small button--primary" to="/reservas" onClick={closeMenu}>Reservar mesa</NavLink>
				</nav>
			</div>
		</header>
	)
}

export default Navbar
