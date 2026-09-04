import { apiRequest } from '../../shared/services/api-client'

export function getReservations() {
	return apiRequest('/reservations')
}

export function updateReservationStatus(id, estado) {
	return apiRequest(`/reservations/${id}`, {
		method: 'PATCH',
		body: JSON.stringify({ estado, status: estado }),
	})
}

export function getUsers() {
	return apiRequest('/users')
}
