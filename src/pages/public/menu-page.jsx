import { useState } from 'react'
import { Link } from 'react-router-dom'
import rondonImg from '../../assets/images/rondon_soup_limon_1788651773676.jpg'
import riceAndBeansImg from '../../assets/images/rice_and_beans_limon_1788651760839.jpg'
import patiImg from '../../assets/images/pati_caribeno_1788651839747.jpg'
import barImg from '../../assets/images/bar_caribeno_noche_1788651853426.jpg'

const categories = [
  { id: 'all', label: 'Toda la carta' },
  { id: 'entradas', label: 'Entradas' },
  { id: 'fuertes', label: 'Platos fuertes' },
  { id: 'postres', label: 'Postres' },
  { id: 'cocteleria', label: 'Coctelería' },
]

const menuItems = [
  { id: 'rondon', category: 'fuertes', name: 'Rondón de pargo al caldero', tag: 'Especialidad de la casa', price: '₡18.500', image: rondonImg, description: 'Pargo fresco en leche de coco, yuca, plátano verde, camote y chile panameño.', notes: 'Acompañado de patacones crocantes.' },
  { id: 'rice-beans', category: 'fuertes', name: 'Rice & beans con pollo al jerk', tag: 'Plato insignia', price: '₡14.000', image: riceAndBeansImg, description: 'Arroz y frijoles en leche de coco, pollo glaseado a la leña y patacón artesanal.', notes: 'Receta de familia con técnica contemporánea.' },
  { id: 'pati', category: 'entradas', name: 'Patí artesanal y especias antillanas', tag: 'Entrada de autor', price: '₡7.200', image: patiImg, description: 'Masa dorada rellena de carne especiada, alioli de coco y cilantro.', notes: 'Dos unidades horneadas al momento.' },
  { id: 'ceviche', category: 'entradas', name: 'Ceviche limonense al coco y jengibre', tag: 'Pesca fresca del día', price: '₡9.500', image: rondonImg, description: 'Corvina fresca, cítricos, leche de coco, aguacate y chips de plátano verde.', notes: 'Consultar disponibilidad de pesca.' },
  { id: 'bar', category: 'cocteleria', name: 'Coctelería de autor caribeña', tag: 'Bar de noche', price: '₡6.500 — ₡8.500', image: barImg, description: 'Ron añejo, coco, jengibre, cacao y frutas tropicales de temporada.', notes: 'Consulte la carta de vinos.' },
  { id: 'coco', category: 'postres', name: 'Coco tostado y tapa de dulce', tag: 'Postre de la casa', price: '₡6.800', image: patiImg, description: 'Coco, especias caribeñas, cacao amargo y helado artesanal.', notes: 'El cierre dulce de la experiencia.' },
]

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const filteredItems = activeCategory === 'all' ? menuItems : menuItems.filter((item) => item.category === activeCategory)

  return (
    <main className="menu-fine-dining-shell">
      <section className="menu-hero-header text-center">
        <span className="rasta-pill"><span className="rasta-dot rasta-dot--yellow" /> Restaurante fino y cocina caribeña</span>
        <h1 className="font-display">Menú gastronómico<br /><em>Carta de autor</em></h1>
        <p className="font-body">Raíces afrocaribeñas, pesca artesanal, coco fresco y fuego de leña en cada servicio.</p>
        <div className="menu-filter-nav" role="tablist" aria-label="Categorías del menú">
          {categories.map((category) => <button key={category.id} type="button" role="tab" aria-selected={activeCategory === category.id} className={`menu-filter-pill ${activeCategory === category.id ? 'menu-filter-pill--active' : ''}`} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}
        </div>
      </section>
      <section className="menu-items-grid" aria-label="Platillos del menú">
        {filteredItems.map((dish) => <article key={dish.id} className="menu-dish-card"><div className="menu-dish-visual"><img src={dish.image} alt={dish.name} className="menu-dish-img" loading="lazy" /><span className="menu-dish-tag">{dish.tag}</span></div><div className="menu-dish-content"><div className="menu-dish-top"><h2 className="menu-dish-title">{dish.name}</h2><span className="menu-dish-price">{dish.price}</span></div><p className="menu-dish-desc">{dish.description}</p><div className="menu-dish-footer-note"><span className="menu-dish-dot" /><small>{dish.notes}</small></div></div></article>)}
      </section>
      <section className="menu-exclusive-banner"><div><span className="eyebrow">Experiencia gastronómica</span><h2>Cupo controlado por turno</h2><p>Te recomendamos asegurar tu reserva con antelación para disfrutar el servicio completo.</p></div><Link to="/reservar" className="btn-artisan-gold">Reservar mi experiencia →</Link></section>
    </main>
  )
}

export default MenuPage
