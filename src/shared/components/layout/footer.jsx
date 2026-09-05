import { Link } from 'react-router-dom'

function Footer() {
	return (
		<footer className="site-footer">
			<div className="footer-main">
				<div>
					<Link className="footer-brand" to="/">
						Donde Ray
					</Link>
					<p>
						Una mesa con historia, sabor del Caribe limonense y ganas de
						compartir.
					</p>
				</div>

				<div className="footer-links">
					<Link to="/menu">Carta</Link>
					<Link to="/#nosotros">Nuestra historia</Link>
					<Link to="/reservar">Reservar mesa</Link>
				</div>

				<div className="footer-contact">
					<span>Limón · Costa Rica</span>
					<span>Miércoles a domingo</span>
					<span>12:00 — 22:00</span>
					<a href="mailto:hola@donderay.com">hola@donderay.com</a>
				</div>
			</div>

			<div className="footer-bottom">
				<span>© 2026 Donde Ray</span>
				<span>Caribe costarricense · Limón</span>
			</div>
		</footer>
	)
}

export default Footer