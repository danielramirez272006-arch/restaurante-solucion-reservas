import { Link } from 'react-router-dom'

function Footer() {
	return (
		<footer className="site-footer">
			<div className="footer-main">
				<div><Link className="footer-brand" to="/">Donde Ray</Link><p>Cocina con memoria, mirada contemporánea.</p></div>
				<div className="footer-links"><Link to="/menu">Carta</Link><Link to="/#nosotros">Nosotros</Link><Link to="/reservas">Reservas</Link></div>
				<div className="footer-contact"><span>Miércoles a domingo</span><span>19:00 — 00:00</span><a href="mailto:hola@donderay.com">hola@donderay.com</a></div>
			</div>
			<div className="footer-bottom"><span>© 2026 Donde Ray</span><span>Playa Chiquita, Puerto Viejo de Talamanca · Limón, Costa Rica</span></div>
		</footer>
	)
}

export default Footer
