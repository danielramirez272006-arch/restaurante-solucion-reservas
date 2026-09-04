/**
 * Reglas de Negocio Estrictas para el Módulo de Reservas "Donde Ray"
 */

export const MAX_CAPACITY_PER_SLOT = 20;
export const MAX_USER_RESERVATIONS_PER_DATE = 5;
export const INITIAL_RESERVATION_STATUS = 'Pendiente';

export const RESERVATION_TYPES = [
  'Cena',
  'Almuerzo',
  'Cumpleaños',
  'Negocios',
  'Aniversario',
  'Familiar',
  'Romántica',
  'Otro'
];

/**
 * Calcula la ocupación actual por franja horaria para una fecha dada.
 * Excluye reservas con status 'Cancelada'.
 * 
 * @param {Array} reservations Lista de reservas de esa fecha
 * @returns {Record<string, number>} Mapa { [hora]: totalGuests }
 */
export const calculateOccupancyBySlot = (reservations = []) => {
  const occupancy = {};

  reservations.forEach((res) => {
    // Si la reserva está cancelada, no ocupa capacidad
    if (res.status === 'Cancelada') return;

    const time = res.time;
    const guests = Number(res.guests) || 0;
    occupancy[time] = (occupancy[time] || 0) + guests;
  });

  return occupancy;
};

/**
 * Valida si un usuario ha alcanzado el límite estricto de 5 reservas para una fecha dada.
 * 
 * @param {Array} reservations Lista de reservas para esa fecha
 * @param {string|number} userId Identificador del cliente
 * @returns {{ allowed: boolean, currentCount: number, error: string|null }}
 */
export const checkUserDailyLimit = (reservations = [], userId) => {
  if (!userId) return { allowed: true, currentCount: 0, error: null };

  const userActiveReservations = reservations.filter(
    (res) => String(res.userId) === String(userId) && res.status !== 'Cancelada'
  );

  const currentCount = userActiveReservations.length;
  if (currentCount >= MAX_USER_RESERVATIONS_PER_DATE) {
    return {
      allowed: false,
      currentCount,
      error: `Has alcanzado el límite máximo de ${MAX_USER_RESERVATIONS_PER_DATE} reservas para esta fecha.`
    };
  }

  return {
    allowed: true,
    currentCount,
    error: null
  };
};

/**
 * Evalúa la disponibilidad de cada franja horaria para una fecha y una cantidad de comensales solicitada.
 * 
 * @param {Array} dateReservations Reservas existentes en esa fecha
 * @param {Array<string>} timeSlots Franjas horarias configuradas
 * @param {number} requestedGuests Cantidad de invitados que el usuario desea reservar
 * @returns {Array<{ time: string, bookedGuests: number, remainingCapacity: number, isAvailable: boolean, reason: string|null }>}
 */
export const getSlotsAvailability = (dateReservations = [], timeSlots = [], requestedGuests = 1) => {
  const occupancy = calculateOccupancyBySlot(dateReservations);
  const guestsToBook = Math.max(1, Number(requestedGuests) || 1);

  return timeSlots.map((time) => {
    const bookedGuests = occupancy[time] || 0;
    const remainingCapacity = Math.max(0, MAX_CAPACITY_PER_SLOT - bookedGuests);

    const fitsInCapacity = (bookedGuests + guestsToBook) <= MAX_CAPACITY_PER_SLOT;
    const isFull = remainingCapacity <= 0;

    let reason = null;
    if (isFull) {
      reason = 'Franja completa (20/20 comensales)';
    } else if (!fitsInCapacity) {
      reason = `Solo quedan ${remainingCapacity} ${remainingCapacity === 1 ? 'cupo' : 'cupos'} disponibles`;
    }

    return {
      time,
      bookedGuests,
      remainingCapacity,
      isAvailable: fitsInCapacity,
      reason
    };
  });
};

/**
 * Valida los datos del formulario antes de enviar el POST
 * @param {Object} data 
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export const validateReservationForm = (data) => {
  const errors = {};

  if (!data.guestName || !data.guestName.trim()) {
    errors.guestName = 'El nombre completo es obligatorio.';
  } else if (data.guestName.trim().length < 3) {
    errors.guestName = 'El nombre debe tener al menos 3 caracteres.';
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'El número de teléfono es obligatorio.';
  } else if (data.phone.trim().length < 7) {
    errors.phone = 'Ingresa un teléfono de contacto válido.';
  }

  if (!data.date) {
    errors.date = 'Debes seleccionar una fecha.';
  }

  if (!data.time) {
    errors.time = 'Debes seleccionar un horario.';
  }

  const guests = Number(data.guests);
  if (isNaN(guests) || guests < 1) {
    errors.guests = 'Debe haber al menos 1 invitado.';
  } else if (guests > MAX_CAPACITY_PER_SLOT) {
    errors.guests = `No se permiten más de ${MAX_CAPACITY_PER_SLOT} personas por reserva.`;
  }

  if (!data.type) {
    errors.type = 'Selecciona el tipo de reserva.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
