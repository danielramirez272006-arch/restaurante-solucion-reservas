import { mockFetch } from '../../shared/services/mock-api.js'

const API_URL = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const response = await mockFetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    throw new Error('No se pudo conectar con el servidor de datos.')
  }

  return response.status === 204 ? null : response.json()
}

function toSession(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
  }
}

export async function loginUser(email, password) {
  const users = await request(`/users?email=${encodeURIComponent(email)}`)
  const user = users.find((candidate) => candidate.password === password)

  if (!user) {
    throw new Error('El correo o la contraseña no son correctos.')
  }

  return toSession(user)
}

export async function registerUser({ name, email, password, phone = '' }) {
  const existingUsers = await request(`/users?email=${encodeURIComponent(email)}`)

  if (existingUsers.length) {
    throw new Error('Ya existe una cuenta con ese correo.')
  }

  const user = await request('/users', {
    method: 'POST',
    body: JSON.stringify({
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: 'user',
      phone,
    }),
  })

  return toSession(user)
}

export { request }