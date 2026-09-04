import { Link } from 'react-router-dom'
import Card from '../../shared/components/ui/card.jsx'

const menuSections = [{ title: 'Para empezar', items: [['Pan de masa madre', 'manteca ahumada y sal de mar'], ['Remolachas asadas', 'yogur de cabra, eneldo y avellanas'], ['Pesca curada', 'cítricos, hinojo y aceite verde']] }, { title: 'Del fuego', items: [['Pesca del día', 'maíz, puerro y beurre blanc'], ['Pato a la brasa', 'ciruela, repollo y mostaza antigua'], ['Arroz de hongos', 'calabaza, tomillo y queso de campo']] }, { title: 'Para cerrar', items: [['Membrillo y queso azul', 'nuez tostada y miel'], ['Chocolate amargo', 'café, sal y aceite de oliva']] }]

function MenuPage() {
	return <main className="page-shell menu-page"><div className="page-intro"><span className="eyebrow">La carta</span><h1>Comer es<br /><em>estar presente.</em></h1><p className="lead">Una selección breve que cambia con el mercado. La carta es orientativa y puede variar según disponibilidad.</p></div><div className="menu-list">{menuSections.map((section) => <section className="menu-section" key={section.title}><h2>{section.title}</h2>{section.items.map(([name, description]) => <Card className="menu-item" key={name}><div><h3>{name}</h3><p>{description}</p></div><span className="menu-line" /></Card>)}</section>)}</div><div className="menu-footer-note"><span>Menú degustación disponible en sala</span><Link className="text-link" to="/reservas">Consultar reserva <span>→</span></Link></div></main>
}

export default MenuPage
