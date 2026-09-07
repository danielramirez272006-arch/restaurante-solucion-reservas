import { Link } from 'react-router-dom'
import Card from '../../shared/components/ui/card.jsx'

const highlights = [
  ['01', 'Coco, fuego y memoria', 'Ray cocina desde técnicas caribeñas aprendidas en familia: sofrito lento, leche de coco fresca, chile y humo de fogón.'],
  ['02', 'Una carrera con territorio', 'Cada plato nace de años escuchando a cocineras, pescadores y portadores de la cultura afrocaribeña de Limón.'],
  ['03', 'El sabor de Puerto Viejo', 'Pesca del día, patí, rondón, jerk y rice & beans conviven en una mesa contemporánea, sin perder su raíz.'],
]

const journey = [
  ['La raíz', 'Aprendió que cocinar es cuidar: medir el coco con la mano, respetar el tiempo del caldo y nunca apurar el fuego.'],
  ['El camino', 'Recorrió cocinas, mercados y costas para entender que la receta también vive en la música, la conversación y la comunidad.'],
  ['La mesa', 'En Donde Ray transforma esa experiencia en una hospitalidad abierta: aquí cada comensal se sienta a conocer una historia.'],
]

export default function OurHousePage() {
  return (
    <main className="our-house-page our-house-story">
      <section className="ray-chef-hero">
        <div className="ray-chef-hero__image-wrap">
          <img src="/limon-hero.jpg" alt="Paisaje caribeño de Puerto Viejo, Limón" />
          <div className="ray-chef-hero__stamp">RAY<br /><small>cocinero de territorio</small></div>
        </div>
        <div className="ray-chef-hero__copy">
          <span className="eyebrow">El hombre detrás del fogón</span>
          <h1>Ray cocina<br /><em>con memoria.</em></h1>
          <p className="ray-chef-hero__lead">No llegó al Caribe para inventar una historia. Llegó para escucharla, aprenderla y servirla con respeto.</p>
          <p>Su cocina nace de la cultura afrocaribeña limonense: del coco rallado temprano, del chile que despierta el caldo, de la pesca que cambia con la marea y de la mesa donde nadie come solo.</p>
          <div className="ray-chef-signature"><span>Raymon</span><small>Chef · anfitrión · aprendiz del Caribe</small></div>
          <Link className="button button--primary" to="/reservar">Conocer la mesa de Ray <span>→</span></Link>
        </div>
      </section>

      <section className="ray-credentials-strip" aria-label="Experiencia de Ray">
        <div><strong>20+</strong><span>años escuchando<br />la cocina caribeña</span></div>
        <div><strong>3</strong><span>generaciones de<br />memoria culinaria</span></div>
        <div><strong>1</strong><span>territorio: Puerto<br />Viejo de Limón</span></div>
      </section>

      <section className="values-section ray-values-section">
        <div className="ray-section-intro"><span className="eyebrow">Lo que sostiene su cocina</span><h2>Una receta no es solo<br /><em>lo que hay en el plato.</em></h2></div>
        <div className="ray-values-grid">{highlights.map(([number, title, text]) => <Card key={number} className="value-card"><span className="card-number">{number}</span><h3>{title}</h3><p>{text}</p></Card>)}</div>
      </section>

      <section className="ray-journey-section">
        <div className="ray-journey-visual"><img src="/limon-community.jpg" alt="Comunidad caribeña de Limón" /><span>Una cocina<br /><em>con raíz</em></span></div>
        <div className="ray-journey-copy"><span className="eyebrow">La experiencia se sirve</span><h2>De la memoria<br /><em>a tu mesa.</em></h2><div className="ray-journey-list">{journey.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div>
      </section>

      <section className="contact-section ray-final-cta"><span className="eyebrow">Donde Ray · Puerto Viejo</span><h2>Ven a probar una historia<br /><em>que todavía se está cocinando.</em></h2><div className="contact-row"><span>Playa Chiquita · Talamanca</span><a href="mailto:wapin@donderay.com">wapin@donderay.com</a><Link className="button button--outline" to="/reservar">Reservar mesa</Link></div></section>
    </main>
  )
}
