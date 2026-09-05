import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/use-auth'
import { useReservations } from '../../features/client-reservations/use-reservations'
import {
  formatDateToSpanish,
  formatTime12h,
  isFutureReservation,
} from '../../shared/utils/date-helpers'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { reservations, loading } = useReservations(user)

  const totalCount = reservations.length
  const pendingCount = reservations.filter(
    (reservation) => (reservation.status || reservation.estado) === 'Pendiente'
  ).length
  const confirmedCount = reservations.filter(
    (reservation) => (reservation.status || reservation.estado) === 'Confirmada'
  ).length

  const nextReservation = reservations.find(
    (reservation) =>
      isFutureReservation(reservation.date, reservation.time) &&
      (reservation.status || reservation.estado) !== 'Cancelada'
  )

  const firstName = user?.name?.split(' ')[0] || 'cliente'

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link className="brand" to="/dashboard">
          <span className="brand-mark">DR</span>
          <span>
            <strong>Donde Ray</strong>
            <small>Sabor del Caribe limonense</small>
          </span>
        </Link>

        <nav className="dashboard-nav-links" aria-label="Navegación del cliente">
          <Link to="/dashboard">Mi panel</Link>
          <Link to="/reservar">Reservar mesa</Link>
          <Link to="/mis-reservas">Mis reservas</Link>
          <button type="button" onClick={logout}>
            Salir
          </button>
        </nav>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-welcome">
          <div>
            <p className="eyebrow">Tu espacio en Donde Ray</p>
            <h1>
              Hola, {firstName}.


              <em>Qué bueno verte.</em>
            </h1>
            <p className="dashboard-intro">
              Desde aquí podés revisar tus visitas, consultar el estado de una
              reserva o preparar tu próxima mesa en el Caribe.
            </p>
          </div>

          <Link className="button button--primary" to="/reservar">
            Nueva reserva <span>→</span>
          </Link>
        </div>

        <div className="dashboard-rhythm" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="stats-grid">
          <article className="stat-card stat-card--main">
            <span>Reservas totales</span>
            <strong>{loading ? '...' : totalCount}</strong>
            <small>Tu historial completo</small>
          </article>

          <article className="stat-card">
            <span>Pendientes</span>
            <strong>{loading ? '...' : pendingCount}</strong>
            <small>Esperando confirmación</small>
          </article>

          <article className="stat-card">
            <span>Confirmadas</span>
            <strong>{loading ? '...' : confirmedCount}</strong>
            <small>Listas para disfrutarse</small>
          </article>
        </div>

        <section className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div>
              <p className="eyebrow">Próxima visita</p>
              <h2>Tu mesa te espera</h2>
            </div>

            <Link className="text-link" to="/mis-reservas">
              Ver todas <span>↗</span>
            </Link>
          </div>

          {nextReservation ? (
            <div className="next-reservation-card">
              <div className="next-reservation-date">
                <span>Fecha de visita</span>
                <strong>{formatDateToSpanish(nextReservation.date)}</strong>
              </div>

              <div className="next-reservation-details">
                <div className="next-reservation-status-row">
                  <span className="reservation-label">Estado</span>
                  <span
                    className={`status ${String(
                      nextReservation.status || nextReservation.estado || ''
                    ).toLowerCase()}`}
                  >
                    {nextReservation.status || nextReservation.estado}
                  </span>
                </div>

                <div className="reservation-facts">
                  <span>
                    <strong>Hora</strong>
                    {formatTime12h(nextReservation.time)}
                  </span>

                  <span>
                    <strong>Personas</strong>
                    {nextReservation.guests}{' '}
                    {nextReservation.guests === 1 ? 'persona' : 'personas'}
                  </span>

                  <span>
                    <strong>Tipo</strong>
                    {nextReservation.type || 'Cena'}
                  </span>
                </div>

                <Link className="button button--primary" to="/mis-reservas">
                  Ver detalles <span>→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-mark" aria-hidden="true">
                DR
              </div>

              <strong>Aún no tenés reservas activas.</strong>

              <p>
                Prepará tu próxima visita y vení a compartir una mesa con sabor de
                Limón.
              </p>

              <Link className="button button--primary" to="/reservar">
                Reservar mesa <span>→</span>
              </Link>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}