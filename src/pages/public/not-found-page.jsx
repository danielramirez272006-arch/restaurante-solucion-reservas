import { Link } from 'react-router-dom'

function NotFoundPage() {
	return <main className="page-shell page-shell--centered"><span className="eyebrow">404</span><h1>Esta mesa<br /><em>no existe.</em></h1><p className="lead">La página que buscas cambió de lugar o nunca estuvo en la carta.</p><Link className="button button--primary" to="/">Volver al inicio</Link></main>
}

export default NotFoundPage
