import { useCallback, useEffect, useState } from 'react'
import { getReservations, getUsers } from '../admin-reservations/admin-service'

const TODAY = new Date().toISOString().slice(0, 10)

export function buildStats(reservations, users) {
	return {
		pending: reservations.filter((item) => (item.estado || item.status) === 'Pendiente').length,
		confirmed: reservations.filter((item) => (item.estado || item.status) === 'Confirmada').length,
		rejected: reservations.filter((item) => (item.estado || item.status) === 'Rechazada').length,
		today: reservations.filter((item) => (item.fecha || item.date || '').slice(0, 10) === TODAY).length,
		clients: users.filter((item) => item.role !== 'admin').length,
	}
}

export function useAdminStats() {
	const [stats, setStats] = useState(buildStats([], []))
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const loadStats = useCallback(async () => {
		setLoading(true)
		setError('')
		try {
			const [reservations, users] = await Promise.all([getReservations(), getUsers()])
			setStats(buildStats(Array.isArray(reservations) ? reservations : [], Array.isArray(users) ? users : []))
		} catch (requestError) {
			setError(requestError.message || 'No se pudieron cargar las estadísticas.')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		const timeoutId = window.setTimeout(loadStats, 0)
		return () => window.clearTimeout(timeoutId)
	}, [loadStats])

	return { stats, loading, error, reload: loadStats }
}
