import { Link } from 'react-router-dom'
import Card from '../../shared/components/ui/card.jsx'

const highlights = [
  ['01', 'Sazón ancestral', 'Coco fresco, fuego lento y recetas de la costa limonense.'],
  ['02', 'Cultura y raíces', 'Calypso, reggae roots y la calidez de una mesa compartida.'],
  ['03', 'Bar y fogón', 'Pesca del día, jerk, ron añejo y frutas tropicales.'],
]

function OurHousePage() {
  return <main className="our-house-page">
    <section className="intro-section"><span className="eyebrow">Nuestra esencia</span><h1>Aquí la comida se cocina<br /><em>con alma y fogón.</em></h1><p>Un punto de encuentro en Puerto Viejo para comer sin prisa, escuchar el mar y compartir sabores con memoria.</p></section>
    <section className="values-section">{highlights.map(([number, title, text]) => <Card key={number} className="value-card"><span className="card-number">{number}</span><h3>{title}</h3><p>{text}</p></Card>)}</section>
    <section className="about-section" id="nosotros"><div className="about-stamp">RAY<br /><small>Puerto Viejo<br />One Love</small></div><div><span className="eyebrow">Cultura afrocostarricense</span><h2>La mesa caribeña<br /><em>es hermandad.</em></h2><p>Donde Ray honra a los pioneros afroantillanos y a la cocina que convierte el coco, el chile y el fuego en una forma de encontrarnos.</p><Link className="text-link" to="/reservar">Apartar mi lugar <span>→</span></Link></div></section>
    <section className="contact-section"><span className="eyebrow">Te esperamos frente al Caribe</span><h2>Tu mesa está lista<br /><em>en Puerto Viejo.</em></h2><div className="contact-row"><span>Playa Chiquita · Talamanca</span><a href="mailto:wapin@donderay.com">wapin@donderay.com</a><Link className="button button--outline" to="/reservar">Reservar mesa</Link></div></section>
  </main>
}

export default OurHousePage