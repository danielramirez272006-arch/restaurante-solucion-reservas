import { Link } from 'react-router-dom'
import Card from '../../shared/components/ui/card.jsx'

const menuSections = [
	{
		title: 'Para compartir',
		intro: 'Sabores para poner al centro de la mesa.',
		items: [
			[
				'Patí',
				'Empanada caribeña de carne sazonada con chile y especias.',
				'₡2.500',
			],
			[
				'Mogambos',
				'Pollo caribeño crujiente con patacones, chile y salsa de la casa.',
				'₡4.500',
			],
			[
				'Pan bon',
				'Pan dulce especiado de tradición afrocaribeña, con frutos secos y vainilla.',
				'₡2.000',
			],
			[
				'Plantinta',
				'Pastel dulce de plátano maduro inspirado en la tradición limonense.',
				'₡2.000',
			],
		],
	},
	{
		title: 'Clásicos de Limón',
		intro: 'Platos con coco, sazón y memoria.',
		items: [
			[
				'Rice & beans con pollo',
				'Arroz y frijoles cocinados con leche de coco y tomillo, pollo caribeño, ensalada y plátano maduro.',
				'₡6.500',
			],
			[
				'Rice & beans con pescado',
				'Arroz y frijoles en leche de coco, pescado, ensalada y plátano maduro.',
				'₡7.000',
			],
			[
				'Rondón',
				'Caldo caribeño de pescado y mariscos con vegetales, tubérculos y coco.',
				'₡7.500',
			],
			[
				'Bochinche casado',
				'Carne en salsa, frijoles molidos, espagueti y patacones.',
				'₡6.500',
			],
		],
	},
	{
		title: 'Del mar y la costa',
		intro: 'El mar Caribe también tiene su lugar en la mesa.',
		items: [
			[
				'Pescado Caribe',
				'Pescado fresco, coco, cítricos y vegetales del día.',
				'₡7.500',
			],
			[
				'Pescado entero frito',
				'Pescado frito con patacones, ensalada y salsa de la casa.',
				'₡8.000',
			],
			[
				'Macarela en escabeche',
				'Macarela marinada con vegetales, especias y acompañamiento del día.',
				'₡6.500',
			],
			[
				'Camarones en salsa caribeña',
				'Camarones en salsa de coco y especias, con arroz y patacones.',
				'₡8.500',
			],
		],
	},
	{
		title: 'Sabores de nuestra raíz',
		intro: 'Recetas e ingredientes que mantienen viva la memoria.',
		items: [
			[
				'Ackee con bacalao',
				'Ackee salteado con bacalao, cebolla, chile y especias caribeñas.',
				'₡7.500',
			],
			[
				'Rabo de res en coco',
				'Rabo de res cocinado lentamente en salsa de coco y especias.',
				'₡8.000',
			],
			[
				'Chuleta caribeña',
				'Chuleta en salsa de la casa, rice & beans y plátano maduro.',
				'₡7.000',
			],
		],
	},
	{
		title: 'Para cerrar',
		intro: 'Un toque dulce para terminar la mesa.',
		items: [
			[
				'Cocada',
				'Dulce tradicional elaborado con coco y azúcar.',
				'₡1.800',
			],
			[
				'Postre de plátano y especias',
				'Plátano maduro, coco y especias cálidas.',
				'₡2.500',
			],
			[
				'Pudín de yuca',
				'Postre suave de yuca con coco y un toque de vainilla.',
				'₡2.500',
			],
		],
	},
	{
		title: 'Para tomarse el Caribe',
		intro: 'Bebidas frescas y sabores de la casa.',
		items: [
			[
				'Hiel',
				'Limón, jengibre y dulce de caña servido bien frío.',
				'₡1.800',
			],
			[
				'Sorrel',
				'Infusión fría de flor de jamaica con especias.',
				'₡2.000',
			],
			[
				'Ginger beer',
				'Bebida refrescante de jengibre con limón.',
				'₡2.000',
			],
			[
				'Agua de pipa',
				'Agua fresca de pipa servida fría.',
				'₡1.800',
			],
			[
				'Fresco de maracuyá',
				'Maracuyá natural preparado en la casa.',
				'₡1.800',
			],
		],
	},
]

function MenuPage() {
	return (
		<main className="page-shell menu-page">
			<section className="page-intro">
				<span className="eyebrow">El sabor del Caribe</span>

				<h1>
					Comida con raíz.


					<em>Sabor de Limón.</em>
				</h1>

				<p className="lead">
					Una carta inspirada en la cocina afrocaribeña limonense: coco,
					plátano, pescado, especias y recetas que nos recuerdan que comer
					también es encontrarnos.
				</p>

				<Link className="button button--primary" to="/reservar">
					Reservar mesa <span>→</span>
				</Link>
			</section>

			<section className="menu-list" aria-label="Menú de Donde Ray">
				{menuSections.map((section) => (
					<section className="menu-section" key={section.title}>
						<h2>{section.title}</h2>

						<p className="menu-section-intro">{section.intro}</p>

						{section.items.map(([name, description, price]) => (
							<Card className="menu-item" key={name}>
								<div className="menu-item-content">
									<h3>{name}</h3>
									<p>{description}</p>
								</div>

								<span className="menu-line" />

								<strong className="menu-price">{price}</strong>
							</Card>
						))}
					</section>
				))}
			</section>

			<section className="menu-footer-note">
				<div>
					<strong>La carta puede variar.</strong>
					<span>
						Trabajamos según disponibilidad de ingredientes y productos
						frescos.
					</span>
				</div>

				<Link className="button button--outline" to="/reservar">
					Reservar ahora <span>→</span>
				</Link>
			</section>
		</main>
	)
}

export default MenuPage
