import { useState } from 'react';
import { useReservations } from '../../features/client-reservations/use-reservations.js';
import { ReservationCard } from '../../features/client-reservations/components/reservation-card.jsx';
import { VoucherTicket } from '../../features/client-reservations/components/voucher-ticket.jsx';

export const MyReservationsPage = () => {
  const {
    currentUser,
    reservations,
    loading,
    actionLoading,
    error,
    cancelUserReservation,
    loadUserReservations,
    activeVoucher,
    setActiveVoucher,
    clearVoucher
  } = useReservations();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado local según pestaña y término de búsqueda
  const filteredReservations = reservations.filter((res) => {
    // Filtro por tab de estado
    if (activeFilter !== 'ALL') {
      if (activeFilter === 'PENDING' && res.status !== 'Pendiente') return false;
      if (activeFilter === 'CONFIRMED' && res.status !== 'Confirmada') return false;
      if (activeFilter === 'CANCELLED' && res.status !== 'Cancelada') return false;
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
    cancelled: reservations.filter((r) => r.status === 'Cancelada').length
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <span style={styles.badge}>CLIENTE • DONDE RAY</span>
        <h1 style={styles.title}>Mis Reservas</h1>
        <p style={styles.subtitle}>
          Historial y gestión de tus reservas exclusivas para el comensal{' '}
          <strong style={{ color: '#ffd89b' }}>{currentUser?.guestName || currentUser?.id}</strong>
        </p>
      </header>

      {/* Barra de Filtros y Búsqueda */}
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
          >
            🔄
          </button>
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div style={styles.errorAlert} role="alert">
          <span>⚠️ {error}</span>
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
          <div style={styles.emptyIcon}>🍽️</div>
          <h3 style={styles.emptyTitle}>No se encontraron reservas</h3>
          <p style={styles.emptyText}>
            {searchTerm
              ? 'No hay reservas que coincidan con tu búsqueda.'
              : activeFilter !== 'ALL'
              ? `No tienes reservas en estado "${activeFilter}".`
              : 'Aún no has registrado ninguna reserva en Donde Ray.'}
          </p>
          <a href="#/reservar" style={styles.bookNowBtn}>
            ✨ Crear Nueva Reserva
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
    padding: '32px 20px 60px',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  badge: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '2px',
    color: '#ffd89b',
    background: 'rgba(212, 163, 89, 0.12)',
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid rgba(212, 163, 89, 0.25)'
  },
  title: {
    margin: 0,
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff'
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#9ca3af'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    background: 'rgba(26, 28, 36, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '12px 16px'
  },
  tabsRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  tabBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tabBtnActive: {
    background: 'rgba(212, 163, 89, 0.2)',
    color: '#ffd89b',
    border: '1px solid rgba(212, 163, 89, 0.4)',
    fontWeight: '700'
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: '1 1 260px',
    maxWidth: '360px'
  },
  searchInput: {
    flex: 1,
    background: 'rgba(15, 17, 23, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '10px',
    color: '#ffffff',
    padding: '8px 14px',
    fontSize: '13px',
    outline: 'none'
  },
  refreshBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '8px',
    color: '#ffffff',
    padding: '7px 10px',
    cursor: 'pointer'
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
    padding: '4px 10px',
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
    color: '#9ca3af'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(212, 163, 89, 0.2)',
    borderTop: '3px solid #ffd89b',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  emptyCard: {
    background: 'rgba(26, 28, 36, 0.6)',
    border: '1px dashed rgba(255, 255, 255, 0.15)',
    borderRadius: '20px',
    padding: '60px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  emptyIcon: {
    fontSize: '48px',
    opacity: 0.7
  },
  emptyTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#ffffff',
    fontWeight: '600'
  },
  emptyText: {
    margin: 0,
    fontSize: '14px',
    color: '#9ca3af',
    maxWidth: '400px'
  },
  bookNowBtn: {
    marginTop: '10px',
    background: 'linear-gradient(135deg, #d4a359 0%, #b47828 100%)',
    color: '#08060d',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '700',
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(212, 163, 89, 0.3)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px'
  }
};
