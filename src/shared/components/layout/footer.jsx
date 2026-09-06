import { Link } from 'react-router-dom'

function Footer() {
	return (
		<footer className="site-footer">
			{/* Cultural Closing Section Marquee */}
			<div className="cultural-marquee-container" aria-label="Lemas culturales de Donde Ray">
				<div className="cultural-marquee-track">
					<span className="cultural-marquee-text">
						WAPIN MI GENTE &nbsp;•&nbsp; ROOTS & CULTURE &nbsp;•&nbsp; PUERTO VIEJO &nbsp;•&nbsp; DONDE RAY &nbsp;•&nbsp;
					</span>
					<span className="cultural-marquee-text" aria-hidden="true">
						WAPIN MI GENTE &nbsp;•&nbsp; ROOTS & CULTURE &nbsp;•&nbsp; PUERTO VIEJO &nbsp;•&nbsp; DONDE RAY &nbsp;•&nbsp;
					</span>
					<span className="cultural-marquee-text" aria-hidden="true">
						WAPIN MI GENTE &nbsp;•&nbsp; ROOTS & CULTURE &nbsp;•&nbsp; PUERTO VIEJO &nbsp;•&nbsp; DONDE RAY &nbsp;•&nbsp;
					</span>
					<span className="cultural-marquee-text" aria-hidden="true">
						WAPIN MI GENTE &nbsp;•&nbsp; ROOTS & CULTURE &nbsp;•&nbsp; PUERTO VIEJO &nbsp;•&nbsp; DONDE RAY &nbsp;•&nbsp;
					</span>
				</div>
			</div>
			<div className="rasta-bar-footer" aria-hidden="true" />
			<div className="footer-main">
				<div>
					<Link className="footer-brand" to="/">Donde Ray</Link>
					<p>Bar, Grill & Raíces Afrocostarricenses en Puerto Viejo. Fuego a la leña, coco puro y vibras One Love.</p>
				</div>
				<div className="footer-links">
					<strong style={{ color: '#f3d99d', fontSize: '13px', marginBottom: '4px' }}>Navegación</strong>
					<Link to="/menu">Carta Caribeña</Link>
					<Link to="/#nosotros">Cultura & Raíces</Link>
					<Link to="/reservar">Reservar Mesa</Link>
					<Link to="/login">Acceso Clientes</Link>
				</div>
				<div className="footer-contact">
					<strong style={{ color: '#f3d99d', fontSize: '13px', marginBottom: '4px' }}>Horario de Atención</strong>
					<span>Martes a domingo</span>
					<span>12:00 MD — 10:00 PM</span>
					<a href="mailto:wapin@donderay.com">wapin@donderay.com</a>
					<span>Playa Chiquita, Talamanca · Limón</span>
				</div>
			</div>
			<div className="footer-bottom">
				<span>© 2026 Donde Ray · Bar & Grill Caribeño</span>
				<span>One Love · Pura Vida Limón, Costa Rica</span>
			</div>
		</footer>
	)
}

export default Footer
