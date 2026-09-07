import { useMemo, useState } from 'react';
import {
  getTodayDateString,
  getMaxReservationDateString,
  formatDateToSpanish,
  formatTime12h,
  isTimePassed,
  getNextDays
} from '../../../shared/utils/date-helpers.js';
import { MAX_CAPACITY_PER_SLOT } from '../../../shared/utils/reservation-rules.js';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

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
  const today = useMemo(() => getTodayDateString(), []);
  const maxDate = useMemo(() => getMaxReservationDateString(60), []);
  const quickDays = useMemo(() => getNextDays(7), []);

  // Control del mes visible en el calendario interactivo
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const initialDate = selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date();
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );

  // Días del mes visible
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ dayNumber: d, dateStr });
    }
    return cells;
  }, [year, month, firstDayIndex, daysInMonth]);

  const canGoBack = `${year}-${String(month + 1).padStart(2, '0')}` > today.slice(0, 7);
  const canGoForward = `${year}-${String(month + 1).padStart(2, '0')}` < maxDate.slice(0, 7);

  // Separar franjas en Almuerzo y Cena
  const lunchSlots = slotsAvailability.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour < 17;
  });

  const dinnerSlots = slotsAvailability.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 17;
  });

  const handleSelectDay = (dateString) => {
    if (dateString < today || dateString > maxDate) return;
    onDateChange(dateString);
  };

  const renderSlotCard = (slot) => {
    const isSelected = selectedTime === slot.time;
    const isPast = isTimePassed(selectedDate, slot.time);
    const isBlocked = !slot.isAvailable || isPast || limitReached;
    const booked = slot.bookedGuests || 0;
    const remaining = Math.max(0, MAX_CAPACITY_PER_SLOT - booked);
    const occupancyPercent = Math.min(100, Math.round((booked / MAX_CAPACITY_PER_SLOT) * 100));

    return (
      <button
        key={slot.time}
        type="button"
        onClick={() => !isBlocked && onTimeSelect(slot.time)}
        disabled={isBlocked}
        aria-pressed={isSelected}
        className={`luxury-slot-card ${isSelected ? 'luxury-slot-card--selected' : ''} ${
          isBlocked ? 'luxury-slot-card--disabled' : ''
        }`}
      >
        <div className="luxury-slot-header">
          <strong className="luxury-slot-time">{formatTime12h(slot.time)}</strong>
          {isSelected && <span className="luxury-slot-check">✓</span>}
        </div>

        <span className="luxury-slot-status">
          {isPast
            ? 'Servicio cerrado'
            : isBlocked && !slot.isAvailable
            ? 'Aforo completo'
            : remaining <= 4
            ? `Últimos ${remaining} lugares`
            : `${remaining} lugares disponibles`}
        </span>

        <div className="luxury-slot-bar">
          <div
            className="luxury-slot-fill"
            style={{
              width: `${occupancyPercent}%`,
              background: isSelected
                ? '#e59c19'
                : occupancyPercent >= 80
                ? '#c8860a'
                : '#1b533f'
            }}
          />
        </div>
      </button>
    );
  };

  return (
    <div className="luxury-calendar-card">
      {/* Encabezado con estética de Restaurante Fino */}
      <div className="luxury-panel-header">
        <div className="luxury-panel-badge">
          <span>Servicio Exclusivo</span>
        </div>
        <h3 className="luxury-panel-title">Fecha & Turno de Servicio</h3>
        <p className="luxury-panel-subtitle">
          Selecciona tu fecha de visita y el horario de servicio en nuestro salón o terraza.
        </p>
      </div>

      {/* Días Próximos - Selector Rápido */}
      <div className="luxury-section-group">
        <div className="luxury-group-label-row">
          <span className="luxury-group-label">Acceso Rápido · Próximos Servicios</span>
          <button
            type="button"
            className="luxury-toggle-cal-btn"
            onClick={() => setShowFullCalendar(!showFullCalendar)}
          >
            {showFullCalendar ? 'Ocultar calendario anual ▴' : 'Ver calendario mensual ▾'}
          </button>
        </div>

        <div className="luxury-quick-strip">
          {quickDays.map((day) => {
            const isDaySelected = selectedDate === day.dateString;
            return (
              <button
                key={day.dateString}
                type="button"
                onClick={() => onDateChange(day.dateString)}
                className={`luxury-quick-chip ${isDaySelected ? 'luxury-quick-chip--active' : ''}`}
              >
                <span className="luxury-quick-chip__sub">{day.weekday.slice(0, 3)}</span>
                <span className="luxury-quick-chip__val">{day.label}</span>
                {day.dateString === today && (
                  <span className="luxury-quick-chip__today-dot" title="Hoy" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendario Mensual Completo (Colapsable o Desplegado) */}
      {showFullCalendar && (
        <div className="luxury-month-picker">
          <div className="luxury-month-nav">
            <button
              type="button"
              disabled={!canGoBack}
              onClick={() => setVisibleMonth(new Date(year, month - 1, 1))}
              className="luxury-month-arrow"
              aria-label="Mes anterior"
            >
              ←
            </button>
            <strong className="luxury-month-title">
              {MONTHS[month]} {year}
            </strong>
            <button
              type="button"
              disabled={!canGoForward}
              onClick={() => setVisibleMonth(new Date(year, month + 1, 1))}
              className="luxury-month-arrow"
              aria-label="Mes siguiente"
            >
              →
            </button>
          </div>

          <div className="luxury-weekdays-row">
            {WEEKDAYS.map((w) => (
              <span key={w} className="luxury-weekday">
                {w}
              </span>
            ))}
          </div>

          <div className="luxury-days-grid">
            {calendarDays.map((cell, idx) => {
              if (!cell) {
                return <span key={`empty-${idx}`} className="luxury-day-empty" />;
              }

              const isSelected = selectedDate === cell.dateStr;
              const isToday = cell.dateStr === today;
              const isDisabled = cell.dateStr < today || cell.dateStr > maxDate;

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDay(cell.dateStr)}
                  className={`luxury-day-btn ${isSelected ? 'luxury-day-btn--selected' : ''} ${
                    isToday ? 'luxury-day-btn--today' : ''
                  }`}
                >
                  <span>{cell.dayNumber}</span>
                  {isToday && <small className="luxury-day-badge">Hoy</small>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Banner de Fecha Elegida */}
      <div className="luxury-selected-banner">
        <div className="luxury-selected-icon">📅</div>
        <div className="luxury-selected-info">
          <span className="luxury-selected-label">Mesa para el día:</span>
          <strong className="luxury-selected-date">
            {formatDateToSpanish(selectedDate) || 'Selecciona una fecha'}
          </strong>
        </div>
        <span className="luxury-selected-venue">Salón de Alta Cocina</span>
      </div>

      {/* Alerta de Límite Diario */}
      {limitReached && (
        <div className="luxury-alert-warning" role="alert">
          <strong>Límite Diario de Reservas Alcanzado</strong>
          <p>
            Ya registraste {limitCount} reservas para esta fecha. Para garantizar disponibilidad para todas las personas, por favor selecciona otra fecha.
          </p>
        </div>
      )}

      {/* Turnos de Servicio */}
      <div className="luxury-slots-section">
        {isLoading ? (
          <div className="luxury-loading-box">
            <div className="luxury-spinner" />
            <span>Consultando disponibilidad en cocina...</span>
          </div>
        ) : (
          <>
            {/* Almuerzo */}
            {lunchSlots.length > 0 && (
              <div className="luxury-service-group">
                <div className="luxury-service-title">
                  <span className="luxury-service-dot" />
                  <strong>Servicio de Almuerzo & Mediodía</strong>
                  <small>12:00 PM — 03:00 PM</small>
                </div>
                <div className="luxury-slots-grid">
                  {lunchSlots.map(renderSlotCard)}
                </div>
              </div>
            )}

            {/* Cena */}
            {dinnerSlots.length > 0 && (
              <div className="luxury-service-group">
                <div className="luxury-service-title">
                  <span className="luxury-service-dot luxury-service-dot--evening" />
                  <strong>Servicio de Cena & Fogón Nocturno</strong>
                  <small>06:00 PM — 10:00 PM</small>
                </div>
                <div className="luxury-slots-grid">
                  {dinnerSlots.map(renderSlotCard)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
