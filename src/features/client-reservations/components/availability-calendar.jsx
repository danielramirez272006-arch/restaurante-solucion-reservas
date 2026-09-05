import { useMemo, useState } from 'react'
import { formatDateToSpanish, formatTime12h, getMaxReservationDateString, getTodayDateString, isTimePassed } from '../../../shared/utils/date-helpers.js'
import { MAX_CAPACITY_PER_SLOT } from '../../../shared/utils/reservation-rules.js'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const toKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const AvailabilityCalendar = ({ selectedDate, onDateChange, selectedTime, onTimeSelect, slotsAvailability = [], limitReached = false, limitCount = 0, isLoading = false }) => {
  const today = useMemo(() => getTodayDateString(), [])
  const maxDate = useMemo(() => getMaxReservationDateString(60), [])
  const selected = selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date()
  const [visibleMonth, setVisibleMonth] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1))
  const firstDay = (new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay() + 6) % 7
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, index) => index < firstDay ? null : new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index - firstDay + 1))
  const canGoBack = `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, '0')}` > today.slice(0, 7)
  const canGoForward = `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, '0')}` < maxDate.slice(0, 7)

  const chooseDate = (date) => {
    const key = toKey(date)
    if (key < today || key > maxDate) return
    onDateChange(key)
  }

  return <section className="ray-calendar">
    <div className="ray-calendar__header"><div><span className="mockup-kicker mockup-kicker--dark">Tu próxima mesa</span><h3>Elegí el día</h3><p>{selectedDate ? formatDateToSpanish(selectedDate) : 'Una fecha para compartir'}</p></div><span className="ray-calendar__bird" aria-hidden="true">⌁</span></div>
    <div className="ray-calendar__month"><button type="button" disabled={!canGoBack} onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}>←</button><strong>{MONTHS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</strong><button type="button" disabled={!canGoForward} onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}>→</button></div>
    <div className="ray-calendar__weekdays">{WEEKDAYS.map((day) => <span key={day}>{day}</span>)}</div>
    <div className="ray-calendar__days">{cells.map((date, index) => date ? <button key={toKey(date)} type="button" className={`${selectedDate === toKey(date) ? 'is-selected' : ''} ${toKey(date) === today ? 'is-today' : ''}`} disabled={toKey(date) < today || toKey(date) > maxDate} onClick={() => chooseDate(date)}><span>{date.getDate()}</span>{toKey(date) === today && <small>Hoy</small>}</button> : <span className="ray-calendar__empty" key={`empty-${index}`} />)}</div>
    {limitReached && <div className="ray-calendar__alert">Ya registraste {limitCount} reservas para esta fecha. Elegí otro día para continuar.</div>}
    <div className="ray-calendar__slots"><div className="ray-calendar__slots-heading"><h4>Horarios disponibles</h4><span>Máximo {MAX_CAPACITY_PER_SLOT} personas por turno</span></div>{isLoading ? <div className="ray-calendar__loading">Preparando la mesa...</div> : <div className="ray-calendar__slot-grid">{slotsAvailability.map((slot) => { const past = isTimePassed(selectedDate, slot.time); const blocked = !slot.isAvailable || past || limitReached; const percent = Math.min(100, Math.round((slot.bookedGuests / MAX_CAPACITY_PER_SLOT) * 100)); return <button key={slot.time} type="button" disabled={blocked} className={`ray-slot ${selectedTime === slot.time ? 'is-selected' : ''} ${blocked ? 'is-blocked' : ''}`} onClick={() => onTimeSelect(slot.time)}><strong>{formatTime12h(slot.time)}</strong><span className="ray-slot__bar"><i style={{ width: `${percent}%` }} /></span><small>{past ? 'Pasado' : slot.remainingCapacity <= 0 ? 'Agotado' : `${slot.remainingCapacity} disponibles`}</small></button> })}</div>}</div>
  </section>
}