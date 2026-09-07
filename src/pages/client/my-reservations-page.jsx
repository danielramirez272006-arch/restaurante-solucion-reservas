import { useState } from 'react';
import { useReservations } from '../../features/client-reservations/use-reservations.js';
import { ReservationCard } from '../../features/client-reservations/components/reservation-card.jsx';
import { VoucherTicket } from '../../features/client-reservations/components/voucher-ticket.jsx';
import { isFutureReservation } from '../../shared/utils/date-helpers.js';

export const MyReservationsPage = () => {
  const {
    currentUser,
    reservations,
    loading,
    actionLoading,
    error,
    rescheduleReservation,
    cancelUserReservation,
    loadUserReservations,
    activeVoucher,
    setActiveVoucher,
    clearVoucher
  } = useReservations();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('ALL'); // 'ALL', 'UPCOMING', 'PAST'
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado local según estado, tiempo (próximas vs pasadas) y término de búsqueda
  const filteredReservations = reservations.filter((res) => {
    // Filtro por tab de estado
    if (activeFilter !== 'ALL') {
      if (activeFilter === 'PENDING' && res.status !== 'Pendiente') return false;
      if (activeFilter === 'CONFIRMED' && res.status !== 'Confirmada') return false;
      if (activeFilter === 'CANCELLED' && res.status !== 'Cancelada') return false;
    }

    // Filtro temporal: próximas vs pasadas
    if (timeFilter === 'UPCOMING' && !isFutureReservation(res.date, res.time)) {
      return false;
    }
    if (timeFilter === 'PAST' && isFutureReservation(res.date, res.time)) {
      return false;
    }

    // Filtro de búsqueda textual
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchId = String(res.id).toLowerCase().includes(term);
      const matchType = (res.type || '').toLowerCase().includes(term);
      const matchDate = (res.date || '').includes(term);
      const matchName = (res.guestName || '').toLowerCase().includes(term);
      return matchId || matchType || matchDate || matchName;
    }

    return true;
  });

  const counts = {
    all: reservations.length,
    pending: reservations.filter((r) => r.status === 'Pendiente').length,
    confirmed: reservations.filter((r) => r.status === 'Confirmada').length,
    cancelled: reservations.filter((r) => r.status === 'Cancelada').length,
    upcoming: reservations.filter((r) => isFutureReservation(r.date, r.time)).length
  };

  /**
   * Exporta las reservas del usuario actual a un archivo CSV estructurado
   */
  const handleExportCSV = () => {
    if (!reservations || reservations.length === 0) {
      alert('No hay reservas para exportar.');
      return;
    }

    const headers = ['ID', 'Titular', 'Fecha', 'Hora', 'Personas', 'Ocasion', 'Estado', 'Telefono', 'Email', 'Notas'];
    const rows = reservations.map((r) => [
      `"${r.id}"`,
      `"${r.guestName || ''}"`,
      `"${r.date || ''}"`,
      `"${r.time || ''}"`,
      r.guests || 1,
      `"${r.type || ''}"`,
      `"${r.status || 'Pendiente'}"`,
      `"${r.phone || ''}"`,
      `"${r.email || ''}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const encodedUri = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mis-reservas-donde-ray-${currentUser?.id || 'cliente'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(encodedUri);
  };

  return (
    <div className="reservation-shell">
      {/* Header */}
      <header className="page-intro reservation-intro">
        <span className="eyebrow">Mis Reservas · Donde Ray</span>
        <h1>Tus mesas<br /><em>y experiencias.</em></h1>
        <p className="lead">
          Historial y gestión de tus reservas exclusivas registradas a nombre de{' '}
          <strong style={{ color: '#fae4a8' }}>{currentUser?.guestName || currentUser?.id}</strong>.
        </p>
      </header>

      {/* Barra de Filtros Temporales (Próximas vs Pasadas) y Exportación */}
      <div style={styles.subBar}>
        <div style={styles.timeFilterGroup}>
          <button
            type="button"
            onClick={() => setTimeFilter('ALL')}
            style={{
              ...styles.pillBtn,
              ...(timeFilter === 'ALL' ? styles.pillBtnActive : {})
            }}
          >
            Todas las Fechas
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('UPCOMING')}
            style={{
              ...styles.pillBtn,
              ...(timeFilter === 'UPCOMING' ? styles.pillBtnActive : {})
            }}
          >
            Próximas ({counts.upcoming})
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('PAST')}
            style={{
              ...styles.pillBtn,
              ...(timeFilter === 'PAST' ? styles.pillBtnActive : {})
            }}
          >
            Historial
          </button>
        </div>

        {reservations.length > 0 && (
          <button
            type="button"
            onClick={handleExportCSV}
            style={styles.exportBtn}
            title="Descargar listado en archivo Excel / CSV"
          >
            Exportar CSV ↓
          </button>
        )}
      </div>

      {/* Barra de Filtros por Estado y Búsqueda */}
      <div style={styles.toolbar}>
        <div style={styles.tabsRow}>
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            style={{
              ...styles.tabBtn,
              ...(activeFilter === 'ALL' ? styles.tabBtnActive : {})
            }}
          >
            Todas ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('PENDING')}
            style={{
              ...styles.tabBtn,
              ...(activeFilter === 'PENDING' ? styles.tabBtnActive : {})
            }}
          >
            Pendientes ({counts.pending})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('CONFIRMED')}
            style={{
              ...styles.tabBtn,
              ...(activeFilter === 'CONFIRMED' ? styles.tabBtnActive : {})
            }}
          >
            Confirmadas ({counts.confirmed})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('CANCELLED')}
            style={{
              ...styles.tabBtn,
              ...(activeFilter === 'CANCELLED' ? styles.tabBtnActive : {})
            }}
          >
            Canceladas ({counts.cancelled})
          </button>
        </div>

        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Buscar por fecha, código o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button
            type="button"
            onClick={loadUserReservations}
            title="Recargar reservas"
            style={styles.refreshBtn}
            aria-label="Recargar lista"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div style={styles.errorAlert} role="alert">
          <span>{error}</span>
          <button type="button" onClick={loadUserReservations} style={styles.retryBtn}>
            Reintentar
          </button>
        </div>
      )}

      {/* Estado de Carga */}
      {loading ? (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <span>Cargando tus reservas desde el servidor...</span>
        </div>
      ) : filteredReservations.length === 0 ? (
        /* Estado Vacío */
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>✦</div>
          <h3 style={styles.emptyTitle}>No se encontraron reservas</h3>
          <p style={styles.emptyText}>
            {searchTerm
              ? 'No hay reservas que coincidan con tu búsqueda.'
              : timeFilter === 'UPCOMING'
                ? 'No tienes reservas próximas por el momento.'
                : activeFilter !== 'ALL'
                  ? `No tienes reservas en estado "${activeFilter}".`
                  : 'Aún no has registrado ninguna reserva en Donde Ray.'}
          </p>
          <a href="#/reservar" style={styles.bookNowBtn}>
            Crear Nueva Reserva →
          </a>
        </div>
      ) : (
        /* Lista de Tarjetas */
        <div style={styles.grid}>
          {filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onViewVoucher={setActiveVoucher}
              onCancel={cancelUserReservation}
              onReschedule={rescheduleReservation}
              isCancelling={actionLoading}
            />
          ))}
        </div>
      )}

      {/* Modal de Voucher Ticket */}
      {activeVoucher && (
        <VoucherTicket reservation={activeVoucher} onClose={clearVoucher} />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px 80px',
    color: '#f0e6cc',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  badge: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '2px',
    color: '#fae4a8',
    background: 'rgba(200, 134, 10, 0.15)',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(200, 134, 10, 0.35)',
    textTransform: 'uppercase'
  },
  title: {
    margin: 0,
    fontSize: 'clamp(32px, 4vw, 44px)',
    fontFamily: 'var(--font-display, "Fraunces", serif)',
    fontWeight: '700',
    color: '#f0e6cc'
  },
  subtitle: {
    margin: 0,
    fontSize: '15px',
    color: 'rgba(240, 230, 204, 0.75)'
  },
  subBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '8px'
  },
  timeFilterGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  pillBtn: {
    background: 'rgba(17, 38, 29, 0.75)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(200, 134, 10, 0.28)',
    borderRadius: '20px',
    padding: '8px 18px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'rgba(240, 230, 204, 0.85)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
  },
  pillBtnActive: {
    background: 'linear-gradient(135deg, #c8860a 0%, #a66a04 100%)',
    borderColor: '#fae4a8',
    color: '#0d1f17',
    fontWeight: '700',
    boxShadow: '0 4px 14px rgba(200, 134, 10, 0.35)'
  },
  exportBtn: {
    background: 'rgba(200, 134, 10, 0.12)',
    border: '1px solid rgba(200, 134, 10, 0.35)',
    borderRadius: '20px',
    padding: '8px 18px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fae4a8',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    background: '#11261d',
    border: '1px solid rgba(200, 134, 10, 0.3)',
    borderRadius: '14px',
    padding: '14px 18px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)'
  },
  tabsRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  tabBtn: {
    background: 'transparent',
    border: '1px solid transparent',
    color: 'rgba(240, 230, 204, 0.7)',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tabBtnActive: {
    background: 'rgba(200, 134, 10, 0.18)',
    color: '#fae4a8',
    border: '1px solid rgba(200, 134, 10, 0.45)',
    fontWeight: '700'
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: '1 1 260px',
    maxWidth: '380px'
  },
  searchInput: {
    flex: 1,
    background: '#0d1e16',
    border: '1px solid rgba(200, 134, 10, 0.3)',
    borderRadius: '8px',
    color: '#f0e6cc',
    padding: '10px 14px',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  refreshBtn: {
    background: 'rgba(200, 134, 10, 0.15)',
    border: '1px solid rgba(200, 134, 10, 0.35)',
    borderRadius: '8px',
    color: '#fae4a8',
    padding: '9px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  errorAlert: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    color: '#fca5a5',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '13px'
  },
  retryBtn: {
    background: '#ef4444',
    border: 'none',
    color: '#ffffff',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '60px 20px',
    color: 'rgba(240, 230, 204, 0.75)'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(200, 134, 10, 0.2)',
    borderTop: '3px solid #c8860a',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  emptyCard: {
    background: '#11261d',
    border: '1px dashed rgba(200, 134, 10, 0.35)',
    borderRadius: '16px',
    padding: '60px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
  },
  emptyIcon: {
    fontSize: '48px',
    opacity: 0.9
  },
  emptyTitle: {
    margin: 0,
    fontSize: '22px',
    fontFamily: 'var(--font-display, "Fraunces", serif)',
    color: '#fae4a8',
    fontWeight: '700'
  },
  emptyText: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(240, 230, 204, 0.75)',
    maxWidth: '400px'
  },
  bookNowBtn: {
    marginTop: '10px',
    background: 'linear-gradient(135deg, #c8860a 0%, #a66a04 100%)',
    color: '#0d1f17',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '13px',
    fontWeight: '700',
    textDecoration: 'none',
    boxShadow: '0 4px 14px rgba(200, 134, 10, 0.35)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px'
  }
};
