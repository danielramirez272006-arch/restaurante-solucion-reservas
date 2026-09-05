import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatsSummary from '../../features/admin-dashboard/components/stats-summary';
import { useAdminStats } from '../../features/admin-dashboard/use-admin-stats';
import { useAdminReservations } from '../../features/admin-reservations/use-admin-reservations';
import ReservationDetailModal from '../../features/admin-reservations/components/reservation-detail-modal';
import { getTodayDateString, formatDateToSpanish, formatTime12h } from '../../shared/utils/date-helpers';
import { MAX_CAPACITY_PER_SLOT } from '../../shared/utils/reservation-rules';

const ALL_SLOTS = ['12:00', '13:00', '14:00', '15:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

export default function DashboardPage() {
  const statsState = useAdminStats();
  const reservationState = useAdminReservations();
  const [selected, setSelected] = useState(null);

  const todayStr = getTodayDateString();

  // Filtrar reservas que requieren atención inmediata (Pendientes)
  const pendingRequests = reservationState.reservations.filter(
    (r) => (r.status || r.estado) === 'Pendiente'
  );

  // Reservas del día de hoy
  const todayReservations = reservationState.reservations.filter((r) => {
    const rDate = (r.fecha || r.date || '').slice(0, 10);
    const rStatus = r.status || r.estado;
    return rDate === todayStr && rStatus !== 'Cancelada' && rStatus !== 'Rechazada';
  });

  // Cálculo de aforo de hoy por franja horaria
  const capacityBySlot = {};
  ALL_SLOTS.forEach((s) => (capacityBySlot[s] = 0));
  todayReservations.forEach((r) => {
    const t = r.hora || r.time;
    if (capacityBySlot[t] !== undefined) {
      capacityBySlot[t] += Number(r.personas || r.guests || 1);
    }
  });

  const totalGuestsToday = Object.values(capacityBySlot).reduce((a, b) => a + b, 0);
  const totalMaxCapacityToday = ALL_SLOTS.length * MAX_CAPACITY_PER_SLOT;
  const occupancyPercentage = Math.round((totalGuestsToday / totalMaxCapacityToday) * 100);

  const handleStatusUpdate = async (reservation, newStatus) => {
    await reservationState.changeStatus(reservation.id, newStatus);
    await statsState.reload();
  };

  return (
    <main className="page">
      {/* Encabezado Ejecutivo */}
      <header className="page-heading">
        <div>
          <span className="eyebrow">Centro de Control Operativo · Donde Ray</span>
          <h1>Resumen <em>del servicio.</em></h1>
          <p className="lede">
            Supervisión ejecutiva en tiempo real del aforo de hoy, solicitudes urgentes y métricas clave del restaurante.
          </p>
        </div>
        <div className="dashboard-actions">
          <button
            className="button button--outline"
            type="button"
            onClick={() => {
              reservationState.reload();
              statsState.reload();
            }}
          >
            ↻ Actualizar métricas
          </button>
          <Link className="button button--primary" to="/admin/reservas">
            Libro de reservas <span>→</span>
          </Link>
        </div>
      </header>

      {(statsState.error || reservationState.error) && (
        <div className="notice error">{statsState.error || reservationState.error}</div>
      )}

      {/* Resumen de KPIs Principales (01 al 05) */}
      <StatsSummary stats={statsState.stats} loading={statsState.loading} />

      {/* Monitor de Aforo en Vivo de Hoy */}
      <section className="panel" aria-label="Monitor de aforo de hoy">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Aforo en Tiempo Real</span>
            <h2>Ocupación de hoy <em>({formatDateToSpanish(todayStr)})</em></h2>
          </div>
          <div className="capacity-summary-badge">
            <span>Ocupación global:</span>
            <strong>{occupancyPercentage}%</strong>
            <small>({totalGuestsToday} de {totalMaxCapacityToday} comensales)</small>
          </div>
        </div>

        <div className="slots-occupancy-grid">
          {ALL_SLOTS.map((slot) => {
            const booked = capacityBySlot[slot] || 0;
            const free = Math.max(0, MAX_CAPACITY_PER_SLOT - booked);
            const percent = Math.min(100, Math.round((booked / MAX_CAPACITY_PER_SLOT) * 100));
            const isFull = free === 0;
            const isHigh = booked >= 15;

            return (
              <div key={slot} className={`slot-occupancy-card ${isFull ? 'slot--full' : isHigh ? 'slot--high' : ''}`}>
                <div className="slot-card-header">
                  <strong className="slot-hour">{slot}</strong>
                  <span className={`slot-badge ${isFull ? 'badge--red' : isHigh ? 'badge--yellow' : 'badge--green'}`}>
                    {isFull ? 'Lleno' : `${free} libres`}
                  </span>
                </div>
                <div className="slot-bar-track">
                  <div
                    className="slot-bar-fill"
                    style={{
                      width: `${percent}%`,
                      background: isFull ? '#dc2626' : isHigh ? '#b17a3c' : '#304b3d'
                    }}
                  />
                </div>
                <div className="slot-meta">
                  <span>{booked} / {MAX_CAPACITY_PER_SLOT} comensales</span>
                  <span>{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fila Dual: Solicitudes Urgentes vs Mesas Confirmadas de Hoy */}
      <div className="admin-two-cols-grid">
        {/* Columna 1: Solicitudes que Requieren Respuesta Inmediata */}
        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Bandeja de Entrada</span>
              <h2>Requieren atención <em>({pendingRequests.length})</em></h2>
            </div>
            {pendingRequests.length > 0 && (
              <Link className="text-link" to="/admin/reservas?status=Pendiente">
                Ver en gestor <span>↗</span>
              </Link>
            )}
          </div>

          {pendingRequests.length > 0 ? (
            <div className="pending-requests-list">
              {pendingRequests.map((r) => (
                <div key={r.id} className="pending-item-card">
                  <div className="pending-item-info">
                    <div className="pending-item-header">
                      <strong>{r.guestName || r.cliente || r.name || 'Comensal'}</strong>
                      <span className="status-pill pendiente">Pendiente</span>
                    </div>
                    <div className="pending-item-meta">
                      <span>📅 {r.fecha || r.date}</span>
                      <span>🕒 {formatTime12h(r.hora || r.time)}</span>
                      <span>👥 {r.personas || r.guests || 1} personas</span>
                      <span>🏷️ {r.tipo || r.type || 'Cena'}</span>
                    </div>
                    {(r.notes || r.notas) && (
                      <p className="pending-item-notes">
                        <em>"{r.notes || r.notas}"</em>
                      </p>
                    )}
                  </div>
                  <div className="pending-item-actions">
                    <button
                      type="button"
                      className="button button--small button--primary"
                      disabled={reservationState.updatingId === r.id}
                      onClick={() => handleStatusUpdate(r, 'Confirmada')}
                    >
                      ✓ Confirmar
                    </button>
                    <button
                      type="button"
                      className="button button--small button.danger"
                      disabled={reservationState.updatingId === r.id}
                      onClick={() => handleStatusUpdate(r, 'Rechazada')}
                    >
                      ✕ Rechazar
                    </button>
                    <button
                      type="button"
                      className="button button--small button.ghost"
                      onClick={() => setSelected(r)}
                    >
                      Detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '32px 16px' }}>
              <strong>✨ Todo al día</strong>
              <p>No tienes solicitudes de mesa pendientes de responder en este momento.</p>
            </div>
          )}
        </section>

        {/* Columna 2: Mesas de Hoy (Servicio del Día) */}
        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Servicio del Día</span>
              <h2>Comensales de hoy <em>({todayReservations.length})</em></h2>
            </div>
            <Link className="text-link" to={`/admin/reservas?date=${todayStr}`}>
              Ver detalle <span>↗</span>
            </Link>
          </div>

          {todayReservations.length > 0 ? (
            <div className="today-arrivals-list">
              {todayReservations.map((r) => (
                <div key={r.id} className="today-arrival-card">
                  <div className="today-arrival-time">
                    <strong>{r.hora || r.time}</strong>
                    <small>{r.tipo || r.type || 'Servicio'}</small>
                  </div>
                  <div className="today-arrival-content">
                    <div className="today-arrival-name">
                      <strong>{r.guestName || r.cliente || r.name}</strong>
                      <span className="arrival-guests">{r.personas || r.guests || 1} personas</span>
                    </div>
                    <span className="today-arrival-phone">{r.phone || r.telefono || 'Sin teléfono'}</span>
                  </div>
                  <button
                    type="button"
                    className="button button--small button.ghost"
                    onClick={() => setSelected(r)}
                  >
                    Ver ficha
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '32px 16px' }}>
              <strong>Sin reservas para hoy</strong>
              <p>Aún no hay mesas confirmadas registradas para el servicio de hoy.</p>
              <Link className="button button--small button--outline" to="/admin/reservas">
                + Crear reserva manual
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Modal de Detalle */}
      {selected && <ReservationDetailModal reservation={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
