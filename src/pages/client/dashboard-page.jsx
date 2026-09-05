import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/use-auth';
import { useReservations } from '../../features/client-reservations/use-reservations';
import { formatDateToSpanish, formatTime12h, isFutureReservation } from '../../shared/utils/date-helpers';

export default function DashboardPage() {
  const { user } = useAuth();
  const { reservations, loading } = useReservations(user);

  const totalCount = reservations.length;
  const pendingCount = reservations.filter((r) => (r.status || r.estado) === 'Pendiente').length;
  const confirmedCount = reservations.filter((r) => (r.status || r.estado) === 'Confirmada').length;

  const nextReservation = reservations.find(
    (r) => isFutureReservation(r.date, r.time) && (r.status || r.estado) !== 'Cancelada'
  );

  return (
    <main className="reservation-shell">
      {/* Encabezado del Dashboard de Cliente */}
      <header className="page-heading">
        <div>
          <p className="eyebrow">Área del comensal</p>
          <h1>Hola, {user?.name?.split(' ')[0] || 'Cliente'}.</h1>
          <p className="lede">Supervisa el estado de tus reservas y asegura tu próxima visita a Donde Ray.</p>
        </div>
        <div className="dashboard-actions">
          <Link className="button button--primary" to="/reservar">
            + Nueva reserva
          </Link>
          <Link className="button button--outline" to="/mis-reservas">
            Ver mis reservas
          </Link>
        </div>
      </header>

      {/* Tarjetas de Métricas de Reservas */}
      <section className="stats-grid" aria-label="Resumen de actividad">
        <article className="stat-card">
          <span className="stat-label">Reservas totales</span>
          <strong className="stat-value">{loading ? '...' : totalCount}</strong>
          <small className="stat-caption">Historial completo</small>
        </article>
        <article className="stat-card stat-card--pending">
          <span className="stat-label">Pendientes</span>
          <strong className="stat-value">{loading ? '...' : pendingCount}</strong>
          <small className="stat-caption">En revisión por cocina</small>
        </article>
        <article className="stat-card stat-card--confirmed">
          <span className="stat-label">Confirmadas</span>
          <strong className="stat-value">{loading ? '...' : confirmedCount}</strong>
          <small className="stat-caption">Listas para disfrutar</small>
        </article>
      </section>

      {/* Próxima Visita */}
      <section className="panel-card">
        <div className="panel-card-header">
          <div>
            <p className="eyebrow">Actividad</p>
            <h2>Tu próxima visita</h2>
          </div>
        </div>

        {nextReservation ? (
          <div className="next-visit-card">
            <div className="next-visit-header">
              <div>
                <strong className="next-visit-date">{formatDateToSpanish(nextReservation.date)}</strong>
                <span className="next-visit-meta">
                  🕒 {formatTime12h(nextReservation.time)} • 👥 {nextReservation.guests} {nextReservation.guests === 1 ? 'persona' : 'personas'} • 🏷️ {nextReservation.type || 'Cena'}
                </span>
              </div>
              <span className={`status-pill ${String(nextReservation.status || nextReservation.estado || '').toLowerCase()}`}>
                {nextReservation.status || nextReservation.estado}
              </span>
            </div>

            <div className="next-visit-actions">
              <Link className="button button--small button--primary" to="/mis-reservas">
                Ver detalle y comprobante QR →
              </Link>
              <Link className="button button--small button--outline" to="/reservar">
                Hacer otra reserva
              </Link>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <strong>Aún no tienes reservas activas próximas.</strong>
            <p>Descubre el menú caribeño contemporáneo y agenda tu mesa en segundos con confirmación inmediata.</p>
            <Link className="button button--primary" to="/reservar">
              Reservar una mesa ahora
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}