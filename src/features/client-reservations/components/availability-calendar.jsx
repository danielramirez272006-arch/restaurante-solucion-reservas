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
    <div className="reservation-panel">
      {/* Encabezado del Panel */}
      <div className="reservation-panel-header">
        <span className="eyebrow" style={{ marginBottom: '8px' }}>Paso 1</span>
        <h3>Fecha y Horario</h3>
        <p>Consulta la disponibilidad de aforo en tiempo real para tu servicio en Donde Ray.</p>
      </div>

      {/* Selector Rápido de Próximos 7 Días */}
      <div className="reservation-field-group">
        <span className="reservation-field-label">Días Próximos</span>
        <div className="quick-days-list">
          {quickDays.map((day) => {
            const isDaySelected = selectedDate === day.dateString;
            return (
              <button
                key={day.dateString}
                type="button"
                onClick={() => onDateChange(day.dateString)}
                className={`quick-day-card ${isDaySelected ? 'quick-day-card--active' : ''}`}
                title={`${day.weekday}, ${day.dateString}`}
              >
                <span className="quick-day-val">{day.label}</span>
                <span className="quick-day-sub">
                  {day.weekday ? day.weekday.slice(0, 3) : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de fecha con input date nativo */}
      <div className="reservation-field-group">
        <label htmlFor="reservation-date-input" className="reservation-field-label">
          Otras Fechas en Calendario
        </label>
        <div className="date-selector-row">
          <input
            id="reservation-date-input"
            type="date"
            value={selectedDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="reservation-input"
            style={{ width: 'auto', minWidth: '170px' }}
          />
          <span className="date-badge-editorial">
            {formatDateToSpanish(selectedDate) || 'Selecciona un día'}
          </span>
        </div>
      </div>

      {/* Alerta de Límite de 5 Reservas por Usuario (Regla 2) */}
      {limitReached && (
        <div className="reservation-alert-warning" role="alert">
          <div>
            <strong>Límite diario de comensal alcanzado</strong>
            <span>
              Ya registraste {limitCount} reservas para esta fecha. Para garantizar acceso equitativo a todos los visitantes, el límite es de 5 reservas por día. Por favor elige otra fecha.
            </span>
          </div>
        </div>
      )}

      {/* Franjas Horarias Disponibles (Reglas 1 y 4) */}
      <div className="time-slots-wrapper">
        <div>
          <span className="time-period-header">Turnos Disponibles</span>
          <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--muted)' }}>
            Aforo estricto de {MAX_CAPACITY_PER_SLOT} personas por turno.
          </p>
        </div>

        {isLoading ? (
          <div className="state-panel" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
            <span className="loading-dot" />
            <span>Consultando aforo disponible...</span>
          </div>
        ) : (
          <div className="time-slots-grid">
            {slotsAvailability.map((slot) => {
              const isSelected = selectedTime === slot.time;
              const isPast = isTimePassed(selectedDate, slot.time);
              const isBlocked = !slot.isAvailable || isPast || limitReached;

              const occupancyPercent = Math.min(
                100,
                Math.round((slot.bookedGuests / MAX_CAPACITY_PER_SLOT) * 100)
              );

              return (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => !isBlocked && onTimeSelect(slot.time)}
                  disabled={isBlocked}
                  aria-pressed={isSelected}
                  title={
                    isPast
                      ? 'Este horario ya transcurrió'
                      : slot.reason || `${slot.remainingCapacity} cupos disponibles de ${MAX_CAPACITY_PER_SLOT}`
                  }
                  className={`slot-card ${isSelected ? 'slot-card--selected' : ''} ${
                    isBlocked ? 'slot-card--disabled' : ''
                  }`}
                >
                  <span className="slot-time-text">{formatTime12h(slot.time)}</span>
                  <span className="slot-capacity-text">
                    {isPast
                      ? 'Finalizado'
                      : isBlocked && !slot.isAvailable
                      ? 'Aforo Completo'
                      : `${slot.remainingCapacity} cupos libres`}
                  </span>
                  <div className="slot-meter-track">
                    <div
                      className="slot-meter-fill"
                      style={{
                        width: `${occupancyPercent}%`,
                        background: isSelected ? 'var(--gold)' : occupancyPercent >= 80 ? '#b17a3c' : 'var(--green)'
                      }}
                    />
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

export default AvailabilityCalendar;
