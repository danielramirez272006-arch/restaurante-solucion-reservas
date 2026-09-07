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
      {/* Encabezado Editorial de Cliente */}
      <header className="page-heading">
        <div>
          <span className="eyebrow">Portal de Clientes · Puerto Viejo</span>
          <h1>
            Hola, {user?.name?.split(' ')[0] || 'Cliente'}.<br />
            <em>Tu mesa te espera.</em>
          </h1>
          <p className="lede">
            Supervisa tus visitas a Donde Ray, accede a tus comprobantes con código QR y asegura tu lugar en nuestra mesa de alta cocina.
          </p>
        </div>
        <div className="dashboard-actions">
          <Link className="button button--primary" to="/reservar">
            Reservar una mesa <span>→</span>
          </Link>
          <Link className="button button--outline" to="/mis-reservas">
            Mis reservas
          </Link>
        </div>
      </header>

      {/* Tarjetas de Métricas con Estilo Editorial de la Página Principal */}
      <section className="stats-grid" aria-label="Resumen de actividad">
        <article className="stat-card">
          <div className="stat-card-top">
            <span className="card-number">01</span>
            <span className="stat-label">Reservas Totales</span>
          </div>
          <strong className="stat-value">{loading ? '...' : totalCount}</strong>
          <small className="stat-caption">Historial de visitas registrado</small>
        </article>

        <article className="stat-card stat-card--pending">
          <div className="stat-card-top">
            <span className="card-number">02</span>
            <span className="stat-label">En Espera</span>
          </div>
          <strong className="stat-value">{loading ? '...' : pendingCount}</strong>
          <small className="stat-caption">En validación por el equipo</small>
        </article>

        <article className="stat-card stat-card--confirmed">
          <div className="stat-card-top">
            <span className="card-number">03</span>
            <span className="stat-label">Confirmadas</span>
          </div>
          <strong className="stat-value">{loading ? '...' : confirmedCount}</strong>
          <small className="stat-caption">Listas con aforo garantizado</small>
        </article>
      </section>

      {/* Próxima Visita / Experiencia */}
      <section className="panel-card">
        <div className="panel-card-header">
          <div>
            <span className="eyebrow">Próxima Cita</span>
            <h2>Tu próxima visita <em>al Caribe</em></h2>
          </div>
          {nextReservation && (
            <Link className="text-link" to="/mis-reservas">
              Ver todas mis reservas <span>↗</span>
            </Link>
          )}
        </div>

        {nextReservation ? (
          <div className="next-visit-card">
            <div className="next-visit-header">
              <div>
                <strong className="next-visit-date">{formatDateToSpanish(nextReservation.date)}</strong>
                <span className="next-visit-meta">
                   {formatTime12h(nextReservation.time)} &nbsp;·&nbsp;  {nextReservation.guests} {nextReservation.guests === 1 ? 'persona' : 'personas'} &nbsp;·&nbsp;  {nextReservation.type || 'Cena'} &nbsp;·&nbsp;  Playa Chiquita
                </span>
              </div>
              <span className={`status-pill ${String(nextReservation.status || nextReservation.estado || '').toLowerCase()}`}>
                {nextReservation.status || nextReservation.estado}
              </span>
            </div>

            <div className="next-visit-actions">
              <Link className="button button--small button--primary" to="/mis-reservas">
                Ver comprobante digital y QR <span>→</span>
              </Link>
              <Link className="button button--small button--outline" to="/reservar">
                Hacer otra reserva
              </Link>
              <Link className="text-link" to="/menu" style={{ marginLeft: 'auto' }}>
                Ver carta recomendada <span>↗</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <strong>Aún no tienes una mesa agendada próximamente.</strong>
            <p>
              Nuestra cocina rinde homenaje a la pesca fresca del día y a los sabores de la leche de coco y jengibre frente al mar.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
              <Link className="button button--primary" to="/reservar">
                Reservar una mesa ahora <span>→</span>
              </Link>
              <Link className="button button--outline" to="/menu">
                Explorar la carta <span>↗</span>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Sección de Descubrimiento Rápido estilo Homepage */}
      <section className="client-shortcuts-strip">
        <article className="shortcut-card">
          <span className="card-number">01</span>
          <h3>Menú de Autor</h3>
          <p>Rondón de mariscos al caldero, pesca fresca del día y cacao orgánico de Talamanca.</p>
          <Link className="text-link" to="/menu">Ver menú <span>↗</span></Link>
        </article>
        <article className="shortcut-card">
          <span className="card-number">02</span>
          <h3>Comprobantes y Código QR</h3>
          <p>Descarga tus vouchers en PDF y sincroniza las fechas con Google Calendar en 1 clic.</p>
          <Link className="text-link" to="/mis-reservas">Ver mis tickets <span>→</span></Link>
        </article>
        <article className="shortcut-card">
          <span className="card-number">03</span>
          <h3>Concierge Ray en Vivo</h3>
          <p>¿Dudas con aforo, dietas o parqueo? Nuestro concierge interactivo te asiste al instante.</p>
          <Link className="text-link" to="/reservar">Reservar con Ray <span>→</span></Link>
        </article>
      </section>
    </main>
  );
}