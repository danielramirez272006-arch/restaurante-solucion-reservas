import { useState } from 'react';
import { Link } from 'react-router-dom';
import rondonImg from '../../assets/images/rondon_soup_limon_1788651773676.jpg';
import riceAndBeansImg from '../../assets/images/rice_and_beans_limon_1788651760839.jpg';
import patiImg from '../../assets/images/pati_caribeno_1788651839747.jpg';
import barImg from '../../assets/images/bar_caribeno_noche_1788651853426.jpg';
import heroImg from '../../assets/images/caribbean_hero_bar_1788651748042.jpg';

const CATEGORIES = [
  { id: 'all', label: 'Toda la Carta' },
  { id: 'entradas', label: 'Entradas de Autor' },
  { id: 'fuertes', label: 'Platos Fuertes Insignia' },
  { id: 'postres', label: 'Repostería Fina' },
  { id: 'cocteleria', label: 'Mixología & Bodega' }
];

const MENU_ITEMS = [
  {
    id: 'rondon-real',
    category: 'fuertes',
    name: 'Rondón Real de Pargo al Caldero',
    tag: 'Especialidad del Chef',
    price: '₡18.500',
    badge: 'Cocción Lenta 6h',
    image: rondonImg,
    description:
      'Pargo rojo entero de pesca artesanal de Puerto Viejo, cocido a fuego sosegado en leche de coco de primera extracción, yuca tierna, plátano verde, camote morado y el perfume inconfundible del chile panameño entero.',
    notes: 'Acompañado de patacones crocantes de plátano verde y reducción de maracuyá.'
  },
  {
    id: 'rice-and-beans-autor',
    category: 'fuertes',
    name: 'Rice & Beans Insignia con Pollo Glaseado al Jerk',
    tag: 'Plato Insignia',
    price: '₡14.000',
    badge: 'Herencia Viva',
    image: riceAndBeansImg,
    description:
      'Arroz jazmín y frijoles negros infusionados en leche de coco natural, tomillo silvestre de huerta y chile panameño, servido con cuarto de pollo campesino confitado a la leña con salsa negra caribeña reducida y patacón artesanal.',
    notes: 'Receta de familia perfeccionada bajo técnica de alta cocina.'
  },
  {
    id: 'pati-gourmet',
    category: 'entradas',
    name: 'Patí Artesanal Hojaldrado & Especias Antillanas',
    tag: 'Entrada de Autor',
    price: '₡7.200',
    badge: 'Horno de Leña',
    image: patiImg,
    description:
      'Masa dorada fina y crujiente elaborada en casa, rellena de lomo mechado al curry caribeño, pimienta de jamaica, tomillo y toque delicado de chile panameño. Servido con alioli ligero de coco y cilantro.',
    notes: '2 unidades presentadas sobre piedra volcánica tibia.'
  },
  {
    id: 'ceviche-coco',
    category: 'entradas',
    name: 'Ceviche Limonense de Corvina Reina al Coco y Jengibre',
    tag: 'Pesca Fresca del Día',
    price: '₡9.500',
    badge: 'Crudo & Fresco',
    image: '/limon-food.jpg',
    description:
      'Láminas de corvina fresca marinadas en zumo de limón mandarina, emulsión sedosa de leche de coco virgen, cebolla morada confitada al vacío, aguacate de Talamanca y chips de plátano verde.',
    notes: 'Maridaje recomendado: Vino blanco Sauvignon Blanc o Agua de Sapo espumosa.'
  },
  {
    id: 'pescado-entero',
    category: 'fuertes',
    name: 'Pesca Entera del Litoral al Escabeche Caribeño',
    tag: 'Pesca Sostenible',
    price: '₡19.800',
    badge: 'Fuego Vivo',
    image: heroImg,
    description:
      'Pargo rojo o robalo fresco del día frito en costra crocante de especias, cubierto con escabeche tibio de cebollas perla, chile panameño ahumado, jengibre y vinagre de caña añejado en roble.',
    notes: 'Servido con ensalada criolla de palmito fresco y tostones dorados.'
  },
  {
    id: 'mixologia-ray',
    category: 'cocteleria',
    name: 'Coctelería de Autor & Tragos de Fogón',
    tag: 'Mixología Premium',
    price: '₡6.500 — ₡8.500',
    badge: 'Bar de Noche',
    image: barImg,
    description:
      'Nuestra barra rinde homenaje a la caña y al cacao de Talamanca: Agua de Sapo de autor con jengibre macerado y ron añejo de 12 años, Coco Fino ahumado en mesa con cáscara de coco y Calypso Punch de frutos tropicales.',
    notes: 'Consulte nuestra carta de vinos orgánicos de pequeños productores.'
  },
  {
    id: 'pan-bon-caramelizado',
    category: 'postres',
    name: 'Pan Bon Caramelizado con Helado Artesanal de Coco',
    tag: 'Postre de la Casa',
    price: '₡6.800',
    badge: 'Dulce Tradición',
    image: '/limon-community.jpg',
    description:
      'Bizcocho denso de especias caribeñas, pasas y frutas maceradas en ron oscuro Centenario, sellado en mantequilla clarificada y servido con helado cremoso de coco tostado y reducción de cacao amargo.',
    notes: 'El broche de oro perfecto para una velada memorable.'
  }
];

export function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <main className="menu-fine-dining-shell">
      {/* Encabezado Principal */}
      <section className="menu-hero-header text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#132c21] border border-[#c8860a]/40 text-[#c8860a] text-xs font-label uppercase tracking-[0.2em] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#c8860a]" />
          <span>Restaurante Fino & Alta Cocina de Autor</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#f0e6cc] font-bold tracking-tight mb-5">
          Menú Gastronómico & <br />
          <em className="text-[#c8860a] font-oblique-8">Carta de Autor</em>
        </h1>

        <p className="font-body text-base sm:text-lg text-[#f0e6cc]/85 max-w-2xl mx-auto leading-relaxed mb-10">
          En Donde Ray elevamos las raíces afrocostarricenses a la excelencia culinaria. Cada plato es un tributo al fuego de leña, la pesca artesanal de Talamanca y la riqueza botánica de nuestra costa caribeña.
        </p>

        {/* Filtros de Categoría de Lujo */}
        <div className="menu-filter-nav" role="tablist" aria-label="Categorías del Menú">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`menu-filter-pill ${activeCategory === cat.id ? 'menu-filter-pill--active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid de Platillos con Fotografía de Alta Calidad */}
      <section className="menu-items-grid" aria-label="Platillos del Menú">
        {filteredItems.map((dish) => (
          <article key={dish.id} className="menu-dish-card">
            <div className="menu-dish-visual">
              <img
                src={dish.image}
                alt={dish.name}
                className="menu-dish-img"
                loading="lazy"
              />
              <span className="menu-dish-tag">{dish.tag}</span>
              <span className="menu-dish-badge">{dish.badge}</span>
            </div>

            <div className="menu-dish-content">
              <div className="menu-dish-top">
                <h2 className="menu-dish-title">{dish.name}</h2>
                <span className="menu-dish-price">{dish.price}</span>
              </div>

              <p className="menu-dish-desc">{dish.description}</p>

              {dish.notes && (
                <div className="menu-dish-footer-note">
                  <span className="menu-dish-dot" />
                  <small>{dish.notes}</small>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* Banner de Reserva & Experiencia Exclusiva */}
      <section className="menu-exclusive-banner">
        <div className="menu-exclusive-text">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-[#c8860a] font-bold block mb-2">
            Experiencia Gastronómica Exclusiva
          </span>
          <h3 className="font-display text-2xl sm:text-3xl text-[#f0e6cc] font-bold mb-2">
            Cupo exclusivo de 20 personas por turno
          </h3>
          <p className="font-body text-sm sm:text-base text-[#f0e6cc]/80 max-w-xl m-0">
            Para garantizar la frescura de nuestra pesca del día y el esmero en cada servicio, te recomendamos asegurar tu reserva con antelación.
          </p>
        </div>

        <div className="menu-exclusive-action">
          <Link to="/reservar" className="btn-artisan-gold">
            Reservar mi experiencia →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default MenuPage;
