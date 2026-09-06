/**
 * Utilidades para manejo, formateo y validación de fechas y horarios
 * en el módulo de reservas de "Donde Ray".
 */

// Horarios de servicio estándar del restaurante
export const RESTAURANT_TIME_SLOTS = [
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00'
];

/**
 * Obtiene la fecha actual en formato local YYYY-MM-DD
 * @returns {string}
 */
export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtiene la fecha máxima permitida para reservar (ej. 60 días adelante)
 * @param {number} daysAhead
 * @returns {string}
 */
export const getMaxReservationDateString = (daysAhead = 60) => {
  const target = new Date();
  target.setDate(target.getDate() + daysAhead);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Convierte 'YYYY-MM-DD' a una descripción amigable en español
 * Ej: "Viernes, 4 de septiembre de 2026"
 * @param {string} dateString
 * @returns {string}
 */
export const formatDateToSpanish = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;

  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formatea una hora en formato HH:MM (24 horas) a formato 12 horas con AM/PM
 * Ej: "13:00" -> "1:00 PM", "20:30" -> "8:30 PM"
 * @param {string} time24
 * @returns {string}
 */
export const formatTime12h = (time24) => {
  if (!time24) return '';
  const [hoursStr, minutesStr] = time24.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';

  if (isNaN(hours)) return time24;

  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours12}:${minutes} ${period}`;
};

/**
 * Determina si una fecha y franja horaria ya pasó respecto a la hora actual
 * @param {string} dateString 'YYYY-MM-DD'
 * @param {string} timeString 'HH:MM'
 * @returns {boolean}
 */
export const isTimePassed = (dateString, timeString) => {
  if (!dateString || !timeString) return false;
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);

  const slotDate = new Date(year, month - 1, day, hours, minutes, 0);
  return slotDate.getTime() <= Date.now();
};

/**
 * Determina si una reserva es futura
 * @param {string} dateString 'YYYY-MM-DD'
 * @param {string} timeString 'HH:MM'
 * @returns {boolean}
 */
export const isFutureReservation = (dateString, timeString = '23:59') => {
  if (!dateString) return false;
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = (timeString || '23:59').split(':').map(Number);

  const slotDate = new Date(year, month - 1, day, hours || 23, minutes || 59, 0);
  return slotDate.getTime() > Date.now();
};

/**
 * Genera una lista de los próximos N días para acceso rápido en la UI
 * @param {number} count
 * @returns {Array<{ dateString: string, label: string, dayNumber: number, weekday: string }>}
 */
export const getNextDays = (count = 7) => {
  const days = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(now.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const label = i === 0
      ? 'Hoy'
      : i === 1
        ? 'Mañana'
        : (() => {
            const weekday = d.toLocaleDateString('es-ES', { weekday: 'short' });
            return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${d.getDate()}`;
          })();

    const weekdayFull = d.toLocaleDateString('es-ES', { weekday: 'long' });

    days.push({
      dateString,
      label,
      dayNumber: d.getDate(),
      weekday: weekdayFull
    });
  }

  return days;
};

/**
 * Genera la URL para agregar la reserva directamente a Google Calendar
 * @param {Object} reservation 
 * @returns {string}
 */
export const createGoogleCalendarUrl = (reservation) => {
  if (!reservation || !reservation.date || !reservation.time) return '#';

  const [year, month, day] = reservation.date.split('-').map(Number);
  const [hours, minutes] = reservation.time.split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hours, minutes, 0);
  // Asumir duración estándar de 2 horas para la experiencia gastronómica
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const formatCalTime = (d) =>
    d.toISOString().replace(/-|:|\.\d+/g, '');

  const title = encodeURIComponent(`Reserva en Restaurante Donde Ray (${reservation.guests} personas)`);
  const details = encodeURIComponent(
    `Reserva #${reservation.id} a nombre de ${reservation.guestName}.\n` +
    `Tipo de ocasión: ${reservation.type || 'Cena'}.\n` +
    `Notas: ${reservation.notes || 'Ninguna'}.\n` +
    `Estado: ${reservation.status || 'Pendiente'}.`
  );
  const location = encodeURIComponent('Restaurante Donde Ray, Playa Chiquita, Puerto Viejo de Talamanca, Limón, Costa Rica');

  const startIso = formatCalTime(startDate);
  const endIso = formatCalTime(endDate);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
};
