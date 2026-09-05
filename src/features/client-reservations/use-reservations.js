import { useState, useEffect, useCallback, useMemo } from 'react';
import { reservationService } from './reservation-service.js';
import {
  RESTAURANT_TIME_SLOTS,
  getTodayDateString
} from '../../shared/utils/date-helpers.js';
import {
  MAX_CAPACITY_PER_SLOT,
  MAX_USER_RESERVATIONS_PER_DATE,
  getSlotsAvailability,
  checkUserDailyLimit,
  validateReservationForm
} from '../../shared/utils/reservation-rules.js';

/**
 * Intenta recuperar el usuario actual desde localStorage o sesión para interoperabilidad
 * limpia con el módulo de Auth sin acoplarse rígidamente.
 */
const getActiveUser = () => {
  try {
    const rawUser = localStorage.getItem('donde-ray-session') || localStorage.getItem('user') || localStorage.getItem('auth_user');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      if (parsed && (parsed.id || parsed.userId)) {
        return {
          id: parsed.id || parsed.userId,
          guestName: parsed.name || parsed.guestName || '',
          name: parsed.name || parsed.guestName || '',
          email: parsed.email || '',
          phone: parsed.phone || ''
        };
      }
    }
  } catch {
    // Si falla el parseo, continuar con fallback
  }

  // Fallback por defecto para MVP y pruebas de desarrollo
  return {
    id: 'u-client',
    guestName: 'Cliente Demo',
    name: 'Cliente Demo',
    email: 'user@demo.com',
    phone: '+57 301 000 0000'
  };
};

export const useReservations = (customUser = null) => {
  const currentUser = useMemo(() => {
    if (customUser) {
      return {
        id: customUser.id || customUser.userId,
        guestName: customUser.name || customUser.guestName || '',
        name: customUser.name || customUser.guestName || '',
        email: customUser.email || '',
        phone: customUser.phone || ''
      };
    }
    return getActiveUser();
  }, [customUser]);

  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [dateReservations, setDateReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeVoucher, setActiveVoucher] = useState(null);

  /**
   * Carga las reservas correspondientes exclusivamente a este usuario (Regla 5)
   */
  const loadUserReservations = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await reservationService.getUserReservations(currentUser.id);
      setReservations(data);
    } catch (err) {
      setError(err.message || 'Error al cargar tus reservas.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  /**
   * Carga las reservas de una fecha para calcular ocupación y validar reglas de capacidad
   */
  const loadDateReservations = useCallback(async (dateToLoad) => {
    if (!dateToLoad) return;
    setAvailabilityLoading(true);
    try {
      const data = await reservationService.getReservationsByDate(dateToLoad);
      setDateReservations(data);
    } catch (err) {
      console.error('Error al consultar reservas de la fecha:', err);
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  // Cargar reservas del usuario al montar el hook
  useEffect(() => {
    const timer = setTimeout(() => {
      void loadUserReservations();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadUserReservations]);

  // Cargar reservas de la fecha seleccionada cada vez que cambia
  useEffect(() => {
    const timer = setTimeout(() => {
      void loadDateReservations(selectedDate);
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedDate, loadDateReservations]);

  /**
   * Calcula la disponibilidad en tiempo real para la fecha seleccionada
   * en base a la cantidad de comensales solicitada (Regla 1 y Regla 4)
   */
  const calculateAvailability = useCallback(
    (requestedGuests = 1) => {
      return getSlotsAvailability(dateReservations, RESTAURANT_TIME_SLOTS, requestedGuests);
    },
    [dateReservations]
  );

  /**
   * Verifica si el usuario actual excede el límite de 5 reservas en la fecha seleccionada (Regla 2)
   */
  const userDateLimitStatus = useMemo(() => {
    return checkUserDailyLimit(dateReservations, currentUser?.id);
  }, [dateReservations, currentUser?.id]);

  /**
   * Crea una nueva reserva ejecutando todas las validaciones estrictas
   */
  const bookReservation = async (formData) => {
    setActionLoading(true);
    setError(null);

    try {
      // 1. Validación de campos del formulario
      const { isValid, errors: formErrors } = validateReservationForm(formData);
      if (!isValid) {
        const firstError = Object.values(formErrors)[0];
        throw new Error(firstError);
      }

      // 2. Consulta en tiempo real de las reservas actuales para esa fecha (Regla 4)
      const freshDateReservations = await reservationService.getReservationsByDate(formData.date);

      // 3. REGLA 2: Límite por Usuario (máximo 5 reservas para la misma fecha)
      const limitCheck = checkUserDailyLimit(freshDateReservations, currentUser?.id);
      if (!limitCheck.allowed) {
        throw new Error(
          `Límite excedido: Ya tienes ${limitCheck.currentCount} reservas registradas para el ${formData.date}. El máximo permitido es ${MAX_USER_RESERVATIONS_PER_DATE} reservas por usuario para una misma fecha.`
        );
      }

      // 4. REGLA 1 & 4: Capacidad Máxima (máximo 20 personas por franja horaria)
      const requestedGuests = Number(formData.guests);
      const activeSlotReservations = freshDateReservations.filter(
        (r) => r.time === formData.time && r.status !== 'Cancelada'
      );
      const currentSlotBooked = activeSlotReservations.reduce(
        (acc, r) => acc + (Number(r.guests) || 0),
        0
      );

      if (currentSlotBooked + requestedGuests > MAX_CAPACITY_PER_SLOT) {
        const remaining = Math.max(0, MAX_CAPACITY_PER_SLOT - currentSlotBooked);
        throw new Error(
          `Capacidad insuficiente para el horario de las ${formData.time}. Cupos disponibles: ${remaining} de ${MAX_CAPACITY_PER_SLOT}. Tu solicitud es de ${requestedGuests} personas.`
        );
      }

      // 5. Preparar contrato con userId y status inicial 'Pendiente' (Regla 3)
      const payload = {
        ...formData,
        userId: currentUser?.id,
        guests: requestedGuests,
        status: 'Pendiente'
      };

      // 6. Enviar POST al backend
      const created = await reservationService.createReservation(payload);

      // 7. Actualizar estado local
      setDateReservations((prev) => [...prev, created]);
      setReservations((prev) => [created, ...prev]);
      setActiveVoucher(created);

      return { success: true, reservation: created };
    } catch (err) {
      const msg = err.message || 'Error al procesar la reserva.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Reagenda o actualiza una reserva existente (validando capacidad y límites)
   */
  const rescheduleReservation = async (reservationId, updatePayload) => {
    setActionLoading(true);
    setError(null);

    try {
      const targetDate = updatePayload.date;
      const targetTime = updatePayload.time;
      const requestedGuests = Number(updatePayload.guests);

      // Validar reservas frescas para la nueva fecha
      const freshReservations = await reservationService.getReservationsByDate(targetDate);

      // Excluir la reserva que se está editando del cálculo
      const otherReservations = freshReservations.filter((r) => String(r.id) !== String(reservationId));

      // Validar límite diario por usuario (Regla 2)
      const limitCheck = checkUserDailyLimit(otherReservations, currentUser?.id);
      if (!limitCheck.allowed) {
        throw new Error(`No puedes reagendar: superarías el límite de ${MAX_USER_RESERVATIONS_PER_DATE} reservas en esa fecha.`);
      }

      // Validar capacidad de la franja (Regla 1 y 4)
      const activeInSlot = otherReservations.filter((r) => r.time === targetTime && r.status !== 'Cancelada');
      const bookedInSlot = activeInSlot.reduce((acc, r) => acc + (Number(r.guests) || 0), 0);

      if (bookedInSlot + requestedGuests > MAX_CAPACITY_PER_SLOT) {
        const remaining = Math.max(0, MAX_CAPACITY_PER_SLOT - bookedInSlot);
        throw new Error(`Capacidad insuficiente a las ${targetTime}. Cupos disponibles: ${remaining} de ${MAX_CAPACITY_PER_SLOT}.`);
      }

      // Enviar actualización
      const updated = await reservationService.updateReservation(reservationId, {
        date: targetDate,
        time: targetTime,
        guests: requestedGuests,
        type: updatePayload.type,
        notes: updatePayload.notes
      });

      // Actualizar estados
      setReservations((prev) => prev.map((r) => (r.id === reservationId ? { ...r, ...updated } : r)));
      if (selectedDate === targetDate) {
        loadDateReservations(targetDate);
      }
      setActiveVoucher({ ...updated });

      return { success: true, reservation: updated };
    } catch (err) {
      const msg = err.message || 'Error al reagendar la reserva.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Cancela una reserva existente
   */
  const cancelUserReservation = async (reservationId) => {
    setActionLoading(true);
    setError(null);
    try {
      const updated = await reservationService.cancelReservation(reservationId);
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: 'Cancelada' } : r))
      );
      setDateReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: 'Cancelada' } : r))
      );
      if (activeVoucher?.id === reservationId) {
        setActiveVoucher(null);
      }
      return { success: true, reservation: updated };
    } catch (err) {
      const msg = err.message || 'No se pudo cancelar la reserva.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    currentUser,
    reservations,
    loading,
    actionLoading,
    availabilityLoading,
    error,
    setError,
    selectedDate,
    setSelectedDate,
    dateReservations,
    userDateLimitStatus,
    calculateAvailability,
    bookReservation,
    rescheduleReservation,
    cancelUserReservation,
    loadUserReservations,
    loadDateReservations,
    activeVoucher,
    setActiveVoucher,
    clearVoucher: () => setActiveVoucher(null)
  };
};
