import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/use-auth'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return <main className="dashboard-page">
    <header className="dashboard-header">
      <Link className="brand" to="/dashboard"><span className="brand-mark">DR</span><span><strong>Donde Ray</strong><small>Cocina con carácter</small></span></Link>
      <nav className="dashboard-nav-links" aria-label="Navegación del cliente">
        <Link to="/dashboard">Inicio</Link>
        <Link to="/reservar">Nueva reserva</Link>
        <Link to="/mis-reservas">Mis reservas</Link>
        <button type="button" onClick={logout}>Cerrar sesión</button>
      </nav>
    </header>
    <section className="dashboard-content">
      <div className="page-heading"><div><p className="eyebrow">Área del cliente</p><h1>Hola, {user?.name?.split(' ')[0] || 'cliente'}.</h1><p>Gestiona tus próximas visitas a Donde Ray.</p></div><Link className="button button-accent" to="/reservar">Nueva reserva</Link></div>
      <div className="stats-grid"><article className="stat-card"><span>Reservas totales</span><strong>0</strong></article><article className="stat-card"><span>Pendientes</span><strong>0</strong></article><article className="stat-card"><span>Confirmadas</span><strong>0</strong></article></div>
      <section className="panel-card"><p className="eyebrow">Actividad</p><h2>Tu próxima visita</h2><div className="empty-state"><strong>Aún no tienes reservas.</strong><p>Solicita tu primera mesa y te ayudaremos a encontrar el mejor horario.</p><Link className="button button-dark" to="/reservar">Solicitar una mesa</Link></div></section>
    </section>
  </main>
}