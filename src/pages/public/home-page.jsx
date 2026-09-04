import { Link } from 'react-router-dom'
import Card from '../../shared/components/ui/card.jsx'

const highlights = [
	{ number: '01', title: 'Producto cercano', text: 'Ingredientes de estación elegidos en nuestra red de productores.' },
	{ number: '02', title: 'Técnica sin ruido', text: 'Cada plato deja que el ingrediente principal tenga la última palabra.' },
	{ number: '03', title: 'Una mesa para volver', text: 'Un servicio atento, cálido y pensado para quedarse un rato más.' },
]

function HomePage() {
	return <main>
		<section className="hero-section">
			<div className="hero-copy"><span className="eyebrow">Restaurante · Buenos Aires</span><h1>Lo que somos<br /><em>se sirve en la mesa.</em></h1><p className="hero-lead">Cocina de autor con raíces argentinas, producto honesto y una sala donde el tiempo baja el ritmo.</p><div className="hero-actions"><Link className="button button--primary" to="/reservas">Reservar una mesa <span>→</span></Link><Link className="text-link" to="/menu">Explorar la carta <span>↗</span></Link></div></div>
			<div className="hero-visual"><div className="hero-image" role="img" aria-label="Plato de cocina de autor servido en mesa" /><div className="hero-note"><span>Menú de temporada</span><strong>Otoño / invierno 2026</strong></div></div>
		</section>
		<section className="intro-section"><span className="eyebrow">La propuesta</span><h2>Una cocina con<br /><em>algo que decir.</em></h2><p>Donde Ray nace del deseo de cocinar sin apuro. Una carta breve, cambiante y arraigada en lo que tenemos alrededor.</p></section>
		<section className="values-section">{highlights.map((item) => <Card key={item.number} className="value-card"><span className="card-number">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></Card>)}</section>
		<section className="featured-section"><div className="section-heading"><div><span className="eyebrow">Un adelanto</span><h2>De nuestra carta</h2></div><Link className="text-link" to="/menu">Ver carta completa <span>↗</span></Link></div><div className="dish-grid"><Card className="dish-card dish-card--image"><div className="dish-photo dish-photo--one" /><div className="dish-info"><span>Entrada</span><h3>Remolachas, yogur de cabra y eneldo</h3></div></Card><Card className="dish-card"><div className="dish-color dish-color--dark"><span>02</span></div><div className="dish-info"><span>Principal</span><h3>Pesca del día, maíz y beurre blanc</h3></div></Card><Card className="dish-card"><div className="dish-color dish-color--gold"><span>03</span></div><div className="dish-info"><span>Final</span><h3>Membrillo, queso azul y nuez</h3></div></Card></div></section>
		<section className="about-section" id="nosotros"><div className="about-stamp">DR<br /><small>desde<br />2018</small></div><div><span className="eyebrow">Nosotros</span><h2>La mesa también<br /><em>es un lugar.</em></h2><p>Creemos que comer bien es una forma de encontrarnos. Por eso cuidamos lo que llega al plato y todo lo que pasa alrededor: la luz, la música, el gesto de quien sirve.</p><Link className="text-link" to="/reservas">Venir a conocernos <span>→</span></Link></div></section>
		<section className="contact-section"><span className="eyebrow">Encontrémonos</span><h2>Tu próxima mesa<br /><em>empieza aquí.</em></h2><div className="contact-row"><span>Gorriti 4823, Palermo</span><a href="mailto:hola@donderay.com">hola@donderay.com</a><Link className="button button--outline" to="/reservas">Reservar mesa</Link></div></section>
	</main>
}

export default HomePage
