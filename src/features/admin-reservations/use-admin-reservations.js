import { useCallback, useEffect, useState } from 'react'
import { getReservations, updateReservationStatus } from './admin-service'

export function useAdminReservations() {
	const [reservations, setReservations] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [updatingId, setUpdatingId] = useState(null)

	const loadReservations = useCallback(async () => {
		setLoading(true)
		setError('')
		try {
			const data = await getReservations()
			setReservations(Array.isArray(data) ? data : [])
		} catch (requestError) {
			setError(requestError.message || 'No se pudieron cargar las reservas.')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		const timeoutId = window.setTimeout(loadReservations, 0)
		return () => window.clearTimeout(timeoutId)
	}, [loadReservations])

	const changeStatus = useCallback(async (id, estado) => {
		setUpdatingId(id)
		setError('')
		try {
			await updateReservationStatus(id, estado)
			await loadReservations()
		} catch (requestError) {
			setError(requestError.message || 'No se pudo actualizar la reserva.')
			throw requestError
		} finally {
			setUpdatingId(null)
		}
	}, [loadReservations])

	return { reservations, loading, error, updatingId, reload: loadReservations, changeStatus }
}
