import { Link } from 'react-router-dom'
import Card from '../../shared/components/ui/card.jsx'

const menuSections = [
	{
		title: 'Bocas & Entradas Caribeñas',
		badge: 'Para empezar y compartir',
		items: [
			['Pati Limonense Tradicional (2 uds)', 'Empanadas doradas al horno rellenas de carne mechada especiada con chile panameño y tomillo silvestre.'],
			['Plantain Tarts Artesanales (2 uds)', 'Tartaletas dulces de plátano maduro con canela, nuez moscada y el característico color y dulzor caribeño.'],
			['Ceviche Caribeño de Pargo al Coco', 'Pesca fresca del día de Puerto Viejo marinada en jugo de limón mandarina, jengibre, cebolla morada y leche de coco fresca.'],
			['Patacones Don Ray con Frijolitos al Coco', 'Ruedas crujientes de plátano verde con frijoles negros molidos a la leche de coco, pico de gallo caribeño y queso frito.'],
		],
	},
	{
		title: 'Del Fuego & La Leña',
		badge: 'Platos fuertes insignia',
		items: [
			['Rice & Beans con Pollo Caribeño', 'El ícono de Limón: arroz y frijoles cocinados en leche de coco pura con chile panameño, servido con pollo en salsa negra caribeña glaseada y patacones.'],
			['Rondón Tradicional de Pescado (Especial)', 'Sopa reina afrocostarricense cocida a fuego lento con leche de coco, pargo rojo entero, yuca, plátano verde, ñame, camote y hierbas de Talamanca.'],
			['Pescado Entero Frito al Estilo Caribe', 'Pargo rojo fresco del Caribe frito crujiente, bañado en salsa escabeche de cebolla morada, chile panameño y jengibre, acompañado de patacones.'],
			['Caribbean Jerk Ribs a la Leña', 'Costillas de cerdo ahumadas con marinada caribeña de especias, glaseadas con barbacoa de maracuyá y chile dulce.'],
		],
	},
	{
		title: 'Dulces & Postres de Limón',
		badge: 'El cierre perfecto',
		items: [
			['Pan Bon Casero de Ray', 'Pan negro tradicional especiado con frutas confitadas, pasas maceradas en ron, vainilla y jengibre, servido tibio con mantequilla.'],
			['Tres Leches de Coco Tostado', 'Bizcocho esponjoso bañado en crema de tres leches y leche de coco caramelizado con ralladura de limón.'],
			['Tarta de Piña & Coco con Helado', 'Tarta rústica de piña caribeña al ron tostado con helado de vainilla artesanal.'],
		],
	},
	{
		title: 'Bar, Cocteles & Refrescos',
		badge: 'Tragos con alma tropical',
		items: [
			['Agua de Sapo Tradicional (Hiel)', 'La bebida sagrada de Limón: agua de panela (tapa de dulce) con abundante jengibre machacado y limón mandarina bien fría.'],
			['Coco Loco Donde Ray', 'Coco natural recién abierto con ron caribeño blanco y dorado, crema de coco y toque de piña fresca.'],
			['Calypso Rum Punch', 'Rones añejos caribeños con jugo de maracuyá, naranja, jarabe de jengibre y bitter aromático.'],
			['Cervezas Frías & Artesanales', 'Imperial, Pilsen, Red Stripe y cervezas artesanales de la costa caribeña.'],
		],
	},
]

function MenuPage() {
	return (
		<main className="page-shell menu-page">
			<div className="page-intro">
				<div className="rasta-pill">
					<span className="rasta-dot rasta-dot--green" />
					<span className="rasta-dot rasta-dot--yellow" />
					<span className="rasta-dot rasta-dot--red" />
					<span>Puerto Viejo · Limón</span>
				</div>
				<span className="eyebrow">Carta Caribeña & Bar</span>
				<h1>
					El sabor no miente:<br />
					<em>coco, leña y sazón.</em>
				</h1>
				<p className="lead">
					En Donde Ray celebramos la auténtica gastronomía afrocostarricense de Talamanca. Ingredientes frescos de agricultores y pescadores locales, leche de coco recién rallada y el inconfundible aroma del chile panameño.
				</p>
			</div>

			<div className="menu-list">
				{menuSections.map((section) => (
					<section className="menu-section" key={section.title}>
						<div className="menu-section-header">
							<h2>{section.title}</h2>
							<span className="menu-section-badge">{section.badge}</span>
						</div>
						{section.items.map(([name, description]) => (
							<Card className="menu-item" key={name}>
								<div>
									<h3>{name}</h3>
									<p>{description}</p>
								</div>
								<span className="menu-line" />
							</Card>
						))}
					</section>
				))}
			</div>

			<div className="menu-footer-note">
				<div>
					<strong>Aforo limitado por turno (20 personas).</strong>
					<span> Para garantizar la frescura de nuestros mariscos y leña, te recomendamos asegurar tu mesa.</span>
				</div>
				<Link className="button button--primary" to="/reservar">
					Reservar mi mesa <span>→</span>
				</Link>
			</div>
		</main>
	)
}

export default MenuPage
