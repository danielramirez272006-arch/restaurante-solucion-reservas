import { useCallback, useEffect, useState } from 'react'
import { getReservations, getUsers } from '../admin-reservations/admin-service'
import { getReviews, buildReviewMetrics } from './reviews-service'

const TODAY = new Date().toISOString().slice(0, 10)

export function buildStats(reservations, users, reviews = []) {
	const reviewMetrics = buildReviewMetrics(reviews)
	return {
		pending: reservations.filter((item) => (item.estado || item.status) === 'Pendiente').length,
		confirmed: reservations.filter((item) => (item.estado || item.status) === 'Confirmada').length,
		rejected: reservations.filter((item) => (item.estado || item.status) === 'Rechazada').length,
		today: reservations.filter((item) => (item.fecha || item.date || '').slice(0, 10) === TODAY).length,
		clients: users.length,
		reservationsGoal: 50,
		reservationsProgress: Math.min(100, Math.round((reservations.length / 50) * 100)),
		reviews: reviewMetrics.total,
		averageRating: reviewMetrics.average,
		sentiment: reviewMetrics.sentiment,
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
			const [reservations, users, reviews] = await Promise.all([getReservations(), getUsers(), getReviews()])
			setStats(buildStats(
				Array.isArray(reservations) ? reservations : [],
				Array.isArray(users) ? users : [],
				Array.isArray(reviews) ? reviews : [],
			))
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
