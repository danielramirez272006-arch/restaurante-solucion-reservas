import { useState } from 'react';
import {
  formatDateToSpanish,
  formatTime12h,
  getTodayDateString,
  getMaxReservationDateString,
  RESTAURANT_TIME_SLOTS
} from '../../../shared/utils/date-helpers.js';
import { MAX_CAPACITY_PER_SLOT } from '../../../shared/utils/reservation-rules.js';

export const ReservationCard = ({
  reservation,
  onViewVoucher,
  onCancel,
  onReschedule,
  isCancelling = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    date: reservation?.date || '',
    time: reservation?.time || '',
    guests: reservation?.guests || 1,
    type: reservation?.type || 'Cena',
    notes: reservation?.notes || ''
  });
  const [editError, setEditError] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

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

  const handleSaveReschedule = async () => {
    setEditError(null);
    setSavingEdit(true);
    try {
      if (!editForm.date || !editForm.time) {
        throw new Error('Selecciona fecha y hora válidas.');
      }
      const result = await onReschedule(id, editForm);
      if (result && result.success) {
        setIsEditing(false);
      } else if (result && result.error) {
        setEditError(result.error);
      }
    } catch (err) {
      setEditError(err.message || 'Error al reagendar.');
    } finally {
      setSavingEdit(false);
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

      {isEditing ? (
        /* Formulario Inline de Reagendamiento */
        <div style={styles.editContainer}>
          <span style={styles.editTitle}>Reagendar Reserva</span>

          {editError && <div style={styles.editError}>{editError}</div>}

          <div style={styles.editField}>
            <label style={styles.editLabel}>Fecha:</label>
            <input
              type="date"
              min={getTodayDateString()}
              max={getMaxReservationDateString(60)}
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              style={styles.editInput}
            />
          </div>

          <div style={styles.editField}>
            <label style={styles.editLabel}>Horario:</label>
            <select
              value={editForm.time}
              onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
              style={styles.editSelect}
            >
              {RESTAURANT_TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {formatTime12h(slot)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.editField}>
            <label style={styles.editLabel}>Personas (Máx. {MAX_CAPACITY_PER_SLOT}):</label>
            <input
              type="number"
              min={1}
              max={MAX_CAPACITY_PER_SLOT}
              value={editForm.guests}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  guests: Math.min(MAX_CAPACITY_PER_SLOT, Math.max(1, Number(e.target.value) || 1))
                })
              }
              style={styles.editInput}
            />
          </div>

          <div style={styles.editActions}>
            <button
              type="button"
              onClick={handleSaveReschedule}
              disabled={savingEdit}
              style={styles.saveBtn}
            >
              {savingEdit ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditError(null);
              }}
              style={styles.cancelEditBtn}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
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

            {status === 'Pendiente' && onReschedule && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={styles.rescheduleButton}
              >
                ✏️ Reagendar
              </button>
            )}

            {status !== 'Cancelada' && (
              <button
                type="button"
                onClick={handleCancelClick}
                disabled={isCancelling}
                style={styles.cancelButton}
              >
                {isCancelling ? '...' : 'Cancelar'}
              </button>
            )}
          </div>
        </>
      )}
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
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '8px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
  },
  voucherButton: {
    flex: 2,
    background: 'linear-gradient(135deg, rgba(212, 163, 89, 0.2), rgba(180, 120, 40, 0.3))',
    border: '1px solid rgba(212, 163, 89, 0.5)',
    color: '#ffd89b',
    borderRadius: '8px',
    padding: '8px 10px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  },
  rescheduleButton: {
    flex: 2,
    background: 'rgba(59, 130, 246, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.4)',
    color: '#93c5fd',
    borderRadius: '8px',
    padding: '8px 10px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  },
  cancelButton: {
    flex: 1,
    background: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    borderRadius: '8px',
    padding: '8px 10px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    background: 'rgba(15, 17, 23, 0.8)',
    borderRadius: '10px',
    padding: '14px',
    border: '1px solid rgba(212, 163, 89, 0.3)'
  },
  editTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffd89b',
    textTransform: 'uppercase'
  },
  editField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  editLabel: {
    fontSize: '11px',
    color: '#9ca3af'
  },
  editInput: {
    background: 'rgba(26, 28, 36, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '6px',
    color: '#ffffff',
    padding: '6px 10px',
    fontSize: '13px',
    outline: 'none'
  },
  editSelect: {
    background: 'rgba(26, 28, 36, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '6px',
    color: '#ffffff',
    padding: '6px 10px',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer'
  },
  editError: {
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    color: '#fca5a5',
    padding: '6px 8px',
    borderRadius: '6px',
    fontSize: '11px'
  },
  editActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px'
  },
  saveBtn: {
    flex: 1,
    background: '#10b981',
    color: '#064e3b',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  cancelEditBtn: {
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#d1d5db',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '12px',
    cursor: 'pointer'
  }
};
