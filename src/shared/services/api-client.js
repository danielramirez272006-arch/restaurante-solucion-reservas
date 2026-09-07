import { mockFetch } from './mock-api.js'

const API_URL = import.meta.env.VITE_API_URL || ''

export async function apiRequest(path, options = {}) {
	const response = await mockFetch(`${API_URL}${path}`, {
		headers: { 'Content-Type': 'application/json', ...options.headers },
		...options,
	})

	if (!response.ok) throw new Error(`La API respondió con ${response.status}`)
	if (response.status === 204) return null
	return response.json()
}

export { API_URL }
