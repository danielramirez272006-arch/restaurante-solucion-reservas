import { apiRequest } from '../../shared/services/api-client';

export function getReservations() {
  return apiRequest('/reservations');
}

export function updateReservationStatus(id, estado) {
  return apiRequest(`/reservations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ estado, status: estado })
  });
}

export function createReservation(data) {
  const newReservation = {
    ...data,
    id: data.id || `RES-${Date.now().toString().slice(-6)}`,
    estado: data.estado || data.status || 'Confirmada',
    status: data.estado || data.status || 'Confirmada',
    createdAt: new Date().toISOString()
  };
  return apiRequest('/reservations', {
    method: 'POST',
    body: JSON.stringify(newReservation)
  });
}

export function getUsers() {
  return apiRequest('/users');
}
