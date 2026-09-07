import initialDb from '../../../db.json'

const STORAGE_KEY = 'donde_ray_db_v1'

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.reservations)) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('[mock-api] Error reading from localStorage, using initialDb', err)
  }

  const initial = {
    users: initialDb.users ? [...initialDb.users] : [],
    reservations: initialDb.reservations ? [...initialDb.reservations] : [],
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  } catch {
    // Ignore storage quota errors
  }
  return initial
}

function saveDb(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.warn('[mock-api] Error saving to localStorage', err)
  }
}

export async function mockFetch(input, init = {}) {
  let urlString = ''
  if (typeof input === 'string') {
    urlString = input
  } else if (input instanceof Request || (input && typeof input.url === 'string')) {
    urlString = input.url
  }

  // Match requests intended for json-server or REST endpoints
  const isMockTarget =
    urlString.includes('localhost:3001') ||
    urlString.includes('/api/reservations') ||
    urlString.includes('/api/users') ||
    urlString.startsWith('/reservations') ||
    urlString.startsWith('/users') ||
    /^(https?:\/\/[^/]+)?\/api\/(users|reservations)/i.test(urlString) ||
    /^(https?:\/\/[^/]+)?\/(users|reservations)/i.test(urlString)

  const originalFetch = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : globalThis.fetch?.bind(globalThis)

  if (!isMockTarget) {
    if (originalFetch) return originalFetch(input, init)
    return new Response(JSON.stringify({ error: 'Endpoint not supported' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
  }

  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    const parsedUrl = new URL(urlString, origin)
    const pathname = parsedUrl.pathname.replace(/^\/api/, '')
    const method = (init.method || (typeof input === 'object' && input.method) || 'GET').toUpperCase()

    const db = loadDb()

    // Handle /users
    if (pathname === '/users' || pathname.startsWith('/users/')) {
      const idMatch = pathname.match(/^\/users\/([^/?#]+)/)
      const userId = idMatch ? idMatch[1] : null

      if (method === 'GET') {
        if (userId) {
          const user = db.users.find((u) => String(u.id) === String(userId))
          if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
          return new Response(JSON.stringify(user), { status: 200, headers: { 'Content-Type': 'application/json' } })
        }

        const emailFilter = parsedUrl.searchParams.get('email')
        let result = db.users
        if (emailFilter) {
          result = db.users.filter((u) => u.email?.toLowerCase() === emailFilter.toLowerCase())
        }
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }

      if (method === 'POST') {
        let body = {}
        try {
          body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body || {}
        } catch {
          body = {}
        }
        const newUser = {
          id: body.id || `user-${Date.now()}`,
          name: body.name || '',
          email: body.email || '',
          password: body.password || '',
          role: body.role || 'user',
          phone: body.phone || '',
        }
        db.users.push(newUser)
        saveDb(db)
        return new Response(JSON.stringify(newUser), { status: 201, headers: { 'Content-Type': 'application/json' } })
      }
    }

    // Handle /reservations
    if (pathname === '/reservations' || pathname.startsWith('/reservations/')) {
      const idMatch = pathname.match(/^\/reservations\/([^/?#]+)/)
      const reservationId = idMatch ? idMatch[1] : null

      if (method === 'GET') {
        if (reservationId) {
          const reservation = db.reservations.find((r) => String(r.id) === String(reservationId))
          if (!reservation) {
            return new Response(JSON.stringify({ message: 'Reserva no encontrada' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
          }
          return new Response(JSON.stringify(reservation), { status: 200, headers: { 'Content-Type': 'application/json' } })
        }

        let results = [...db.reservations]
        const dateFilter = parsedUrl.searchParams.get('date')
        const userFilter = parsedUrl.searchParams.get('userId')

        if (dateFilter) {
          results = results.filter((r) => r.date === dateFilter)
        }
        if (userFilter) {
          results = results.filter((r) => String(r.userId) === String(userFilter))
        }

        results.sort((a, b) => {
          const timeA = new Date(`${a.date}T${a.time || '00:00'}`).getTime()
          const timeB = new Date(`${b.date}T${b.time || '00:00'}`).getTime()
          return timeB - timeA
        })

        return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }

      if (method === 'POST') {
        let body = {}
        try {
          body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body || {}
        } catch {
          body = {}
        }
        const newReservation = {
          id: body.id || `res-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          userId: body.userId || 'u-client',
          guestName: (body.guestName || body.cliente || '').trim(),
          cliente: (body.guestName || body.cliente || '').trim(),
          email: (body.email || '').trim().toLowerCase(),
          phone: (body.phone || '').trim(),
          date: body.date,
          time: body.time,
          guests: Number(body.guests) || 2,
          type: body.type || 'Cena',
          notes: (body.notes || '').trim(),
          status: body.status || body.estado || 'Pendiente',
          estado: body.status || body.estado || 'Pendiente',
          createdAt: body.createdAt || new Date().toISOString(),
        }
        db.reservations.unshift(newReservation)
        saveDb(db)
        return new Response(JSON.stringify(newReservation), { status: 201, headers: { 'Content-Type': 'application/json' } })
      }

      if (method === 'PATCH' || method === 'PUT') {
        if (!reservationId) {
          return new Response(JSON.stringify({ error: 'Missing reservation ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
        }
        let body = {}
        try {
          body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body || {}
        } catch {
          body = {}
        }

        const index = db.reservations.findIndex((r) => String(r.id) === String(reservationId))
        if (index === -1) {
          return new Response(JSON.stringify({ message: 'Reserva no encontrada' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
        }

        const current = db.reservations[index]
        const updated = {
          ...current,
          ...body,
          status: body.status || body.estado || current.status,
          estado: body.estado || body.status || current.estado,
          updatedAt: new Date().toISOString(),
        }
        db.reservations[index] = updated
        saveDb(db)
        return new Response(JSON.stringify(updated), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }

      if (method === 'DELETE') {
        if (!reservationId) {
          return new Response(JSON.stringify({ error: 'Missing reservation ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
        }
        db.reservations = db.reservations.filter((r) => String(r.id) !== String(reservationId))
        saveDb(db)
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
    }

    if (originalFetch) return originalFetch(input, init)
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('[mock-api] Error handling mock request:', err)
    if (originalFetch) return originalFetch(input, init)
    return new Response(JSON.stringify({ error: 'Internal Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export function setupMockApi() {
  if (typeof window === 'undefined') return
  try {
    if (window.fetch === mockFetch) return

    let patched = false
    try {
      Object.defineProperty(window, 'fetch', {
        value: mockFetch,
        writable: true,
        configurable: true,
      })
      patched = true
    } catch {
      // Failed on window directly
    }

    if (!patched) {
      try {
        const proto = Object.getPrototypeOf(window)
        if (proto) {
          Object.defineProperty(proto, 'fetch', {
            value: mockFetch,
            writable: true,
            configurable: true,
          })
          patched = true
        }
      } catch {
        // Failed on Window.prototype
      }
    }

    if (!patched) {
      try {
        window.fetch = mockFetch
      } catch {
        // Ignored: services call mockFetch directly
      }
    }
  } catch {
    // Completely safe fallback
  }
}

// Auto-run on import
setupMockApi()
