import { formatDateToSpanish, formatTime12h } from '../../../shared/utils/date-helpers.js';

export const ReservationCard = ({
  reservation,
  onViewVoucher,
  onCancel,
  isCancelling = false
}) => {
  if (!reservation) return null;

  const {
    id,
    guestName,
    email,
    phone,
    date,
    time,
    guests,
    type,
    notes,
    status
  } = reservation;

  const getStatusBadgeStyle = (currentStatus) => {
    switch (currentStatus) {
      case 'Confirmada':
        return {
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.4)'
        };
      case 'Cancelada':
        return {
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          border: '1px solid rgba(239, 68, 68, 0.4)'
        };
      case 'Pendiente':
      default:
        return {
          background: 'rgba(245, 158, 11, 0.15)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.4)'
        };
    }
  };

  const handleCancelClick = () => {
    const confirm = window.confirm(
      `¿Estás seguro de que deseas cancelar tu reserva para el ${date} a las ${time}?`
    );
    if (confirm && onCancel) {
      onCancel(id);
    }
  };

  return (
    <div style={styles.card}>
      {/* Encabezado con Código y Estado */}
      <div style={styles.header}>
        <div style={styles.idGroup}>
          <span style={styles.idLabel}>Reserva #</span>
          <span style={styles.idValue}>{id}</span>
        </div>
        <div style={{ ...styles.statusBadge, ...getStatusBadgeStyle(status) }}>
          {status || 'Pendiente'}
        </div>
      </div>

      {/* Contenido Principal: Fecha, Hora, Personas */}
      <div style={styles.mainInfo}>
        <div style={styles.dateBlock}>
          <span style={styles.icon}>📅</span>
          <div>
            <div style={styles.dateText}>{formatDateToSpanish(date)}</div>
            <div style={styles.timeText}>{formatTime12h(time)}</div>
          </div>
        </div>

        <div style={styles.chipsRow}>
          <span style={styles.chip}>
            👥 {guests} {guests === 1 ? 'Persona' : 'Personas'}
          </span>
          <span style={styles.chip}>🏷️ {type || 'Cena'}</span>
        </div>
      </div>

      {/* Datos del Titular y Notas */}
      <div style={styles.detailsBox}>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Titular:</span>
          <span style={styles.detailValue}>{guestName}</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Contacto:</span>
          <span style={styles.detailValue}>
            {phone} • {email}
          </span>
        </div>
        {notes && (
          <div style={styles.notesBlock}>
            <span style={styles.detailLabel}>Notas:</span>
            <p style={styles.notesText}>"{notes}"</p>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div style={styles.actionsRow}>
        <button
          type="button"
          onClick={() => onViewVoucher && onViewVoucher(reservation)}
          style={styles.voucherButton}
        >
          🎟️ Ver Voucher
        </button>

        {status !== 'Cancelada' && (
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={isCancelling}
            style={styles.cancelButton}
          >
            {isCancelling ? 'Cancelando...' : 'Cancelar'}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'linear-gradient(145deg, rgba(26, 28, 36, 0.95), rgba(18, 19, 24, 0.98))',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    textAlign: 'left'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '12px'
  },
  idGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  idLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    textTransform: 'uppercase'
  },
  idValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffd89b'
  },
  statusBadge: {
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  mainInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  dateBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  icon: {
    fontSize: '24px',
    background: 'rgba(212, 163, 89, 0.15)',
    padding: '8px',
    borderRadius: '10px'
  },
  dateText: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize'
  },
  timeText: {
    fontSize: '13px',
    color: '#ffd89b',
    fontWeight: '500'
  },
  chipsRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  chip: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '12px',
    color: '#d1d5db'
  },
  detailsBox: {
    background: 'rgba(15, 17, 23, 0.6)',
    borderRadius: '10px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '13px'
  },
  detailRow: {
    display: 'flex',
    gap: '8px'
  },
  detailLabel: {
    color: '#9ca3af',
    fontWeight: '500'
  },
  detailValue: {
    color: '#e5e7eb',
    wordBreak: 'break-word'
  },
  notesBlock: {
    marginTop: '4px',
    borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
    paddingTop: '6px'
  },
  notesText: {
    margin: '2px 0 0',
    color: '#d1d5db',
    fontStyle: 'italic',
    fontSize: '12px'
  },
  actionsRow: {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto',
    paddingTop: '8px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
  },
  voucherButton: {
    flex: 1,
    background: 'linear-gradient(135deg, rgba(212, 163, 89, 0.2), rgba(180, 120, 40, 0.3))',
    border: '1px solid rgba(212, 163, 89, 0.5)',
    color: '#ffd89b',
    borderRadius: '10px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    outline: 'none',
    textAlign: 'center'
  },
  cancelButton: {
    background: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    borderRadius: '10px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s',
    outline: 'none'
  }
};
