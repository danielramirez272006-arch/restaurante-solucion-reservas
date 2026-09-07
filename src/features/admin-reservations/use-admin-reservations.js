import { useCallback, useEffect, useState } from 'react';
import { getReservations, updateReservationStatus, createReservation } from './admin-service';

export function useAdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.message || 'No se pudieron cargar las reservas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadReservations, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadReservations]);

  const changeStatus = useCallback(async (id, estado) => {
    setUpdatingId(id);
    setError('');
    try {
      await updateReservationStatus(id, estado);
      await loadReservations();
    } catch (requestError) {
      setError(requestError.message || 'No se pudo actualizar la reserva.');
      throw requestError;
    } finally {
      setUpdatingId(null);
    }
  }, [loadReservations]);

  const createNewReservation = useCallback(async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await createReservation(data);
      await loadReservations();
      return { success: true, data: res };
    } catch (requestError) {
      setError(requestError.message || 'No se pudo crear la reserva.');
      return { success: false, error: requestError.message };
    } finally {
      setLoading(false);
    }
  }, [loadReservations]);

  return {
    reservations,
    loading,
    error,
    updatingId,
    reload: loadReservations,
    changeStatus,
    createNewReservation
  };
}
