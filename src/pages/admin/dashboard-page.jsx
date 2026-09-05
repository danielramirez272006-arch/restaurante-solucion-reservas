import { useState } from 'react';
import StatsSummary from '../../features/admin-dashboard/components/stats-summary';
import { useAdminStats } from '../../features/admin-dashboard/use-admin-stats';
import { useAdminReservations } from '../../features/admin-reservations/use-admin-reservations';
import DateFilters from '../../features/admin-reservations/components/date-filters';
import ReservationsTable from '../../features/admin-reservations/components/reservations-table';
import ReservationDetailModal from '../../features/admin-reservations/components/reservation-detail-modal';

export default function DashboardPage() {
  const statsState = useAdminStats();
  const reservationState = useAdminReservations();
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  const filtered = reservationState.reservations.filter((item) => {
    const itemDate = (item.fecha || item.date || '').slice(0, 10);
    const itemStatus = item.estado || item.status;
    const matchDate = !date || itemDate === date;
    const matchStatus = !status || itemStatus === status;
    return matchDate && matchStatus;
  });

  const refresh = async (reservation, nextStatus) => {
    await reservationState.changeStatus(reservation.id, nextStatus);
    await statsState.reload();
  };

  return (
    <main className="page">
      {/* Encabezado Editorial del Panel de Administración */}
      <header className="page-heading">
        <div>
          <span className="eyebrow">Donde Ray · Puerto Viejo de Talamanca</span>
          <h1>Resumen <em>operativo.</em></h1>
          <p className="lede">
            Supervisa en tiempo real el ritmo del restaurante, el aforo por turnos y gestiona las solicitudes de mesa.
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
            ↻ Actualizar datos
          </button>
        </div>
      </header>

      {(statsState.error || reservationState.error) && (
        <div className="notice error">{statsState.error || reservationState.error}</div>
      )}

      {/* Resumen de Métricas (01, 02, 03, 04, 05) */}
      <StatsSummary stats={statsState.stats} loading={statsState.loading} />

      {/* Panel de Reservas Recientes */}
      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Agenda del Restaurante</span>
            <h2>Reservas <em>recientes</em></h2>
          </div>
          <DateFilters
            date={date}
            status={status}
            onDateChange={setDate}
            onStatusChange={setStatus}
            onClear={() => {
              setDate('');
              setStatus('');
            }}
          />
        </div>

        <ReservationsTable
          reservations={filtered}
          loading={reservationState.loading}
          error={reservationState.error}
          updatingId={reservationState.updatingId}
          onStatusChange={refresh}
          onView={setSelected}
        />
      </section>

      {/* Modal de Detalle de Reserva */}
      <ReservationDetailModal reservation={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
