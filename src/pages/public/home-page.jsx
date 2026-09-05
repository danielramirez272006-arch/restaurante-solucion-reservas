import { Link } from 'react-router-dom'
import Card from '../../shared/components/ui/card.jsx'

const highlights = [
	{
		number: '01',
		title: 'Cocina con raíz',
		text: 'Coco, plátano, mar y especias en una mesa hecha para compartir.',
	},
	{
		number: '02',
		title: 'Sabor de Limón',
		text: 'Una experiencia inspirada en la memoria afrocaribeña costarricense.',
	},
	{
		number: '03',
		title: 'Vení a encontrarte',
		text: 'Reservá tu mesa, bajá el ritmo y quedate a conversar un rato más.',
	},
]

function HomePage() {
	return (
		<main>
			<section className="hero-section hero-section--limon">
				<div className="hero-copy">
					<span className="eyebrow">Caribe · Costa Rica</span>

					<h1>
						Reservá tu mesa.


						<em>Viví el Caribe.</em>
					</h1>

					<p className="hero-lead">
						Donde Ray es una mesa abierta en Limón: comida, historias y una
						experiencia de reserva hecha para encontrarnos.
					</p>

					<div className="hero-actions">
						<Link className="button button--primary" to="/reservar">
							Reservar ahora <span>→</span>
						</Link>

						<Link className="text-link" to="/menu">
							Ver la carta <span>↗</span>
						</Link>
					</div>
				</div>

				<div className="hero-visual hero-visual--limon">
					<div
						className="hero-image"
						role="img"
						aria-label="Corredor de madera caribeña con una mesa servida en Limón"
					/>

					<div className="hero-note">
						<span>Una mesa con historia</span>
						<strong>Coco · mar · comunidad</strong>
					</div>
				</div>
			</section>

			<section className="intro-section intro-section--limon">
				<span className="eyebrow">Raíces que siguen vivas</span>

				<h2>
					El sabor también


					<em>guarda memoria.</em>
				</h2>

				<p>
					Desde el rice &amp; beans hasta el rondón, la cocina del Caribe cuenta
					historias de familia, comunidad, mar y tierra.
				</p>
			</section>

			<section className="values-section">
				{highlights.map((item) => (
					<Card key={item.number} className="value-card">
						<span className="card-number">{item.number}</span>
						<h3>{item.title}</h3>
						<p>{item.text}</p>
					</Card>
				))}
			</section>

			<section className="featured-section featured-section--limon">
				<div className="section-heading">
					<div>
						<span className="eyebrow">El sabor del Caribe</span>
						<h2>Comida para volver</h2>
					</div>

					<Link className="text-link" to="/menu">
						Ver el menú <span>↗</span>
					</Link>
				</div>

				<div className="dish-grid">
					<Card className="dish-card dish-card--image">
						<div className="dish-photo dish-photo--one" />
						<div className="dish-info">
							<span>Para compartir</span>
							<h3>Mogambos, patacones y salsa de la casa</h3>
						</div>
					</Card>

					<Card className="dish-card">
						<div className="dish-color dish-color--dark">
							<span>02</span>
						</div>
						<div className="dish-info">
							<span>Clásico limonense</span>
							<h3>Rice &amp; beans con pollo caribeño</h3>
						</div>
					</Card>

					<Card className="dish-card">
						<div className="dish-color dish-color--gold">
							<span>03</span>
						</div>
						<div className="dish-info">
							<span>De la costa</span>
							<h3>Rondón con coco, tubérculos y mar</h3>
						</div>
					</Card>
				</div>
			</section>

			<section className="limon-story-section">
				<div className="limon-story-image limon-story-image--community" role="img" aria-label="Arquitectura caribeña de madera en Limón" />
				<div className="limon-story-copy">
					<span className="eyebrow">Más que una decoración</span>
					<h2>
						Limón se reconoce


						<em>en la forma de vivir.</em>
					</h2>
					<p>
						En los corredores, en la madera, en las ventanas abiertas, en la lluvia
						y en la gente que se queda conversando. Donde Ray toma ese espíritu y
						lo convierte en una experiencia para reservar y compartir.
					</p>
					<Link className="text-link" to="/reservar">
						Quiero comer aquí <span>→</span>
					</Link>
				</div>
			</section>

			<section className="about-section" id="nosotros">
				<div className="about-stamp">
					DR


					<small>
						Caribe


						Limón
					</small>
				</div>

				<div>
					<span className="eyebrow">Nuestra historia</span>
					<h2>
						Un lugar para


						<em>encontrarnos.</em>
					</h2>
					<p>
						Del coco que perfuma el arroz al plátano maduro, cada sabor nos conecta
						con una historia afrocaribeña que sigue viva en Costa Rica.
					</p>
					<Link className="text-link" to="/menu">
						Conocer el menú <span>→</span>
					</Link>
				</div>
			</section>

			<section className="contact-section">
				<span className="eyebrow">Tu mesa comienza aquí</span>
				<h2>
					Vení a comer.


					<em>Vení a compartir.</em>
				</h2>
				<div className="contact-row">
					<span>Limón · Costa Rica</span>
					<a href="mailto:hola@donderay.com">hola@donderay.com</a>
					<Link className="button button--outline" to="/reservar">
						Reservar mesa
					</Link>
				</div>
			</section>
		</main>
	)
}

export default HomePage