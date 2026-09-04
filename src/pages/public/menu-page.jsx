import { Link } from 'react-router-dom'
import Card from '../../shared/components/ui/card.jsx'

const menuSections = [
	{
		title: 'Antojitos caribeños',
		items: [
			['Paty', 'Empanada de masa especiada, rellena de carne sazonada al estilo limonense.'],
			['Chifrijo caribeño', 'Arroz con frijoles, chicharrón, pico de gallo, aguacate y un toque de chile panameño.'],
			['Plantintá', 'Empanada dulce de masa de maíz rellena de plátano maduro y especias.'],
		],
	},
	{
		title: 'Platos de la costa',
		items: [
			['Rice and beans con pollo', 'Arroz y frijoles cocinados con leche de coco, pollo guisado y ensalada fresca.'],
			['Rice and beans con macarela', 'Arroz y frijoles en leche de coco, macarela dorada, patacones y curtido.'],
			['Rice and beans con rabo', 'Arroz y frijoles caribeños, rabo de res cocido lentamente y vegetales criollos.'],
			['Rondón', 'Sopa caribeña de pescado, mariscos, tubérculos y leche de coco con hierbas frescas.'],
		],
	},
	{
		title: 'Para compartir',
		items: [
			['Patacones con ceviche caribeño', 'Plátano verde crujiente, pescado marinado, culantro y cítricos.'],
			['Coco y tapa de dulce', 'Bocado dulce de coco, tapa de dulce y especias de la costa.'],
		],
	},
]

function MenuPage() {
	return <main className="page-shell menu-page"><div className="page-intro"><span className="eyebrow">La carta · Caribe costarricense</span><h1>Sabores de la costa<br /><em>en nuestra mesa.</em></h1><p className="lead">Recetas con memoria, coco, chile y fuego. Una selección inspirada en la cocina caribeña de Costa Rica, preparada para compartir.</p></div><div className="menu-list">{menuSections.map((section) => <section className="menu-section" key={section.title}><h2>{section.title}</h2>{section.items.map(([name, description]) => <Card className="menu-item" key={name}><div><h3>{name}</h3><p>{description}</p></div><span className="menu-line" /></Card>)}</section>)}</div><div className="menu-footer-note"><span>La carta puede variar según disponibilidad</span><Link className="text-link" to="/reservas">Consultar reserva <span>→</span></Link></div></main>
}

export default MenuPage
