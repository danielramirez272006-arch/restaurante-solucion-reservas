import { Link } from 'react-router-dom'
import Card from '../../shared/components/ui/card.jsx'
import riceAndBeansImg from '../../assets/images/rice_and_beans_limon_1788651760839.jpg'
import rondonImg from '../../assets/images/rondon_soup_limon_1788651773676.jpg'
import nightBarImg from '../../assets/images/bar_caribeno_noche_1788651853426.jpg'

function HomePage() {
  return <main className="home-page">
    <section className="hero-section"><div className="hero-copy"><span className="eyebrow">Restaurante caribeño · Puerto Viejo</span><h1>Una mesa con<br /><em>alma y fogón.</em></h1><p className="hero-lead">Cocina afrocaribeña, producto fresco y noches que se quedan contigo.</p><div className="hero-actions"><Link className="button button--primary" to="/reservar">Reservar una mesa <span>→</span></Link><Link className="text-link" to="/menu">Descubrir la carta <span>↗</span></Link></div></div><div className="hero-visual"><div className="hero-image" style={{ backgroundImage: `url(${riceAndBeansImg})` }} role="img" aria-label="Rice and beans caribeño" /><div className="hero-note"><span>Donde Ray</span><strong>One love · Limón</strong></div></div></section>
    <section className="featured-section"><div className="section-heading"><div><span className="eyebrow">Iconos de Limón</span><h2>De nuestra cocina</h2></div><Link className="text-link" to="/menu">Ver carta completa <span>↗</span></Link></div><div className="dish-grid"><Card className="dish-card"><div className="dish-photo" style={{ backgroundImage: `url(${riceAndBeansImg})` }} /><div className="dish-info"><span>Receta ancestral</span><h3>Rice & beans con pollo al fuego</h3></div></Card><Card className="dish-card"><div className="dish-photo" style={{ backgroundImage: `url(${rondonImg})` }} /><div className="dish-info"><span>Pesca de Talamanca</span><h3>Rondón tradicional de pargo</h3></div></Card><Card className="dish-card"><div className="dish-photo" style={{ backgroundImage: `url(${nightBarImg})` }} /><div className="dish-info"><span>La noche caribeña</span><h3>Tragos con alma y buena vibra</h3></div></Card></div></section>
  </main>
}

export default HomePage
