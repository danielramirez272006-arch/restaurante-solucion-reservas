import { useCallback, useEffect, useState } from 'react'
import { getUsers } from '../admin-reservations/admin-service'

export function useAdminClients() {
	const [clients, setClients] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const loadClients = useCallback(async () => {
		setLoading(true)
		setError('')
		try {
			const data = await getUsers()
			setClients(Array.isArray(data) ? data : [])
		} catch (requestError) {
			setError(requestError.message || 'No se pudieron cargar los clientes.')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		const timeoutId = window.setTimeout(loadClients, 0)
		return () => window.clearTimeout(timeoutId)
	}, [loadClients])

	return { clients, loading, error, reload: loadClients }
}
