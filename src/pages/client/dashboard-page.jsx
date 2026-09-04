import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/use-auth'
import { useReservations } from '../../features/client-reservations/use-reservations'
import { formatDateToSpanish, formatTime12h, isFutureReservation } from '../../shared/utils/date-helpers'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { reservations, loading } = useReservations(user)

  const totalCount = reservations.length
  const pendingCount = reservations.filter((r) => (r.status || r.estado) === 'Pendiente').length
  const confirmedCount = reservations.filter((r) => (r.status || r.estado) === 'Confirmada').length

  const nextReservation = reservations.find(
    (r) => isFutureReservation(r.date, r.time) && (r.status || r.estado) !== 'Cancelada'
  )

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link className="brand" to="/dashboard">
          <span className="brand-mark">DR</span>
          <span><strong>Donde Ray</strong><small>Cocina con carácter</small></span>
        </Link>
        <nav className="dashboard-nav-links" aria-label="Navegación del cliente">
          <Link to="/dashboard">Inicio</Link>
          <Link to="/reservar">Nueva reserva</Link>
          <Link to="/mis-reservas">Mis reservas</Link>
          <button type="button" onClick={logout}>Cerrar sesión</button>
        </nav>
      </header>
      <section className="dashboard-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Área del cliente</p>
            <h1>Hola, {user?.name?.split(' ')[0] || 'cliente'}.</h1>
            <p>Gestiona tus próximas visitas a Donde Ray.</p>
          </div>
          <Link className="button button-accent" to="/reservar">Nueva reserva</Link>
        </div>
        <div className="stats-grid">
          <article className="stat-card">
            <span>Reservas totales</span>
            <strong>{loading ? '...' : totalCount}</strong>
          </article>
          <article className="stat-card">
            <span>Pendientes</span>
            <strong>{loading ? '...' : pendingCount}</strong>
          </article>
          <article className="stat-card">
            <span>Confirmadas</span>
            <strong>{loading ? '...' : confirmedCount}</strong>
          </article>
        </div>
        <section className="panel-card">
          <p className="eyebrow">Actividad</p>
          <h2>Tu próxima visita</h2>
          {nextReservation ? (
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '16px', color: '#ffd89b' }}>{formatDateToSpanish(nextReservation.date)}</strong>
                <span className={`status ${String(nextReservation.status || nextReservation.estado || '').toLowerCase()}`}>
                  {nextReservation.status || nextReservation.estado}
                </span>
              </div>
              <p style={{ margin: '4px 0', color: '#d1d5db', fontSize: '13px' }}>
                🕒 {formatTime12h(nextReservation.time)} • 👥 {nextReservation.guests} {nextReservation.guests === 1 ? 'persona' : 'personas'} • 🏷️ {nextReservation.type || 'Cena'}
              </p>
              <div style={{ marginTop: '14px' }}>
                <Link className="button button-accent" to="/mis-reservas" style={{ padding: '6px 14px', fontSize: '13px', textDecoration: 'none', display: 'inline-block' }}>
                  Ver en Mis Reservas
                </Link>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <strong>Aún no tienes reservas activas.</strong>
              <p>Solicita tu primera mesa y te ayudaremos a encontrar el mejor horario.</p>
              <Link className="button button-dark" to="/reservar">Solicitar una mesa</Link>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}