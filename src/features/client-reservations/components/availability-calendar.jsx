import { useMemo } from 'react';
import {
  getTodayDateString,
  getMaxReservationDateString,
  formatDateToSpanish,
  formatTime12h,
  isTimePassed,
  getNextDays
} from '../../../shared/utils/date-helpers.js';
import { MAX_CAPACITY_PER_SLOT } from '../../../shared/utils/reservation-rules.js';

export const AvailabilityCalendar = ({
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeSelect,
  slotsAvailability = [],
  guestsCount = 1,
  limitReached = false,
  limitCount = 0,
  isLoading = false
}) => {
  const minDate = useMemo(() => getTodayDateString(), []);
  const maxDate = useMemo(() => getMaxReservationDateString(60), []);
  const quickDays = useMemo(() => getNextDays(7), []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconCircle}>📅</div>
        <div>
          <h3 style={styles.title}>Fecha y Horario</h3>
          <p style={styles.subtitle}>
            Consulta la disponibilidad en tiempo real para tu experiencia en "Donde Ray"
          </p>
        </div>
      </div>

      {/* Selector Rápido de Próximos 7 Días */}
      <div style={styles.quickDaysSection}>
        <span style={styles.quickDaysLabel}>Acceso rápido:</span>
        <div style={styles.quickDaysRow}>
          {quickDays.map((day) => {
            const isDaySelected = selectedDate === day.dateString;
            return (
              <button
                key={day.dateString}
                type="button"
                onClick={() => onDateChange(day.dateString)}
                style={{
                  ...styles.quickDayBtn,
                  ...(isDaySelected ? styles.quickDayBtnActive : {})
                }}
              >
                <span style={styles.quickDayText}>{day.label}</span>
                <span style={styles.quickDaySub}>
                  {day.weekday ? day.weekday.slice(0, 3) : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de fecha con input date nativo para cualquier otra fecha */}
      <div style={styles.dateSelectorGroup}>
        <label htmlFor="reservation-date-input" style={styles.label}>
          O elige otra fecha en el calendario:
        </label>
        <div style={styles.dateInputWrapper}>
          <input
            id="reservation-date-input"
            type="date"
            value={selectedDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => onDateChange(e.target.value)}
            style={styles.dateInput}
          />
          <span style={styles.dateBadge}>
            {formatDateToSpanish(selectedDate) || 'Selecciona un día'}
          </span>
        </div>
      </div>

      {/* Alerta de Límite de 5 Reservas por Usuario (Regla 2) */}
      {limitReached && (
        <div style={styles.warningAlert} role="alert">
          <span style={styles.alertIcon}>⚠️</span>
          <div>
            <strong>Límite por usuario alcanzado</strong>
            <p style={styles.alertText}>
              Ya registraste {limitCount} reservas para esta fecha. Según la política del restaurante,
              no puedes registrar más de 5 reservas por día. Por favor elige otra fecha.
            </p>
          </div>
        </div>
      )}

      {/* Franjas horarias con barras de progreso de capacidad (Regla 1 y Regla 4) */}
      <div style={styles.slotsSection}>
        <div style={styles.slotsHeader}>
          <span style={styles.slotsLabel}>Horarios disponibles:</span>
          <span style={styles.capacityLegend}>
            Capacidad máx: {MAX_CAPACITY_PER_SLOT} comensales por turno
          </span>
        </div>

        {isLoading ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <span>Verificando disponibilidad de mesas...</span>
          </div>
        ) : (
          <div style={styles.slotsGrid}>
            {slotsAvailability.map((slot) => {
              const isSelected = selectedTime === slot.time;
              const isPast = isTimePassed(selectedDate, slot.time);
              const isBlocked = !slot.isAvailable || isPast || limitReached;

              const occupancyPercent = Math.min(
                100,
                Math.round((slot.bookedGuests / MAX_CAPACITY_PER_SLOT) * 100)
              );

              let buttonStyle = { ...styles.slotButton };
              let tagStyle = { ...styles.slotBadge };

              if (isSelected) {
                buttonStyle = { ...buttonStyle, ...styles.slotButtonSelected };
              } else if (isBlocked) {
                buttonStyle = { ...buttonStyle, ...styles.slotButtonDisabled };
              }

              // Color de la barra de ocupación
              let progressColor = '#10b981'; // verde
              if (occupancyPercent >= 90) progressColor = '#ef4444'; // rojo
              else if (occupancyPercent >= 60) progressColor = '#f59e0b'; // ámbar

              const isLowAvailability =
                slot.remainingCapacity > 0 &&
                slot.remainingCapacity <= 4 &&
                !isPast &&
                !isBlocked;

              return (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => !isBlocked && onTimeSelect(slot.time)}
                  disabled={isBlocked}
                  aria-pressed={isSelected}
                  title={
                    isPast
                      ? 'Este horario ya ha transcurrido'
                      : slot.reason || `${slot.remainingCapacity} cupos disponibles de ${MAX_CAPACITY_PER_SLOT}`
                  }
                  style={buttonStyle}
                >
                  <div style={styles.slotTime}>{formatTime12h(slot.time)}</div>

                  {/* Barra de Progreso de Ocupación Visual */}
                  {!isPast && (
                    <div style={styles.progressBarContainer}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${occupancyPercent}%`,
                          backgroundColor: progressColor
                        }}
                      />
                    </div>
                  )}

                  <div style={styles.slotMeta}>
                    {isPast ? (
                      <span style={{ ...tagStyle, ...styles.badgePast }}>Horario pasado</span>
                    ) : slot.remainingCapacity <= 0 ? (
                      <span style={{ ...tagStyle, ...styles.badgeFull }}>Agotado (20/20)</span>
                    ) : isLowAvailability ? (
                      <span style={{ ...tagStyle, ...styles.badgeUrgent }}>
                        ¡Solo {slot.remainingCapacity} {slot.remainingCapacity === 1 ? 'cupo' : 'cupos'}!
                      </span>
                    ) : !slot.isAvailable ? (
                      <span style={{ ...tagStyle, ...styles.badgeNoFit }}>
                        Solo {slot.remainingCapacity} libres
                      </span>
                    ) : (
                      <span style={{ ...tagStyle, ...styles.badgeAvailable }}>
                        {slot.remainingCapacity} disponibles
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(145deg, rgba(26, 28, 36, 0.95), rgba(18, 19, 24, 0.98))',
    border: '1px solid rgba(212, 163, 89, 0.25)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    color: '#f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '14px'
  },
  iconCircle: {
    fontSize: '24px',
    background: 'rgba(212, 163, 89, 0.15)',
    width: '46px',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    border: '1px solid rgba(212, 163, 89, 0.3)'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffd89b'
  },
  subtitle: {
    margin: '2px 0 0',
    fontSize: '13px',
    color: '#9ca3af'
  },
  quickDaysSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  quickDaysLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#d1d5db',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  quickDaysRow: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '6px'
  },
  quickDayBtn: {
    flex: '0 0 auto',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '8px 12px',
    color: '#d1d5db',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    transition: 'all 0.2s ease',
    minWidth: '70px'
  },
  quickDayBtnActive: {
    background: 'linear-gradient(135deg, rgba(212, 163, 89, 0.3), rgba(180, 120, 40, 0.4))',
    borderColor: '#ffd89b',
    color: '#ffffff',
    boxShadow: '0 0 12px rgba(212, 163, 89, 0.3)'
  },
  quickDayText: {
    fontSize: '13px',
    fontWeight: '700'
  },
  quickDaySub: {
    fontSize: '10px',
    textTransform: 'capitalize',
    opacity: 0.8
  },
  dateSelectorGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#9ca3af'
  },
  dateInputWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '12px'
  },
  dateInput: {
    background: 'rgba(15, 17, 23, 0.9)',
    border: '1px solid rgba(212, 163, 89, 0.4)',
    borderRadius: '10px',
    color: '#ffffff',
    padding: '8px 14px',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer'
  },
  dateBadge: {
    fontSize: '13px',
    color: '#ffd89b',
    background: 'rgba(212, 163, 89, 0.1)',
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(212, 163, 89, 0.2)',
    textTransform: 'capitalize'
  },
  warningAlert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    padding: '12px 16px',
    borderRadius: '10px',
    color: '#fca5a5'
  },
  alertIcon: {
    fontSize: '20px'
  },
  alertText: {
    margin: '4px 0 0',
    fontSize: '13px',
    lineHeight: '1.4'
  },
  slotsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  slotsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px'
  },
  slotsLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#e5e7eb',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  capacityLegend: {
    fontSize: '11px',
    color: '#9ca3af'
  },
  loadingBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '24px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#9ca3af'
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(212, 163, 89, 0.2)',
    borderTop: '2px solid #ffd89b',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  slotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '10px'
  },
  slotButton: {
    background: 'rgba(24, 26, 32, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    padding: '12px 8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    outline: 'none',
    position: 'relative'
  },
  slotButtonSelected: {
    background: 'linear-gradient(135deg, rgba(212, 163, 89, 0.25), rgba(180, 120, 40, 0.35))',
    borderColor: '#ffd89b',
    boxShadow: '0 0 16px rgba(212, 163, 89, 0.4)',
    transform: 'scale(1.02)'
  },
  slotButtonDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
    background: 'rgba(15, 17, 23, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  slotTime: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#ffffff'
  },
  progressBarContainer: {
    width: '80%',
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
    margin: '2px 0'
  },
  progressBarFill: {
    height: '100%',
    transition: 'width 0.3s ease, background-color 0.3s ease'
  },
  slotMeta: {
    display: 'flex',
    justifyContent: 'center'
  },
  slotBadge: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  badgeAvailable: {
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    border: '1px solid rgba(16, 185, 129, 0.3)'
  },
  badgeFull: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  badgeNoFit: {
    background: 'rgba(245, 158, 11, 0.15)',
    color: '#fbbf24',
    border: '1px solid rgba(245, 158, 11, 0.3)'
  },
  badgeUrgent: {
    background: 'rgba(212, 163, 89, 0.25)',
    color: '#ffd89b',
    border: '1px solid #ffd89b',
    fontWeight: '700'
  },
  badgePast: {
    background: 'rgba(107, 114, 128, 0.15)',
    color: '#9ca3af',
    border: '1px solid rgba(107, 114, 128, 0.3)'
  }
};
