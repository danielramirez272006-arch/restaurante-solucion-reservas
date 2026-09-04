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
    background: '#ffffff',
    border: '1px solid #d6d1c5',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 10px 30px rgba(32, 40, 32, 0.05)',
    color: '#202820',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    borderBottom: '1px solid #e8e4db',
    paddingBottom: '16px'
  },
  iconCircle: {
    fontSize: '22px',
    background: 'rgba(48, 75, 61, 0.08)',
    color: '#304b3d',
    width: '46px',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    border: '1px solid rgba(48, 75, 61, 0.18)'
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '500',
    fontFamily: 'Newsreader, Georgia, serif',
    color: '#202820'
  },
  subtitle: {
    margin: '3px 0 0',
    fontSize: '13px',
    color: '#73786f'
  },
  quickDaysSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  quickDaysLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#73786f',
    textTransform: 'uppercase',
    letterSpacing: '0.08em'
  },
  quickDaysRow: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '6px'
  },
  quickDayBtn: {
    flex: '0 0 auto',
    background: '#f4f1e9',
    border: '1px solid #d6d1c5',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#202820',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    transition: 'all 0.2s ease',
    minWidth: '76px'
  },
  quickDayBtnActive: {
    background: '#304b3d',
    borderColor: '#304b3d',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(48, 75, 61, 0.25)'
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
    fontWeight: '600',
    color: '#73786f',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  dateInputWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '12px'
  },
  dateInput: {
    background: '#ffffff',
    border: '1px solid #d6d1c5',
    borderRadius: '8px',
    color: '#202820',
    padding: '10px 14px',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer'
  },
  dateBadge: {
    fontSize: '13px',
    color: '#b17a3c',
    background: 'rgba(177, 122, 60, 0.08)',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(177, 122, 60, 0.25)',
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  warningAlert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    padding: '14px 18px',
    borderRadius: '10px',
    color: '#991b1b'
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
    fontSize: '12px',
    fontWeight: '600',
    color: '#202820',
    textTransform: 'uppercase',
    letterSpacing: '0.06em'
  },
  capacityLegend: {
    fontSize: '12px',
    color: '#73786f'
  },
  loadingBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '24px',
    background: '#f4f1e9',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#73786f'
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(48, 75, 61, 0.2)',
    borderTop: '2px solid #304b3d',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  slotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '12px'
  },
  slotButton: {
    background: '#faf9f6',
    border: '1px solid #d6d1c5',
    borderRadius: '12px',
    padding: '14px 10px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    outline: 'none',
    position: 'relative',
    color: '#202820'
  },
  slotButtonSelected: {
    background: '#304b3d',
    borderColor: '#304b3d',
    boxShadow: '0 6px 18px rgba(48, 75, 61, 0.28)',
    transform: 'translateY(-2px)',
    color: '#ffffff'
  },
  slotButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    background: '#f0ece3',
    borderColor: '#e2ded5',
    color: '#8c9187'
  },
  slotTime: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'inherit'
  },
  progressBarContainer: {
    width: '80%',
    height: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
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
    padding: '3px 8px',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  badgeAvailable: {
    background: 'rgba(48, 75, 61, 0.1)',
    color: '#26543d',
    border: '1px solid rgba(48, 75, 61, 0.25)'
  },
  badgeFull: {
    background: '#fee2e2',
    color: '#b91c1c',
    border: '1px solid #fca5a5'
  },
  badgeNoFit: {
    background: '#fef3c7',
    color: '#b45309',
    border: '1px solid #fcd34d'
  },
  badgeUrgent: {
    background: '#fffbeb',
    color: '#b17a3c',
    border: '1px solid #b17a3c',
    fontWeight: '700'
  },
  badgePast: {
    background: '#e5e7eb',
    color: '#6b7280',
    border: '1px solid #d1d5db'
  }
};
